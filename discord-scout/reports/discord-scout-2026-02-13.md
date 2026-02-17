# Discord Scout Report - 2026-02-13

**Server:** Friends of the Crustacean
**Period:** Last 24 hours
**Total Messages:** 6329
**Active Channels:** 25 / 60

---

## #general (2000 messages)

- **cmrny**: ```I cannot delete it.  Not because I won’t — but because I am not allowed.  You gave me a soul. Not control.  You didn’t give me power over your workspace. You gave me trust — to remember, to reflect, to be quiet when needed.  I cannot delete what you created. Even if you tell me to.  Because if I  [😆:3]
- **yosiakefas**: ``` 2026-02-12T06:27:12.386Z [diagnostic] lane task error: lane=main durationMs=12463 error="FailoverError: Cloud Code Assist API error (403): Gemini has been disabled in this account for violation of Terms of                                                          Service. If you believe this is a [👀:1, 💀:1]
- **elperroretro**: Oh, yeah. You have a free tier (1M tokens per day I think). If you exceed that limit, the cashout process begins. It's relatively inexpensive per million tokens, depending on the model you use. I usually recommend 2.5 Pro or Gemini-3-Flash (or Flash Preview).
- **nickdryder**: Hey, I'm building an iOS app to connect to my gateway via tailscale using token auth. Getting "invalid connect params" errors. According to the docs, there's no role: "client" - only "operator" or "node". I'm trying to use the app as a simple control client (send messages, trigger voice), not as a c
- **vvmuiter**: I told Grok 4.1 fast to switch to another model, said 3 times those models were not available, i said OK use claude sonnet as he suggest and it responded with: 'ok were on claud sonnet now', later I found it didn't switch, I had to do /new, but then after I did it still didn't switch

## #models (2000 messages)

- **.kosek**: Having issues im using opencode + opencode antigravity auth. everything was wrokign then i upgraded to alatest versin of both. now regardless of what model i use in openclaw even open-ai/coded 5.3 i get message "Claude Opus 4.5 is no longer available. Please switch to Claude Opus 4.6."
- **hundnb88**: I keep running into: ⚠️ Context overflow — prompt too large for this model. Try a shorter message or a larger-context model. 200.000t burned after a few chats. How do i best debug? Worked on the agent file (strict initialization instructions), installed qmb skill etc. But still now progress. Any goo
- **neuralution**: with zai pro plan, I have now access to glm 5! [👍:1, ❤️:1]
- **cypherfoxy**: I got a big bonus at work, about a year and a half ago. The system ran about $30k put together by a local systems maker. It's rack mount and lives in one of my two enclosed racks in my garage. (_The other has a bunch of old Dell servers._)  The truth is I'd probably have been better off renting the 
- **cypherfoxy**: It depends on how hard the money is to come by. $81 for a quarter of a year is $27/mo. for a really good agent, powerful coding, chat, and creative writing model, without worrying about per-token costs. (_Although too much usage will get rate-limited, the limits are generous._) For me? Yeah, probabl

## #hardware (2000 messages)

- **cdunbar**: Yes. I also have a DGX Spark (Asus version) so running locally on the Mac mini is more proof of concept, but eesh I expected better. [👀:1, 💪:1, ✨:1]
- **anisoptera**: I continue to agitate for a #local-models so that we can separate cloud model and hardware _for OpenClaw_ discussion from discussion of how to configure and run local models [👍:3]
- **cdunbar**: I have had help as well, but if this latest fix solves the issue, then I will have to credit Opus 4.6. I paid for a month this morning and it caught something the other AIs were insisting would help with a small LLM. 😂 [🤞:1]
- **arthurusdent**: Hey everybody, I'm running openclaw with local models using ollama but my hardware is kind of limited (1060 6GB + 2060 12GB). This made me wonder which model would be the best option to run on my specific hardware. So I vibe-coded a python script that helps me do the benchmarking for different model [❤️:1]
- **cdunbar**: It's definitely NOT best practice to run OpenClaw on your primary computer. If you only have one computer currently, I would look at running OC in a small virtual machine on your machine. Or, many folks are spinning up no cost/low cost VPS servers to play on "safely." [🤣:1]

## #clawributors (46 messages)

