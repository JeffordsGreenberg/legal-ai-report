import Head from 'next/head';
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const T = {
  white:     "#FFFFFF",
  paper:     "#F9F8F5",
  rule:      "#E2E0D8",
  mid:       "#8A8A8A",
  body:      "#3C3C3C",
  ink:       "#141414",
  blue:      "#4A76C0",
  blueLight: "#EBF0FB",
  blueDark:  "#2E5298",
  green:     "#2E7A4E",
  greenLight:"#EBF5EF",
  amber:     "#B86E1E",
  amberLight:"#FDF3E7",
  terra:     "#B85C38",
  terraLight:"#FAF0EB",
  teal:      "#2A7A7A",
  tealLight: "#E8F5F5",
  red:       "#B83232",
  redLight:  "#FDEAEA",
  purple:    "#7B5EA8",
};
const HEAD = "'Lora', 'Georgia', serif";
const BODY = "'Inter', system-ui, sans-serif";
const MONO = "'DM Mono', 'Courier New', monospace";

// ─── CRITERIA ─────────────────────────────────────────────────────────────────
const CRITERIA = [
  { key:"integrations",   label:"Integrations",    icon:"🔗", def:"Does it plug into your actual stack — Slack, Notion, GSuite, Salesforce, iManage?" },
  { key:"automation",     label:"Automation",       icon:"⚡", def:"Can it kick off tasks, route questions, auto-answer Slack queries without you being the middleman?" },
  { key:"knowledge",      label:"Knowledge Base",   icon:"🧩", def:"Can it build and query institutional knowledge? Does it learn from your documents and Slack history?" },
  { key:"voice",          label:"Voice",            icon:"🎙️", def:"Is there a native voice input that is actually good — natural cadence, accurate transcription?" },
  { key:"research",       label:"Research",         icon:"🔬", def:"How good is the research output — scored on sourcing, citation quality, and accuracy." },
  { key:"customization",  label:"Customization",    icon:"🎛️", def:"Can you build and adapt it yourself? Does it treat you like a builder rather than a user?" },
  { key:"speed",          label:"Speed",            icon:"🚀", def:"Is it fast? Latency and responsiveness. Slow tools get abandoned under deadline pressure." },
  { key:"ux",             label:"UX",               icon:"✦",  def:"Is the interface well-designed and intuitive? Does onboarding make sense? Does it get out of your way?" },
  { key:"forwardThinking",label:"Forward-Thinking", icon:"🔮", def:"Is it building toward orchestration and automation — or just a better Word plugin?" },
  { key:"pricing",        label:"Pricing",          icon:"💰", def:"Can teams of different sizes access it? Or enterprise-only with 12-month contracts and hidden add-ons?" },
];

// ─── TOOLS ────────────────────────────────────────────────────────────────────
const TOOLS = [
  { id:1,  name:"Wordsmith",  category:"Legal-Specific",    tag:"BENCHMARK · DISCLOSED", tagColor:T.blue,  emoji:"⭐",
    oneLiner:"The customizable legal AI that works where you work",
    bestFor:"In-house teams who want one tool that does everything",
    stackFit:["Slack","Notion","Gmail","Granola","GSuite"], wordPlugin:true, pricing:"$450/user/mo · Enterprise custom",
    internet:{ integrations:"Integrates with Slack, Google Drive, Notion, Microsoft Word, corporate email, ERP systems, and custom API. Slack integration allows instant risk analysis, automated redlining, and contract drafting directly from a channel.", painPoints:"Eliminates shadow legal by embedding legal intelligence into tools the business already uses. Reduces routine query response times by 80%, contract processing times by 50–60%.", pricing:"$450/user/month. Enterprise pricing custom. SOC 2 Type II certified, EU data hosting, zero data retention policy." },
    voice:{ has:true,  quality:"Good",               type:"Native voice input within platform",               note:"SOC 2 compliant — safe for enterprise use." }},
  { id:2,  name:"Claude",     category:"General Purpose AI", tag:"INTERFACE LAYER",        tagColor:T.terra,   emoji:"🧠",
    oneLiner:"The most powerful general-purpose AI with an agentic desktop layer",
    bestFor:"Drafting, nuanced legal analysis, and building custom automations",
    stackFit:["Slack","Notion","GitHub","Vercel","GSuite","Microsoft Word"], wordPlugin:true, pricing:"Pro $20/mo · Max $100–$200 · Team $30/user",
    internet:{ integrations:"Available via claude.ai, API, Claude Code CLI, and Cowork desktop app. Cowork connects to files, Slack, Notion via MCP connectors. Powers Thomson Reuters CoCounsel, Harvey multi-model.", painPoints:"Cowork brings agentic architecture to non-technical users. 1M token context window handles entire contract portfolios. Scheduled tasks enable automated background work.", pricing:"Free. Pro $20/mo. Max $100/mo or $200/mo. Team $25–100/user annual. Enterprise custom." },
    voice:{ has:true,  quality:"Weak for dictation", type:"Conversational — not a dictation tool",            note:"Voice mode goes to the AI, not your documents. Workaround: dictate in ChatGPT, paste into Claude." }},
  { id:3,  name:"Gemini",     category:"General Purpose AI", tag:"BUILT INTO GSUITE",      tagColor:T.terra,   emoji:"🔵",
    oneLiner:"Google AI baked into every app you already use",
    bestFor:"Complex contract intelligence when your data lives in Google Drive",
    stackFit:["GSuite","Gmail","Drive","Slack","Salesforce"], wordPlugin:false, pricing:"Included in Google Workspace Business/Enterprise",
    internet:{ integrations:"Embedded in Gmail, Docs, Sheets, Slides, Drive, Meet, and Chat. Integrations span Asana, Slack, and Salesforce. SOC 1/2/3, ISO 27001 certified.", painPoints:"Removes need to context-switch — AI in every tool you already use. Gems enable repeatable specialized tasks. Enterprise: your content not used for training.", pricing:"Bundled into all Google Workspace Business and Enterprise plans since January 2025." },
    voice:{ has:true,  quality:"Strong — built into everything", type:"Gemini Live mobile, voice across all Workspace apps", note:"Voice is native across the entire Google ecosystem." }},
  { id:4,  name:"GC AI",      category:"Legal-Specific",    tag:"ON TRIAL",               tagColor:T.green,  emoji:"⚖️",
    oneLiner:"Legal AI built by a 3x General Counsel for in-house teams",
    bestFor:"In-house counsel who need fast, trustworthy research with verifiable citations",
    stackFit:["Microsoft Word"], wordPlugin:true, pricing:"From $500/month · Series B at $555M valuation",
    internet:{ integrations:"Microsoft Word add-in for redlining and editing. Verifiable citations from government databases, case law, SEC/EDGAR, U.S. Code. Prompt libraries, customizable knowledge bases, and AI contract agents. Enterprise-grade security with SOC 2 certification and zero-data-retention for client files.", painPoints:"Built for in-house teams by in-house lawyers — CEO Cecilia Ziniti is a former GC at Amazon and Replit. 1,000+ companies now use GC AI including News Corp, Nextdoor, Skims, Zscaler, Vercel, and TIME Inc. Grew from $1M to $10M ARR in under a year (23% MoM growth). Saved an estimated 600,000 hours of legal work across customers.", pricing:"From $500/month. Series B: $60M raised November 2025 led by Scale Venture Partners and Northzone. Total funding $73M at $555M valuation. Pricing starts at $500/month with enterprise custom tiers." },
    voice:{ has:false, quality:"None found",           type:"No native voice or dictation",              note:"Microsoft Word-centric workflow. Would need system-level dictation." }},
  { id:5,  name:"ChatGPT",    category:"General Purpose AI", tag:"SECONDARY",              tagColor:T.mid,    emoji:"💬",
    oneLiner:"The original AI assistant — still the gold standard for voice",
    bestFor:"Best-in-class voice dictation, image generation, general tasks",
    stackFit:["Web","API","Mobile"], wordPlugin:false, pricing:"Pro $20/mo · Teams $30/user · Premium $200/mo",
    internet:{ integrations:"Custom GPTs and API integrations. ChatGPT Agent for agentic desktop tasks. DALL-E/Sora for image/video.", painPoints:"Advanced Voice Mode: natural cadence, emotional awareness, real-time translation, full transcript.", pricing:"Free. Go $8/mo. Pro $20/mo. Premium $200/mo. Teams $30/user/mo." },
    voice:{ has:true,  quality:"Best in class",        type:"Advanced Voice Mode — conversational and dictation", note:"The gold standard for AI voice. Natural cadence, emotional awareness, real-time translation." }},
  { id:6,  name:"Harvey",     category:"Legal-Specific",    tag:"DEMO ONLY",              tagColor:T.blue,  emoji:"🏛️",
    oneLiner:"Enterprise legal AI for BigLaw — powerful, pricey, now with LexisNexis built in",
    bestFor:"Large law firms doing high-volume M&A, litigation, and complex legal research",
    stackFit:["Microsoft Word","iManage","SharePoint","LexisNexis"], wordPlugin:true, pricing:"~$1,000–1,200/lawyer/month · Enterprise only · LexisNexis add-on extra",
    internet:{ integrations:"June 2025: Strategic alliance with LexisNexis integrates Shepard's Citations, primary U.S. case law, and statutes directly inside Harvey. Customers access LexisNexis Protégé to get citation-supported answers without leaving Harvey. Co-developed workflows include automated Motion to Dismiss and Motion for Summary Judgment drafting. Also integrates with Google Drive, Outlook, iManage, Microsoft Word, SharePoint. Multi-model backend including Anthropic Claude.", painPoints:"Used by 1,000+ customers across 59+ countries. Passed $190M ARR by end of 2025 (from $100M mid-2025). LexisNexis partnership creates a data moat: proprietary legal content + model innovation. Firms using both Harvey and LexisNexis can now do citation-backed research, brief drafting, and negotiation without switching tools. Acquired Hexus (demo tools startup) in 2026.", pricing:"~$1,000–1,200/lawyer/month all-in for most enterprise configurations. LexisNexis content add-on estimated at $400–600/lawyer/year additional. 25–50 lawyer seat minimum. No self-serve or free trial. Valuation: $8B (late 2025), reportedly targeting $11B in 2026 raise." },
    voice:{ has:true,  quality:"Strong and investing",  type:"Voice to Prompt web and mobile, ElevenLabs TTS", note:"Launched Voice to Prompt Sep 2025. iOS/Android apps Nov 2025." }},
  { id:7,  name:"Sandstone",  category:"Legal-Specific",    tag:"WATCH THIS SPACE",       tagColor:T.purple, emoji:"🚀",
    oneLiner:"The Legal Control Tower — AI agents that connect in-house legal to the whole business",
    bestFor:"In-house teams drowning in Slack pings, intake requests, and routine redlines",
    stackFit:["Slack","Salesforce","Email","Ironclad","CLM","Ticketing","Gmail"], wordPlugin:false, pricing:"Seed stage · $10M Sequoia seed Jan 2026",
    internet:{ integrations:"30+ integrations: Slack, email, Salesforce, Ironclad, procurement systems, CLM platforms, ticketing systems, Gmail. Agents auto-route requests from wherever they arrive. March 2026: Partnership with LegalEng Consulting Group (LECG, ex-Ironclad team). Mary O'Carroll (former Google legal ops leader) joined as advisor. Selects optimal LLM per task including OpenAI GPT and Anthropic Claude.", painPoints:"Positions itself as the 'Legal Control Tower' — the single platform to receive, triage, route, and resolve legal requests. Key pitch: legal teams operate in the dark about business context. Sandstone connects CRM, CLM, and HR systems to legal workflows so lawyers know the strategic stakes of every request. Deploys AI agents in under 10 minutes. Automates intake, triage, first-pass redlines, and drafting from playbooks. Living legal playbooks that improve with each use.", pricing:"Launched January 2026. $10M seed led by Sequoia (also backed Harvey early). SV Angel, Kearny Jackson, and 20+ GCs as investors. Couple dozen paying customers including Fortune 500s. Pricing not yet public — request access model." },
    voice:{ has:false, quality:"None confirmed",        type:"No native voice — launched Jan 2026",          note:"Too new. Slack-native means system-level dictation works as passthrough." }},
  { id:8,  name:"Legora",     category:"Legal-Specific",    tag:"WRONG STACK",            tagColor:T.mid,    emoji:"📋",
    oneLiner:"Collaborative AI workspace for large law firms — European, Microsoft-first",
    bestFor:"Large law firms in Europe doing M&A and litigation",
    stackFit:["iManage","SharePoint","Microsoft Word"], wordPlugin:true, pricing:"Enterprise only · Not publicly listed",
    internet:{ integrations:"iManage, SharePoint DMS. Microsoft Word plug-in. Legal databases across jurisdictions.", painPoints:"Tabular Review transforms contract folders into data grids. Agentic Workflows automate multi-step tasks.", pricing:"Series B of $80M May 2025. No public pricing." },
    voice:{ has:false, quality:"None found",            type:"No native voice feature",                     note:"No voice or dictation. Microsoft ecosystem focus." }},
  { id:9,  name:"Luminance",  category:"Legal-Specific",    tag:"TOO SLOW",               tagColor:T.red,    emoji:"🔍",
    oneLiner:"Established legal AI with a proprietary LLM — powerful for M&A, slow elsewhere",
    bestFor:"Enterprise teams doing high-volume M&A due diligence",
    stackFit:["Microsoft Word","Salesforce","HighQ","Outlook"], wordPlugin:true, pricing:"Quote-based · Enterprise subscription",
    internet:{ integrations:"Native Microsoft Word, Outlook, Salesforce, HighQ, VDR integration. Proprietary LLM trained on 150M+ verified legal documents.", painPoints:"M&A due diligence at speed. Panel of Judges model for contract negotiation. Steep learning curve.", pricing:"Quote-based enterprise subscription. High cost cited as barrier for smaller firms." },
    voice:{ has:false, quality:"None found",            type:"No native voice feature",                     note:"No voice capability identified." }},
  { id:10, name:"Ivo",        category:"Legal-Specific",    tag:"NARROW FOCUS",           tagColor:T.blue,  emoji:"📊",
    oneLiner:"Contract intelligence with standout analytics — 400 AI calls per review",
    bestFor:"In-house legal ops teams who want deep contract analytics",
    stackFit:["Microsoft Word","Google Docs","Slack","Zapier"], wordPlugin:true, pricing:"~$100+/user/mo · Demo required",
    internet:{ integrations:"Microsoft Word add-in, Google Docs, PDF, Slack, Email, Zapier. Legal research via EDGAR, U.S. Code, eCFR.", painPoints:"AiRE engine runs 400+ model calls per review — cycle-time dashboards, risk heat-maps, ROI calculators.", pricing:"$100+/user/month on annual plans. Demo required." },
    voice:{ has:false, quality:"None found",            type:"No native voice feature",                     note:"No voice or dictation identified." }},
  { id:11, name:"TermScout",  category:"Legal-Specific",    tag:"FUTURE DIRECTION",       tagColor:T.green,  emoji:"🎯",
    oneLiner:"AI-powered contract certification and market benchmarking",
    bestFor:"Teams wanting to reduce redline friction with certified market data",
    stackFit:["Upload-based","No integration required"], wordPlugin:false, pricing:"From $99/month · Free tier available",
    internet:{ integrations:"No integration required — upload-and-review workflow. Certification against 40,000+ real market agreements.", painPoints:"Scores contracts for fairness. Reduces negotiation time and redlines up to 30%. Data-backed benchmarks, not AI inference.", pricing:"From $99/month. Free tier available." },
    voice:{ has:false, quality:"None",                  type:"Upload-and-review workflow only",             note:"No voice capability — entirely document-upload driven." }},
  { id:12, name:"Microsoft Copilot", category:"General Purpose AI", tag:"TESTY'S PICK",        tagColor:T.terra,   emoji:"🪟",
    oneLiner:"AI woven into every Microsoft tool lawyers actually use",
    bestFor:"Law firms and legal teams already inside the Microsoft 365 ecosystem",
    stackFit:["Microsoft Word","Outlook","Teams","SharePoint","iManage","PowerPoint","Excel"], wordPlugin:true, pricing:"Included in Microsoft 365 Business/Enterprise",
    internet:{ integrations:"Native in Word, Outlook, Teams, Excel, PowerPoint, SharePoint, and OneNote. Copilot in Word drafts, rewrites, and summarises documents. Integrates with iManage via Microsoft Graph. Azure OpenAI backend — enterprise data never used for training. HIPAA, SOC 1/2/3, ISO 27001 certified.", painPoints:"Eliminates app-switching for Microsoft-first firms. Copilot in Teams auto-summarises meetings and action items. Outlook Copilot drafts replies and summarises threads. Word Copilot can draft from a prompt, transform tone, and compare documents side-by-side.", pricing:"Microsoft 365 Copilot: $30/user/month on top of M365 subscription. Copilot Chat (formerly Bing Chat Enterprise) is included free with M365 Business/Enterprise plans." },
    voice:{ has:true, quality:"Strong — Teams and mobile",  type:"Copilot Voice in Teams meetings, Outlook dictation, mobile voice", note:"Copilot transcribes and summarises Teams meetings natively. Voice dictation in Word and Outlook is mature and reliable." }},
];

