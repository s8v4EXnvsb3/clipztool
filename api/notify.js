/* Sends a short, anonymous usage alert to the site owner on Telegram.

   Environment variables (set in Vercel, never in the website code):
     TELEGRAM_BOT_TOKEN   the bot token from @BotFather
     TELEGRAM_CHAT_ID     the chat that should receive the alerts
     NOTIFY_VISITS        optional, set to "off" to stop the (silent) new-visit alerts
     ALLOWED_ORIGINS      optional, comma-separated extra site origins (for example a custom domain)

   The browser only ever calls this endpoint. The token stays on the server.
   Alerts contain the page, device type and country. They never contain emails, IP addresses or file names. */

const EVENTS = new Set(["visit", "tool_run", "signin", "new_account", "sponsor_click", "test"]);
const TOOLS = {
  trim: "Trim video", gif: "Video to GIF", audio: "Extract audio", compress: "Compress video",
  resize: "Resize for Shorts and Reels", speed: "Speed and reverse", merge: "Merge clips", watermark: "Add text watermark"
};
const BOTS = /bot|crawl|spider|slurp|headless|lighthouse|preview/i;
const DEFAULT_ORIGINS = ["https://clipztool.vercel.app"];

/* Best-effort limits per server instance: a few alerts per minute per visitor, and an overall cap. */
const PER_IP = 10, GLOBAL = 30, WINDOW_MS = 60 * 1000;
const hits = new Map();
let recent = [];
function limited(ip) {
  const now = Date.now();
  recent = recent.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= GLOBAL) return true;
  const mine = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (mine.length >= PER_IP) { hits.set(ip, mine); return true; }
  mine.push(now); hits.set(ip, mine); recent.push(now);
  if (hits.size > 500) hits.clear();
  return false;
}

function allowedOrigins() {
  const extra = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return DEFAULT_ORIGINS.concat(extra);
}

function buildMessage(b, country) {
  const where = country ? ", " + country : "";
  const dev = b.device + where;
  switch (b.event) {
    case "visit": return "🟢 New visit: " + b.page + " (" + dev + ")";
    case "tool_run": return "🛠 Tool used: " + (TOOLS[b.tool] || "unknown") + " (" + dev + ")";
    case "signin": return "✅ A returning user signed in (" + dev + ")";
    case "new_account": return "🎉 New account created (" + dev + ")";
    case "sponsor_click": return "💰 Sponsor interest: " + (b.where || "click") + " on " + b.page + " (" + dev + ")";
    case "test": return "🔔 Test alert from the Clipztool site. Alerts are working.";
    default: return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).end(); }

  // Only accept requests that come from this site's own pages.
  if (allowedOrigins().indexOf(req.headers.origin || "") < 0) return res.status(403).end();

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).end();

  const event = String(body.event || "");
  if (!EVENTS.has(event)) return res.status(400).end();

  // Ignore crawlers and other automated visitors.
  if (BOTS.test(String(req.headers["user-agent"] || ""))) return res.status(204).end();
  if (event === "visit" && process.env.NOTIFY_VISITS === "off") return res.status(204).end();

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (limited(ip)) return res.status(429).end();

  const clean = {
    event: event,
    page: typeof body.page === "string" && body.page.charAt(0) === "/" ? body.page.slice(0, 120).replace(/[^A-Za-z0-9\-._\/#?=&]/g, "") : "/",
    device: body.device === "mobile" ? "mobile" : "desktop",
    tool: Object.prototype.hasOwnProperty.call(TOOLS, body.tool) ? body.tool : "",
    where: /^[a-z-]{1,20}$/.test(String(body.where || "")) ? String(body.where) : ""
  };
  const country = /^[A-Z]{2}$/.test(String(req.headers["x-vercel-ip-country"] || "")) ? req.headers["x-vercel-ip-country"] : "";
  const text = buildMessage(clean, country);
  if (!text) return res.status(400).end();

  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) { console.error("notify: Telegram is not configured"); return res.status(500).end(); }

  try {
    const r = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: text, disable_notification: event === "visit", disable_web_page_preview: true })
    });
    if (!r.ok) { console.error("notify: Telegram answered " + r.status); return res.status(502).end(); }
  } catch (e) {
    // Never log the error text: request URLs contain the token.
    console.error("notify: could not reach Telegram");
    return res.status(502).end();
  }
  return res.status(204).end();
};
