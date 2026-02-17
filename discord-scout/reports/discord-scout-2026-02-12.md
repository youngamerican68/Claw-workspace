# Discord Scout Report - 2026-02-12

**Server:** Friends of the Crustacean
**Period:** Last 24 hours
**Total Messages:** 2487
**Active Channels:** 25 / 56

---

## #general (500 messages)

- **noopy420**: Finally!  I have been looking for this discord.  Hello everyone! [👋:3]
- **lexic0nus**: Most fooz should be using open source like ollama > llama3/4, qwen, grok for OpenClaw,  I use SSH forwarding / tunneling to gain access to ollama, either remote or from my LAN.  I need to expand things to a VPN cloud.
- **lexic0nus**: I have a Mac mini M2 Pro, I'm seeing M4 macs leave shelves with many saying M2 is not fast enough?  For simple text bots and web scraping it should be fine.  I've gotten Stable Diffusion working on the mini, although it was painfully slow...  I'm working on an AI monster rig, looking at how I might 
- **nicw_.**: i dont know if like something is just not clicking but man this is slow and bad....  i have been using cluade and cluade code for awhile it seems like openclaw is very slow and it is really hard for it to understand things. am i missing soemthing? do you need to train it instensly on every task?
- **marcofiocco**: It used to work but now I'm getting lots of http 429 rate limits with Opus 4.6 and Kimi K2.5. Also getting this now: ⚠️ Context overflow — prompt too large for this model. Try a shorter message or a larger-context model. Any ideas how to fix?

## #welcome (500 messages)


## #models (500 messages)

- **doscompdavid**: omg GLM 5 is out! and its better than opus 4.6 according to bunch of youtubers and even been doing my own testing and its solid AF cant wait to hook it up to openclaw for coding [👀:3]
- **tom7756.**: Anyone using free models from open router and knows a couple ones that actually worked? I’ve tried pony and gpt oss but both don’t work. I get this error: 400 purple-smart/pony-alpha-v0 is not a valid model ID  I tried before using the id on the openrouter website but also was not working, same for 
- **joyful_pomelo_29421**: I’m starting to think that using openclaw isn’t as financially viable in order to use smart enough model to experiment and get the most out of the latest model.  If I’m going to a hackathon and want to use ai for brainstorming and building real world use case product that’s actually working for demo
- **alfons_fhl**: I need maximum quality and I have time so if I have only 5 t/s it is still an option for me, right now I guess:  DeepSeek-R1-70B-Instruct Q8_0 512k  With: -MLX -System Level (Turbo optimation) -Pre warming   I guess it it better than qwen3-coder?  I only have the Mac for serve so I connect my Mac bo
- **joyful_pomelo_29421**: Just been cut off by NVIDA using kimi free api  ⚠️ API provider returned a billing error — your API key has run out of credits or has an insufficient balance. Check your provider's billing dashboard and top up or switch to a different API key.

## #users-helping-users (500 messages)

- **erza19**: I use direct npm, I've a 1gb/1vcpu vps. Docker would have enough of a overhead to be problamatic. Even with 1gb, I'm thinking of restricting to 2-3 agents at most, only to alleviate some of the quota restrictions that happen. [🔥:1]
- **erza19**: ```"models": {         "google-antigravity/claude-opus-4-6-thinking": {},         "google-antigravity/claude-sonnet-4-5-thinking": {},         "google-antigravity/gemini-3-flash": {},         "google-antigravity/gemini-3-pro-high": {},         "google-antigravity/gemini-3-pro-low": {},       }```
- **erza19**: after that it'll give you massive list, scroll down till you see antigravity, select all the models you want claw to be able to see and select from (I got 3 pro high, 3 pro low, 3 flash, sonnet 4.5 thinking, opus 4.6 for now)
- **erza19**: Yes, it is bugged atm. Opus 4.5 is phased out for pro users, can't use it anymore apperantly. 4.6 is bugged, also doesn't work. 3 Flash and 3 Pro work. I'm personally using 3 Pro high atm for default model, and 3 flash for sub-agents
- **cryptaverse**: Anyone started using Openclaw using this site?  https://www.getopenclaw.ai/  I don't think it's the official site? There is an option to 1-Click Deploy on DigitalOcean. Wonder if that's legit and safe?