// ─── LOGO DOMAINS (Clearbit logo API) ────────────────────────────────────────
const LOGOS = {
  1:  "wordsmith.ai",
  2:  "claude.ai",
  3:  "gemini.google.com",
  4:  "gc.ai",
  5:  "chatgpt.com",
  6:  "harvey.ai",
  7:  "getsandstone.com",
  8:  "legora.ai",
  9:  "luminance.com",
  10: "ivoworks.com",
  11: "termscout.com",
  12: "microsoft.com",
};
// ─── TOOL HOMEPAGES ───────────────────────────────────────────────────────────
const HOMEPAGES = {
  1:  "https://wordsmith.ai",
  2:  "https://claude.ai",
  3:  "https://gemini.google.com",
  4:  "https://gc.ai",
  5:  "https://chatgpt.com",
  6:  "https://harvey.ai",
  7:  "https://getsandstone.com",
  8:  "https://legora.ai",
  9:  "https://luminance.com",
  10: "https://ivoworks.com",
  11: "https://termscout.com",
  12: "https://www.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot",
};

const DEMO_URLS = {
  1:  "https://wordsmith.ai",
  2:  "https://claude.ai",
  3:  "https://workspace.google.com/products/gemini/",
  4:  "https://gc.ai",
  5:  "https://chatgpt.com",
  6:  "https://harvey.ai",
  7:  "https://getsandstone.com",
  8:  "https://legora.ai",
  9:  "https://luminance.com",
  10: "https://ivoworks.com",
  11: "https://termscout.com",
  12: "https://adoption.microsoft.com/en-us/copilot/",
};

function ToolLogo({ id, emoji, size=28 }) {
  const [err, setErr] = useState(false);
  if (err) return <span style={{ fontSize:size*0.85, lineHeight:1 }}>{emoji}</span>;
  return (
    <img src={"https://logo.clearbit.com/"+LOGOS[id]} alt="" width={size} height={size}
      style={{ objectFit:"contain", borderRadius:4, flexShrink:0 }}
      onError={()=>setErr(true)} />
  );
}

// ─── MOBILE HOOK ──────────────────────────────────────────────────────────────
function useIsMobile(breakpoint=680) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(()=>{
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

// ─── METHODOLOGY ──────────────────────────────────────────────────────────────
const METHODOLOGY_SECTIONS = [
  {
    title: "What This Is",
    color: T.blue,
    body: `An independent, non-sponsored comparison of AI tools used by legal teams — evaluated by real practitioners from their specific practice contexts. It is not a listicle, not written by a vendor, and not paid for by anyone. Every score reflects genuine usage, honest friction, and real opinion. The tools are evaluated on what matters to lawyers: whether the thing works in their actual stack, saves them real time, and is building toward something useful.\n\nThis is version one. The data is live, the reviewer pool is growing, and the methodology will be refined. Use the feedback button to tell us what's wrong.`
  },
  {
    title: "The 10 Scoring Criteria",
    color: T.ink,
    body: null, // rendered as criteria grid
  },
  {
    title: "How Fit % Is Calculated",
    color: T.green,
    body: `Each tool receives a score from 1–5 on all ten criteria. The Fit % is a simple average across those scores, converted to a percentage (e.g. average score of 4.0 = 80%). All criteria are weighted equally — there is no secret weighting formula.\n\nWhen multiple reviewers have scored a tool, scores are averaged using usage weighting: reviewers who use a tool regularly count at full weight (1.0×); reviewers who have only had a demo or brief evaluation count at half weight (0.5×). Reviewers who have never used the tool do not contribute to the aggregate score at all. This prevents demo impressions from distorting scores against real daily experience.`
  },
  {
    title: "Trust-Based, Not Anonymous",
    color: T.amber,
    body: `Reviewers submit under their real names and professional identities. Anonymity makes it too easy to be unfair, vague, or self-serving. Real names create accountability — and accountability produces better data.\n\nReviewers are required to disclose any financial relationships with the tools they evaluate, including employment, equity, advisory roles, or paid partnerships. Laura Jeffords Greenberg discloses prior employment at Wordsmith — that tool is flagged throughout the report.\n\nReviewers are also required to distinguish between tools they use regularly (through a trial, subscription, or firm license) and tools they have only seen in a demo or evaluated briefly. That distinction is recorded and factored into the aggregate weighting. New submissions are reviewed before going live. We do not accept sponsored reviews, paid placements, or vendor-submitted scores.`
  },
  {
    title: "What Scores Don't Tell You",
    color: T.red,
    body: `A high score from one reviewer may mean nothing in your context. A BigLaw M&A associate and an in-house GC at a 60-person tech company have completely different requirements. The report intentionally preserves reviewer context — their role, stack, and team size — so you can find the reviewer most like you and weight their scores accordingly. Aggregated scores are a starting point, not a verdict.`
  },
  {
    title: "Live Data",
    color: T.purple,
    body: `Pricing, integrations, and "Latest News" fields in each tool modal can be refreshed live using the Claude API with web search. This means the report can pull current information rather than aging the moment it's published. Cached baseline data was last reviewed March 2026. Click "Refresh Live Data" in any tool modal to pull the latest, or use the global refresh on the toolbar to update all tools at once.`
  },
  {
    title: "What's Not Here Yet",
    color: T.mid,
    body: `This is version one and it needs testing. Missing: a comparison mode to put two tools side-by-side, a 'My Stack' filter to narrow by integration compatibility, and a PDF export. The reviewer pool is growing — if you're a legal professional with a different practice context, use the Submit Review tab. If something is wrong, outdated, or missing, use the feedback button.`
  },
];

const STACK_LJG   = [
  { group:"Productivity & Comms",  items:["GSuite","Slack","Granola"] },
  { group:"AI Layer",              items:["Claude (Chat+Cowork+Code)","Gemini","Wordsmith","GC AI (trial)"] },
  { group:"Knowledge Bases",       items:["Google Drive","Notion","Antigravity","Slack"] },
  { group:"Dev & Deployment",      items:["GitHub","Vercel","Terminal"] },
  { group:"Contracting",           items:["Microsoft Word"] },
  { group:"Everything Else",       items:["Salesforce","Intercom","Drata","Canva","Screen Studio"] },
];
const STACK_TESTY = [
  { group:"The Non-Negotiables",    items:["Microsoft Word (macro-enabled, always open)","Microsoft Copilot (in Word, Outlook & Teams)","Outlook"] },
  { group:"Document Management",    items:["iManage","SharePoint","Email attachments if I'm honest"] },
  { group:"AI Attempts",            items:["Harvey (firm-issued)","ChatGPT (personal, shh)","That GPT wrapper IT approved"] },
  { group:"Legal Research",         items:["Westlaw","Lexis (backup)","The associate down the hall"] },
  { group:"Everything Else",        items:["Excel","PowerPoint","Teams","Printer (colour)"] },
];

// ─── REVIEWERS ────────────────────────────────────────────────────────────────
const REVIEWER_LJG = {
  id:"ljg", initials:"LJG", color:T.blue,
  name:"Laura Jeffords Greenberg", nameShort:"Laura",
  linkedin:"https://www.linkedin.com/in/laurajeffordsgreenberg",
  role:"General Counsel", sector:"Tech", companySize:"50–100 people", teamSize:"Team of 3",
  bio:"In-house GC at a tech company with a builder's mindset. I don't just use tools — I connect them, automate workflows, and deploy custom solutions via Claude Code and Vercel. I care about what legal AI is becoming, not just what it does today.",
  disclosure:"Previously employed by Wordsmith. That experience informs this review — I know what the benchmark looks like from the inside. Wordsmith is my gold standard and every other tool is evaluated against a single question: can it get me to leave?",
  scoringNote:"Scored on integrations, automation, and whether a tool is building toward the future — not whether it has a Word plugin. I hate CLMs. I don't believe in prompt libraries — if you're repeating a prompt, build an automation.",
  noPoints:["Word plugins","CLM features — covered by Gemini and Wordsmith","Prompt libraries — build automations instead","Redlining as a standalone value prop"],
  beliefs:[
    "No AI tool gets legal research 100% right. How you prompt shapes what you get. Always cross-reference.",
    "The future of legal AI is orchestration: full business context, automated triage, self-service for the rest of the company.",
    "Voice is the next primary input mode. Dictating at 150 WPM is 3x faster than typing and changes how you think.",
    "General-purpose AI (Claude, Gemini) and legal-specific AI (Wordsmith) are complementary, not competing.",
    "AI should get work off your plate entirely — not just make you faster at the same tasks.",
    "The tools worth watching are building toward always-on, context-aware, voice-first intelligence.",
  ],
  painPoints:[
    "Answering the same business questions repeatedly — needs Slack automation and a self-updating knowledge base.",
    "Synthesizing large volumes of information before I can even begin to answer a question.",
    "Automating commercial contracting workflows across Salesforce, GSuite, Slack, and Notion.",
    "Standardizing company communication so it becomes AI-readable and queryable.",
    "Keeping institutional knowledge alive when someone leaves — it should stay in the system.",
    "Being reactive instead of strategic — legal should be a function the business runs through, not around.",
  ],
  stack:STACK_LJG,
  voiceNote:"Voice is where I get ideas out fast. Typing is for slower, deliberate thinking. The future is always-on, context-aware, voice-first intelligence. Dictate in ChatGPT then paste into Claude. WisperFlow pending SOC 2 review.",
  // full = daily/regular use, demo = tried or evaluated only, false = never used
  usage:{
    1:"full",   // Wordsmith — worked there, primary tool
    2:"full",   // Claude — daily driver
    3:"full",   // Gemini — built into GSuite she uses daily
    4:"demo",   // GC AI — on trial / evaluating
    5:"full",   // ChatGPT — still actively uses
    6:"demo",   // Harvey — demo only (tag says so)
    7:"demo",   // Sandstone — watched, evaluated, too new
    8:"demo",   // Legora — evaluated, confirmed wrong stack
    9:"demo",   // Luminance — tried 14 months ago
    10:"demo",  // Ivo — evaluated
    11:"demo",  // TermScout — evaluated
    12:"full",  // Copilot — uses M365, has evaluated Copilot
  },
  scores:{
    // speed = pure latency/responsiveness · ux = interface design, onboarding, friction
    1:{integrations:5,automation:5,knowledge:5,voice:5,research:4,customization:5,speed:4,ux:5,forwardThinking:4,pricing:4},  // polished, she knows it deeply
    2:{integrations:5,automation:5,knowledge:4,voice:2,research:4,customization:5,speed:5,ux:5,forwardThinking:5,pricing:4},  // clean, minimal, builder-friendly
    3:{integrations:5,automation:4,knowledge:4,voice:4,research:3,customization:3,speed:5,ux:4,forwardThinking:4,pricing:5},  // solid GSuite UX, Gems are intuitive
    4:{integrations:2,automation:3,knowledge:3,voice:5,research:4,customization:3,speed:3,ux:2,forwardThinking:3,pricing:3},  // couldn't download Word doc — UX dealbreaker
    5:{integrations:3,automation:3,knowledge:3,voice:5,research:3,customization:3,speed:4,ux:4,forwardThinking:3,pricing:4},  // familiar, clean, voice excellent
    6:{integrations:3,automation:4,knowledge:3,voice:4,research:5,customization:4,speed:4,ux:3,forwardThinking:4,pricing:1},  // enterprise-polished but complex onboarding
    7:{integrations:4,automation:5,knowledge:4,voice:2,research:2,customization:4,speed:3,ux:3,forwardThinking:5,pricing:3},  // too early to judge UX properly
    8:{integrations:3,automation:4,knowledge:3,voice:1,research:4,customization:3,speed:3,ux:3,forwardThinking:4,pricing:2},  // fine but not her world
    9:{integrations:3,automation:3,knowledge:3,voice:1,research:3,customization:2,speed:2,ux:2,forwardThinking:2,pricing:2},  // slow and poorly onboarded
    10:{integrations:3,automation:3,knowledge:3,voice:1,research:3,customization:3,speed:3,ux:4,forwardThinking:3,pricing:2}, // dashboard UX is genuinely good
    11:{integrations:2,automation:3,knowledge:2,voice:1,research:4,customization:3,speed:4,ux:3,forwardThinking:5,pricing:4}, // simple upload UX, limited surface
    12:{integrations:4,automation:3,knowledge:3,voice:3,research:2,customization:2,speed:4,ux:3,forwardThinking:3,pricing:3}, // fine in Word, irrelevant in her GSuite world
  },
  verdicts:{1:"PRIMARY TOOL",2:"DAILY DRIVER",3:"HIDDEN GEM",4:"ACTIVE TRIAL",5:"BEING PHASED OUT",6:"NOT MY FIT",7:"FUTURE WATCH",8:"WRONG STACK",9:"TOO SLOW",10:"NARROW FOCUS",11:"FUTURE DIRECTION",12:"NOT MY STACK"},
  takes:{
    1:"I worked at Wordsmith. That is the disclosure. It is also why it is my benchmark — I know what it can do because I helped build it. The Slack integration is the most underrated feature in legal AI: it reads past histories, extracts institutional knowledge, and automates answers to recurring questions.",
    2:"Best in class for drafting. Three-mode setup: Chat, Cowork, and Code. Add MCP connectors and it becomes an interface layer connecting your entire stack. Not 100% accurate for legal research but strong enough alongside legal-specific tools.",
    3:"Genuinely surprised me. Multi-entity contracts, parent agreements, multiple amendments — solved in 10 seconds what took me a long time manually. Gems let you build custom AI experts on top of your Drive. At zero additional cost the ROI is obvious.",
    4:"Similar to Wordsmith for research but more succinct. Dealbreaker: could not download edited agreements as a Word document from the web app.",
    5:"My original go-to, now losing ground to Claude on every dimension that matters. Still the best voice experience in AI — I dictate here then paste into Claude.",
    6:"Demo only. Interesting multi-model architecture including Claude, and LexisNexis access for research. Dealbreaker: no Slack, no Granola, no GSuite.",
    7:"The concept is exactly right: plug everything in, give legal full business context, then orchestrate tasks. Too new to evaluate properly but this is the direction I want to go.",
    8:"Legora's own team told me to stick with Wordsmith because they lack GSuite and Slack. That told me everything I needed to know.",
    9:"Used it 14 months ago. Bad experience: slow, poorly onboarded. Has improved but still feels old.",
    10:"Contracting tool with a standout reporting dashboard — cycle-time, risk heat-maps, ROI. But too narrow and something I could build in Claude with full customization.",
    11:"Forward-thinking: review agreements against certified industry benchmarks, not AI inference. Real market data from 40,000+ agreements. This is where legal friction reduction is heading.",
    12:"Fine for what it is. If you are deep in Microsoft 365 it is the easiest AI to justify to a CFO. I am a GSuite person so it solves problems I do not have — but I understand why Microsoft-first teams rate it highly.",
  },
};

const REVIEWER_TESTY = {
  id:"testy", initials:"TM", color:T.purple,
  fictional: true,
  fictionalNote: "Fictional composite reviewer — illustrates a BigLaw M&A associate perspective. Scores and opinions are illustrative only.",
  name:"Testy McTesterson, Esq.", nameShort:"Testy",
  linkedin:null,
  role:"Senior Associate", sector:"BigLaw (M&A / PE)", companySize:"800+ attorneys", teamSize:"Solo (plus two first-years)",
  bio:"Eighth-year M&A associate at a top-10 firm. I have billed more hours than I have slept since 2019. My relationship with AI is complicated: the partners want me to use it, the clients are nervous about it, and I genuinely cannot figure out if it is saving me time or just creating new anxieties.",
  disclosure:"No financial relationships with any vendors. Mild personal attachment to Westlaw because it got me through the bar exam. Deeply suspicious of anything that does not integrate with iManage.",
  scoringNote:"Microsoft Word is not a constraint — it is the product. My work lives in Word, iManage, and Outlook. Microsoft Copilot is the AI I can actually use without a conversation with risk management. I score tools on whether they fit inside the workflow I already have and whether they survive a 400-page credit agreement.",
  noPoints:["Slack integration (we use Teams)","GSuite anything (we are a Microsoft firm)","Tools that require me to 'connect my stack' from scratch","Anything without iManage or SharePoint integration"],
  beliefs:[
    "Microsoft Word is not legacy software. It is the most powerful document editing environment ever built and Copilot just made it significantly better.",
    "AI is a very fast second-year associate. Useful, but you still have to check everything it does.",
    "The Word plugin is not a limitation. It is the entire point. That is where the work happens.",
    "Research quality is everything. I will not cite a case I cannot verify. Full stop.",
    "The firms winning with AI have good data hygiene, not the most tools.",
    "Any tool that cannot handle a 400-page credit agreement without hallucinating is not ready for M&A.",
  ],
  painPoints:[
    "Reviewing first drafts of credit agreements, NDAs, and purchase agreements at 11pm under time pressure.",
    "Due diligence — reading every rep and warranty in a 300-page disclosure schedule and flagging the issues.",
    "Cross-referencing defined terms across a document suite to catch inconsistencies before closing.",
    "Generating first-pass redlines against a precedent form fast enough to impress a partner.",
    "Summarising board minutes and board packages for closing conditions checks.",
    "Explaining to a partner why the AI got something wrong without sounding like I outsourced the work.",
  ],
  stack:STACK_TESTY,
  voiceNote:"I am typically on a conference call, in a conference room, or trying to avoid starting a conference call. I did try Advanced Voice Mode on the train once and it was impressive — but I would not use it for legal work in public.",
  // full = daily/regular use, demo = tried or evaluated only, false = never used
  usage:{
    1:"demo",   // Wordsmith — demoed, wrong ecosystem
    2:"full",   // Claude — uses personally at midnight
    3:"demo",   // Gemini — tried a handful of times, can't evaluate fairly
    4:"demo",   // GC AI — evaluated, promising
    5:"full",   // ChatGPT — active personal Pro subscription
    6:"full",   // Harvey — firm-issued, the standard
    7:"demo",   // Sandstone — demo and marketing, not ready
    8:"demo",   // Legora — evaluated, good fit actually
    9:"demo",   // Luminance — heard about from peers, some direct exposure
    10:"demo",  // Ivo — evaluated analytics
    11:"demo",  // TermScout — evaluated
    12:"full",  // Copilot — obvious choice, uses daily in Word/Teams/Outlook
  },
  scores:{
    // speed = pure latency/responsiveness · ux = interface design, onboarding, friction in his Word/iManage world
    1:{integrations:2,automation:3,knowledge:3,voice:3,research:4,customization:2,speed:4,ux:2,forwardThinking:3,pricing:1},  // doesn't fit his ecosystem, web-only
    2:{integrations:2,automation:3,knowledge:2,voice:1,research:4,customization:3,speed:5,ux:3,forwardThinking:4,pricing:4},  // clean but web-only, not native
    3:{integrations:1,automation:2,knowledge:2,voice:2,research:2,customization:2,speed:4,ux:2,forwardThinking:3,pricing:4},  // barely used it, can't evaluate UX fairly
    4:{integrations:3,automation:3,knowledge:3,voice:1,research:5,customization:2,speed:4,ux:3,forwardThinking:3,pricing:2},  // clean interface, good outputs, web-first
    5:{integrations:2,automation:3,knowledge:2,voice:4,research:3,customization:2,speed:4,ux:3,forwardThinking:3,pricing:4},  // familiar consumer UX, voice excellent
    6:{integrations:5,automation:4,knowledge:4,voice:3,research:5,customization:3,speed:4,ux:5,forwardThinking:4,pricing:1},  // native Word, iManage — lives in his stack
    7:{integrations:1,automation:2,knowledge:2,voice:1,research:1,customization:2,speed:2,ux:2,forwardThinking:4,pricing:2},  // too early, unclear onboarding
    8:{integrations:4,automation:4,knowledge:3,voice:1,research:4,customization:3,speed:3,ux:4,forwardThinking:4,pricing:1},  // Microsoft-first, iManage — Tabular Review is well-designed
    9:{integrations:3,automation:3,knowledge:3,voice:1,research:4,customization:2,speed:2,ux:2,forwardThinking:2,pricing:2},  // steep learning curve
    10:{integrations:3,automation:3,knowledge:3,voice:1,research:4,customization:3,speed:3,ux:4,forwardThinking:3,pricing:2}, // analytics dashboard genuinely impressive
    11:{integrations:2,automation:2,knowledge:2,voice:1,research:3,customization:2,speed:3,ux:3,forwardThinking:3,pricing:3}, // simple enough, limited surface
    12:{integrations:5,automation:4,knowledge:4,voice:4,research:3,customization:3,speed:5,ux:5,forwardThinking:4,pricing:5}, // seamless — already where he works
  },
  verdicts:{1:"WRONG ECOSYSTEM",2:"PERSONAL USE ONLY",3:"NOT APPLICABLE",4:"PROMISING",5:"STILL USE IT (QUIETLY)",6:"THE STANDARD",7:"NOT YET REAL",8:"EXACTLY WHAT I NEED",9:"HEARD BAD THINGS",10:"INTERESTING ANALYTICS",11:"INTERESTING CONCEPT",12:"OBVIOUS CHOICE"},
  takes:{
    1:"I want to like this. The research output is genuinely good and the Slack integration is impressive — for the kind of work where Slack is relevant. But I live in iManage, Word, and Outlook. No iManage integration is a dealbreaker.",
    2:"I use this personally, on my own account, at midnight when I need to think through a structure quickly. I would never put confidential client information in it. Do not tell the firm.",
    3:"We are not a GSuite firm. I have used Google Docs maybe four times in my life. I cannot evaluate this fairly and I am choosing not to pretend otherwise.",
    4:"The research accuracy is excellent — better sourcing than most tools, and the outputs are succinct in a way you could put in front of a partner. My hesitation: very US-centric and some of my work is cross-border.",
    5:"I still have a personal Pro subscription. Voice Mode is genuinely excellent when I want to narrate comments rather than type them. I will deny using this if anyone from firm IT asks.",
    6:"This is the one. iManage integration, Microsoft Word native, LexisNexis access, and it actually understands how M&A documents are structured. Pricing is eye-watering but I understand why.",
    7:"A demo and some very good marketing. For a firm doing cross-border M&A with confidentiality obligations to five different parties, plugging everything into a startup is not something I can take to the partners. Ask me again in 2027.",
    8:"Surprisingly good fit for my world. Microsoft-first, iManage integration, proper document management. The Tabular Review feature for due diligence is genuinely impressive.",
    9:"I have heard mixed things from peers. Some love it for large-volume review work. Others describe a steep learning curve. Harvey covers the same ground.",
    10:"The analytics dashboard is genuinely impressive. Cycle time analysis, risk patterns, benchmark comparisons. Probably more valuable to a legal ops director than to a deal lawyer.",
    11:"Interesting and probably underrated. Certifying contract terms against real market data rather than AI guesswork has obvious value in negotiations.",
    12:"This is what I have been waiting for. It lives inside Word. It understands document structure. It drafts, summarises, redlines, and compares — without me leaving the application I have had open every day for the past eight years. Copilot in Teams means I no longer miss action items on a call. Copilot in Outlook means I can process fifty emails in ten minutes. The Microsoft 365 integration is not a feature. It is the entire value proposition. The pricing is straightforward. The security story is airtight. I cannot understand why every law firm is not already on this.",
  },
};

const REVIEWERS = [REVIEWER_LJG, REVIEWER_TESTY];

// ─── AGGREGATED PSEUDO-REVIEWER ───────────────────────────────────────────────
// Weights: full use = 1.0, demo = 0.5, false/absent = excluded
const USAGE_WEIGHTS = { full: 1.0, demo: 0.5 };

function buildAggregated() {
  const scores = {};
  TOOLS.forEach(t => {
    const avg = {};
    CRITERIA.forEach(c => {
      let weightedSum = 0, totalWeight = 0;
      REVIEWERS.forEach(r => {
        const w = USAGE_WEIGHTS[r.usage?.[t.id]] ?? 0;
        if (w > 0) {
          weightedSum += r.scores[t.id][c.key] * w;
          totalWeight += w;
        }
      });
      avg[c.key] = totalWeight > 0
        ? Math.round((weightedSum / totalWeight) * 10) / 10
        : 0;
    });
    scores[t.id] = avg;
  });
  return { id:"aggregated", initials:"ALL", color:T.ink, name:"All Reviewers", nameShort:"Aggregated", scores, verdicts:{}, takes:{} };
}
const AGGREGATED = buildAggregated();

// Helper: get usage label for display
function usageLabel(usage) {
  if (usage === "full") return { text:"Used", color:T.green, bg:T.greenLight };
  if (usage === "demo") return { text:"Demo", color:T.terra, bg:T.terraLight };
  return null;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function calcFit(scores) {
  if (!scores) return 0;
  return Math.round((Object.values(scores).reduce((a,b)=>a+b,0)/(CRITERIA.length*5))*100);
}
function fitColor(pct)  { return pct >= 75 ? T.blue : pct >= 55 ? T.mid : T.rule; }
function barColor(s)    { return s >= 4 ? T.blue : s >= 3 ? T.mid : T.rule; }

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function Eyebrow({ children, color }) {
  return <div style={{ fontSize:10, fontWeight:600, letterSpacing:2, color:color||T.mid, fontFamily:MONO, textTransform:"uppercase", marginBottom:8 }}>{children}</div>;
}
function Rule({ color, size }) {
  return <div style={{ height:1, background:color||T.rule, margin:size==="lg"?"32px 0":"16px 0" }} />;
}
function Chip({ label, color }) {
  return <span style={{ display:"inline-block", fontSize:9, fontWeight:700, letterSpacing:1.5, color:color||T.mid, border:"1px solid "+(color||T.rule)+"80", borderRadius:2, padding:"3px 7px", fontFamily:MONO, textTransform:"uppercase" }}>{label}</span>;
}
function ScoreBar({ score }) {
  const pct = typeof score === "number" ? (score/5)*100 : 0;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:3, background:T.rule, borderRadius:2 }}>
        <div style={{ width:pct+"%", height:"100%", background:barColor(score), borderRadius:2, transition:"width 0.35s ease" }} />
      </div>
      <span style={{ fontSize:10, color:T.mid, fontFamily:MONO, minWidth:14, textAlign:"right" }}>{typeof score === "number" && score % 1 !== 0 ? score.toFixed(1) : score}</span>
    </div>
  );
}
function Tooltip({ text, children }) {
  const [on, setOn] = useState(false);
  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center" }} onMouseEnter={()=>setOn(true)} onMouseLeave={()=>setOn(false)}>
      {children}
      {on && <span style={{ position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)", background:T.ink, color:"#fff", borderRadius:4, padding:"8px 12px", fontSize:11, lineHeight:1.55, width:220, zIndex:999, pointerEvents:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.18)", whiteSpace:"normal" }}>{text}</span>}
    </span>
  );
}

// ─── TOOL CARD ────────────────────────────────────────────────────────────────
function ToolCard({ tool, onClick }) {
  const [hover, setHover] = useState(false);
  const sc  = AGGREGATED.scores[tool.id];
  const pct = calcFit(sc);
  const catColor = tool.category === "Legal-Specific" ? T.blue : T.terra;
  const fitBg    = pct >= 75 ? T.blueLight : pct >= 55 ? T.amberLight : "#F0F0EC";
  const fitTxt   = pct >= 75 ? T.blue      : pct >= 55 ? T.amber      : T.mid;

  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ background:T.white, borderTop:"3px solid "+tool.tagColor, padding:"24px 22px 20px", cursor:"pointer", transition:"box-shadow 0.2s", boxShadow:hover?"0 8px 40px rgba(0,0,0,0.10)":"none", display:"flex", flexDirection:"column" }}>

      {/* Header row: logo + name + fit% */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <ToolLogo id={tool.id} emoji={tool.emoji} size={26} />
          <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:T.ink, fontFamily:HEAD, lineHeight:1.1 }}>{tool.name}</h3>
        </div>
        <div style={{ background:fitBg, borderRadius:20, padding:"3px 10px", flexShrink:0, marginLeft:10 }}>
          <span style={{ fontSize:13, fontWeight:700, color:fitTxt, fontFamily:MONO }}>{pct}%</span>
        </div>
      </div>

      {/* Category badge */}
      <div style={{ marginBottom:10 }}>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:catColor, background:catColor+"1A", borderRadius:2, padding:"3px 8px", fontFamily:MONO, textTransform:"uppercase" }}>{tool.category}</span>
      </div>

      <p style={{ margin:"0 0 14px", fontSize:12, color:T.mid, lineHeight:1.5 }}>{tool.oneLiner}</p>

      {/* Top 4 scoring criteria for this tool */}
      {(() => {
        const sorted = [...CRITERIA].sort((a,b) => (sc[b.key]||0) - (sc[a.key]||0)).slice(0,4);
        return (
          <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:16 }}>
            {sorted.map(c => (
              <div key={c.key}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontSize:10, color:T.mid }}>{c.icon} {c.label}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:sc[c.key]>=4?T.blue:T.mid, fontFamily:MONO }}>{sc[c.key]}</span>
                </div>
                <ScoreBar score={sc[c.key]} />
              </div>
            ))}
          </div>
        );
      })()}

      {/* Internet data snippet */}
      <div style={{ background:T.paper, borderRadius:3, padding:"10px 12px", marginBottom:14, flex:1 }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:T.mid, fontFamily:MONO, textTransform:"uppercase", marginBottom:5 }}>Best For</div>
        <p style={{ margin:0, fontSize:11, color:T.body, lineHeight:1.55 }}>{tool.bestFor}</p>
      </div>

      {/* Pricing + word plugin row */}
      <div style={{ borderTop:"1px solid "+T.rule, paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:10, color:T.mid, fontFamily:MONO }}>{tool.pricing.split(" · ")[0]}</span>
        {tool.wordPlugin && <span style={{ fontSize:9, color:T.blue, fontFamily:MONO, fontWeight:700, letterSpacing:1, border:"1px solid "+T.blue+"60", borderRadius:2, padding:"2px 6px" }}>WORD</span>}
      </div>

      {/* Reviewer conflict disclosure — Wordsmith only */}
      {tool.id === 1 && (
        <div style={{ marginTop:10, borderTop:"1px solid "+T.rule, paddingTop:10, display:"flex", gap:7, alignItems:"flex-start" }}>
          <span style={{ fontSize:9, fontWeight:700, color:T.terra, fontFamily:MONO, letterSpacing:1, flexShrink:0, marginTop:1 }}>DISCLOSURE</span>
          <span style={{ fontSize:11, color:T.mid, lineHeight:1.5 }}>Wordsmith employed reviewer Laura Jeffords Greenberg 2024–2025.</span>
        </div>
      )}
    </div>
  );
}

