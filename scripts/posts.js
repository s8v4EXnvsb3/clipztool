/* Source for every guide on /blog/. Run `node scripts/build-blog.js` after editing to regenerate the HTML.
   Each entry: name, jobs, access, url (outside tools) or tool (built-in editor key), title, desc, intro, who[], start[], free, watch[], verdict. */

const FREE_NOTE = " Plans and limits change often, so read the current pricing page before you plan a project around it.";

module.exports = [
  /* ---------------- built-in editors ---------------- */
  {
    name: "Trim video", jobs: ["edit"], access: "Built in", tool: "trim",
    title: "How to trim a video in your browser for free",
    desc: "Cut the start and end off a video without installing anything. How the Clipztool trimmer works and what to expect.",
    intro: "Most videos need a cut before they are ready to share: dead air at the start, a fumbled ending, a clip that runs past a platform limit. The Clipztool trimmer keeps one section of a video and drops the rest, right in your browser.",
    who: ["Anyone shortening a clip before posting it", "People sending a short part of a long recording", "Creators who want a fast cut before resizing or compressing"],
    start: ["Open the editor and choose Trim video.", "Add your video. The End box fills in with the length of the clip.", "Set Start and End in seconds, for example 12.5 and 41.", "Press Run and wait for the progress bar to finish.", "Play the result on the page, then download it."],
    free: "The trimmer is built in, so it costs nothing. You need a free Clipztool account to use the editor. Your video is processed on your own device and is never uploaded.",
    watch: ["The output is a new MP4 encoded with H.264. That keeps the cut exact, but large files take longer than a plain copy would.", "Times are in seconds. For 1:30, enter 90.", "Files over 700 MB are refused, and very long videos can be slow on phones."],
    verdict: "Use it when you need one clean cut in under a minute. For many cuts in one video, run it more than once or move to a full editor such as DaVinci Resolve."
  },
  {
    name: "Video to GIF", jobs: ["edit"], access: "Built in", tool: "gif",
    title: "How to turn a video into a GIF for free",
    desc: "Make an animated GIF from a few seconds of video in your browser. Settings, size limits and tips for smaller files.",
    intro: "A GIF is still the easiest way to show a short moment in a chat, a document or a support ticket. The Clipztool converter takes a few seconds of any video and turns them into an animated GIF without uploading the file anywhere.",
    who: ["People making reaction clips or product demos", "Support and documentation writers who need short screen captures", "Anyone who wants a looping clip that plays without a video player"],
    start: ["Open the editor and choose Video to GIF.", "Add your video.", "Set the Start time and a Length of up to 15 seconds.", "Pick a width (320, 480 or 640 pixels) and a frame rate (8, 12 or 15).", "Press Run, check the preview, then download the GIF."],
    free: "Built in and free with a Clipztool account. Nothing is uploaded; the conversion happens on your device.",
    watch: ["GIF files get large fast. A 5 second clip at 480 pixels and 12 frames per second is a good starting point.", "The length is capped at 15 seconds. For anything longer, share the video itself.", "GIFs have no sound, so the audio is dropped."],
    verdict: "Keep clips short and narrow. If the file is still too big, lower the width or the frame rate before you shorten the clip."
  },
  {
    name: "Extract audio", jobs: ["edit"], access: "Built in", tool: "audio",
    title: "How to extract audio from a video as an MP3",
    desc: "Save the sound track of any video as an MP3 file, free and in your browser. Quality options and what to check first.",
    intro: "Sometimes you only need the sound: a lecture to listen to on a walk, a voice memo recorded on video, music from your own footage. The Clipztool audio extractor saves the audio track of a video as an MP3.",
    who: ["Students and researchers working from recorded talks", "Podcasters who record on video first", "Editors who need a clean audio file for another tool"],
    start: ["Open the editor and choose Extract audio.", "Add your video.", "Pick a quality: High, Medium or Small file.", "Press Run.", "Play the MP3 in the page and download it."],
    free: "Built in and free with a Clipztool account. The video stays on your device.",
    watch: ["If the video has no audio track, the tool tells you instead of producing an empty file.", "MP3 is compressed. If you need a lossless master, use a desktop editor.", "Only extract audio from recordings you have the right to use."],
    verdict: "A quick way to turn a video into something you can listen to. Choose High for speech you will edit later and Small for casual listening."
  },
  {
    name: "Compress video", jobs: ["edit"], access: "Built in", tool: "compress",
    title: "How to compress a video without ruining it",
    desc: "Shrink a large video so it is easy to email or upload. How the three compression levels and the width limit work.",
    intro: "A phone recording can easily run to several hundred megabytes. That is too large for most email services and slow to upload anywhere. The Clipztool compressor re-encodes a video at a smaller size and keeps it playable everywhere.",
    who: ["People who hit an upload or email size limit", "Anyone sharing a clip over a slow connection", "Creators who want a lighter copy to review or send for feedback"],
    start: ["Open the editor and choose Compress video.", "Add your video.", "Choose Compression: Light, Balanced or Strong.", "Choose a Maximum width, or keep the original size.", "Press Run and compare the result size with the original shown under the preview."],
    free: "Built in and free with a Clipztool account. Nothing is uploaded.",
    watch: ["Balanced at a maximum width of 1280 pixels works for most clips. Strong can look blocky on fast motion.", "Compressing an already small file can make it larger. The page shows both sizes so you can check.", "Each pass loses a little quality. Compress from your original, not from a copy you already compressed."],
    verdict: "Start with Balanced. If the result is still too big, lower the maximum width before you choose Strong."
  },
  {
    name: "Resize for Shorts and Reels", jobs: ["edit"], access: "Built in", tool: "resize",
    title: "How to resize a video for Shorts, Reels and TikTok",
    desc: "Change a video to vertical 9:16, 4:5, square or wide. When to fill the frame and when to keep black bars.",
    intro: "Each platform likes a different shape. Shorts, Reels and TikTok want vertical video. Instagram feed posts like 4:5. YouTube wants wide. The Clipztool resizer changes the shape of a clip in your browser.",
    who: ["Creators reposting one clip to several platforms", "Anyone who recorded sideways and needs a vertical version", "Teams making square versions for ads or newsletters"],
    start: ["Open the editor and choose Resize for Shorts and Reels.", "Add your video.", "Pick a shape: 9:16, 4:5, 1:1 or 16:9.", "Pick how to fit: fill the frame, which crops the edges, or show everything, which adds black bars.", "Press Run, preview it, then download."],
    free: "Built in and free with a Clipztool account. The video never leaves your device.",
    watch: ["Filling the frame crops the sides. Check that faces and text stay inside the picture.", "Output sizes are 720 by 1280 for vertical, 720 by 900 for 4:5, 720 by 720 for square and 1280 by 720 for wide. They are fine for social posts, not for large screens.", "Upscaling a small video to a larger frame will not add detail."],
    verdict: "Use fill for talking-head clips and show-everything for screen recordings, where cropping would cut off the interface."
  },
  {
    name: "Speed and reverse", jobs: ["edit"], access: "Built in", tool: "speed",
    title: "How to slow down, speed up or reverse a video",
    desc: "Add slow motion, fast forward or a backwards effect to a clip in your browser. Options and limits explained.",
    intro: "Changing the speed of a clip is one of the quickest ways to make footage more interesting. The Clipztool speed tool slows a video down, speeds it up or plays it backwards.",
    who: ["Creators adding slow motion to a highlight", "People speeding up a long screen recording", "Anyone who wants a quick rewind effect"],
    start: ["Open the editor and choose Speed and reverse.", "Add your video.", "Pick an effect: 0.5x, 0.75x, 1.5x, 2x, 4x or Reverse.", "Press Run.", "Check the preview, then download it."],
    free: "Built in and free with a Clipztool account. Processing happens in your browser.",
    watch: ["Reverse works on clips up to 30 seconds. Trim longer videos first.", "Sound is sped up or slowed down along with the picture, so voices change pitch less than you might expect but still sound different.", "Slow motion on footage shot at a normal frame rate can look choppy, because there are no extra frames to show."],
    verdict: "Great for short effects. For smooth slow motion, film at a higher frame rate in the first place."
  },
  {
    name: "Merge clips", jobs: ["edit"], access: "Built in", tool: "merge",
    title: "How to merge several video clips into one",
    desc: "Join two or more videos in order, free and in your browser. Output sizes, ordering and what happens to audio.",
    intro: "Putting clips one after another is the simplest edit there is. The Clipztool merger joins two or more videos into a single file in the order you choose.",
    who: ["People combining several phone recordings into one", "Creators stitching an intro, a main clip and an outro", "Anyone who needs one file instead of a folder of parts"],
    start: ["Open the editor and choose Merge clips.", "Add two or more videos. Use the arrows to change their order.", "Pick an output size: wide, vertical or square.", "Press Run.", "Preview the merged video and download it."],
    free: "Built in and free with a Clipztool account. Your clips stay on your device.",
    watch: ["Every clip is scaled to the output size with black bars where needed, so mixed sizes line up.", "If any clip has no audio, the merged video is silent. The page tells you when this happens.", "Merging many large clips needs a lot of memory. Compress or trim them first if the browser struggles."],
    verdict: "Best for a handful of short clips. For crossfades, titles and audio mixing, use a full editor."
  },
  {
    name: "Add text watermark", jobs: ["edit"], access: "Built in", tool: "watermark",
    title: "How to add a text watermark to a video",
    desc: "Put your name or handle on a video in your browser. Position, size and tips for a mark that is visible but not annoying.",
    intro: "A small name or handle in the corner tells viewers where a clip came from, even if it gets reposted. The Clipztool watermark tool burns a line of text onto a video for its whole length.",
    who: ["Creators protecting clips from being passed off as someone else's", "Brands adding a handle to short promos", "Teachers marking draft or internal videos"],
    start: ["Open the editor and choose Add text watermark.", "Add your video.", "Type your text, for example @yourname.", "Pick a position and a size.", "Press Run, preview it, then download."],
    free: "Built in and free with a Clipztool account. No upload is involved.",
    watch: ["The text is part of the picture once exported. Keep your original file in case you need a clean copy.", "A mark in the corner can be cropped out. A mark nearer the middle is harder to remove but more distracting.", "Medium size is readable on phones without covering the action."],
    verdict: "Pick a corner, keep it small and keep the original. That covers most uses."
  },

  /* ---------------- generate ---------------- */
  {
    name: "Luma Dream Machine", jobs: ["generate"], access: "Credits", url: "https://lumalabs.ai/dream-machine",
    title: "Luma Dream Machine: a beginner's guide to the free plan",
    desc: "What Luma Dream Machine does, how to make your first clip from a prompt or an image, and what to check about free credits.",
    intro: "Luma Dream Machine turns a written prompt or a still image into a short video clip. It is one of the easier AI video generators to start with, because you describe what you want and wait for the result.",
    who: ["Creators who want a short moving shot without filming it", "Designers animating a still image or a mockup", "Anyone curious about AI video who wants a low-effort first try"],
    start: ["Create a free account on the Luma site and open Dream Machine.", "Choose text to video, or upload an image to animate it.", "Write one clear sentence: who or what, where, and how the camera moves.", "Generate the clip and wait for it to finish.", "Download a version you like, or change the prompt and try again."],
    free: "Free accounts usually get a limited number of generations, and free output is often watermarked or limited for commercial use. Check the current terms." + FREE_NOTE,
    watch: ["Short prompts work better than long ones. Ask for one action at a time.", "Hands, text and crowds are common weak spots in AI video.", "Each try uses credits, so a handful of clips is realistic on a free plan, not dozens."],
    verdict: "A good first stop for text and image to video. Save your credits for prompts you have thought through."
  },
  {
    name: "Runway", jobs: ["generate", "edit"], access: "Credits", url: "https://runwayml.com",
    title: "Runway: what you can do with the free credits",
    desc: "Runway offers AI video generation plus editing tools like green screen and object removal. A practical guide to getting started for free.",
    intro: "Runway is a larger toolbox than most AI video sites. It generates video from text and images, and it also has editing tools such as background removal and object removal. That makes it useful for both making and fixing footage.",
    who: ["Creators who want generation and editing in one place", "Editors who need to remove a background or an unwanted object", "Teams exploring AI video for concept work"],
    start: ["Sign up for a free account on the Runway site.", "Open a video generation tool and pick text or image as the starting point.", "Write a short prompt or upload a reference image.", "Generate, then review the result.", "Try an editing tool, such as green screen, on your own footage."],
    free: "Free plans typically come with a small, limited pool of credits rather than a monthly refill, and some features and exports are restricted. Check the current terms." + FREE_NOTE,
    watch: ["Credits run out quickly, especially on longer or higher quality generations.", "Some of the best tools sit behind paid plans.", "Read the licence terms before using output in client or commercial work."],
    verdict: "Worth an account for the editing tools alone. Use the credits on the things only Runway does well."
  },
  {
    name: "Pika", jobs: ["generate"], access: "Credits", url: "https://pika.art",
    title: "Pika: making short AI video clips for free",
    desc: "How Pika turns text and photos into short clips, including effects that animate objects in a picture, and how to stretch free credits.",
    intro: "Pika makes short video clips from text prompts or from your own images. It is known for playful effects that change an object in a photo, for example making it melt, float or inflate, which suits short social posts.",
    who: ["Social media creators who want eye-catching effects fast", "People who want to animate a photo they already have", "Beginners who prefer trying effects over writing long prompts"],
    start: ["Create a free account on the Pika site.", "Pick text to video or upload an image.", "Choose an effect, or write a short prompt.", "Generate and preview the clip.", "Download it or change the prompt and try again."],
    free: "Pika has offered free credits for new accounts. Free output may carry a watermark and limits on commercial use. Check the current terms." + FREE_NOTE,
    watch: ["Effects work best on a clear subject against a simple background.", "Clips are short, so plan to join several with a video editor.", "Credits are consumed per generation, so keep prompts specific."],
    verdict: "Good for quick, attention-grabbing clips. Less suited to long, controlled scenes."
  },
  {
    name: "Hailuo AI", jobs: ["generate"], access: "Credits", url: "https://hailuoai.video",
    title: "Hailuo AI: free text and image to video, explained",
    desc: "A plain guide to Hailuo AI: how to make a clip from text or an image, what to expect from the free credit allowance, and prompt tips.",
    intro: "Hailuo AI generates short videos from a text prompt or a starting image. People like it for smooth motion and for how closely it follows a prompt that describes a scene and a camera move.",
    who: ["Creators testing several AI video tools side by side", "People who want cinematic camera moves in a short clip", "Anyone building a storyboard before filming"],
    start: ["Sign up on the Hailuo AI site.", "Choose text to video or image to video.", "Describe the subject, the setting and the camera movement in one or two sentences.", "Generate and watch the result.", "Adjust the wording and run it again if the motion is off."],
    free: "Free accounts have had a credit allowance for generating clips, with limits that can change. Check the current terms." + FREE_NOTE,
    watch: ["Generation times can be longer when the service is busy.", "Be careful with prompts that include real people or branded content.", "Always check the licence before using clips commercially."],
    verdict: "Worth putting next to Luma and Kling in a side-by-side test with the same prompt. They each have a different look."
  },
  {
    name: "Kling AI", jobs: ["generate"], access: "Credits", url: "https://klingai.com",
    title: "Kling AI: a guide to free video generation",
    desc: "What Kling AI does, how to make your first text or image to video clip, and what to know about free credits and limits.",
    intro: "Kling AI creates short videos from text prompts and images. It is one of the main alternatives to Luma and Runway, and it is a good tool to try if you want realistic motion in a short shot.",
    who: ["Creators comparing AI video generators", "People animating product photos or portraits", "Anyone who wants to try AI video before paying for it"],
    start: ["Sign up on the Kling AI site.", "Choose text to video or image to video.", "Write what happens in the shot and how the camera moves.", "Generate the clip and review it.", "Download your favourite or refine the prompt."],
    free: "Kling has offered free credits on its free plan. How often they refill and what they cover can change. Check the current terms." + FREE_NOTE,
    watch: ["Free generations can queue for a while at busy times.", "Start from a clear, well lit image if you animate a photo.", "Review the terms before using results in paid work."],
    verdict: "A strong option to include in your tests. Use the same prompt on two or three tools and keep the best clip."
  },
  {
    name: "ComfyUI", jobs: ["generate"], access: "Open source", url: "https://www.comfy.org",
    title: "ComfyUI: running AI video models on your own computer",
    desc: "ComfyUI is a free, open-source app for running image and video models locally. What you need, how to start and where beginners get stuck.",
    intro: "ComfyUI is an open-source app that lets you run AI image and video models on your own computer. There are no credits and no queue. The cost is setup time and a capable graphics card, and in return you control everything.",
    who: ["People who want unlimited generations and no account", "Hobbyists who like tuning every step of a workflow", "Anyone with a recent NVIDIA graphics card and some patience"],
    start: ["Download ComfyUI from the official site and install it.", "Open the app and browse the built-in workflow templates.", "Pick a video template and let ComfyUI list the models it needs.", "Download those models, which are large files, and place them where the app asks.", "Type a prompt, press run and wait for the clip."],
    free: "ComfyUI is free and open source. The models you load have their own licences, so read each one before using output commercially.",
    watch: ["Video models need a lot of graphics memory. A weak card will be slow or fail.", "Model files are large, often many gigabytes each.", "Node-based workflows look complicated at first. Start from a template and change one thing at a time."],
    verdict: "The best choice if you generate a lot and have the hardware. If you only want a few clips, a hosted tool is much simpler."
  },

  /* ---------------- edit ---------------- */
  {
    name: "DaVinci Resolve", jobs: ["edit"], access: "Free plan", url: "https://www.blackmagicdesign.com/products/davinciresolve",
    title: "DaVinci Resolve free: is it enough for most editors?",
    desc: "DaVinci Resolve is a professional editor with a very capable free version. What the free version covers and what needs Studio.",
    intro: "DaVinci Resolve is a professional video editor, colour grader and audio tool in one program. The free version is not a trial. It covers cutting, colour, effects and audio, which is why many creators never upgrade.",
    who: ["Editors who have outgrown simple online tools", "Creators who care about colour correction", "People happy to learn a desktop program properly"],
    start: ["Download the free version from the Blackmagic Design site and install it.", "Create a project and import your clips into the media pool.", "Drag clips onto the timeline on the Cut or Edit page.", "Trim, arrange and add titles.", "Use the Deliver page to export a file for YouTube or social media."],
    free: "The free version includes the core editing and colour tools. Some AI-powered and advanced features are reserved for the paid Studio version. Check the current feature list." + FREE_NOTE,
    watch: ["It is a big program. Expect a learning curve and a computer with a decent graphics card.", "Project files can take lots of disk space.", "The free version has some limits on export formats and effects."],
    verdict: "If you will edit regularly, this is the free editor most worth learning."
  },
  {
    name: "CapCut", jobs: ["edit", "captions"], access: "Free plan", url: "https://www.capcut.com",
    title: "CapCut for beginners: editing and auto captions for free",
    desc: "CapCut is a popular free editor for short videos with automatic captions. How to get started and what sits behind the paid plan.",
    intro: "CapCut is a video editor built around short, social-style videos. It runs on phones, desktop and in the browser, and it is popular for its automatic captions, ready-made effects and quick background removal.",
    who: ["Creators making TikTok, Reels and Shorts", "Anyone who wants captions generated for them", "Beginners who want templates and effects without a steep learning curve"],
    start: ["Install CapCut or open it in your browser and sign in.", "Create a project and import your video.", "Use the captions feature to generate text from the speech, then fix any mistakes.", "Add effects, music or a background change if you want them.", "Export at the quality you need."],
    free: "The free plan covers the main editing features. Some effects, templates and exports sit behind a paid plan. Check the current terms." + FREE_NOTE,
    watch: ["Always proofread automatic captions. Names and unusual words are often wrong.", "Some effects and templates are marked as Pro and will not export on a free account.", "Check the terms on how your videos and data are used."],
    verdict: "A fast route from raw footage to a captioned short video."
  },
  {
    name: "Clipchamp", jobs: ["edit", "voice"], access: "Free plan", url: "https://clipchamp.com",
    title: "Clipchamp: a free browser video editor with auto captions",
    desc: "Clipchamp is Microsoft's browser-based editor with auto captions and text to speech. What it does well and what to know about the free plan.",
    intro: "Clipchamp is a video editor from Microsoft that runs in your browser. It is simple enough for a first project and has useful extras like automatic captions and text to speech, which turns typed text into a voiceover.",
    who: ["People who want a no-install editor", "Anyone who needs a quick voiceover without recording one", "Teams making simple explainers and training clips"],
    start: ["Open Clipchamp in your browser and sign in with a Microsoft account.", "Create a new video and import your clips.", "Drag clips onto the timeline and trim them.", "Add captions with the auto caption tool, or add a text to speech voiceover.", "Export the video."],
    free: "The free plan supports basic editing and exporting at standard definition up to full HD, with some stock content and features reserved for paid plans. Check the current terms." + FREE_NOTE,
    watch: ["Heavy projects can feel slow in a browser.", "Premium stock media is marked and will not export on the free plan.", "Always listen to a text to speech voiceover to check pronunciation."],
    verdict: "A friendly editor for simple projects, especially if you already use a Microsoft account."
  },
  {
    name: "Kapwing", jobs: ["edit", "captions"], access: "Free plan", url: "https://www.kapwing.com",
    title: "Kapwing: free online video editing for subtitles and resizing",
    desc: "Kapwing is a browser editor for subtitles, resizing and quick clean-up. What the free plan gives you and where the limits are.",
    intro: "Kapwing is an online video editor with a collection of small, practical tools: add subtitles, resize for different platforms, clean up audio, remove silences and more. It suits quick jobs that would take longer in a full editor.",
    who: ["Creators who need subtitles on a clip quickly", "People repurposing one video for several platforms", "Teams who want to edit in a browser without installing software"],
    start: ["Open Kapwing and start a new project, or pick a tool from the front page.", "Upload your video.", "Use the subtitles tool to generate text, then edit it.", "Resize the canvas for the platform you are posting to.", "Export and download."],
    free: "Free exports may carry a watermark and have length or quality limits. Check the current terms." + FREE_NOTE,
    watch: ["The watermark matters if you post publicly. Plan for it before you start.", "Large uploads depend on your internet speed.", "Check generated subtitles for errors."],
    verdict: "Handy for small, specific jobs. If the watermark is a problem, try the Clipztool editor or a desktop tool for the same task."
  },
  {
    name: "Descript", jobs: ["edit", "captions"], access: "Free plan", url: "https://www.descript.com",
    title: "Descript: edit video by editing the transcript",
    desc: "Descript turns speech into text, and lets you cut video by deleting words. How it works and what the free plan covers.",
    intro: "Descript works differently from other editors. It transcribes your video, then you edit the text. Delete a sentence and the matching part of the video is cut. For talking-head videos, interviews and podcasts, that is much faster than scrubbing a timeline.",
    who: ["Podcasters and interviewers", "People who record talks, webinars or tutorials", "Anyone who finds a traditional timeline slow"],
    start: ["Create a free Descript account and a new project.", "Import your video or audio and let it transcribe.", "Read through the transcript and delete mistakes, filler words and tangents.", "Add captions or a title if needed.", "Export the video or just the audio."],
    free: "The free plan has included a limited amount of transcription and some export restrictions. Check the current terms." + FREE_NOTE,
    watch: ["Transcripts are only as good as the audio. Clean recordings give better results.", "Text-based cuts can leave jumpy edits, so watch the video back.", "Heavy visual editing is easier in a traditional editor."],
    verdict: "A great fit for spoken-word video. Less useful for footage with little talking."
  },
  {
    name: "Video2X", jobs: ["edit"], access: "Open source", url: "https://github.com/k4yt3x/video2x",
    title: "Video2X: free AI upscaling for low-resolution video",
    desc: "Video2X is open-source software that enlarges video and adds frames using AI models. What it needs and what results to expect.",
    intro: "Video2X is open-source software that makes low-resolution video bigger and smoother using AI models. It can upscale old footage to a higher resolution and increase the frame rate. It runs on your own computer.",
    who: ["People restoring old home videos or low-resolution clips", "Anime and animation fans upscaling older shows", "Hobbyists comfortable running software from a project page"],
    start: ["Download Video2X from its project page and read the setup notes.", "Check that your graphics card supports the technology it uses.", "Choose an input video and an upscaling model.", "Pick the output size, for example double the original.", "Run it and wait. It can take a long time."],
    free: "Video2X is free and open source. The models it uses have their own terms, so check them if you plan to share or sell the result.",
    watch: ["It needs a reasonably modern graphics card, and big videos take hours.", "Upscaling guesses at detail. It improves sharpness but cannot recover what was never recorded.", "Setup is more technical than a website tool."],
    verdict: "A solid free option for restoration projects if you do not mind the setup."
  },

  /* ---------------- captions ---------------- */
  {
    name: "Subtitle Edit", jobs: ["captions"], access: "Open source", url: "https://www.nikse.dk/subtitleedit",
    title: "Subtitle Edit: free subtitles with built-in speech recognition",
    desc: "Subtitle Edit is a free subtitle editor for Windows that can transcribe speech with Whisper. How to make and fix subtitles with it.",
    intro: "Subtitle Edit is a free, open-source subtitle editor. It can create subtitles from scratch, fix timing, convert between formats and generate a first draft from speech using Whisper speech recognition.",
    who: ["Anyone adding subtitles to a video before upload", "Translators who work with timed text", "People who need to convert subtitle formats"],
    start: ["Download Subtitle Edit from the official site and install it.", "Open your video from the File menu so you can watch while you edit.", "Use the speech recognition option to generate a first draft.", "Correct the text and adjust timing where lines start or end too early or late.", "Save as SRT or another format and upload it with your video."],
    free: "Subtitle Edit is free and open source.",
    watch: ["Speech recognition models are downloaded separately, and larger ones need a good computer.", "Always proofread the draft, especially names and technical terms.", "Check which subtitle format your target platform accepts."],
    verdict: "The best free tool for polishing subtitles on a computer, even if you use another tool for the first draft."
  },
  {
    name: "Buzz", jobs: ["captions"], access: "Open source", url: "https://github.com/chidiwilliams/buzz",
    title: "Buzz: free offline transcription with Whisper",
    desc: "Buzz is a free desktop app that transcribes audio and video on your computer using Whisper. How to use it for captions and notes.",
    intro: "Buzz is an open-source desktop app that turns speech in audio or video files into text. It uses OpenAI's Whisper models and runs entirely on your computer, so recordings do not leave your device.",
    who: ["Journalists and researchers with private recordings", "Creators who want a caption file without uploading videos", "Anyone who wants transcripts for meetings and interviews"],
    start: ["Download Buzz from its project page and install it.", "Open the app and choose a Whisper model size. Smaller is faster, larger is more accurate.", "Add your audio or video file and start the transcription.", "Wait for it to finish, then review the text.", "Export as SRT, VTT or plain text."],
    free: "Buzz is free and open source. Models are downloaded the first time you use them.",
    watch: ["Large models are slow without a good graphics card.", "Accuracy drops with background noise and heavy accents.", "Proofread before publishing."],
    verdict: "A private, free way to get a transcript or caption file. Choose a model that matches your computer."
  },

  /* ---------------- voice ---------------- */
  {
    name: "ElevenLabs", jobs: ["voice"], access: "Free plan", url: "https://elevenlabs.io",
    title: "ElevenLabs: free text to speech for video voiceovers",
    desc: "ElevenLabs makes realistic spoken audio from text. How to create a voiceover for your video and what to check on the free plan.",
    intro: "ElevenLabs turns written text into natural-sounding speech. For video makers, that means a voiceover without a microphone, in many voices and languages. It also offers dubbing, which translates speech from one language to another.",
    who: ["Creators making narrated videos without recording audio", "Teams producing training and explainer videos", "Anyone adding a voice to a slide or screen recording"],
    start: ["Create a free account on the ElevenLabs site.", "Open the text to speech tool and paste your script.", "Choose a voice and listen to a short sample.", "Generate the audio and download it.", "Add the audio file to your video in an editor."],
    free: "Free plans have a monthly limit on how much text you can convert, and free use may come with conditions on credit and commercial use. Check the current terms." + FREE_NOTE,
    watch: ["Listen for odd pronunciation, especially for names and acronyms. Respell them if needed.", "Do not clone or imitate a real person's voice without permission.", "The monthly allowance is small compared with long videos."],
    verdict: "Excellent quality for short voiceovers. Plan the script before you spend your monthly allowance."
  },

  /* ---------------- avatar ---------------- */
  {
    name: "HeyGen", jobs: ["avatar"], access: "Free plan", url: "https://www.heygen.com",
    title: "HeyGen: making presenter videos from a script",
    desc: "HeyGen creates videos with a digital presenter who reads your script. How it works and what to know about the free plan.",
    intro: "HeyGen produces videos where a digital presenter speaks your script. You type the words, choose an avatar and a voice, and it generates the video. It suits explainers and training where filming a person would be slow or costly.",
    who: ["Teams making training or onboarding videos", "Small businesses producing product explainers", "Creators who do not want to appear on camera"],
    start: ["Create a free account on the HeyGen site.", "Start a new video and choose an avatar.", "Paste your script and choose a voice and language.", "Generate the video and preview it.", "Download it or share the link."],
    free: "The free plan is limited in video length and number of videos, and output may carry a watermark. Check the current terms." + FREE_NOTE,
    watch: ["Keep scripts short and conversational.", "Always tell viewers when a presenter is AI generated if it could mislead them.", "Check the rules on using avatars based on real people."],
    verdict: "A quick way to produce a presenter-led video, best for short and clear information."
  },
  {
    name: "D-ID", jobs: ["avatar"], access: "Trial", url: "https://www.d-id.com",
    title: "D-ID: animate a photo so it speaks your script",
    desc: "D-ID turns a still photo into a talking video from a script. How to try it with the free trial and what to watch for.",
    intro: "D-ID animates a still photo so the person in it appears to speak. You give it an image and a script, and it generates a short talking video. It is often used for explainers, greetings and simple presenter clips.",
    who: ["Teams who want a presenter without filming", "Educators making short spoken lessons", "People experimenting with talking-photo effects"],
    start: ["Sign up for a free trial on the D-ID site.", "Upload a clear, front-facing photo or pick a provided presenter.", "Paste your script or upload audio.", "Generate the video.", "Review it, then download."],
    free: "D-ID has offered a free trial with limited credits, and trial videos may be watermarked. Check the current terms." + FREE_NOTE,
    watch: ["Only use photos you have permission to animate. Never animate someone else's face to mislead.", "Photos with a clear face, even lighting and a neutral expression give the best results.", "A free trial is short, so test your idea quickly."],
    verdict: "Easy to try, with strong ethical lines to respect. Use your own photo or a licensed presenter."
  }
];