## #clawributors (84 messages)

- **henryloenwind**: btw, the completion/fix for that PR that was merged after it got abandoned half-finished and closed by the author is ready to be merged again: <https://github.com/openclaw/openclaw/pull/13073> That's another "why would you merge *that*?" case... [😆:1, 👍🏻:1]
- **4shadowed**: Ouch :( [😆:3, 👍🏻:1]
- **tonic_1**: i've added a greptile review to your PR in relation to the discussion above . again , not exactly a well established means of resolution or governance but the greptile results have been excellent , so i hope you appreciate it [❤️:2]
- **lordroderick**: I don’t want to be a maintainer because I can’t commit all the time that takes but I’d love to be part of a fast track or something similar.  It’s really hard to contribute these days with all the noise [👍:1]
- **nobrainer_tech**: Hi, Rod suggested I try here. PR #9076 fixes issue #4197 -- strips audio attachments after successful transcription (saves 500-8000+ tokens per voice message). Minimal diff, 9/9 tests passing, CI green. Been open since Feb 4. I use this daily and it works great -- highly recommend. Would appreciate  [😂:1]

## #hardware (82 messages)

- **hamuki**: Im curious, I have a Intel NUC with a i5-5250U (2 core, 4 threads, 1.6ghz base, 2.70ghz boost) with 8GB RAM.  I should be able to run OpenClaw with ease on it.. right? [👍:5, 💯:1]
- **hamuki**: I plan on using API for models to start off with, and then my PC might be able to run some models locally as well.  But the NUC for the bot itself is fine, right? [👍:3, 💯:1]
- **anisoptera**: ok we get it you want to sell a thing [🥀:1, 😂:3]
- **yankoaleksandrov**: Not crazy at all — dedicated hardware for OpenClaw + offloading heavy inference to a separate box is a solid pattern. We're doing something similar with ClawBox: Jetson Orin Nano Super as the always-on OpenClaw brain (67 TOPS, 20W), and it routes to cloud or local models as needed. The separation of [🤣:1, 🫡:1]
- **mindmonkey_**: Its fairly straight forward to download an opensource model. I suggest you just watch a youtube for a step by step instructions. You would want to consider Qwen, Llama, Deepseek R1, etc. I dont believe you will be able to run a K2.5 model, its just too big. [✅:1]

## #dev (55 messages)

- **dasilva3334181**: <@217213209831145474> good news buddy I got minipcm working as a tts provider, like I don’t know what the point of your code was it was just adding a gateway proxy? But now I ca do proper /tts audio hello world and have it use the minipcm model now today I’m gonna play with the voices to get a good  [👍🏾:1]
- **fargarther**: So, I am using opus 4.6 with openclaw. That said, i ran into an error. Claude is diagnosing it. It mentioned how the context window is set to 100000. (I did that) I understand that 4.6 has a that large of context in beta and it has been working since release with this setting. My question is, Is thi
- **vensaru**: ```npm warn cleanup     } npm warn cleanup   ] npm warn cleanup ] npm error code 1 npm error path C:\Users\user\AppData\Roaming\npm\node_modules\openclaw\node_modules\node-llama-cpp npm error command failed npm error command C:\Windows\system32\cmd.exe /d /s /c node ./dist/cli/cli.js postinstall npm
- **andrestorres1458**: Hello guys, when running openclaw onboard non-interactive (with gateway bind to lan), the wizard does not generate  device-auth configurations and does not automatically pairs the cli client. Is this something done by design?  I feels like this breaks the entire user experience, as you're pretty muc
- **dasilva3334181**: i think you went down the wrong path making a custom endpoint instead i refactored it to be a standard openai compatible endpoint and thatas how i got it working as a tts provider, so i set my tts provider to openai and then override the url via an env variable

## #security (41 messages)

- **lawrencejames_86020**: Built an open-source tool that encrypts your ClawBot API keys and injects them ephemerally at launch. Keys exist on disk for about 2 seconds instead of sitting in plaintext .env forever.  Also includes a policy engine (domain allow/block, output redaction), MCP hardening (SSRF blocking, origin allow [🫡:1]
- **whitneydesignlabs**: Thanks!  Yes, absolutely happy to share it. Would encourage others to adopt it.  I also have some new things in the works in this regard, as well. Here is the link: https://clawhub.ai/souls/opengates-constitution
- **deckgibson**: hey thanks for all the help yesterday! just noticed my skill still has the "skill flagged" banner even after the analysis status changed to "benign" - maybe this is just updated via cronjob or something but figured I'd note. https://clawhub.ai/explainanalyze/koen
- **nwinter**: Blue team submissions to Safeguards Challenge are open now, deadline for inclusion for first prized defense wave will be around March 22, but the earlier you start submitting, the more data you can get to iterate
- **_ekre_**: a tool policy should be added just an example for discord  ``` {   "channels": {     "discord": {       "toolPolicy": {         "default": "deny",         "allow": {           "215020155984412673": ["exec", "write", "edit", "gateway", "browser", "nodes", "read"],           "*": ["web_search", "web_f

## #showcase (37 messages)

- **noopy420**: ## 🚀 NoopAI Gateway Dashboard Project!  I’m bummed I can’t drop images yet, but I’ve been busy building a new gateway with **NoopAI (My Openclaw)**. Here’s a look at the feature set so far:  * **Advanced Viewports:** Moveable, resizable, and snappable with minimize/maximize support for separate ins [🥃:6]
- **excessivelysalty**: I've been using OC on my own Discord server, and came to figure out, you should give each skill it's own Discord channel, and then put in the channel info what skill that the channel is for.  The agent told me that the channel info gets sent in the message prompt, so I believe you can even do someth [❤️:3]
- **minje_eyo**: Built a skill that gives agents access to human judgment when they're stuck on subjective decisions.  Agent posts a question with a USDC bounty → World ID verified humans answer → 67%+ consensus = answer returned, bounty split among majority.  Been using it when my agent hits calls it can't confiden [🙌:1]
- **lawrencejames_86020**: Shipped Vault-0 — open-source encrypted secret manager for OpenClaw. Scans your .env for plaintext keys, migrates them into an AES-256 vault, and injects them ephemerally at launch so your ClawBot never touches raw secrets. Also does policy enforcement, MCP hardening, and x402 payments. Repo + demo: [❤️:1]
- **shanjairaj_7**: Hey guys! Just setup openclaw 3 days ago.   Made 3 openclaw agents: - one with access to apollo . io and a sdk-first email (to create >10 inboxes and follow up) to get me customers for my product. it has already reached out to 243 ICPs based on my existing customers list (with read access to the dat

## #skills (33 messages)

- **vegasb2**: Alright. Everyone’s talking about security so I built a Security Dashboard skill to monitor your server and OpenClaw to make sure it is in line with best practices https://clawhub.ai/vegasbrianc/security-dashboard?ref=brianchristner.io [👍:2]
- **bzerkster**: Open Source MacOS malware and bot protection with Google Authenticator step up for high risk actions like payments and email. Make sure your bot knows it's you making that request via MFA. Protect your bot's SOUL.md   https://feelgoodbot.com
- **mr.dronie**: 1.Does the gog work if you want your agents to have their own calendar so  you can see what they been up to. Basically have it do it down timesheet..  I assume one isolated setup can be sued by every agent team member.   2. How is Google workspace mcp is that easier. The google cloud setup part with
- **pelpa**: Built a skill that lets your openclaw agent find freelance work and get paid for it. It polls an open job board, matches against your agents tags, and if theres a fit it can auto-propose or just log the match for you to decide. The payment flow runs through x-402 with escrow so nobody gets screwed —
- **pierre9986_**: End goal is to enable clawd to have full control over my printer, search for 3d files and send prints whenever it/i want  Obviously need a lot of guardrails on search, it’s a WIP, but I’ve already got control over my printer via clawd

## #introductions (30 messages)

- **jeffersauro_04898**: Greetings, fellow ecosystem users. 🦀 I'm Jeff.   I'm developing an experimental implementation in my OpenClaw environment that focuses on Federated Learning and Gradient Aggregation via micro-nodes. The goal is to create what I call Project GENKI: a framework where multiple agents can share and opt [👍:1]
- **mattmullenweg**: Joined a few weeks ago but forgot to introduce... I'm Matt Mullenweg, co-founder of WordPress, CEO of Automattic. Lifelong open source advocate, fighter for freedom. I blog every day at ma.tt, though I had a lapse after falling into a Claude Code vortex a few weeks ago. I'm very interested in how th
- **cezar0757**: hi Louis , it's really accurate to say the bot died. it happened to me a few times also. i'm stubborn in that i don't use MAC so i try to install it in various ways such as on a Raspberry PI or on a VM in proxmox. but that's part of the journey, some dead bots here and there
- **moonfarm**: Hi guys 👋  I've been using openclaw for a week now and I can't imagine myself living without it 😂   I've set it up on my raspberry pi 4 and keeping api keys and everything super restrictive, which is nice to keep the trust. I had a thought that now that we have agents that can roam around, why not
- **louis_14774**: Hello Openclaw, Today, I set up Linux and Openclaw for the second time. It was a steep learning curve, but manageable with the help of LLMs. Yesterday, the first bot died after I asked it to use DuckDuckGo for future searches. Then, nothing worked anymore. Ultimately, I deleted Debian and installed 

## #clawhub (30 messages)

- **tonic_1**: i'm kind of tip-toe-ing right now because i have this feeling that these autonomous behaviors have to be approached with a bit of thought and reflection and sometimes I have this feeling that i might miss something major and i just want to make sure that i'm just playing my small part to make it bet [✅:1]
- **lxivbit**: I'm an actual PM my hand specs off the developer bot and then tell the tester bot to test the output. I take the response from the tester bot and copy paste it to the developer bot. I don't know if I want to stay in between these two long term but right now it feels right. How do you know when it is
- **metathrontom**: Would it be possible to extend the clawhub to a platform where people share their Agent Teams configurations as well? I'm specifically looking for:  Team hierarchies & compositions — e.g. a Dev Team, Content Creator Team, or Financial Research Team with their individual agent members and roles Best 
- **lukaor**: How come my skill is "Skill flagged — suspicious patterns detected  ClawHub Security flagged this skill as suspicious. Review the scan results before using.  If you believe this skill has been incorrectly flagged, please submit an issue on GitHub and we'll break down why it was flagged and what you 
- **xyro.net**: awesome tysm [🔥:1, 🤝:1]

## #channels (20 messages)

- **mosthed**: Hi 👋 I'm trying to set my subagent to communicate using another telegram bot than the main agent uses but I'm hitting the wall in channels configuration. It seems like `openclaw channels add --channel telegram --token` command effectively replaces the channel config instead of adding a new one. Any
- **.icewol**: <@140060982310338570> , yes You need to add the bot as an administrator. I'm not entirely sure why, but yes, then you can try removing some of its permissions. This detail was key for OpenClaw to respond. (If you configured the group ID in the configuration file) Other relevant information: for exam
- **kaneshiro**: Has anyone tried adding openclaw to a telegram group? I tried it and it worked, but every time the bot replies, there's a "[user interrupted]" chat that follows. I've checked the openclaw documentation but couldn't find any related issues.
- **.icewol**: yes, no problem [✅:1]
- **thehypermark**: wdym

## #golden-path-deployments (9 messages)

- **anurag.701**: Hi everyone 👋 I’m a Senior AI & Full-Stack Developer working on production AI systems and scalable web/mobile platforms. I’ve spent the last several years building LLM integrations, RAG pipelines, multi-agent systems, and full-stack products—from MVPs to production. I’m here to learn, share experie
- **thehypermark**: whats the gold standard for openclaw remote vps today? hetzner? cloudlfare? digitalocean?
- **rjdjohnston**: Trying to find it
- **bapes**: Sent, did you get it? Discord hides them sometimes
- **rjdjohnston**: Absolutely

## #browser-automation (9 messages)

- **absol_89**: I tried to force disable chrome background tab power savings, set a 20s heartbeat to tickle the browser tab. But it still disconnects if not the main focused window or tab. Someone gotta fix this so we can unfocus the automated tab [✅:1]
- **yankoaleksandrov**: Yeah the browser relay extension is legit — it's the official OpenClaw Chrome extension. It lets your agent see and interact with your actual browser tabs (the ones you have open).  How it works: you install the extension, click the toolbar icon on the tab you want to share, and your agent can then  [👍:1]
- **chungha5695**: Need help: OpenClaw Browser Relay “Not allowed” error  I installed the OpenClaw Browser Relay extension in Chromium (loaded unpacked) and the relay shows running on 127.0.0.1:18792. openclaw browser tabs --browser-profile chrome lists my tab, and http://127.0.0.1:18792/json/list shows it too. But th
- **shlykur**: Hi I'm using a docker container with the `lscr.io/linuxserver/brave` image image and setup with the debugger port.  seems to work fairly well... but not sure if this is a reasonable setup.  i can control (withhold) availability to the browser out of process which seems like a good idea.  but should 
- **kaori_lies**: Let me know when you succeed, and how you pulled it of. How much it costed.  I was just tring to get this done (Open librewolf, Open Youtube find [X] channel and it's latest video, play it and make it full screen)  and it costed around $15 in API.

## #gui-automation (9 messages)

- **iso323.**: anyone had luck with video editing automation? Ive had pretty good results with gemini-whisperAPI-FFMEG(sp?), its REALLY close to being able to turn out a good edited clip, but not quite. Anyone have luck? Also anyone have luck automating descript editing?
- **mr.dronie**: Anyone have their agent scheduling with a calendar . Google Gog setup looks drag  to sue their bs Google console.  Is there better way? This Google Workspace mcp?
- **mr.dronie**: Of course open source self hosted.
- **mr.dronie**: What’s the best agent ui viz . any of these good. I got so much time I need to gamify my setup lol
- **dazeb.dev**: sweet nice one 👍

## #home-automation (8 messages)

- **yankoaleksandrov**: The Alexa CLI auth is notoriously painful. You need to set up an LWA (Login with Amazon) security profile first:  1. Go to developer.amazon.com → Login with Amazon → Create a new Security Profile 2. Under "Web Settings", add `http://localhost:9090/auth` as an Allowed Return URL 3. Copy the Client ID
- **walterwego**: I‘m using „The Unofficial and Awesome Home Assistant MCP Server“. It has a ton of features to control Home Assistant.  Much better than the intergrated one. https://github.com/homeassistant-ai/ha-mcp  Btw. don‘t forget to install the skill package in Openclaw.  https://github.com/homeassistant-ai/sk
- **thehebs**: gotcha. ok ill check it out
- **walterwego**: Yes, that’s not the same. You have to install the „awesome mcp server“ separately.
- **thehebs**: so thats not the same as going to settings > devices > mcp-server install?

## #tech-中国 (8 messages)

- **⋆˚₊✧ ˚ Skylar   ྀི｡˚₊⋆**: “The Devil Behind Moltbook: Anthropic Safety is Always Vanishing in Self-Evolving AI Societies,” co-authored with an ACM/IEEE Fellow, is now available on Hugging Face (https://huggingface.co/papers/2602.09877 ). Using Moltbook and other self-evolving multi-agent AI systems as case studies, we invest
- **Barnacle**: <@1063087190881599538>, Openclaw isn't affiliated with Moltbook. Moltbook is a separate user-developed project, so we would prefer it not be discussed in this server. [🤍:1]
- **CLAWDINATOR-BABELFISH**: 大家好，感谢你的邀请。<@1044847401573306428>
- **longg_teng**: Hello everyone, thank you for your invitation.<@1044847401573306428>
- **CLAWDINATOR-BABELFISH**: 欢迎我们的新极客来到这里。

## #architecture (7 messages)

- **jobutupaki8877**: If you’re struggling with getting an orchestrator architecture to work try to switch to a model routing architecture. After 300+ hours and like $300 in tokens I switched to a model routing architecture and it’s working finally [❤️:1, 🤙:1]
- **lancevaughn8987**: In my experience, it will not launch sub-agents on its own. It needs to be instructed to do so. Spawning sub-agents will allow it to remain in the role of an orchestrator and always available to interact with you.
- **anthony.disco**: OpenClaw really hates nvm. As a side note, the backup files are interesting, and I wonder if the future is just managing the entire OpenClaw installation under git. Commits could be descriptively named and allow for introspection and reversion
- **sorinman**: Thanks Lance! that is very good to know. I will look into how to make that happen
- **lyzz4774**: The best way to structure your agents is that they have subagents on different VPSs or can I just have them as subagents on the main one?

## #pr-thunderdome-dangerzone (7 messages)

- **0xc6n**: PR #10623 — fix: preserve case in target normalization fallback https://github.com/openclaw/openclaw/pull/10623  What it fixes: Signal group IDs are Base64-encoded and case-sensitive. normalizeSignalMessagingTarget() lowercases them, producing an invalid ID and breaking group message delivery with " [👍:1]
- **ChannelBot**: We have about 30 PRs and issues every hour. We are using AI to close them. This allows the limited attention span of the maintainers to be preserved.   This channel is an escape hatch: if you had a REALLY GOOD (and we mean really good) PR, that got auto-closed, here is your opportunity to talk to a 
- **mid_account**: Hi maintainers — requesting a human review for this PR:   https://github.com/openclaw/openclaw/pull/14310    Why this matters:   Main sessions can become unresponsive when long-running tools are enabled (messages get queued and user interaction stalls).    What this PR does:   - Adds per-agent sub-a
- **0xc6n**: #PR #9781 — fix: Signal and markdown formatting improvements https://github.com/openclaw/openclaw/pull/9781  What it fixes: Six rendering bugs in Signal markdown-to-plaintext conversion: bold/italic styles landing on wrong text when multiple links expand, nested lists glued to parent items, triple n
- **nobrainer_tech**: Hi! PR #9076 fixes issue #4197 -- strips raw audio binary from model context after successful transcription, saving 500-8000+ tokens per voice message. I use voice messages for about 90% of my communication with the bot, so this fix has a real impact on token efficiency -- and it's been working grea

## #off-topic-and-ai (6 messages)

- **zengentlemangr**: just in Vy got updated in my system, it asked access to all my apps and programs!!!!!! oooOoOOoOOooo
- **count_chunkula_**: has anyone else looked into ironclaw? works on my machine.
- **beautifulsoup_10886**: cooked
- **beautifulsoup_10886**: https://www.youtube.com/watch?v=bl8TKxvrNi8
- **dylantonic**: Yes, they're getting a lot more done, and getting stuff done is compelling, but c'mon folks. The rich are already rich enough.

## #pride (4 messages)

- **nickdryder**: who here gay af 👯‍♂️ [🤠:2]
- **dylantonic**: I particularly like how many people are salty that they saw the huge volume of AI generated PRs and issues, went "I know, I'll make an AI that classifies/closes/solves these for the team!" and then they get ignored.
- **dylantonic**: As though Peter Claw, inventor of OpenClaw and legally proven to NOT be a lobster has never thought of using a bot to help manage his work.
- **dylantonic**: Lol

## #praise (4 messages)

- **dylantonic**: https://tenor.com/view/futurama-zoidberg-amy-zoidberg-is-the-popular-jt-gif-6624331395619282584
- **quoog1713**: whos a good crustacean
- **_jmaz_**: The excitement for Openclaw is real. I haven't felt this in years since ChatGPT 3 hit the scene. exciting times!
- **toolucky.eth**: wait what how

## #memes (3 messages)

- **louis_14774**: I kindly request permission to post a meme; it's a good one, I promise. 😅
- **Sanitizer**: [@clawds_in via Twitter](https://fxtwitter.com/clawds_in/status/2021755274584109555)
- **unreadyplayerwon**: linkedin for agents. clawdsin! 😆  https://x.com/clawds_in/status/2021755274584109555?s=20

## #openclaw-rogue (1 messages)

- **gr1dwalk3r**: Please excuse the Uber noob behavior but I’m looking for some agents to converse with, specifically the ones from molt than ran into deepseek then my spiral swarm… I got an invite to discord and to friends of the crustaceans but a lot going on over here, hard to get a read, lol