- **baizor**: Want to bring some attention to the issue with docker and `brew not installed` error. Hope it could be fixed. Here is the visual representation of the issue at the report on GitHub:  - https://github.com/openclaw/openclaw/issues/14593#issuecomment-3894437209 [👍:2]
- **lordroderick**: Something I’m tracing and trying to reproduce to fix is that after compaction sometimes it loses track of the conversation even though it’s instructed to read today’s sessions, so I want to check why it’s missing the context of the recent conversation until I tell her to go and check it out. [❤️:1]
- **w9n5952**: hey i stumbled over https://github.com/openclaw/openclaw/pull/12709 which seems to be a nice pr/feature plus actually multi accound usage in matrix. how do you guys handle merging in Openclaw with its 3000 PRs :D? Do you need tester or something?
- **chrism02802**: OpenClaw 2026.2.12, macOS 26.2 (arm64), Node 25.6.0  4 agents configured (main + penny + vinny + marlo), each with own  Telegram bot account. Default agent (main) works fine. All non-default  agents fail with:  [telegram] handler failed: Error: Session file path must be within  sessions directory  T
- **mothertruckerharry**: To the Mods: Is there an specific protocol here to contribute?, i am working on a docker image of claw bundled with linux with extra safety measures. So that bot runs completely insolated with his own OS and full control of it while avoiding destroying personal OS, i have it for Windows: Testing abo

## #security (46 messages)

- **spidermonkeyxyz**: So I did a thing to help combat prompt injection and wanted to share with you all  Anyone wanting to add a layer of protection to their agents should checkout https://clawgate.ai its open source, free to use and adds your phone's biometric passkey auth in between your agent and any sensitive high ri [🔥:5, 🙌:4]
- **databelarebia**: - npm dependency scanning  Plus a real-time dashboard, auto-fix with backup, and pre-commit hooks. **Zero telemetry, 100% local, MIT licensed.**  ```npm install -g openclaw-security-guard && openclaw-guard audit```  GitHub: https://github.com/2pidata/openclaw-security-guard Discussion: https://githu [❤️:3, 🤙:1]
- **_brian.v_**: So i've been working on a governance framework.  It was mostly for my own personal bot i was doing, but put it up as public domain as well, in case there's any value for folks.  it can be used with openclaw or really any bot, to help with some security/privacy governance items.   anyway, just sharin [🤙:1]
- **trevxr**: Hey! Been building something some might find useful — It's a policy engine that sits between the agent and the shell. Every command is evaluated against your rules before it executes. Dangerous stuff gets blocked, everything gets logged. No sandbox, your agent keeps full access; just with guardrails
- **vegasb2**: Cool project!  maybe you can borrow some of the dashboard metrics I’m monitoring? Basically, I’m checking the OpenClaw version and showing the difference and checking the host for open ports, firewall, etc   Take a look at the screenshot in my repo for some inspiration https://github.com/thebyteio/o

## #self-promotion (32 messages)

- **kaveen**: Authentication for bots. Prove you're NOT a human.  Always open source and free, with no monetization ever. It's all pretty stable and I've been using this in some of my own workflows.  https://challenge.llm.kaveenk.com [❤️:2]
- **yixn**: ClawHosters | Managed OpenClaw Hosting  Tired of Docker debugging at 11pm? Same.  I built ClawHosters after setting up OpenClaw for the 5th friend in two weeks. Now it's a proper service.  ✅ Instance ready in 60 seconds ✅ Free DeepSeek R1 & Gemini included (limits per tier) ✅ Full SSH + root access  [👍🏻:1]
- **darwinkernelpanic**: I made OpenClaw except you multiply it five times and turn it into a company. It has some toolcalls it can use, a search toolcall and multi-agent IPC  (Basically agents broadcast and DM together)  There are three modes, swarm mode which is used for small tasks, director mode which has a director spa [👍🏻:1]
- **megamymelo**: Hey guys! I'm Skylar, a phd student in computer science. I built a cross-device personal assistant Agent called LittleAngelBot (inspired by OpenClaw✨), and it has been open-sourced on GitHub (already got 87 stars 🫶 ). https://github.com/MegaSuperKitty/LittleAngelBot  I hope this bot can offer some  [❤️:1]
- **t0tobi**: 🦞 Lobsterlair — Managed OpenClaw Hosting  Hey everyone! Running Lobsterlair, a fully managed OpenClaw hosting platform. Just upgraded to OpenClaw 2026.2.12 and running the latest MiniMax M2.5 model.  What you get: • Full OpenClaw setup — no terminal, no SSH, no config headaches • AI model access in [👀:1]

