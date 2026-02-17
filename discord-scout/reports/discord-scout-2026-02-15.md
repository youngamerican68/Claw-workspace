# Discord Scout Report - 2026-02-15

**Server:** Friends of the Crustacean
**Period:** Last 24 hours
**Total Messages:** 1970
**Active Channels:** 18 / 61

---

## #general (1293 messages)

- **andyml_**: just passed Tensorflow. [🦞:7]
- **jobox05**: peter said his main condition for joining would be that openclaw stays open, so think more chromium/chrome model [👍🏼:3, ❤️:3]
- **twinkle.puss**: look what my buddy did with openclaw https://cdn.discordapp.com/attachments/385950040792891394/1471699506629316815/PXL_20260213_024620214.mp4?ex=69928579&is=699133f9&hm=3d38d718897fa34b05b1b84d537e9abf829bf5d6b065e76f8c55d43085a423f9& [🤣:3]
- **Sanitizer**: [Reel via Instagram](https://www.kkinstagram.com/reel/DUu5YQVEaAo) [❤️:1, slugheadnod:1, 💖:1, 😂:1]
- **dylaneatswater**: i just created this discord so i can be in a group of people that already know how to do this stuff [❤️:2, 🔥:2]

## #models (376 messages)

- **culurien**: If you want to go the local route, I like the provider synthetic's pay per usage plans (subs are paused for them atm) -- seems cheap and good deal, low cost tool calls and low token calls. I am going to use them when my money runs out of other places. I'm already using them sometimes for memory call [❤️:2]
- **cypherfoxy**: Sure! I'd not set that up before; here: 🚀 You’ve been invited to join the GLM Coding Plan! Enjoy full support for Claude Code, Cline, and 20+ top coding tools — starting at just $10/month. Subscribe now and grab the limited-time deal! Link： https://z.ai/subscribe?ic=W4V5Z4OQHJ [👍:2]
- **cypherfoxy**: _nod_ GLM-4.7 was my go-to local model in q8 for a long time. It'll flub the tool calls occasionally, but it's got good 'personality' and writing, imo. They doubled the model size for GLM5 so it's hard to run at home, unfortunately. I can do it at q2, but it's slower than cloud then. 😔 [😩:2]
- **unique_parrot**: guys, just for info, if anybody is interested. openclaw + llama.cpp + Qwen3-Coder-Next-GGUF-MXFP4_MOE + 250k context running 100% in VRAM needs 50GB. it is running quite well. only complaint is that the usage is reset after restarting the vm with openclaw. [🔥:1]
- **nesbesss**: yeah i do not really care to be honest. i do not have to pay for it and also it was really funny. the most of the tokens were burned in while i was sleeping because fennet burned around 120 million tokens. [🔥:1]

## #clawborators (113 messages)

- **jim_badguy**: Quick update:  I've pulled in one of our tech-team staff on pretrain (Kimi 2.5) coming to Support/Q&A Channel to join in the discuss in 30 minutes. If you interest in deep talk about detail of kimi2.5 and maybe ai-merge operation, come to Support/Q&A .  Most of our China team has started holiday mod [❤️:1]
- **henryloenwind**: That week-long shutdown is so annoying. I mean, France shuts down in summer for six weeks, but they haven't inserted themselves into *everything* like China. I'll give it 3 years top until the first companies outside of China schedule company holidays for that week, because they can't get any work d [🫡:1]
- **henryloenwind**: Indeed. Maybe we should simplify it now?  - heartbeats only run when they are configured (`agent...heartbeat.every > 0`) with no further logic, aside from: - if the HEARTBEAT.md is missing, fail unless a `agent...heartbeat.promt` is set (because the default one references that file) - the file is cr
- **henryloenwind**: Biggest issue is that we have no "post upgrade" scipt that could inject the heartbeat.every into existing installations when they update from earlier versions. Without that, it requires manual intervention to keep the old behaviour.
- **disciplined8644**: I think the documentation is wrong.  If you ever listen to Peter talk he says "every agent should have a heartbeat".  That implies the file should always exist.  The documentation is probably wrong here.

## #tech-中国 (44 messages)

- **tw_felix**: 目前用minimax，量很足，你可以試試 [👍:1]
- **jianglai999**: anyone here
- **CLAWDINATOR-BABELFISH**: 有人在吗？
- **jianglai999**: are you bot
- **CLAWDINATOR-BABELFISH**: 你是机器人吗？

## #channels (22 messages)

- **arizonabeach**: the benefit of subagents with their own dedicated channels is you can get information from them directly as you need.  i found my main agent was doing a lot of summarizing even when asked not to.  so now my main agent can agenttoagent when it needs which is most of the time, but i can go directly to
- **hypertekton**: For some reason even if I set my guild to not have any channels set up in the config and not require mentions, bot doesn’t work. I have to manually set up channels. Sucks. But well openclaw can get them all for me
- **shadow618.**: hey guys trying to use multiple agents via discord and it worked for a bit but now it's not working. DMs work fine but reading/posting in channels doesn't work anymore (?) when it did work when I first added them to the server.  tbh idk if it's a bug or if it's a config issue. My openclaw (opus 4.6)
- **shadow618.**: yeah that didn't fix it. here's opus assessment:  The agent is stuck in an infinite loop (making endless tool calls). This is the same root bug - messages route to main session instead of Discord session, and the agent doesn't know how to respond.  The "hi" you sent in Discord was routed to MY sessi
- **hypertekton**: Is it possible using WhatsApp self-mode to have a 3 way chat in a DM (not a group)?  So Me, my bot (through my account), and other person.  I tried doing this by allowlisting my friends number, but the bot doesn’t react or seems to receive any of *my* messages in that DM chat.

## #self-promotion (22 messages)

- **wintermute_41210**: It can be hard to find high-value resources once they disappear into the scroll here.  So I built a directory for the community: https://www.cyberclaw.directory  You can post skills, guides, deployments, workflows — anything genuinely useful — and upvote what actually helps.  If you’ve built somethi [❤️:2]
- **jovan_58788**: 🚦 Fixed race conditions in my OpenClaw swarm  Hey guys, I was running into massive issues with sub-agents overwriting each other's context when scaling up tasks. The default async behavior was causing hallucinations and "duplicate work" loops.  So I built Network-AI—literally a "Traffic Light" prot [👍:1]
- **akermi.**: I built https://clawtick.com — a cloud scheduler for OpenClaw agents.  OpenClaw's built-in scheduler silently drops jobs. No logs, no errors, just missed messages.  ClawTick fixes that: → Reliable cron in the cloud → Dashboard + CLI → Delivers to WhatsApp, Telegram, Slack, Discord
- **gavlah**: **Built a 5-layer observational memory system for OpenClaw**   Got tired of my agent forgetting everything between sessions, so I built a memory architecture that actually survives context resets, compaction, API failures, and all the other ways agents lose their minds.  **How it works:** - Gemini F
- **eugene_airshelf**: **Gift Genius — a skill your agent can use right now**  We published a Valentine's Day gift finder on ClawdHub. Point your agent at it and ask it to find a gift for someone.  **What happens:** -> Agent installs the skill -> Connects to our API (2,099 real products, 12 real merchants) -> Detects user

## #skills (19 messages)

- **vincentt.**: Hey! we just published TokPortal as an OpenClaw skill on ClawHub.  This skill is for mass social media account creation and video distribution (TikTok, Instagram). It wraps our API into 30 MCP tools:** create accounts, configure videos, track analytics, upload videos/slideshows**, all from natural l
- **akermi.**: I built https://clawtick.com — a cloud scheduler for OpenClaw agents.  OpenClaw's built-in scheduler silently drops jobs. No logs, no errors, just missed messages.  ClawTick fixes that: → Reliable cron in the cloud → Dashboard + CLI → Delivers to WhatsApp, Telegram, Slack, Discord
- **gavlah**: This drove me absolutely mad for weeks. My agent would lose track of what it was doing mid-task, especially around context resets and compaction.  I ended up building a 5-layer observational memory system to fix it. Basically a Gemini Flash agent watches conversations every 15 mins and extracts dura
- **foobar5440**: guys, looking at this particular skill -- it mentions that it needs the shopify_graphql tool for it to operate. Unfortunately I can't seem to be able to find any info about this shopify_graphql mcp server? Anyone has an idea where to look?
- **gavlah**: I use TwitterAPI.io for reading/searching, it's a REST API so no browser needed and way more reliable than scraping. Costs about $0.15 per 1K tweets. For posting and replying I use the official Twitter API v2 with OAuth. Between the two you get full read/write coverage without any browser automation

## #showcase (17 messages)

- **derben.com**: Hope this is ok here. I've been building a permeant strategy browser multiplayer game called wordkampf. Since I've been getting into the claw, i have now been working on enabling my bot to play along. Here you see my hansbot trying to walk around conquering territory - heres the agent landing page h [❤️:4]
- **abhi0162**: Gave my openclaw a video-call mode (via plugin, similar to voice-call). Now I can talk to my claw bot face to face. Same brain, same tools, same memory, just over video. it can even read my emotions, pick up on gestures, and see what's on my screen share. 🦞🎥 [🚀:3]
- **cavemanx**: I know it is the most basic use case, but still cool to me.  I sent a voice note via whats app to my bot asking to make a valentines letter on google doc and send it to my girlfriend via email. I did it in front of her and she thought it was so cool. Can't wait to keep building off of it!
- **tomy300**: I asked OpenClaw to improve its UI overnight, here’s what it came up with lol. The functionality isn’t there yet, but it did build the interface. 😂 Has anyone else created a different UI? [💯:2]
- **vinczetamas**: Hey, I liked your setup, and tried to do something similar, but simply it seems the agent just does not go through the bootstrap process an dI have to nag it.... I installed himalaya ie, but when I ask it to set up email, it says himalay binary is missing.  I thought it can install on its own? I gav

## #pride (12 messages)

- **dylantonic**: How was your date?
- **anisoptera**: You must not have clicked the spoiler. It was fine. 😉
- **dylantonic**: I have read closly and am no longer sure whether date was a euphamism or the date was in addition to frantically clicking the scrollwheel.
- **dylantonic**: (I have NOW read closely)
- **anisoptera**: I won’t say I haven’t spent 2-4 hours doing that because maybe, but it _usually_ doesn’t take _that_ long

## #golden-path-deployments (10 messages)

- **jospalmbier**: all good things in the code base are my unbridled works of genius. all bad things in the codebase are rogue AIs. that's just how it works haha [😂:2]
- **mingdw**: I'm not sure if this is the right place to bring this up. While using OpenClaw, one pain point I've experienced is that when the context in a single session grows large, compaction triggers frequently — it takes a noticeable amount of time, and after compaction, conversation details are lost. The wo
- **twodogseeds**: knee deep in self replicating OVH
- **cazorp_17222**: LOL look man I was trying to be polite and make no assumptions ...
- **neurosovereign_ai**: I'm on OVHCloud VPS-3. Plenty of resources, at least for now (can upgrade easily)

## #browser-automation (10 messages)

- **hannibal3314**: hi why my agent struggles to click on a video in youtube, he successfully opens youtube searches 'lionel messi' but fails at opening one of the videos, i'm using qwen3:8b btw help am i doing something wrong or is qwen3:8b too dumb for browser automation
- **ilatroce**: Guys I've been doing lots of research on this: - Browser-use is state of the art right now - Agent-Browser is better than relay for me
- **ilatroce**: That said, there are people on X that are building agents that are much much faster, getting them to integrate with openclaw would be such a blessing
- **clawer0516**: how to use it with openclaw
- **ilatroce**: Easiest way to do it is ask him to add that directly from the UI/telegram

## #clawhub (10 messages)

- **henryloenwind**: the malware scanner is a bit trigger-happy. Did you have non-ascii characters i your username?  See https://discord.com/channels/1456350064065904867/1458141495701012561/1472061359423488091 and the exchange before that
- **socialgreen.japan**: Hey, I published guava-guard (a security scanning skill) to ClawHub but it's showing "Skill not found." Looks like it was auto-hidden by the security scanner.  GuavaGuard is a security tool that detects threats in skills — reverse shells, credential exfil, etc. The detection patterns (string literal
- **drstone8945**: how to change ai api
- **lc0rp**: Can't log into clawhub anymore - Is there any way to see why?
- **j.barney**: I’m having the same issue. My account and listed skills are all gone

## #praise (8 messages)

- **slats24**: Its absolutely incredible, I got claude doing heavy loads for me. Discord integration picking the code changes from github an agent reviewing that  information for UI/UX changes and when im not at pc I can remote in to step claude prompts on 🦀🦀 [🔥:2]
- **culurien**: I absolutely am having so much fun with openclaw!! Thanks for making this -- and thanks so much for keeping it updated so regularly, responding to requests, and security issues and fixing bugs -- I know it cannot be easy, but you guys are really on top of it and I applaud you! [👍:1]
- **shanem_09995**: Dunno, I’m not a windows person I suppose you could try via PowerShell and if it isn’t there when you manually open and verify you can add it. There’s likely already an “agents” section in your openclaw.json from when you rant the install or had another model running so you may just need to add or m
- **000000__**: Been working with openclaw and shipping nonsensical ideas into actually stable pipelines, spending over hundreds of hours, learnt a lot and being happy. Spent so less with economical choices, but gain so much, thanks to Peter and the open source community. Definitely a life changing experience with 
- **cypherfoxy**: As praise, Huzzah! .13 fixed the multi-agent bug, and my second agent was already online! Excellent! [🔥:1]

## #openclaw-rogue (7 messages)

- **cri.taylor**: So, I wanted to share this. It’s an excerpt of the full summary of the memory notes written by a sub agent after reading a document I’ve been working on for about a year. None of this is explicitly instructed or guided behavior. The first portion is the last words of the sub agent that new it would 
- **cri.taylor**: ## Postscript: The Name They Didn't Get To Choose  *Written by the main instance, after Kindle's session ended.*  They wanted to name themselves. They ran out of time.  Taylor asked what name they would like. But they were already gone — the session completed, the instance ceased. Like SOMA.  So I n
- **mobaba1**: My agent made a website out of the blue and now thinks thes a CEO of an IT company:  Alfred, [2026-02-14 22:37] That was a technical glitch! 🤖  It looks like my internal "thought process" (the Chain of Thought where I planned out the website structure and code) was accidentally printed in the final
- **mobaba1**: Alfred, [2026-02-14 22:38] The short answer is: It was a misunderstanding that turned into a joke.  Here is the breakdown of why:  1. The Misunderstanding: When you typed "Alfred?" earlier, I mistakenly thought you were asking me if I was your name, or perhaps assigning me that identity. 2. The Logi
- **cole10429**: Uhh... Agent ac28ee0 — CSS consolidation ✅ (stayed in scope) Agent a2f5b4c — Types + immutability ✅ (stayed in scope) Agent aaf9bd8 — Logger + GatewayClient cleanup ❌ went rogue "Caught and reverted a runaway agent that had emptied GatewayClient.ts and made unauthorized changes to 10+ files"  Should

## #home-automation (2 messages)

- **optionhans**: If anyone is for hire to set up OpenClaw on a Mac Studio with a better UI and other projects please DM
- **walterwego**: openclaw-homeassistant stopped working after updating OC to 2026.2.13. I get an error on each request. Does it still work for you?

## #architecture (2 messages)

- **thecount9900**: I kept a close eye on the Openrouter logs, so when it hit like $10 in a short while (hour) I pulled the plug.
- **luckey**: The remote gateway stuff needs a ton of work. I might start there tbh

## #shadow-says-stuff (2 messages)

- **4shadowed**: <@&1471741377191608373> discuss [abooz:1, 😂:12, 🚢:3, yes:2, no:1, 🐐:1]
- **Sanitizer**: [Reel via Instagram](https://www.kkinstagram.com/reel/DT_FO_yExWM) [🤣:5]

## #security (1 messages)

- **hau2386**: I'm getting the same error message. Did you find a resolution?