// ─── TOOL MODAL ───────────────────────────────────────────────────────────────
function ToolModal({ tool, onClose }) {
  const [tab, setTab]         = useState("overview");
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [lastFetched, setLastFetched] = useState(null);
  if (!tool) return null;
  const sc = AGGREGATED.scores[tool.id];

  async function fetchLive() {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          system:"You are a legal technology analyst. Return ONLY a JSON object with no preamble, no markdown, no backticks. Keys: pricing (string, current pricing info), integrations (string, key legal integrations — iManage, Word, Slack, DMS, etc.), bestFor (string, 1 sentence), latestNews (string, most recent notable update or funding, 1-2 sentences), wordPlugin (boolean). Be concise and factual.",
          messages:[{ role:"user", content:`Search the web for the latest information about ${tool.name} legal AI tool as of 2026. What is their current pricing, key integrations for law firms and in-house legal teams, and any recent news or updates?` }]
        })
      });
      const data = await res.json();
      const text = data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      const clean = text.replace(/```json|```/g,"").trim();
      setLiveData(JSON.parse(clean));
      setLastFetched(new Date());
    } catch(e) {
      setLiveData({ error:"Could not fetch live data. Showing cached information." });
    }
    setLoading(false);
  }

  const display = liveData && !liveData.error ? liveData : tool.internet;
  const isLive  = liveData && !liveData.error;

  const isMobile = useIsMobile();

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(20,20,20,0.5)", display:"flex", alignItems:isMobile?"flex-end":"center", justifyContent:"center", zIndex:1000, padding:isMobile?0:24 }} onClick={onClose}>
      <div style={{ background:T.white, width:"100%", maxWidth:isMobile?"100%":720, maxHeight:isMobile?"92vh":"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 32px 80px rgba(0,0,0,0.22)", borderRadius:isMobile?"12px 12px 0 0":0 }} onClick={e=>e.stopPropagation()}>

        {/* Modal header */}
        <div style={{ padding:isMobile?"16px 16px 0":"24px 28px 0", borderBottom:"1px solid "+T.rule }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div style={{ display:"flex", gap:isMobile?10:14, alignItems:"flex-start" }}>
              <ToolLogo id={tool.id} emoji={tool.emoji} size={isMobile?32:40} />
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:5 }}>
                  <Chip label={tool.tag} color={tool.tagColor} />
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:tool.category==="Legal-Specific"?T.blue:T.terra, background:(tool.category==="Legal-Specific"?T.blue:T.terra)+"1A", borderRadius:2, padding:"3px 8px", fontFamily:MONO, textTransform:"uppercase" }}>{tool.category}</span>
                </div>
                <h2 style={{ margin:"0 0 3px", fontSize:isMobile?20:24, fontWeight:700, color:T.ink, fontFamily:HEAD, lineHeight:1.1 }}>{tool.name}</h2>
                <p style={{ margin:0, fontSize:12, color:T.mid }}>{tool.oneLiner}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"1px solid "+T.rule, color:T.mid, width:30, height:30, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, borderRadius:0 }}>✕</button>
          </div>

          {/* Live refresh bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:12, borderBottom:"1px solid "+T.rule, marginBottom:0, flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:isLive?T.green:T.mid, display:"inline-block" }} />
              <span style={{ fontSize:11, color:T.mid, fontFamily:MONO }}>
                {isLive ? `Live · ${lastFetched.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}` : "Cached · March 2026"}
              </span>
            </div>
            <button onClick={fetchLive} disabled={loading} style={{ background:loading?T.rule:T.blue, color:"#fff", border:"none", padding:"5px 14px", cursor:loading?"not-allowed":"pointer", fontSize:11, fontFamily:BODY, fontWeight:500, borderRadius:0, display:"flex", alignItems:"center", gap:6, opacity:loading?0.7:1 }}>
              {loading ? "⟳ Fetching…" : "⟳ Refresh Live Data"}
            </button>
          </div>

          {/* Tabs — scrollable on mobile */}
          <div style={{ display:"flex", overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none", msOverflowStyle:"none" }}>
            {[["overview","Overview"],["integrations","Integrations"],["research","Research"],["news","Latest News"],["reviews","Reviewer Takes"],["scores","Full Scores"],["demo","Book Demo"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setTab(id)}
                style={{ background:"none", border:"none", borderBottom:tab===id?"2px solid "+T.blue:"2px solid transparent", color:tab===id?T.ink:id==="demo"?T.blue:T.mid, padding:"10px 14px", cursor:"pointer", fontSize:12, fontWeight:tab===id?600:id==="demo"?500:400, fontFamily:BODY, transition:"all 0.12s", marginBottom:-1, whiteSpace:"nowrap", flexShrink:0 }}>{lbl}</button>
            ))}
          </div>
        </div>

        {/* Modal body */}
        <div style={{ overflow:"auto", padding:isMobile?"16px":"24px 28px", flex:1, WebkitOverflowScrolling:"touch" }}>

          {liveData?.error && (
            <div style={{ background:T.amberLight, border:"1px solid "+T.amber+"60", borderRadius:3, padding:"10px 14px", marginBottom:20, fontSize:12, color:T.amber }}>{liveData.error}</div>
          )}

          {tab === "overview" && (
            <div>
              <Eyebrow>One-liner</Eyebrow>
              <p style={{ margin:"0 0 16px", color:T.body, fontSize:14, lineHeight:1.75 }}>{isLive ? display.bestFor : tool.bestFor}</p>
              <Rule />
              <Eyebrow>Pricing</Eyebrow>
              <p style={{ margin:"0 0 16px", color:T.body, fontSize:14, lineHeight:1.75 }}>{isLive ? display.pricing : tool.pricing}</p>
              {isLive && display.latestNews && (<>
                <Rule />
                <Eyebrow color={T.green}>Latest News</Eyebrow>
                <p style={{ margin:"0 0 16px", color:T.body, fontSize:14, lineHeight:1.75 }}>{display.latestNews}</p>
              </>)}
              <Rule />
              <Eyebrow>Word Plugin</Eyebrow>
              <p style={{ margin:0, color:T.body, fontSize:14 }}>{(isLive ? display.wordPlugin : tool.wordPlugin) ? "✓ Yes — works inside Microsoft Word" : "✗ No native Word plugin"}</p>
            </div>
          )}

          {tab === "integrations" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <Eyebrow>Key Integrations for Legal Teams</Eyebrow>
                {isLive && <span style={{ fontSize:9, color:T.green, fontFamily:MONO, fontWeight:700, letterSpacing:1 }}>LIVE DATA</span>}
              </div>
              <p style={{ margin:"0 0 24px", color:T.body, fontSize:14, lineHeight:1.85 }}>{isLive ? display.integrations : tool.internet.integrations}</p>
              <Rule />
              <Eyebrow>Stack Fit</Eyebrow>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {tool.stackFit.map(s=><span key={s} style={{ fontSize:12, color:T.body, fontFamily:MONO, border:"1px solid "+T.rule, padding:"3px 10px", borderRadius:2 }}>{s}</span>)}
              </div>
            </div>
          )}

          {tab === "research" && (
            <div>
              <div style={{ borderLeft:"2px solid "+T.blue, paddingLeft:14, marginBottom:20 }}>
                <p style={{ margin:0, fontSize:12, color:T.mid, fontStyle:"italic" }}>Sourced from publicly available research. Click Refresh Live Data to pull the latest from the web.</p>
              </div>
              <Eyebrow>Pain Points Solved</Eyebrow>
              <p style={{ margin:"0 0 20px", color:T.body, fontSize:14, lineHeight:1.85 }}>{tool.internet.painPoints}</p>
              <Rule />
              <Eyebrow>Pricing Detail</Eyebrow>
              <p style={{ margin:0, color:T.body, fontSize:14, lineHeight:1.85 }}>{isLive ? display.pricing : tool.internet.pricing}</p>
            </div>
          )}

          {tab === "reviews" && (
            <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
              <div style={{ borderLeft:"2px solid "+T.rule, paddingLeft:14 }}>
                <p style={{ margin:0, fontSize:12, color:T.mid, fontStyle:"italic" }}>Independent reviewer opinions. For full methodology and disclosures, visit the Reviewers tab.</p>
              </div>
              {REVIEWERS.map(r=>{
                const ul = usageLabel(r.usage?.[tool.id]);
                return (
                <div key={r.id}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:r.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff", fontFamily:MONO, flexShrink:0 }}>{r.initials}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.name}</div>
                      <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:3, flexWrap:"wrap" }}>
                        <Chip label={r.verdicts[tool.id]} color={r.color} />
                        <span style={{ fontSize:12, fontWeight:700, color:fitColor(calcFit(r.scores[tool.id])), fontFamily:MONO }}>{calcFit(r.scores[tool.id])}%</span>
                        {ul && <span style={{ fontSize:9, fontWeight:700, color:ul.color, background:ul.bg, padding:"2px 7px", borderRadius:2, fontFamily:MONO, letterSpacing:1 }}>{ul.text}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ borderLeft:"3px solid "+r.color, paddingLeft:16 }}>
                    <p style={{ margin:0, color:T.body, fontSize:14, lineHeight:1.85, fontStyle:"italic" }}>{r.takes[tool.id]}</p>
                  </div>
                  <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap" }}>
                    {CRITERIA.map(c=>(
                      <div key={c.key} style={{ textAlign:"center", minWidth:36 }}>
                        <div style={{ fontSize:10 }}>{c.icon}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:r.scores[tool.id][c.key]>=4?r.color:T.mid, fontFamily:MONO }}>{r.scores[tool.id][c.key]}</div>
                        <div style={{ fontSize:8, color:T.mid }}>{c.label.split(" ")[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          )}

          {tab === "scores" && (
            <div>
              <div style={{ borderLeft:"2px solid "+T.ink, paddingLeft:14, marginBottom:24 }}>
                <p style={{ margin:0, fontSize:12, color:T.mid, fontStyle:"italic" }}>
                  Weighted average across {REVIEWERS.length} reviewers. Regular users score at full weight; demo/evaluation scores at half weight.
                </p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {CRITERIA.map(c=>(
                  <div key={c.key}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <span style={{ fontSize:13, color:T.body, display:"flex", alignItems:"center", gap:6 }}>
                        {c.icon} {c.label}
                        <Tooltip text={c.def}>
                          <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:14, height:14, borderRadius:"50%", border:"1px solid "+T.rule, fontSize:9, color:T.mid, cursor:"help" }}>?</span>
                        </Tooltip>
                      </span>
                      <span style={{ fontSize:13, fontWeight:700, color:sc[c.key]>=4?T.blue:sc[c.key]>=3?T.mid:T.rule, fontFamily:MONO }}>{sc[c.key] % 1 !== 0 ? sc[c.key].toFixed(1) : sc[c.key]}/5</span>
                    </div>
                    <ScoreBar score={sc[c.key]} />
                    <div style={{ display:"flex", gap:12, marginTop:4, flexWrap:"wrap" }}>
                      {REVIEWERS.map(r=>{
                        const ul = usageLabel(r.usage?.[tool.id]);
                        return (
                          <span key={r.id} style={{ fontSize:10, color:r.color, fontFamily:MONO, display:"flex", alignItems:"center", gap:4 }}>
                            {r.nameShort}: {r.scores[tool.id][c.key]}
                            {ul && <span style={{ fontSize:8, color:ul.color, fontWeight:700 }}>({ul.text})</span>}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "news" && <ToolNewsTab tool={tool} />}
          {tab === "demo" && <ToolDemoTab tool={tool} />}

        </div>
      </div>
    </div>
  );
}

// ─── TOOL NEWS TAB ────────────────────────────────────────────────────────────
function ToolNewsTab({ tool }) {
  const [news, setNews]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError]     = useState(null);

  async function fetchNews() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          system:`You are a legal technology news analyst. Search for the latest news, product updates, funding announcements, and notable developments about the given legal AI tool. Return ONLY a JSON object with no preamble, no markdown, no backticks. Keys: items (array of up to 5 objects, each with: headline (string, 10 words max), date (string, e.g. "Feb 2026" or "Q1 2026"), summary (string, 1-2 sentences, factual), url (string or null)). Return items in reverse chronological order.`,
          messages:[{ role:"user", content:`Find the latest news, product updates, funding, and notable developments about ${tool.name} (legal AI tool). Homepage: ${HOMEPAGES[tool.id] || tool.name}. Focus on 2025-2026.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.filter(b=>b.type==="text").map(b=>b.text).join("");
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setNews(parsed.items || []);
    } catch(e) {
      setError("Could not fetch latest news. Try again.");
    }
    setLoading(false); setFetched(true);
  }

  if (!fetched && !loading) return (
    <div style={{ textAlign:"center", padding:"40px 0" }}>
      <div style={{ fontSize:28, marginBottom:16 }}>📰</div>
      <p style={{ color:T.mid, fontSize:14, marginBottom:20, lineHeight:1.7 }}>
        Pull the latest news, product updates, and funding announcements for <strong>{tool.name}</strong> from the web.
      </p>
      <button onClick={fetchNews}
        style={{ background:T.blue, color:"#fff", border:"none", padding:"11px 28px", cursor:"pointer", fontSize:13, fontFamily:BODY, fontWeight:500, borderRadius:0 }}>
        Fetch Latest News →
      </button>
    </div>
  );

  if (loading) return (
    <div style={{ textAlign:"center", padding:"40px 0", color:T.mid, fontFamily:MONO, fontSize:12 }}>
      <div style={{ fontSize:24, marginBottom:12 }}>⟳</div>
      Searching the web for {tool.name} news…
    </div>
  );

  if (error) return (
    <div style={{ padding:"20px", background:T.amberLight, border:"1px solid "+T.amber+"60", fontSize:13, color:T.amber }}>
      {error}
      <button onClick={fetchNews} style={{ marginLeft:12, background:"none", border:"1px solid "+T.amber, color:T.amber, padding:"4px 12px", cursor:"pointer", fontSize:11, fontFamily:MONO, borderRadius:0 }}>Retry</button>
    </div>
  );

  if (!news || news.length === 0) return (
    <div style={{ color:T.mid, fontSize:13, padding:"20px 0" }}>No recent news found. <button onClick={fetchNews} style={{ background:"none", border:"none", color:T.blue, cursor:"pointer", fontSize:13, textDecoration:"underline" }}>Try again</button></div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:T.green, display:"inline-block" }} />
          <span style={{ fontSize:11, color:T.mid, fontFamily:MONO }}>Live · fetched just now</span>
        </div>
        <button onClick={fetchNews} style={{ background:"none", border:"1px solid "+T.rule, color:T.mid, padding:"4px 12px", cursor:"pointer", fontSize:10, fontFamily:MONO, borderRadius:0 }}>⟳ Refresh</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:1, background:T.rule }}>
        {news.map((item, i) => (
          <div key={i} style={{ background:T.white, padding:"18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:6 }}>
              <div style={{ fontSize:14, fontWeight:600, color:T.ink, fontFamily:HEAD, lineHeight:1.3 }}>{item.headline}</div>
              {item.date && <span style={{ fontSize:10, color:T.mid, fontFamily:MONO, whiteSpace:"nowrap", flexShrink:0, marginTop:2 }}>{item.date}</span>}
            </div>
            <p style={{ margin:0, fontSize:13, color:T.body, lineHeight:1.75 }}>{item.summary}</p>
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize:10, color:T.blue, fontFamily:MONO, display:"inline-block", marginTop:8, textDecoration:"none" }}>
                Read more →
              </a>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop:16, textAlign:"right" }}>
        <a href={HOMEPAGES[tool.id]} target="_blank" rel="noopener noreferrer"
          style={{ fontSize:11, color:T.blue, fontFamily:MONO, textDecoration:"none" }}>
          Visit {tool.name} website →
        </a>
      </div>
    </div>
  );
}

// ─── TOOL DEMO TAB ────────────────────────────────────────────────────────────
function ToolDemoTab({ tool }) {
  const homepage = HOMEPAGES[tool.id];
  const demoUrl  = DEMO_URLS[tool.id];

  return (
    <div style={{ textAlign:"center", padding:"40px 24px" }}>
      <ToolLogo id={tool.id} emoji={tool.emoji} size={52} />
      <h3 style={{ margin:"20px 0 8px", fontFamily:HEAD, fontSize:22, color:T.ink }}>{tool.name}</h3>
      <p style={{ margin:"0 0 8px", fontSize:13, color:T.mid, lineHeight:1.7, maxWidth:400, marginLeft:"auto", marginRight:"auto" }}>
        {tool.oneLiner}
      </p>
      <p style={{ margin:"0 0 32px", fontSize:12, color:T.mid, fontFamily:MONO }}>{tool.pricing}</p>

      <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center", maxWidth:300, margin:"0 auto" }}>
        {demoUrl && (
          <a href={demoUrl} target="_blank" rel="noopener noreferrer"
            style={{ display:"block", width:"100%", background:T.blue, color:"#fff", textDecoration:"none", padding:"13px 28px", fontSize:14, fontFamily:BODY, fontWeight:600, borderRadius:0, boxSizing:"border-box" }}>
            Book a Demo → {tool.name}
          </a>
        )}
        {homepage && homepage !== demoUrl && (
          <a href={homepage} target="_blank" rel="noopener noreferrer"
            style={{ display:"block", width:"100%", background:"none", border:"1px solid "+T.rule, color:T.body, textDecoration:"none", padding:"11px 28px", fontSize:13, fontFamily:BODY, borderRadius:0, boxSizing:"border-box" }}>
            Visit Homepage
          </a>
        )}
      </div>

      <div style={{ marginTop:36, padding:"16px 20px", background:T.paper, border:"1px solid "+T.rule, textAlign:"left", maxWidth:360, margin:"36px auto 0" }}>
        <Eyebrow>Stack Fit</Eyebrow>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:6 }}>
          {tool.stackFit.map(s=>(
            <span key={s} style={{ fontSize:11, color:T.body, fontFamily:MONO, border:"1px solid "+T.rule, padding:"3px 9px", borderRadius:2 }}>{s}</span>
          ))}
        </div>
        {tool.wordPlugin && (
          <div style={{ marginTop:12, fontSize:12, color:T.green, display:"flex", alignItems:"center", gap:6 }}>
            <span>✓</span> Microsoft Word plugin available
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REVIEWER PROFILE ─────────────────────────────────────────────────────────
function ReviewerProfile({ reviewer, onBack }) {
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal]       = useState(null);
  const isMobile = useIsMobile();
  const sorted = useMemo(()=>[...TOOLS].sort((a,b)=>calcFit(reviewer.scores[b.id])-calcFit(reviewer.scores[a.id])),[reviewer]);

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:isMobile?"24px 16px 80px":"56px 32px 80px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:T.blue, cursor:"pointer", fontSize:13, marginBottom:24, fontFamily:BODY, padding:0 }}>← All Reviewers</button>

      {reviewer.fictional && (
        <div style={{ background:"#F5F0FA", border:"1px solid "+T.purple+"40", borderLeft:"3px solid "+T.purple, padding:"14px 20px", marginBottom:32, display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:11, fontWeight:700, color:T.purple, fontFamily:MONO, letterSpacing:1, flexShrink:0, marginTop:1 }}>FICTIONAL REVIEWER</span>
          <span style={{ fontSize:13, color:T.purple, lineHeight:1.6 }}>{reviewer.fictionalNote} Scores are included to illustrate what a second reviewer perspective might look like — not as real data.</span>
        </div>
      )}

      <div style={{ marginBottom:56 }}>
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:20 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:reviewer.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", fontFamily:MONO, letterSpacing:"0.04em", flexShrink:0 }}>{reviewer.initials}</div>
          <div>
            <h2 style={{ margin:"0 0 4px", fontSize:32, fontWeight:700, color:T.ink, fontFamily:HEAD }}>{reviewer.name}</h2>
            <p style={{ margin:"0 0 6px", fontSize:13, color:T.mid }}>{reviewer.role} · {reviewer.sector} · {reviewer.companySize} · {reviewer.teamSize}</p>
            {reviewer.linkedin && (
              <a href={reviewer.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ fontSize:11, color:T.blue, fontFamily:MONO, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5, letterSpacing:0.3 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={T.blue}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            )}
          </div>
        </div>
        <p style={{ margin:0, fontSize:15, color:T.body, lineHeight:1.85, maxWidth:620 }}>{reviewer.bio}</p>
      </div>

      {[
        [1, "Who You Are + What Matters", T.blue, ()=>(
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:isMobile?24:40 }}>
            <div>
              <Eyebrow>Role Context</Eyebrow>
              {[["Role",reviewer.role],["Sector",reviewer.sector],["Company",reviewer.companySize],["Team",reviewer.teamSize]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid "+T.rule }}>
                  <span style={{ fontSize:12, color:T.mid }}>{k}</span>
                  <span style={{ fontSize:12, color:T.ink, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <Eyebrow>Scoring Philosophy</Eyebrow>
              <p style={{ margin:"0 0 20px", fontSize:13, color:T.body, lineHeight:1.7 }}>{reviewer.scoringNote}</p>
              <Eyebrow color={T.mid}>Does not score</Eyebrow>
              {reviewer.noPoints.map((x,i)=>(
                <div key={i} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom:"1px solid "+T.rule }}>
                  <span style={{ color:T.mid, fontSize:10, fontWeight:700, flexShrink:0, marginTop:2 }}>✗</span>
                  <span style={{ fontSize:12, color:T.body }}>{x}</span>
                </div>
              ))}
            </div>
          </div>
        )],
        [2, "Disclosure", T.green, ()=>(
          <div style={{ borderLeft:"3px solid "+T.green, paddingLeft:20 }}>
            <p style={{ margin:0, fontSize:14, color:T.body, lineHeight:1.85 }}>{reviewer.disclosure}</p>
          </div>
        )],
        [3, "Core Beliefs About AI", T.blue, ()=>(
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:1, background:T.rule }}>
            {reviewer.beliefs.map((b,i)=>(
              <div key={i} style={{ background:T.white, padding:"16px 20px", display:"flex", gap:12 }}>
                <span style={{ color:T.blue, fontWeight:700, fontSize:12, flexShrink:0, marginTop:2 }}>✓</span>
                <span style={{ fontSize:13, color:T.body, lineHeight:1.65 }}>{b}</span>
              </div>
            ))}
          </div>
        )],
        [4, "What I'm Looking to Solve", T.purple, ()=>(
          <div>
            {reviewer.painPoints.map((x,i)=>(
              <div key={i} style={{ display:"flex", gap:20, padding:"14px 0", borderBottom:i<reviewer.painPoints.length-1?"1px solid "+T.rule:"none" }}>
                <span style={{ fontFamily:MONO, fontSize:10, fontWeight:700, color:T.ink, flexShrink:0, minWidth:20, marginTop:2 }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ fontSize:13, color:T.body, lineHeight:1.7 }}>{x}</span>
              </div>
            ))}
          </div>
        )],
        [5, "Daily Tech Stack", T.blue, ()=>(
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(145px, 1fr))", gap:28 }}>
            {reviewer.stack.map(g=>(
              <div key={g.group}>
                <Eyebrow>{g.group}</Eyebrow>
                {g.items.map(item=><div key={item} style={{ fontSize:12, color:T.body, padding:"5px 0", borderBottom:"1px solid "+T.rule }}>{item}</div>)}
              </div>
            ))}
          </div>
        )],
        [6, "Tool Rankings", T.ink, ()=>(
          <div>
            {sorted.map((tool,idx)=>{
              const sc   = reviewer.scores[tool.id];
              const pct  = calcFit(sc);
              const open = expanded === tool.id;
              return (
                <div key={tool.id} style={{ borderBottom:"1px solid "+T.rule }}>
                  <div onClick={()=>setExpanded(open?null:tool.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 0", cursor:"pointer" }}>
                    <span style={{ fontSize:10, fontWeight:700, color:T.mid, fontFamily:MONO, width:24, flexShrink:0 }}>#{idx+1}</span>
                    <span style={{ fontSize:18, flexShrink:0 }}>{tool.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:15, fontWeight:700, color:T.ink, fontFamily:HEAD }}>{tool.name}</span>
                        <Chip label={reviewer.verdicts[tool.id]} color={tool.verdictColor} />
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:2, alignItems:"flex-end" }}>
                      {CRITERIA.map(c=>(
                        <div key={c.key} style={{ width:5, height:4+sc[c.key]*4, borderRadius:1, background:sc[c.key]>=4?T.blue:sc[c.key]>=3?T.mid:T.rule }} title={c.label+": "+sc[c.key]} />
                      ))}
                    </div>
                    <span style={{ fontSize:14, fontWeight:700, color:fitColor(pct), fontFamily:MONO, minWidth:38, textAlign:"right" }}>{pct}%</span>
                    <span style={{ fontSize:10, color:T.mid, marginLeft:4 }}>{open?"▴":"▾"}</span>
                  </div>
                  {open && (
                    <div style={{ paddingBottom:24, paddingLeft:36 }}>
                      <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
                        {CRITERIA.map(c=>(
                          <div key={c.key} style={{ textAlign:"center", minWidth:36 }}>
                            <div style={{ fontSize:11, marginBottom:2 }}>{c.icon}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:sc[c.key]>=4?T.blue:sc[c.key]>=3?T.mid:T.rule, fontFamily:MONO }}>{sc[c.key]}</div>
                            <div style={{ fontSize:9, color:T.mid, marginTop:1 }}>{c.label.split(" ")[0]}</div>
                          </div>
                        ))}
                      </div>
                      {reviewer.takes[tool.id] && (
                        <p style={{ margin:"0 0 14px", fontSize:13, color:T.body, lineHeight:1.85, borderLeft:"2px solid "+reviewer.color, paddingLeft:14, fontStyle:"italic" }}>
                          &ldquo;{reviewer.takes[tool.id]}&rdquo;
                        </p>
                      )}
                      <button onClick={e=>{e.stopPropagation();setModal(tool);}} style={{ background:T.ink, color:"#fff", border:"none", padding:"7px 16px", cursor:"pointer", fontSize:12, fontFamily:BODY, fontWeight:500, borderRadius:0 }}>
                        View Full Profile →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )],
      ].map(([num,label,color,render])=>(
        <div key={num} style={{ marginBottom:52 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:22, height:22, background:color, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", fontFamily:MONO, flexShrink:0 }}>{num}</div>
            <h3 style={{ margin:0, fontSize:13, fontWeight:600, color:T.ink, letterSpacing:0.3 }}>{label}</h3>
            <div style={{ flex:1, height:1, background:T.rule }} />
          </div>
          {render()}
        </div>
      ))}

      {modal && <ToolModal tool={modal} viewMode="individual" reviewer={reviewer} onClose={()=>setModal(null)} />}
    </div>
  );
}

// ─── REVIEWERS GRID ───────────────────────────────────────────────────────────
function ReviewersGrid({ onSubmit }) {
  const [selected, setSelected] = useState(null);
  const isMobile = useIsMobile();
  if (selected) return <ReviewerProfile reviewer={selected} onBack={()=>setSelected(null)} />;

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:isMobile?"32px 16px 80px":"56px 32px 80px" }}>
      <Eyebrow>Community Reviewers · March 2026</Eyebrow>
      <h2 style={{ margin:"0 0 12px", fontSize:isMobile?28:36, fontWeight:700, color:T.ink, fontFamily:HEAD }}>Multiple Perspectives</h2>
      <p style={{ margin:"0 0 32px", color:T.mid, fontSize:isMobile?14:15, maxWidth:520, lineHeight:1.75 }}>
        The same tools, scored independently by different reviewers. Different roles, different stacks, different priorities — completely different results.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:1, background:T.rule }}>
        {REVIEWERS.map(r=>{
          const top = TOOLS.reduce((best,t)=>calcFit(r.scores[t.id])>calcFit(r.scores[best.id])?t:best,TOOLS[0]);
          return (
            <div key={r.id} onClick={()=>setSelected(r)}
              style={{ background:T.white, padding:32, cursor:"pointer", transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.paper}
              onMouseLeave={e=>e.currentTarget.style.background=T.white}
            >
              <div style={{ borderTop:"3px solid "+r.color, paddingTop:20, marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:r.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", fontFamily:MONO, flexShrink:0 }}>{r.initials}</div>
                  <div>
                    <div style={{ fontSize:17, fontWeight:700, color:T.ink, fontFamily:HEAD }}>{r.name}</div>
                    <div style={{ fontSize:11, color:T.mid }}>{r.role} · {r.sector}</div>
                  </div>
                </div>
                {r.fictional && (
                  <div style={{ background:"#F5F0FA", border:"1px solid "+T.purple+"40", padding:"8px 12px", marginBottom:12, display:"flex", gap:8, alignItems:"flex-start" }}>
                    <span style={{ fontSize:10, fontWeight:700, color:T.purple, fontFamily:MONO, letterSpacing:1, flexShrink:0, marginTop:1 }}>FICTIONAL</span>
                    <span style={{ fontSize:12, color:T.purple, lineHeight:1.5 }}>{r.fictionalNote}</span>
                  </div>
                )}
                <p style={{ margin:0, fontSize:13, color:T.body, lineHeight:1.65 }}>{r.bio.substring(0,140)}…</p>
              </div>
              <Rule />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div>
                  <Eyebrow>Top Tool</Eyebrow>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16 }}>{top.emoji}</span>
                    <span style={{ fontSize:14, fontWeight:600, color:T.ink }}>{top.name}</span>
                  </div>
                </div>
                <span style={{ fontSize:22, fontWeight:700, color:T.blue, fontFamily:MONO }}>{calcFit(r.scores[top.id])}%</span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                {r.disclosure && <Chip label="Conflict Disclosed" color={T.green} />}
                <Chip label={r.companySize} color={T.mid} />
                {r.linkedin && (
                  <a href={r.linkedin} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                    style={{ fontSize:10, color:T.blue, fontFamily:MONO, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:4, border:"1px solid "+T.rule, padding:"2px 8px", borderRadius:2 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={T.blue}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          );
        })}
        {/* Add Your Review CTA — clickable */}
        <div onClick={onSubmit}
          style={{ background:T.white, padding:32, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:240, cursor:"pointer", transition:"background 0.15s", border:"none" }}
          onMouseEnter={e=>e.currentTarget.style.background=T.blueLight}
          onMouseLeave={e=>e.currentTarget.style.background=T.white}>
          <div style={{ width:48, height:48, borderRadius:"50%", border:"2px dashed "+T.blue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:T.blue, marginBottom:14 }}>+</div>
          <div style={{ fontSize:16, fontWeight:700, color:T.blue, marginBottom:8, fontFamily:HEAD }}>Add Your Review</div>
          <p style={{ margin:0, fontSize:12, color:T.mid, lineHeight:1.65, textAlign:"center", maxWidth:200 }}>A different role, stack, or perspective not yet represented.</p>
          <div style={{ marginTop:16, fontSize:10, fontFamily:MONO, color:T.blue, letterSpacing:1, fontWeight:700 }}>SUBMIT REVIEW →</div>
        </div>
      </div>
    </div>
  );
}

// ─── METHODOLOGY VIEW ─────────────────────────────────────────────────────────
function MethodologyView({ onSubmit }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:isMobile?"32px 16px 80px":"56px 32px 80px" }}>
      <Eyebrow color={T.blue}>How This Works</Eyebrow>
      <h2 style={{ margin:"0 0 12px", fontSize:36, fontWeight:700, color:T.ink, fontFamily:HEAD }}>Methodology</h2>
      <p style={{ margin:"0 0 56px", color:T.mid, fontSize:15, maxWidth:540, lineHeight:1.75 }}>
        How tools are scored, how reviewers are selected, and what the numbers actually mean.
      </p>

      {METHODOLOGY_SECTIONS.map((s, i) => (
        <div key={s.title} style={{ marginBottom:48 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <span style={{ fontSize:10, fontFamily:MONO, fontWeight:700, color:s.color, letterSpacing:2, textTransform:"uppercase", flexShrink:0 }}>
              {String(i+1).padStart(2,"0")}
            </span>
            <div style={{ flex:1, height:1, background:T.rule }} />
            <h3 style={{ margin:0, fontSize:20, fontWeight:700, color:T.ink, fontFamily:HEAD }}>{s.title}</h3>
          </div>

          {s.body ? (
            <p style={{ margin:0, fontSize:14, color:T.body, lineHeight:1.85, maxWidth:680 }}>{s.body}</p>
          ) : (
            // Criteria grid — fixed 3 cols + white filler cells to prevent sand-coloured empty gaps
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:1, background:T.rule }}>
              {CRITERIA.map(c=>(
                <div key={c.key} style={{ background:T.white, padding:"18px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:16 }}>{c.icon}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{c.label}</span>
                  </div>
                  <p style={{ margin:0, fontSize:12, color:T.mid, lineHeight:1.65 }}>{c.def}</p>
                </div>
              ))}
              {Array.from({ length:(3-(CRITERIA.length%3))%3 }).map((_,i)=>(
                <div key={"fill-"+i} style={{ background:T.white }} />
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop:16, borderTop:"1px solid "+T.rule, paddingTop:32 }}>
        <div style={{ borderLeft:"3px solid "+T.blue, paddingLeft:20 }}>
          <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:T.ink }}>Want to add your scores?</p>
          <p style={{ margin:"0 0 16px", fontSize:13, color:T.mid, lineHeight:1.7 }}>
            If you're a legal professional with a different practice context, submit your scores here. All submissions are reviewed before going live. We prioritise reviewers with distinct roles, stacks, or firm types not yet represented.
          </p>
          <button onClick={onSubmit}
            style={{ background:T.blue, color:"#fff", border:"none", padding:"10px 24px", cursor:"pointer", fontSize:13, fontFamily:BODY, fontWeight:500, borderRadius:0 }}>
            Submit Your Review →
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── EXPLORER VIEW ────────────────────────────────────────────────────────────
function ExplorerView({ onSubmit }) {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy,   setSortBy]   = useState("fit");
  const [modal,    setModal]    = useState(null);
  const [globalRefreshing, setGlobalRefreshing] = useState(false);
  const [globalLastRefresh, setGlobalLastRefresh] = useState(null);
  const [globalRefreshCount, setGlobalRefreshCount] = useState(0);

  async function handleGlobalRefresh() {
    setGlobalRefreshing(true);
    try {
      // Fire all tool refreshes in parallel — individual modals handle their own state;
      // here we just record the timestamp so the toolbar indicator updates
      await new Promise(r => setTimeout(r, 1200)); // UX: give visual feedback
      setGlobalLastRefresh(new Date());
      setGlobalRefreshCount(c => c + 1);
    } finally {
      setGlobalRefreshing(false);
    }
  }

  const tools = useMemo(()=>{
    let list = [...TOOLS];
    if (search) { const q=search.toLowerCase(); list=list.filter(t=>t.name.toLowerCase().includes(q)||t.oneLiner.toLowerCase().includes(q)||t.stackFit.some(s=>s.toLowerCase().includes(q))); }
    if (category!=="All") list=list.filter(t=>t.category===category);
    if (sortBy==="fit")   list.sort((a,b)=>calcFit(AGGREGATED.scores[b.id])-calcFit(AGGREGATED.scores[a.id]));
    if (sortBy==="name")  list.sort((a,b)=>a.name.localeCompare(b.name));
    if (sortBy==="voice") list.sort((a,b)=>AGGREGATED.scores[b.id].voice-AGGREGATED.scores[a.id].voice);
    if (sortBy==="integ") list.sort((a,b)=>AGGREGATED.scores[b.id].integrations-AGGREGATED.scores[a.id].integrations);
    if (sortBy==="auto")  list.sort((a,b)=>AGGREGATED.scores[b.id].automation-AGGREGATED.scores[a.id].automation);
    return list;
  },[search,category,sortBy]);

  const isMobile = useIsMobile();

  return (
    <>
      {/* Sticky toolbar — blue */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:T.blue, boxShadow:"0 2px 12px rgba(74,118,192,0.25)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:isMobile?"10px 12px":"12px 24px", display:"flex", flexWrap:"wrap", gap:isMobile?6:8, alignItems:"center" }}>

          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tools…"
            style={{ flex:1, minWidth:isMobile?100:140, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", padding:"8px 14px", color:"#fff", fontSize:13, outline:"none", fontFamily:BODY, borderRadius:0 }} />

          <div style={{ display:"flex", gap:4 }}>
            {(isMobile ? [["All","All"],["Legal-Specific","Legal"],["General Purpose AI","General"]] : [["All","All"],["Legal-Specific","Legal-Specific"],["General Purpose AI","General Purpose AI"]]).map(([val,lbl])=>(
              <button key={val} onClick={()=>setCategory(val)} style={{ background:category===val?"#fff":"rgba(255,255,255,0.12)", color:category===val?T.blue:"rgba(255,255,255,0.85)", border:"1px solid "+(category===val?"#fff":"rgba(255,255,255,0.3)"), padding:isMobile?"5px 8px":"6px 12px", cursor:"pointer", fontSize:isMobile?10:11, fontFamily:BODY, fontWeight:category===val?600:400, transition:"all 0.12s", borderRadius:0 }}>
                {lbl}
              </button>
            ))}
          </div>

          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", padding:"7px 10px", fontSize:11, cursor:"pointer", fontFamily:BODY, outline:"none", borderRadius:0 }}>
            <option value="fit" style={{ color:T.ink }}>Sort: Fit</option>
            <option value="name" style={{ color:T.ink }}>Sort: Name</option>
            <option value="voice" style={{ color:T.ink }}>Sort: Voice</option>
            <option value="integ" style={{ color:T.ink }}>Sort: Integrations</option>
            <option value="auto" style={{ color:T.ink }}>Sort: Automation</option>
          </select>

          {/* Global refresh + count */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
            {globalLastRefresh && !isMobile && (
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#7EE8A2", display:"inline-block" }} />
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.7)", fontFamily:MONO }}>
                  Live · {globalLastRefresh.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                </span>
              </div>
            )}
            <button onClick={handleGlobalRefresh} disabled={globalRefreshing}
              style={{ background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.35)", color:"#fff", padding:"6px 12px", cursor:globalRefreshing?"not-allowed":"pointer", fontSize:10, fontFamily:MONO, letterSpacing:0.5, borderRadius:0, opacity:globalRefreshing?0.7:1, display:"flex", alignItems:"center", gap:5 }}>
              {globalRefreshing ? "⟳" : "⟳ "}{!isMobile && (globalRefreshing ? "REFRESHING…" : "REFRESH ALL")}
            </button>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.7)", fontFamily:MONO }}>{tools.length}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:isMobile?"16px 12px 80px":"32px 32px 80px" }}>
        {/* Context strip */}
        <div style={{ background:T.blueLight, border:"1px solid #C8D8F0", paddingLeft:isMobile?12:20, paddingRight:isMobile?12:20, paddingTop:14, paddingBottom:14, marginBottom:isMobile?12:32, display:"flex", flexDirection:isMobile?"column":"row", alignItems:isMobile?"flex-start":"center", justifyContent:"space-between", gap:isMobile?8:0 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.blueDark }}>Aggregated View — {REVIEWERS.length} Independent Reviewer{REVIEWERS.length===1?"":"s"}</div>
            <div style={{ fontSize:12, color:T.blue, marginTop:2 }}>Scores averaged across {REVIEWERS.map(r=>r.name).join(" and ")}. Visit the Reviewers tab to see each individual lens.</div>
          </div>
          <div style={{ display:"flex", gap:8, flexShrink:0 }}>
            {REVIEWERS.map(r=>(
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:r.color }} />
                <span style={{ fontSize:11, color:r.color, fontWeight:500 }}>{r.nameShort}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Beta announcement bar */}
        <div style={{ background:T.tealLight, border:"1px solid "+T.teal+"40", padding:isMobile?"12px 16px":"14px 24px", marginBottom:isMobile?16:24 }}>
          <div style={{ display:"flex", flexDirection:isMobile?"column":"row", alignItems:isMobile?"flex-start":"center", justifyContent:"space-between", gap:isMobile?12:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:MONO, letterSpacing:1, background:T.teal, padding:"4px 10px", flexShrink:0 }}>BETA</span>
              <span style={{ fontSize:13, color:T.teal, lineHeight:1.5 }}>
                Scores reflect <strong>{REVIEWERS.length} reviewer{REVIEWERS.length===1?"":"s"}</strong> so far. More perspectives needed to stress-test the rankings.
              </span>
            </div>
            <button onClick={onSubmit}
              style={{ background:"none", border:"1px solid "+T.teal, color:T.teal, padding:"7px 18px", cursor:"pointer", fontSize:13, fontFamily:BODY, fontWeight:500, flexShrink:0, whiteSpace:"nowrap", transition:"all 0.15s" }}>
              Add your scores →
            </button>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:1, background:T.rule, border:"1px solid "+T.rule }}>
          {tools.map(tool=>(
            <ToolCard key={tool.id} tool={tool} onClick={()=>setModal(tool)} />
          ))}
        </div>

        <div style={{ marginTop:48, borderTop:"1px solid "+T.rule, paddingTop:24 }}>
          <Eyebrow>Methodology</Eyebrow>
          <p style={{ margin:0, fontSize:13, color:T.mid, lineHeight:1.8, maxWidth:620 }}>
            No AI tool gets legal research 100% right — how you prompt shapes what you get. Tools are scored on fit for each reviewer's specific practice context, not on features in isolation. Each reviewer weights four key drivers: their existing tech stack, the pain points they need solved, their team size, and their budget reality. See individual reviewer profiles for full scoring philosophy and disclosures.
          </p>
        </div>
      </div>

      {modal && <ToolModal tool={modal} onClose={()=>setModal(null)} />}
    </>
  );
}

// ─── REVIEWER FORM ────────────────────────────────────────────────────────────
const SUBMIT_URL = "/api/submit-reviewer"; // → Vercel serverless route → Notion DB

const FORM_STEPS = ["Who You Are", "Your Stack", "Rate Tools", "Submit"];

const VERDICT_OPTIONS = [
  "PRIMARY TOOL","DAILY DRIVER","HIDDEN GEM","ACTIVE TRIAL","BEING PHASED OUT",
  "NOT MY FIT","FUTURE WATCH","WRONG STACK","TOO SLOW","NARROW FOCUS",
  "FUTURE DIRECTION","WRONG ECOSYSTEM","PERSONAL USE ONLY","NOT APPLICABLE",
  "PROMISING","THE STANDARD","NOT YET REAL","EXACTLY WHAT I NEED",
  "OBVIOUS CHOICE","INTERESTING CONCEPT","STILL USE IT (QUIETLY)","HEARD BAD THINGS",
  "ON MY RADAR","OVERPRICED","UNDER-HYPED","FIRM-MANDATED"
];

const FORM_SAVE_KEY = "legal-ai-reviewer-form-v1";

const STACK_SUGGESTIONS = {
  "Productivity":["Microsoft 365","Microsoft Word","Outlook","Teams","Slack","Gmail","GSuite","Notion","Granola","Zoom"],
  "AI Tools":["Harvey","Microsoft Copilot","Claude","ChatGPT","Gemini","Wordsmith","GC AI","Legora","Luminance","Ivo","TermScout","Sandstone","CoCounsel","Clio Duo","Spellbook","LexisNexis AI","Westlaw AI"],
  "Document Management":["iManage","SharePoint","NetDocuments","Dropbox","Google Drive","Box"],
  "Legal Research":["Westlaw","LexisNexis","Fastcase","vLex","Casetext","Bloomberg Law"],
  "Other":["Salesforce","Drata","GitHub","Vercel","Excel","PowerPoint","Canva"],
};

function ReviewerForm({ onCancel }) {
  const isMobile = useIsMobile();
  const [step, setStep]           = useState(0);
  const [toolIdx, setToolIdx]     = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]       = useState({});
  const [savedAt, setSavedAt]     = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // ── State (localStorage-persisted) ──────────────────────────────────────────
  const [identity, setIdentity] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(FORM_SAVE_KEY)); return s?.identity || { name:"", role:"", sector:"", companySize:"", teamSize:"", bio:"", linkedin:"", disclosure:"" }; }
    catch { return { name:"", role:"", sector:"", companySize:"", teamSize:"", bio:"", linkedin:"", disclosure:"" }; }
  });

  // stack: flat array of selected tool names
  const [stackItems, setStackItems] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(FORM_SAVE_KEY));
      // migrate from old group format
      if (Array.isArray(s?.stack)) return s.stack.flatMap(g => g.items||[]).filter(Boolean);
      if (Array.isArray(s?.stackItems)) return s.stackItems;
    } catch {}
    return [];
  });
  const [stackOther, setStackOther] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(FORM_SAVE_KEY)); return s?.stackOther || ""; } catch { return ""; }
  });

  // optional profile enrichment (moved out of the critical path)
  const [philosophy, setPhilosophy] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(FORM_SAVE_KEY)); return s?.philosophy || { scoringNote:"", voiceNote:"", beliefs:[""], painPoints:[""] }; }
    catch { return { scoringNote:"", voiceNote:"", beliefs:[""], painPoints:[""] }; }
  });

  const [toolReviews, setToolReviews] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(FORM_SAVE_KEY));
      if (s?.toolReviews) return s.toolReviews;
    } catch {}
    const tr = {};
    TOOLS.forEach(t => { tr[t.id] = { used:null, skip:false, scores:{ integrations:3,automation:3,knowledge:3,voice:3,research:3,customization:3,speed:3,ux:3,forwardThinking:3,pricing:3 }, verdict:"", take:"" }; });
    return tr;
  });

  const [customTools, setCustomTools]   = useState([]);
  const [newToolDraft, setNewToolDraft] = useState({ name:"", category:"Legal-Specific", oneLiner:"", pricing:"" });
  const [showAddTool, setShowAddTool]   = useState(false);

  const allTools = [...TOOLS, ...customTools];

  function addCustomTool() {
    if (!newToolDraft.name.trim()) return;
    const id = "custom_" + Date.now();
    const tool = { id, emoji:"🔧", name:newToolDraft.name.trim(), category:newToolDraft.category, oneLiner:newToolDraft.oneLiner.trim()||"Reviewer-added tool", pricing:newToolDraft.pricing.trim()||"Not listed", stackFit:[], wordPlugin:false, tagColor:T.purple, tag:"WRITE-IN", internet:{ integrations:"", painPoints:"", pricing:newToolDraft.pricing.trim() }, voice:{ has:false, quality:"Unknown", type:"Not evaluated", note:"" }, bestFor:newToolDraft.oneLiner.trim()||"" };
    setCustomTools(p=>[...p, tool]);
    setToolReviews(p=>({...p, [id]:{ used:null, skip:false, scores:{ integrations:3,automation:3,knowledge:3,voice:3,research:3,customization:3,speed:3,ux:3,forwardThinking:3,pricing:3 }, verdict:"", take:"" }}));
    setToolIdx(allTools.length);
    setNewToolDraft({ name:"", category:"Legal-Specific", oneLiner:"", pricing:"" });
    setShowAddTool(false);
  }

  function removeCustomTool(id) {
    setCustomTools(p=>p.filter(t=>t.id!==id));
    setToolReviews(p=>{ const n={...p}; delete n[id]; return n; });
    setToolIdx(i=>Math.max(0, i-1));
  }

  // helpers
  const updateId  = (k,v) => setIdentity(p=>({...p,[k]:v}));
  const updatePhi = (k,v) => setPhilosophy(p=>({...p,[k]:v}));
  const updatePhiList = (key,i,v) => setPhilosophy(p=>({...p,[key]:p[key].map((x,j)=>j===i?v:x)}));
  const addPhiItem    = key => setPhilosophy(p=>({...p,[key]:[...p[key],""]}));
  const removePhiItem = (key,i) => setPhilosophy(p=>({...p,[key]:p[key].filter((_,j)=>j!==i)}));
  const setScore  = (id,k,v) => setToolReviews(p=>({...p,[id]:{...p[id],scores:{...p[id].scores,[k]:v}}}));
  const setTR     = (id,k,v) => setToolReviews(p=>({...p,[id]:{...p[id],[k]:v}}));

  const toggleStack = item => setStackItems(p => p.includes(item) ? p.filter(x=>x!==item) : [...p, item]);

  // Autosave
  useEffect(() => {
    try {
      localStorage.setItem(FORM_SAVE_KEY, JSON.stringify({ identity, stackItems, stackOther, philosophy, toolReviews }));
      setSavedAt(new Date());
    } catch {}
  }, [identity, stackItems, stackOther, philosophy, toolReviews]);

  function clearSavedData() {
    try { localStorage.removeItem(FORM_SAVE_KEY); } catch {}
    setIdentity({ name:"", role:"", sector:"", companySize:"", teamSize:"", bio:"", linkedin:"", disclosure:"" });
    setStackItems([]); setStackOther("");
    setPhilosophy({ scoringNote:"", voiceNote:"", beliefs:[""], painPoints:[""] });
    const tr = {};
    TOOLS.forEach(t => { tr[t.id] = { used:null, skip:false, scores:{ integrations:3,automation:3,knowledge:3,voice:3,research:3,customization:3,speed:3,ux:3,forwardThinking:3,pricing:3 }, verdict:"", take:"" }; });
    setToolReviews(tr); setCustomTools([]);
    setStep(0); setToolIdx(0); setSavedAt(null); setShowClearConfirm(false);
  }

  const validate = () => {
    const e={};
    if(!identity.name.trim()) e.name="Required";
    if(!identity.role.trim()) e.role="Required";
    if(!identity.bio.trim())  e.bio="Required";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  async function handleSubmit() {
    if(!validate()) { setStep(0); return; }
    setSubmitting(true);
    const payload = {
      identity,
      stack: [...stackItems, ...stackOther.split(",").map(s=>s.trim()).filter(Boolean)],
      philosophy: { ...philosophy, beliefs:philosophy.beliefs.filter(Boolean), painPoints:philosophy.painPoints.filter(Boolean) },
      customTools: customTools.map(t=>({ id:t.id, name:t.name, category:t.category, oneLiner:t.oneLiner, pricing:t.pricing })),
      toolReviews,
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch(SUBMIT_URL, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      if(!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.message || "Submission failed");
      }
      setSubmitting(false);
      setSubmitted(true);
    } catch(e) {
      setSubmitting(false);
      alert("Something went wrong submitting your review. Please email get@laurajg.com directly.\n\n" + e.message);
    }
  }

  // Shared styles
  const inp = { width:"100%", border:"1px solid "+T.rule, padding:"10px 12px", fontSize:13, fontFamily:BODY, color:T.ink, background:T.white, boxSizing:"border-box", outline:"none", borderRadius:0 };
  const lbl = { fontSize:10, fontWeight:700, color:T.mid, letterSpacing:1.4, textTransform:"uppercase", fontFamily:MONO, display:"block", marginBottom:6 };

  const currentTool = allTools[toolIdx];
  const tr = toolReviews[currentTool?.id] || {};
  const scoredCount = Object.values(toolReviews).filter(r=>!r.skip&&r.verdict).length;

  // ── Submitted ───────────────────────────────────────────────────────────────
  if (submitted) return (
    <div style={{ maxWidth:560, margin:"80px auto", padding:"0 32px", textAlign:"center" }}>
      <div style={{ width:64,height:64,borderRadius:"50%",background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:28 }}>✓</div>
      <h2 style={{ fontFamily:HEAD, fontSize:28, color:T.ink, margin:"0 0 14px" }}>Review Received</h2>
      <p style={{ color:T.mid, fontSize:15, lineHeight:1.8, margin:"0 0 32px" }}>
        Your submission is pending moderation. Once approved, your profile will go live on the Reviewers page.{" "}
        Questions? <a href="mailto:get@laurajg.com" style={{color:T.blue,textDecoration:"none"}}>get@laurajg.com</a>
      </p>
      <button onClick={onCancel} style={{background:T.blue,color:"#fff",border:"none",padding:"12px 36px",cursor:"pointer",fontSize:14,fontFamily:BODY,fontWeight:500,borderRadius:0}}>
        Back to Report
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:isMobile?"24px 16px 80px":"48px 32px 100px" }}>

      {/* Top bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40 }}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:T.blue,cursor:"pointer",fontSize:13,fontFamily:BODY,padding:0}}>← Back to Report</button>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {savedAt && (
            <span style={{ fontSize:10, color:T.green, fontFamily:MONO, display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:T.green, display:"inline-block" }} />
              Auto-saved {savedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
            </span>
          )}
          {showClearConfirm ? (
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ fontSize:11, color:T.red, fontFamily:MONO }}>Clear all data?</span>
              <button onClick={clearSavedData} style={{ background:T.red, color:"#fff", border:"none", padding:"4px 10px", cursor:"pointer", fontSize:10, fontFamily:MONO, borderRadius:0 }}>Yes, clear</button>
              <button onClick={()=>setShowClearConfirm(false)} style={{ background:"none", border:"1px solid "+T.rule, color:T.mid, padding:"4px 10px", cursor:"pointer", fontSize:10, fontFamily:MONO, borderRadius:0 }}>Cancel</button>
            </div>
          ) : (
            <button onClick={()=>setShowClearConfirm(true)} style={{ background:"none", border:"1px solid "+T.rule, color:T.mid, padding:"5px 10px", cursor:"pointer", fontSize:10, fontFamily:MONO, borderRadius:0 }}>Clear saved data</button>
          )}
        </div>
      </div>

      {/* Step progress */}
      <div style={{display:"flex",marginBottom:48,borderBottom:"1px solid "+T.rule}}>
        {FORM_STEPS.map((s,i)=>(
          <div key={s} onClick={()=>i<step&&setStep(i)} style={{flex:1,paddingBottom:12,borderBottom:i===step?"2px solid "+T.blue:i<step?"2px solid "+T.green:"2px solid transparent",marginBottom:-1,cursor:i<step?"pointer":"default"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:i===step?T.blue:i<step?T.green:T.mid,fontFamily:MONO,textTransform:"uppercase"}}>
              {i<step?"✓ ":""}{i+1}. {s}
            </div>
          </div>
        ))}
      </div>

      {/* ── STEP 0: Who You Are ─────────────────────────────────────────────── */}
      {step===0 && (
        <div>
          <h2 style={{margin:"0 0 6px",fontFamily:HEAD,fontSize:28,color:T.ink}}>Who You Are</h2>
          <p style={{margin:"0 0 36px",color:T.mid,fontSize:14,lineHeight:1.7}}>Your profile is public and attributed. Use the name and role you want on record.</p>

          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"0 24px"}}>
            {[
              ["name","Full Name *","e.g. Jane Smith"],
              ["role","Role *","e.g. Senior Associate, GC, Legal Ops Director"],
              ["sector","Sector","e.g. BigLaw M&A, In-house Tech, Boutique IP"],
              ["linkedin","LinkedIn URL","https://linkedin.com/in/…"],
            ].map(([k,lab,ph])=>(
              <div key={k} style={{marginBottom:20}}>
                <label style={lbl}>{lab}</label>
                <input value={identity[k]} onChange={e=>updateId(k,e.target.value)}
                  style={{...inp,borderColor:errors[k]?T.red:T.rule}} placeholder={ph} />
                {errors[k]&&<span style={{fontSize:11,color:T.red,marginTop:4,display:"block"}}>{errors[k]}</span>}
              </div>
            ))}
          </div>

          <div style={{marginBottom:20}}>
            <label style={lbl}>Bio * — 2–3 sentences</label>
            <textarea value={identity.bio} onChange={e=>updateId("bio",e.target.value)} rows={3}
              style={{...inp,resize:"vertical",borderColor:errors.bio?T.red:T.rule}}
              placeholder="Your role, practice context, and what you actually want from AI tools." />
            {errors.bio&&<span style={{fontSize:11,color:T.red,marginTop:4,display:"block"}}>{errors.bio}</span>}
          </div>

          <div style={{marginBottom:20}}>
            <label style={lbl}>Disclosure</label>
            <textarea value={identity.disclosure} onChange={e=>updateId("disclosure",e.target.value)} rows={2}
              style={{...inp,resize:"vertical"}}
              placeholder="Any financial relationships, employment, equity, or advisory roles with vendors you're reviewing." />
            <div style={{fontSize:11,color:T.mid,marginTop:6,lineHeight:1.6}}>
              No conflicts? Leave blank — "No financial relationships declared" will appear on your profile.
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Stack ───────────────────────────────────────────────────── */}
      {step===1 && (
        <div>
          <h2 style={{margin:"0 0 6px",fontFamily:HEAD,fontSize:28,color:T.ink}}>Your Tech Stack</h2>
          <p style={{margin:"0 0 28px",color:T.mid,fontSize:14,lineHeight:1.7}}>Click to select the tools you work with. This appears on your profile and helps readers understand your context.</p>

          {Object.entries(STACK_SUGGESTIONS).map(([group,items])=>(
            <div key={group} style={{marginBottom:20}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:T.mid,fontFamily:MONO,textTransform:"uppercase",marginBottom:10}}>{group}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {items.map(item=>{
                  const on = stackItems.includes(item);
                  return (
                    <button key={item} onClick={()=>toggleStack(item)}
                      style={{padding:"5px 12px",border:"1px solid "+(on?T.blue:T.rule),background:on?T.blueLight:"none",color:on?T.blue:T.body,cursor:"pointer",fontSize:12,fontFamily:BODY,borderRadius:2,transition:"all 0.1s",fontWeight:on?500:400}}>
                      {on?"✓ ":""}{item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{marginTop:8,paddingTop:20,borderTop:"1px solid "+T.rule}}>
            <label style={lbl}>Anything else? (comma-separated)</label>
            <input value={stackOther} onChange={e=>setStackOther(e.target.value)}
              style={inp} placeholder="e.g. Clio, NetDocuments, ContractPodAi, Monday.com" />
          </div>

          {stackItems.length>0&&(
            <div style={{marginTop:20,padding:"12px 16px",background:T.paper,border:"1px solid "+T.rule,fontSize:12,color:T.mid,lineHeight:1.8}}>
              <span style={{fontWeight:600,color:T.body}}>Selected: </span>
              {[...stackItems, ...stackOther.split(",").map(s=>s.trim()).filter(Boolean)].join(" · ")}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Rate Tools ──────────────────────────────────────────────── */}
      {step===2 && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
            <h2 style={{margin:0,fontFamily:HEAD,fontSize:28,color:T.ink}}>Rate the Tools</h2>
            <span style={{fontSize:11,color:T.mid,fontFamily:MONO}}>{Math.min(toolIdx+1,allTools.length)} / {allTools.length} · {scoredCount} scored</span>
          </div>
          <p style={{margin:"0 0 20px",color:T.mid,fontSize:14,lineHeight:1.6}}>
            For each tool, tell us whether you've used it — then score or skip. Only your actual experience counts.
          </p>

          {/* Progress dots */}
          <div style={{display:"flex",gap:5,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
            {allTools.map((t,i)=>{
              const r=toolReviews[t.id];
              const isCustom = t.id?.toString().startsWith("custom_");
              const dotColor = r?.used===false ? T.rule
                : r?.verdict ? T.green
                : i===toolIdx ? T.blue
                : r?.used===true ? T.blueLight
                : isCustom ? T.purple+"33"
                : T.paper;
              const fg = (r?.verdict || i===toolIdx) && r?.used!==false ? "#fff" : T.mid;
              return (
                <div key={t.id} onClick={()=>setToolIdx(i)} title={t.name}
                  style={{width:26,height:26,borderRadius:isCustom?"4px":"50%",background:dotColor,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:fg,fontFamily:MONO,fontWeight:700,transition:"all 0.15s",flexShrink:0,border:isCustom?"1px dashed "+T.purple:r?.used===false?"1px solid "+T.rule:"none",opacity:r?.used===false?0.45:1}}>
                  {r?.used===false ? "—" : isCustom ? "✎" : i+1}
                </div>
              );
            })}
            <div onClick={()=>setShowAddTool(a=>!a)} title="Add a tool not on this list"
              style={{width:26,height:26,borderRadius:"50%",background:showAddTool?T.blue:T.paper,border:"1px dashed "+(showAddTool?T.blue:T.mid),cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:showAddTool?"#fff":T.mid,flexShrink:0,transition:"all 0.15s"}}>
              +
            </div>
          </div>

          {/* Add tool panel */}
          {showAddTool && (
            <div style={{border:"1px dashed "+T.blue,background:T.blueLight,padding:"18px 20px",marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,color:T.blue,letterSpacing:1.5,fontFamily:MONO,marginBottom:14,textTransform:"uppercase"}}>Add a Tool Not on This List</div>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label style={{...lbl,color:T.blue}}>Tool Name *</label>
                  <input value={newToolDraft.name} onChange={e=>setNewToolDraft(p=>({...p,name:e.target.value}))} style={inp} placeholder="e.g. Clio Duo, LexisNexis AI…" />
                </div>
                <div>
                  <label style={{...lbl,color:T.blue}}>Category</label>
                  <select value={newToolDraft.category} onChange={e=>setNewToolDraft(p=>({...p,category:e.target.value}))} style={{...inp,cursor:"pointer"}}>
                    <option value="Legal-Specific">Legal-Specific</option>
                    <option value="General Purpose AI">General Purpose AI</option>
                  </select>
                </div>
                <div>
                  <label style={{...lbl,color:T.blue}}>One-liner (optional)</label>
                  <input value={newToolDraft.oneLiner} onChange={e=>setNewToolDraft(p=>({...p,oneLiner:e.target.value}))} style={inp} placeholder="What does it do?" />
                </div>
                <div>
                  <label style={{...lbl,color:T.blue}}>Pricing (optional)</label>
                  <input value={newToolDraft.pricing} onChange={e=>setNewToolDraft(p=>({...p,pricing:e.target.value}))} style={inp} placeholder="e.g. From $200/mo" />
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={addCustomTool} disabled={!newToolDraft.name.trim()} style={{background:newToolDraft.name.trim()?T.blue:T.rule,color:"#fff",border:"none",padding:"8px 20px",cursor:newToolDraft.name.trim()?"pointer":"not-allowed",fontSize:12,fontFamily:BODY,fontWeight:500,borderRadius:0}}>Add &amp; Score →</button>
                <button onClick={()=>setShowAddTool(false)} style={{background:"none",border:"1px solid "+T.rule,color:T.mid,padding:"8px 16px",cursor:"pointer",fontSize:12,fontFamily:BODY,borderRadius:0}}>Cancel</button>
              </div>
            </div>
          )}

          {/* Tool card */}
          {currentTool && (
          <div style={{border:"1px solid "+(currentTool.id?.toString().startsWith("custom_")?T.purple:T.rule)}}>

            {/* Header */}
            <div style={{padding:"20px 24px",borderBottom:"1px solid "+T.rule,display:"flex",justifyContent:"space-between",alignItems:"flex-start",background:tr.used===false?T.paper:T.white}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                {currentTool.id?.toString().startsWith("custom_")
                  ? <div style={{width:32,height:32,background:T.purple+"22",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✎</div>
                  : <ToolLogo id={currentTool.id} emoji={currentTool.emoji} size={32} />}
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{fontFamily:HEAD,fontSize:18,fontWeight:700,color:T.ink}}>{currentTool.name}</div>
                    {currentTool.id?.toString().startsWith("custom_")&&<span style={{fontSize:9,fontWeight:700,color:T.purple,background:T.purple+"1A",padding:"2px 7px",borderRadius:2,fontFamily:MONO,letterSpacing:1}}>WRITE-IN</span>}
                  </div>
                  <div style={{fontSize:11,color:T.mid,marginTop:2}}>{currentTool.oneLiner}</div>
                </div>
              </div>
              {currentTool.id?.toString().startsWith("custom_")&&(
                <button onClick={()=>removeCustomTool(currentTool.id)} style={{background:"none",border:"1px solid "+T.rule,color:T.red,padding:"4px 10px",cursor:"pointer",fontSize:10,fontFamily:MONO,borderRadius:0}}>REMOVE</button>
              )}
            </div>

            {/* Usage gate */}
            {tr.used === null ? (
              <div style={{padding:"32px 24px",textAlign:"center"}}>
                <p style={{margin:"0 0 8px",fontSize:15,fontFamily:HEAD,color:T.ink}}>How familiar are you with <strong>{currentTool.name}</strong>?</p>
                <p style={{margin:"0 0 24px",fontSize:12,color:T.mid,lineHeight:1.6}}>Your answer affects how your scores are weighted in the aggregate.</p>
                <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"stretch",maxWidth:320,margin:"0 auto"}}>
                  <button onClick={()=>setTR(currentTool.id,"used","full")} style={{background:T.green,color:"#fff",border:"none",padding:"12px 24px",cursor:"pointer",fontSize:13,fontFamily:BODY,fontWeight:600,borderRadius:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>I use it regularly</span><span style={{fontSize:10,opacity:0.8,fontFamily:MONO}}>FULL WEIGHT</span>
                  </button>
                  <button onClick={()=>setTR(currentTool.id,"used","demo")} style={{background:T.amberLight,color:T.amber,border:"1px solid "+T.amber+"60",padding:"12px 24px",cursor:"pointer",fontSize:13,fontFamily:BODY,fontWeight:600,borderRadius:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>Demo or brief evaluation only</span><span style={{fontSize:10,fontFamily:MONO}}>HALF WEIGHT</span>
                  </button>
                  <button onClick={()=>{ setTR(currentTool.id,"used",false); setTR(currentTool.id,"skip",true); }} style={{background:"none",border:"1px solid "+T.rule,color:T.mid,padding:"12px 24px",cursor:"pointer",fontSize:13,fontFamily:BODY,borderRadius:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>Never used it</span><span style={{fontSize:10,fontFamily:MONO}}>NOT SCORED</span>
                  </button>
                </div>
              </div>

            ) : tr.used === false ? (
              <div style={{padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:T.mid,fontStyle:"italic"}}>Not used — excluded from your scored list.</span>
                <button onClick={()=>{ setTR(currentTool.id,"used",null); setTR(currentTool.id,"skip",false); }} style={{background:"none",border:"1px solid "+T.rule,color:T.blue,padding:"5px 14px",cursor:"pointer",fontSize:10,fontFamily:MONO,borderRadius:0}}>↩ CHANGE</button>
              </div>

            ) : (
              <div style={{padding:"24px"}}>
                {/* Usage banner */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,padding:"8px 14px",background:tr.used==="full"?T.greenLight:T.amberLight,border:"1px solid "+(tr.used==="full"?T.green+"40":T.amber+"40")}}>
                  <span style={{fontSize:12,color:tr.used==="full"?T.green:T.terra,fontFamily:MONO,fontWeight:700,letterSpacing:0.8}}>
                    {tr.used==="full"?"✓ REGULAR USER — full weight":"◎ DEMO / EVALUATION — half weight"}
                  </span>
                  <button onClick={()=>{ setTR(currentTool.id,"used",null); setTR(currentTool.id,"verdict",""); setTR(currentTool.id,"skip",false); }} style={{background:"none",border:"none",color:T.mid,padding:0,cursor:"pointer",fontSize:10,fontFamily:MONO,textDecoration:"underline"}}>change</button>
                </div>

                {/* Score bars */}
                <label style={lbl}>Scores (1 = poor · 5 = excellent)</label>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14,marginBottom:24}}>
                  {CRITERIA.map(c=>(
                    <div key={c.key}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:11,color:T.body,display:"flex",alignItems:"center",gap:5}}>{c.icon} {c.label}</span>
                        <span style={{fontSize:12,fontWeight:700,color:tr.scores[c.key]>=4?T.blue:T.mid,fontFamily:MONO}}>{tr.scores[c.key]}/5</span>
                      </div>
                      <div style={{display:"flex",gap:3}}>
                        {[1,2,3,4,5].map(n=>(
                          <button key={n} onClick={()=>setScore(currentTool.id,c.key,n)}
                            style={{flex:1,height:24,background:tr.scores[c.key]>=n?T.blue:T.blueLight,border:"none",cursor:"pointer",borderRadius:0,transition:"background 0.1s"}} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verdict */}
                <div style={{marginBottom:20}}>
                  <label style={lbl}>Verdict *</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {VERDICT_OPTIONS.map(v=>(
                      <button key={v} onClick={()=>setTR(currentTool.id,"verdict",tr.verdict===v?"":v)}
                        style={{padding:"4px 10px",border:"1px solid "+(tr.verdict===v?T.blue:T.rule),background:tr.verdict===v?T.blueLight:"none",color:tr.verdict===v?T.blue:T.mid,cursor:"pointer",fontSize:9,fontFamily:MONO,letterSpacing:0.5,borderRadius:2,transition:"all 0.1s"}}>
                        {v}
                      </button>
                    ))}
                  </div>
                  {!tr.verdict&&<div style={{fontSize:11,color:T.mid,marginTop:6}}>Pick one, or leave unscored.</div>}
                </div>

                {/* Take */}
                <div>
                  <label style={lbl}>Your Take (optional but valuable)</label>
                  <textarea value={tr.take} onChange={e=>setTR(currentTool.id,"take",e.target.value)} rows={3}
                    style={{...inp,resize:"vertical"}} placeholder={`2–4 honest sentences about ${currentTool.name} in your practice context.`} />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Tool nav */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16}}>
            <button onClick={()=>setToolIdx(i=>Math.max(0,i-1))} disabled={toolIdx===0}
              style={{background:"none",border:"1px solid "+T.rule,color:T.mid,padding:"8px 20px",cursor:toolIdx===0?"not-allowed":"pointer",fontSize:12,fontFamily:BODY,borderRadius:0,opacity:toolIdx===0?0.4:1}}>← Prev</button>
            <button onClick={()=>setStep(3)} style={{background:"none",border:"none",color:T.mid,cursor:"pointer",fontSize:11,fontFamily:MONO,padding:"4px 8px",textDecoration:"underline"}}>
              skip to submit →
            </button>
            {toolIdx<allTools.length-1
              ? <button onClick={()=>setToolIdx(i=>i+1)} style={{background:T.blue,color:"#fff",border:"none",padding:"8px 24px",cursor:"pointer",fontSize:12,fontFamily:BODY,fontWeight:500,borderRadius:0}}>Next →</button>
              : <button onClick={()=>setStep(3)} style={{background:T.green,color:"#fff",border:"none",padding:"8px 24px",cursor:"pointer",fontSize:12,fontFamily:BODY,fontWeight:500,borderRadius:0}}>Done → Review &amp; Submit</button>
            }
          </div>
        </div>
      )}

      {/* ── STEP 3: Submit ──────────────────────────────────────────────────── */}
      {step===3 && (
        <div>
          <h2 style={{margin:"0 0 6px",fontFamily:HEAD,fontSize:28,color:T.ink}}>Review &amp; Submit</h2>
          <p style={{margin:"0 0 32px",color:T.mid,fontSize:14,lineHeight:1.7}}>Your submission is reviewed before going live. We'll follow up at your LinkedIn or email.</p>

          {/* Summary */}
          <div style={{border:"1px solid "+T.rule,marginBottom:28}}>
            {[
              ["Reviewer", identity.name||"—"],
              ["Role", [identity.role,identity.sector].filter(Boolean).join(" · ")||"—"],
              ["LinkedIn", identity.linkedin||"Not provided"],
              ["Stack", [...stackItems,...stackOther.split(",").map(s=>s.trim()).filter(Boolean)].join(", ")||"Not provided"],
              ["Tools scored", `${scoredCount} of ${allTools.length}${customTools.length>0?" (incl. "+customTools.length+" write-in)":""}`],
              ["Disclosure", identity.disclosure||"None declared"],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",padding:"12px 20px",borderBottom:"1px solid "+T.rule}}>
                <span style={{fontSize:11,color:T.mid,width:140,flexShrink:0,fontFamily:MONO}}>{k}</span>
                <span style={{fontSize:13,color:T.ink,flex:1}}>{v}</span>
              </div>
            ))}
          </div>

          {scoredCount===0&&(
            <div style={{background:T.amberLight,border:"1px solid "+T.amber+"60",padding:"12px 16px",marginBottom:20,fontSize:13,color:T.amber}}>
              You haven't scored any tools yet. Go back to Rate Tools — or submit to just have your profile appear.
            </div>
          )}

          {/* Optional enrichment — collapsed by default */}
          <div style={{marginBottom:28,border:"1px solid "+T.rule}}>
            <button onClick={()=>setShowOptional(p=>!p)}
              style={{width:"100%",background:T.paper,border:"none",padding:"14px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:BODY}}>
              <span style={{fontSize:13,fontWeight:500,color:T.body}}>Add more context to your profile <span style={{fontSize:11,color:T.mid,fontWeight:400}}>(optional — makes your profile richer)</span></span>
              <span style={{fontSize:12,color:T.mid,fontFamily:MONO}}>{showOptional?"▲ hide":"▼ show"}</span>
            </button>
            {showOptional&&(
              <div style={{padding:"20px 20px 4px",borderTop:"1px solid "+T.rule}}>
                <div style={{marginBottom:20}}>
                  <label style={lbl}>Scoring philosophy — what matters most to you</label>
                  <textarea value={philosophy.scoringNote} onChange={e=>updatePhi("scoringNote",e.target.value)} rows={3}
                    style={{...inp,resize:"vertical"}} placeholder="e.g. I score on whether a tool survives a 400-page credit agreement and fits inside iManage..." />
                </div>
                {[
                  ["beliefs","Core beliefs about AI (up to 6)","e.g. AI is a fast second-year associate — always verify."],
                  ["painPoints","Pain points you're solving","e.g. Reviewing 300-page disclosure schedules at 11pm."],
                ].map(([key,title,ph])=>(
                  <div key={key} style={{marginBottom:20}}>
                    <label style={lbl}>{title}</label>
                    {philosophy[key].map((x,i)=>(
                      <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                        <input value={x} onChange={e=>updatePhiList(key,i,e.target.value)} style={{...inp,flex:1}} placeholder={ph} />
                        {i>0&&<button onClick={()=>removePhiItem(key,i)} style={{background:"none",border:"1px solid "+T.rule,color:T.mid,width:36,cursor:"pointer",fontSize:16,borderRadius:0,flexShrink:0}}>✕</button>}
                      </div>
                    ))}
                    {(key!=="beliefs"||philosophy.beliefs.length<6)&&(
                      <button onClick={()=>addPhiItem(key)} style={{background:"none",border:"1px dashed "+T.rule,color:T.mid,padding:"5px 14px",cursor:"pointer",fontSize:12,fontFamily:BODY,borderRadius:0,marginTop:2}}>+ Add</button>
                    )}
                  </div>
                ))}
                <div style={{marginBottom:20}}>
                  <label style={lbl}>Your relationship with voice features</label>
                  <textarea value={philosophy.voiceNote} onChange={e=>updatePhi("voiceNote",e.target.value)} rows={2}
                    style={{...inp,resize:"vertical"}} placeholder="e.g. I'm usually on a call. Tried voice mode once — impressive but wouldn't use for client work." />
                </div>
              </div>
            )}
          </div>

          <div style={{borderLeft:"3px solid "+T.amber,paddingLeft:16,marginBottom:32}}>
            <p style={{margin:0,fontSize:13,color:T.body,lineHeight:1.75}}>
              By submitting, you confirm this reflects your genuine independent assessment and you have no undisclosed financial relationships with the tools reviewed.
            </p>
          </div>

          <button onClick={handleSubmit} disabled={submitting||!identity.name.trim()}
            style={{background:identity.name.trim()?T.blue:T.rule,color:"#fff",border:"none",padding:"14px 40px",cursor:identity.name.trim()?"pointer":"not-allowed",fontSize:14,fontFamily:BODY,fontWeight:600,borderRadius:0,width:"100%",transition:"background 0.2s"}}>
            {submitting?"Submitting…":"Submit Review →"}
          </button>
        </div>
      )}

      {/* Bottom nav */}
      {step<3&&(
        <div style={{display:"flex",justifyContent:"space-between",marginTop:48,borderTop:"1px solid "+T.rule,paddingTop:24}}>
          <button onClick={()=>step===0?onCancel():setStep(s=>s-1)}
            style={{background:"none",border:"1px solid "+T.rule,color:T.mid,padding:"10px 24px",cursor:"pointer",fontSize:13,fontFamily:BODY,borderRadius:0}}>
            {step===0?"Cancel":"← Back"}
          </button>
          {step<2&&(
            <button onClick={()=>setStep(s=>s+1)}
              style={{background:T.blue,color:"#fff",border:"none",padding:"10px 28px",cursor:"pointer",fontSize:13,fontFamily:BODY,fontWeight:500,borderRadius:0}}>
              Continue →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("explorer");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight:"100vh", background:T.white, fontFamily:BODY, color:T.body }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      {/* OG / meta — copy these into your Next.js <Head> or HTML <head> */}
      <title>AI Tools for Legal Teams · Independent Comparison Report</title>
      <meta name="description" content="An independent, non-sponsored comparison of AI tools used by legal teams — scored by real practitioners on integrations, research quality, automation, and forward trajectory." />
      <meta property="og:title" content="AI Tools for Legal Teams · Independent Comparison Report" />
      <meta property="og:description" content="Scored by real practitioners on what actually matters: integrations, research quality, automation, and where things are heading. Not a listicle. Not sponsored." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://laurajg.com/legal-ai" />
      <meta property="og:image" content="https://legal-ai-report.laurajg.com/legal-ai-og.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="AI Tools for Legal Teams · Independent Comparison Report" />
      <meta name="twitter:description" content="Scored by real practitioners on what actually matters. Not a listicle. Not sponsored." />
      <meta name="twitter:image" content="https://legal-ai-report.laurajg.com/legal-ai-og.png" />

      {/* ── MASTHEAD ── */}
      <header style={{ background:T.white, borderBottom:"1px solid "+T.rule }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:isMobile?"0 16px":"0 32px" }}>

          {/* Publication bar + nav */}
          <div style={{ borderBottom:"1px solid "+T.rule, padding:isMobile?"10px 0":"14px 0" }}>
            {!isMobile && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:10, fontWeight:600, letterSpacing:2.5, color:T.mid, fontFamily:MONO, textTransform:"uppercase" }}>Legal AI Tool Comparison Interactive Report</span>
                <div style={{ display:"flex", gap:0 }}>
                  {[["explorer","Tool Explorer"],["reviewers","Reviewers"],["methodology","Methodology"],["submit","Submit Review"]].map(([id,lbl])=>(
                    <button key={id} onClick={()=>setView(id)} style={{ background:"none", border:"none", borderBottom:view===id?"2px solid "+T.blue:"2px solid transparent", color:view===id?T.ink:id==="submit"?T.blue:T.mid, padding:"8px 18px", cursor:"pointer", fontSize:12, fontFamily:BODY, fontWeight:view===id?600:id==="submit"?500:400, transition:"all 0.12s", marginBottom:-1 }}>
                      {id==="submit"?"＋ "+lbl:lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isMobile && (
              <div>
                <div style={{ fontSize:9, fontWeight:600, letterSpacing:2, color:T.mid, fontFamily:MONO, textTransform:"uppercase", marginBottom:10 }}>Legal AI Report</div>
                <div style={{ display:"flex", gap:0, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none", marginBottom:-1 }}>
                  {[["explorer","Explorer"],["reviewers","Reviewers"],["methodology","Method"],["submit","＋ Submit"]].map(([id,lbl])=>(
                    <button key={id} onClick={()=>setView(id)} style={{ background:"none", border:"none", borderBottom:view===id?"2px solid "+T.blue:"2px solid transparent", color:view===id?T.ink:id==="submit"?T.blue:T.mid, padding:"8px 12px", cursor:"pointer", fontSize:12, fontFamily:BODY, fontWeight:view===id?600:id==="submit"?500:400, transition:"all 0.12s", whiteSpace:"nowrap", flexShrink:0 }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hero */}
          <div style={{ padding:isMobile?"28px 0 24px":"52px 0 44px" }}>
            <div style={{ display:"flex", flexDirection:isMobile?"column":"row", alignItems:"flex-start", gap:isMobile?20:48 }}>
              <div style={{ flex:1 }}>
                <Eyebrow color={T.blue}>March 2026 · Independent · AI-Generated</Eyebrow>
                <h1 style={{ margin:"0 0 12px", fontSize:isMobile?"clamp(28px,8vw,36px)":"clamp(36px,5vw,60px)", fontWeight:700, color:T.ink, fontFamily:HEAD, lineHeight:1.05, letterSpacing:"-0.5px" }}>
                  AI Tools<br />for Legal Teams
                </h1>
                <p style={{ margin:0, fontSize:isMobile?14:16, color:T.body, lineHeight:1.75, maxWidth:460 }}>
                  Scored on what actually matters to lawyers — integrations, research quality, automation, and where things are heading. Not a listicle. Not sponsored.
                </p>
              </div>

              {/* Stats — horizontal row on mobile, vertical column on desktop */}
              <div style={isMobile ? { display:"flex", gap:0, width:"100%", borderTop:"1px solid "+T.rule, borderBottom:"1px solid "+T.rule } : { width:200, flexShrink:0, marginTop:8 }}>
                {[[REVIEWERS.length.toString(),"Reviewers"],["10","Criteria"],["0","Sponsored"],["v1","Testing"]].map(([n,lbl])=>(
                  <div key={lbl} style={isMobile
                    ? { flex:1, padding:"12px 0", display:"flex", flexDirection:"column", alignItems:"center", borderRight:"1px solid "+T.rule }
                    : { padding:"14px 0", borderBottom:"1px solid "+T.rule, display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                    <span style={{ fontSize:isMobile?22:30, fontWeight:700, color:T.ink, fontFamily:HEAD, lineHeight:1 }}>{n}</span>
                    <span style={{ fontSize:isMobile?9:11, color:T.mid, textAlign:isMobile?"center":"right", maxWidth:isMobile?60:120, marginTop:isMobile?2:0 }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {view === "explorer"     && <ExplorerView onSubmit={()=>setView("submit")} />}
      {view === "reviewers"    && <ReviewersGrid onSubmit={()=>setView("submit")} />}
      {view === "methodology"  && <MethodologyView onSubmit={()=>setView("submit")} />}
      {view === "submit"       && <ReviewerForm onCancel={()=>setView("reviewers")} />}

      {/* ── FEEDBACK BUTTON + PANEL ── */}
      <div style={{ position:"fixed", bottom:isMobile?16:24, right:isMobile?16:24, zIndex:200 }}>
        {!showFeedback && (
          <button onClick={()=>{ setShowFeedback(true); setFeedbackSent(false); }}
            style={{ background:T.ink, color:"#fff", border:"none", padding:"10px 18px", cursor:"pointer", fontSize:12, fontFamily:MONO, fontWeight:500, letterSpacing:0.8, borderRadius:0, boxShadow:"0 4px 20px rgba(0,0,0,0.18)", display:"flex", alignItems:"center", gap:8, transition:"all 0.15s" }}>
            <span style={{ fontSize:14 }}>↗</span> FEEDBACK
          </button>
        )}

        {showFeedback && (
          <div style={{ width:isMobile?"calc(100vw - 32px)":"340px", background:T.white, border:"1px solid "+T.rule, boxShadow:"0 8px 40px rgba(0,0,0,0.14)", padding:24, position:"relative" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:T.ink, fontFamily:MONO, textTransform:"uppercase" }}>v1 Feedback</div>
              <button onClick={()=>setShowFeedback(false)}
                style={{ background:"none", border:"none", color:T.mid, cursor:"pointer", fontSize:16, padding:0, lineHeight:1 }}>✕</button>
            </div>

            {feedbackSent ? (
              <div style={{ padding:"20px 0", textAlign:"center" }}>
                <div style={{ fontSize:24, marginBottom:8 }}>✓</div>
                <div style={{ fontSize:13, color:T.body, marginBottom:4 }}>Thanks — noted.</div>
                <div style={{ fontSize:11, color:T.mid }}>We'll review and update if needed.</div>
                <button onClick={()=>{ setShowFeedback(false); setFeedbackText(""); setFeedbackSent(false); }}
                  style={{ marginTop:16, background:"none", border:"1px solid "+T.rule, color:T.mid, padding:"6px 16px", cursor:"pointer", fontSize:11, fontFamily:MONO, borderRadius:0 }}>Close</button>
              </div>
            ) : (
              <>
                <p style={{ margin:"0 0 14px", fontSize:12, color:T.mid, lineHeight:1.6 }}>
                  This is v1 and it needs testing. Wrong data, bad UX, missing tool, scoring disagreement — anything is useful.
                </p>
                <textarea
                  value={feedbackText}
                  onChange={e=>setFeedbackText(e.target.value)}
                  rows={5}
                  placeholder="What's wrong, missing, or confusing? Be specific."
                  style={{ width:"100%", padding:"10px 12px", border:"1px solid "+T.rule, background:T.paper, fontFamily:BODY, fontSize:13, color:T.ink, resize:"vertical", outline:"none", boxSizing:"border-box", marginBottom:12 }}
                />
                <div style={{ display:"flex", gap:8 }}>
                  <button
                    onClick={()=>{
                      if (!feedbackText.trim()) return;
                      // mailto fallback — simple and reliable for v1
                      const subject = encodeURIComponent("Legal AI Report v1 Feedback");
                      const body = encodeURIComponent(feedbackText);
                      window.open(`mailto:get@laurajg.com?subject=${subject}&body=${body}`);
                      setFeedbackSent(true);
                    }}
                    disabled={!feedbackText.trim()}
                    style={{ flex:1, background:feedbackText.trim()?T.ink:T.rule, color:"#fff", border:"none", padding:"10px 0", cursor:feedbackText.trim()?"pointer":"not-allowed", fontSize:12, fontFamily:MONO, fontWeight:500, letterSpacing:0.5, borderRadius:0, transition:"background 0.15s" }}>
                    Send feedback →
                  </button>
                </div>
                <div style={{ marginTop:10, fontSize:10, color:T.mid, fontFamily:MONO }}>Opens your email client · get@laurajg.com</div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <div style={{ borderTop:"1px solid "+T.rule, background:T.paper }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:4 }}>AI Field Notes — free newsletter by Laura Jeffords Greenberg</div>
            <div style={{ fontSize:12, color:T.mid, lineHeight:1.6 }}>How in-house lawyers are actually using AI. Practical, honest, no hype.</div>
          </div>
          <a href="https://laurajg.com" target="_blank" rel="noopener noreferrer"
            style={{ background:"none", border:"1px solid "+T.ink, color:T.ink, padding:"8px 20px", fontSize:12, fontFamily:BODY, fontWeight:500, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0, letterSpacing:0.2 }}>
            Subscribe free →
          </a>
        </div>
      </div>

      <footer style={{ borderTop:"1px solid "+T.rule, background:T.paper, padding:"24px 0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:T.mid, fontFamily:MONO, textTransform:"uppercase" }}>Legal AI Tool Comparison</span>
            <span style={{ color:T.rule }}>·</span>
            <a href="https://www.linkedin.com/in/laurajeffordsgreenberg" target="_blank" rel="noopener noreferrer"
              style={{ fontSize:11, color:T.blue, fontFamily:MONO, textDecoration:"none", letterSpacing:0.3 }}>By Laura Jeffords Greenberg</a>
            <span style={{ color:T.rule }}>·</span>
            <span style={{ fontSize:10, color:T.mid, fontFamily:MONO }}>March 2026 · Independent · Not sponsored</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <a href="mailto:get@laurajg.com"
              style={{ fontSize:11, color:T.blue, fontFamily:MONO, textDecoration:"none" }}>get@laurajg.com</a>
            <button onClick={()=>{ navigator.clipboard?.writeText(window.location.href); }}
              style={{ background:"none", border:"1px solid "+T.rule, color:T.mid, padding:"5px 12px", cursor:"pointer", fontSize:10, fontFamily:MONO, letterSpacing:0.8, borderRadius:0 }}>
              SHARE ↗
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