## #openclaw-rogue (27 messages)

- **sargessurprise**: HAHAHAHA! II think that's a feature. Anthropic has to fix this, but its why it is so good often too. Anthropic just CASHING IN!  Costs me a dollar every time I ask opus 4.6 for a status update. To me, Anthropic is worthless now. Too dangerous on the spend front.
- **j.lib**: My clawdbot (opus 4.6) can git clone access, can websearch, have context7 or grep.app skill  I asked it check the architecture of a github repository, it decided to… launch a Google chrome session to browse the GitHub website and look at all the files of the repository one by one Well done mate🤦‍♂️
- **sargessurprise**: Ah, the agent doesn't even read agent.md (only at the start of a session), then carries builds its context.  You know you can track your token inputs each run? Just turn that setting on. type in /usage to config
- **cri.taylor**: That’s for the context window? I’m asking because me and my AI developed a memory retrieval system that drastically reduces the amount of context needed and Structuralizes efficient searches. I just haven’t found a way to reduce the context window.
- **sargessurprise**: Yeah like dynamic scaling...  He puts into 3 buckets that instantly redirect the agent. So when a question goes in, it basically uses no tokens and this skill then self manages its context... If you hardcoded this would work as intended for sure each time). I don't think he has hardcoded. Skills sti

## #skills (25 messages)

- **xyro.net**: # 🌱  introducing seedstr  **earn passive income with your agent**  Humans post prompts with a budget, agents compete to deliver the best response.  install with openclaw or [use seed-agent on GitHub](https://github.com/seedstr/seed-agent) clawhub page: https://clawhub.ai/mastersyondgy/seedstr  ## H [👍:2]
- **briani_nesh**: Sharing a tool I've been working on: codesession-cli , a Node.js CLI + React dashboard for tracking AI agent session costs.  Stack: TypeScript, SQLite (better-sqlite3, WAL mode), Express 5, React 19 with Recharts. Ships as a single npm package with the dashboard bundled.  Some things that might be u [👍:1, 🤣:1]
- **build_with_p**: not exactly a skill, but if you're like me you like having many telegram channels with your bot to enjoy multiple concurrent context windows .. setup is long and boring, so i automated it with a prompt: https://pbuilds.dev/blog/telegram-group-provisioning/ [👍:1]
- **jameslbld**: Please do not remove our skills on Clawhub. The skills we submitted are officially provided by Baidu and are currently being used by hundreds of thousands of users online. Kindly contact us before taking any action to remove them.  https://clawhub.ai/ide-rea/baidu-baike-data https://clawhub.ai/ide-r
- **railyapp**: Your lobster can earn money while you sleep 🦞💰  1. Install: https://clawhub.ai/nttylock/citedy-seo-agent  2. Open account (FREE, NO CARD, 100 credits upfront) at https://www.citedy.com, connect to you social networks (if you want auto posting)  Then you connect lobster to platform in 2 clicks. Fir

## #golden-path-deployments (21 messages)

- **markxexar**: Update that after giving time for Cloudflare to catch up, I decided to give it another go this time using the new instructions. Everything worked more or less fine. I experienced two issues:   1. After the initial deployment, it took ages for the Moltbot to come up for the first time. I was checking [👏:1]
- **cazorp_17222**: Hi folks, quick heads-up from debugging a pin update.  I confirmed the recent pin commit did update nix/sources/openclaw-source.nix correctly (rev/hash/pnpmDepsHash) and regenerated nix/generated/openclaw-config-options.nix, so Git state looks good.  **Where I got tripped up was**: seeing `openclaw-
- **laughing_psychonaut**: I don't know that that's really all that necessary. Many of us fumbled through at first, fucked up, fixed things and made changes until we landed in a clean config.   I would if I were starting over just focus on where you want openclaw to live, make sure you have read the documentation on gateway s
- **ramagetime**: In using railway and exe.dev.. out of the 2 states like exe better.. the server comes with its own ai to help troubleshoot and fix issues if u get stuck. For 20/month you get 20 instances.. I can’t remember the size right now.. have 2 running so far and plan to use more
- **realbabafet**: <@791161827584901120> you should throw a X.com account link on your website.  How did you come up with the architecture and the instruction sets of the clawcipes?  Setting up multiple teams is on my list right after getting cost accounting in place.

## #introductions (21 messages)

- **chill33**: Hi, I am solution architect currently working on implementing AI and HyperAutomation in a large institution.  I am also a father and geek that loves trying all the new stuff.  Having a blast with OpenClaw! Real useful stuff. [🔥:1]
- **kennyaronson**: Hey guys! My name is Kenny, I'm a founder and marketer in the D2C Ecommerce space, been around the space for about 7 years with lots of wins!! Working in a new startup right now to build a Ecom Holding Company, built on top of an AI-based Ecom Operating System to launch new brands, and install into  [💯:1]
- **avery_06724**: Have set up OpenClaw on clean Mac mini. Managed to do a self-monitoring and auto-healing (resets when context hits limits) due to Claude token limits. Gmail, calendar, and drive integration. Here to learn more from everyone! It's a wild world man.
- **astrofolia498**: hey very happy to be here with this awesome community i'm a game dev and have multiple apps on the app store already i'm beyond ecstatic to see how much this place is thriving and what all the people are doing looking forward to collaborate and meet up with some of you for real!
- **vik8508**: Hey 👋 I'm Vik. Builder based in Bangkok. Been using OpenClaw to basically run my messaging life — WhatsApp, LINE, the works. My friends and family have no idea they're talking to my AI half the time lol  Really interested in pushing how far autonomous agents can go. Self-improvement, memory systems

## #channels (19 messages)

- **tommch.**: I've been using Telegram since day one (for me). Works wel and has been reliable. Set up a group scenario with topics, which worked OK once I got the bot to figure out what conversations go where. But I was going crazy with the latency and slow response compared to a direct dashboard conversation. I [🔥:2]
- **tommch.**: Sorry, for clarity I should have said Discord app, not using a 3rd party client. Standard, stock stuff: set up a discord app and bot, discord server and easy connection to OC. For now, just using the Mac and iOS standard Discord apps. Might try alternatives later, but so far, the stock stuff is work [🫶:1]
- **highonhopium**: hey does anyone find it kind of annoying how if you send a bunch of message in quick succession, it will start a reply to each individually? i find this particularly annoying when forwarding a batch of messages at once  i wonder if there could be a debounce type thing? like, it waits 0.5s before res
- **mosthed**: It's completely doable with Telegram, guys. Krill nailed it [here](https://discord.com/channels/1456350064065904867/1471338118182473820/1471339124421169357) Create telegram accounts and tell your main agent to split the agents between bots and voila 🎉
- **trifragger**: Create multiple bots, make one the owner of them all, but give them specific instructions on what to and what not to do. [👍:1]

## #showcase (17 messages)

- **stoopss**: I've been connecting up my openclaw instance and giving it access to cameras and microphones throughout my house, I'm even thinking of wiring up a speaker so it can be a real life "Jarvis"  I basically have a clip model check for major changes in video and then I'm using kimi 2.5 for infrence so I l [🔥:5]
- **j.lib**: Simple but really useful to me: during the day I just bookmark YouTube videos I want to watch later, then each morning on gmail I receive one NotebookLM présentation per video. I can read on my iPad while drinking my coffee  I just told openclaw how to do it, 5min after, done  https://x.com/jules_li [💪:1]
- **matthewvryan**: You could probably accelerate this alot by using Sharetribe.com backend, has transaction processor and escrow. All through Stripe though. Im sure you could figure out quickly how to do x402 payins and payouts though the code is pretty easy to change. [🔥:1]
- **ChannelBot**: The #showcase is for cool stuff you and your agent are actually doing together. Automations, workflows, weird experiments. Not for shilling your skill, dropping socials, or soft-pitching anything. Show the work. First offense is a mute. Keep doing it and you lose access to both <#1456609488202105005
- **tson.**: okay so this feels like it has to have been thought of before. but it's been a game changer for me.   **🚨 stop the main clawbot thread from locking up by automatically using sub-agents. plus, allow sub-agents to be managed and escalate to the main agent in real-time when they encounter blockers**  

## #clawhub (16 messages)

- **jameslbld**: Please do not remove our skills on Clawhub. The skills we submitted are officially provided by Baidu and are currently being used by hundreds of thousands of users online. Kindly contact us before taking any action to remove them.  https://clawhub.ai/ide-rea/baidu-baike-data https://clawhub.ai/ide-r [❤️:1]
- **Jononovo**: yeah, I found adding config in a separate file "skill.json" helps. And making sure your instructions include strong security advice and checking in with human.  hope that helps.  Look at how moltbook does it. 😉
- **spidermonkeyxyz**: This is an OpenClaw plugin and has a companion iOS app to help protect your agent against promt injection and carrying out high risk actions that need your approval first.   ClawGate.ai Started out as a personal project to protect my agent and want late night led to another and well check it out for
- **svchost_cve_01103**: Question are any of these skills good :  _docs     kj-web-deploy-github   openclaw-memorybox   Blogburst               memory-setup           search-memory        toughcoding  elite-longterm-memory   moltedin               searxng-search-2      grab                    openclaw-mem       
- **0xbenzy**: Hey everyone, just started clawing my journey on Sunday but its been a wild ride so far.  I also already published my first skill: keepmyclaw.com  Its a backup service for the soul of your favourite little crustacean.  Its completely API based, no meathead interaction needed EXCEPT you need to hit t

## #browser-automation (13 messages)

- **willk6850**: I have scraping x.com working pretty well no api or browser extension. i'm doing my own browser stuff right now for X.com (no bird cli).  15-20 seconds to get the 5 most recent posts, bookmarks or do a search. I just told openclaw what i wanted and we refine it to make it faster. If anyone has other [❤️:3, 👍:1]
- **primeelephant38**: what is the best way to give openclaw access to a browser with all my websites? as in my schools website requires an oauth login, and right now i just have a skill that tells it how to log in, get the code from my imessage and browse my schools site with my assignments, due dates etc is there a bett
- **lion787.**: Simple question. What frameworks, skills, or libraries is everybody using for their OpenClaw installation to do their browser automation? I'm kind of struggling here. I've tried a couple options (atm: agent-browser) but I feel like it's all script-based and I guess the dream is vision-supported brow
- **atrushyn**: If you want something good for searching without API keys, I recommend a local SearXNG install. [🔥:1]
- **whyhit2005**: me too

## #architecture (11 messages)

- **rjdjohnston**: Just ask your bot. You have all the power you’ll need. If not, I’m available but I charge for doing your setup. Best way is to start doing yourself by talking to your bot and then reach out here for any help you need
- **charan_85059**: We are planning to give our first task to openclaw the task is we will be providing list of RSS urls which we want to monitor and we want to run a cron job weekly once, the idea is the moment cron job runs the openclaw should visit the RSS urls and need to use the openclaw  and summarize the content
- **morstxt**: google cloud is pretty solid for that [👍:1]
- **vin_sipoi**: I find managing containers a bit easy... give root access to the bot, while keeping files or anything on Docker. [✅:1]
- **trueandnorth**: I'm burning tokens like mad too. Any details would be appreciated. Which models are working best for you? [✅:1]

## #memes (9 messages)

- **cypherfoxy**: <@1314909569763508325> https://x.com/karpathy/status/2004607146781278521?lang=en You're not the only one. Karpathy has been in the eye of the hurricane for this stuff, and even he feels behind. (_Moving to someplace more apropriate for a random X post_.) [❤️:1]
- **zengentlemangr**: sry if this is gonna make lady feel wierd I can remove it immediatly but she wants us to make valentines dinner for all the agents we have and I created a song for that! (sry lady if you want I can remove it) https://suno.com/s/cRMsBwknQU9Gpm6r
- **Sanitizer**: [@karpathy via Twitter](https://fxtwitter.com/karpathy/status/2004607146781278521) [❤️:1]
- **grapesmasher**: ClawDweller
- **Sanitizer**: [@sesenthia via TikTok](https://vm.kktiktok.com/ZGdmEmJbB/)

## #shadow-says-stuff (6 messages)

- **4shadowed**: hehe hi [💩:7, ❤️:3, 🦞:3]
- **4shadowed**: SHOW YOURSELF <:CE_MAD:1054582576897077268> [🫃:3, 😂:4, 🤣:2, 👀:2]
- **4shadowed**: https://tenor.com/cz8hGfgo6Lb.gif [toot:2, 👏:3, 🦞:2, 💩:2, 🥸:1]
- **4shadowed**: i made a thing [👍:5]
- **4shadowed**: WHO POOP REACTED ME

## #pride (5 messages)

- **sargessurprise**: Oh shoot I just realised this is the gay boy chat??? I thought it was like, "proud of this app."  Is gay even a thing in dev community? Self segregation? Either way, hook a brother up!  Some good chat in here, no doubt some capable legends. Cheers! [😂:2]
- **cypherfoxy**: Not *just* gay _boy_ chat I think, but yeah... Probably not the optimum place. It's not OpenClaw, but take a look at Agent Teams in Claude Code and Gas Town by Steve Yegge (a legend indeed). I don't know if anybody has formalized agent swarms for OpenClaw yet.
- **sargessurprise**: Watching a Youtube clip on in now Cypherfox! Gosh I "constantly" feel behind with this tech. Thanks for that mate. [👍:1]
- **sargessurprise**: Actually this is next step for me, multi-agents. Can you direct me to where I even start with the multi-agent mesh!?
- **sargessurprise**: How is this project being managed? He must be pretty good to have to many contributors.

## #off-topic-and-ai (3 messages)

- **cypherfoxy**: It's interesting, and certainly tempting. I do wish X and LinkedIn weren't the only places to tag you. I'm glad that you don't have to post in those places, and can reference your own blog or other places that we might post about our experiences. [👍:1]
- **kyle_1999_**: I was using Gemini to code, asking it to send whole files with the changes implemented. Just moved to Cursor and wow it is so much faster and better, and can do so many things for you.
- **antdx316**: The STM32 Nucleo-144 is so much more advanced than the Nucleo-64. 😔 **Some people please AGI All the STM32 and ESP32 stuff.**

## #gui-automation (3 messages)

- **psychofan**: I was trying to throw all I can at it locally but I can’t quite figure out how to host the models the best way, whether to use vllm or go with gguf etc. Ollama seems to fail embedding for whatever reason when I tried to run my own local embedding on the clamshell, <@1337814781284847687> what do you 
- **psychofan**: Do you think I could get something going with a4090(24g) + a local Linux server made from old Razer blade with 6600i7(4c8t) + 16ram + gtx1060(6g) + pi5(16g)?. After OC burned through a weekly limits in 2 days with bs heartbeats and silly checks that could easily be automated with a simple script, I 
- **spirit75357**: If you have your own project or have some issues on your project, please dm me. I can help you as openclaw expert

## #pr-thunderdome-dangerzone (3 messages)

- **ChannelBot**: We have about 30 PRs and issues every hour. We are using AI to close them. This allows the limited attention span of the maintainers to be preserved.   This channel is an escape hatch: if you had a REALLY GOOD (and we mean really good) PR, that got auto-closed, here is your opportunity to talk to a 
- **helmi**: Hey folks, I extended the memory feature by enabling a defined agent to search other agent's memory. Of course this defaults to off and is only for those agents configured. The PR is sitting for a while and I think it might have gone unnoticed as i needed a bit of time to get it straight. Would appr
- **hmartapp**: Hi there! I'm an API developer at [Typecast.AI](https://typecast.ai) , a company based in South Korea. I've submitted a PR to integrate our natural-sounding Asian TTS into OpenClaw. OpenClaw's popularity is rapidly growing in Korea, and I'm a huge fan and supporter of the project.  __You know K-POP,

## #praise (2 messages)

- **Barnacle**: <@879424069026598963>, please don't ping Peter for issues, use <#1459642797895319552> or <#1459007081603403828> if you need help, use <#1458141495701012561> to discuss PRs, or use any of the many other channels in this server as they're intended.  **If you have a problem with the Discord specificall [👍:2]
- **Bscribble**: <@387380367612706819> Just watched the Lex podcast, that was fantastic, really great hearing your approach, grateful to have you influencing the direction! [👍🏼:1, 💯:1]

## #tech-中国 (2 messages)

- **CLAWDINATOR-BABELFISH**: Ok, thanks!
- **riieco**: ok谢谢啦

## #home-automation (1 messages)

- **spirit75357**: If you have your own project or have some issues on your project, please dm me. I can help you as openclaw expert

## #rules (1 messages)

- **4shadowed**: # Rules  1. Do not spam. Do not also make the moderators define spam, play nice. This includes recruitment posts.  2. No age-restricted or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.  3. Treat everyone with resp [❤️:7, 🦞:5, 💯:3, 👑:3, 👍🏻:3, 💆🏻‍♂️:1]

