// SSI Operating System — seed data, scripts, and locked playbooks (HANDOFF.md Sections 2–7)
import type {
  CounterKey,
  Lead,
  LeadStage,
  ObjectionType,
  Pillar,
  PostFormat,
} from './types';

export const COLORS = {
  orange: '#FF6B00',
  gold: '#FFB800',
};

// ── Daily weekday targets (Tier 2, adjusted reality) ──────────────────────
export const TARGETS: Partial<Record<CounterKey, number>> = {
  posts: 1,
  stories: 2,
  comments: 10,
  coldDMs: 5,
  warmDMs: 10,
  reactivationDMs: 5,
  followUps: 15,
};

export const COUNTER_LABELS: Record<CounterKey, string> = {
  posts: 'Posts',
  stories: 'Stories',
  comments: 'Peer Comments',
  coldDMs: 'Cold DMs',
  warmDMs: 'Warm DMs',
  reactivationDMs: 'Reactivation DMs',
  followUps: 'Follow-ups',
  chatsBooked: 'Chats Booked',
  chatsHeld: 'Chats Held',
  salesCalls: 'Sales Calls',
  closes: 'Closes',
};

// ── Weekday content calendar (locked) ─────────────────────────────────────
export const WEEKDAY_PILLARS: Record<number, { pillar: Pillar; label: string; job: string }> = {
  1: { pillar: 'framework', label: 'Framework Post', job: 'Authority — teach the system' },
  2: { pillar: 'story', label: 'Story / Relatability', job: 'Trust — be human' },
  3: { pillar: 'myth_buster', label: 'Myth Buster', job: 'Challenge an industry norm' },
  4: { pillar: 'conversion_cta', label: 'Conversion CTA', job: 'Drive a keyword trigger to DMs' },
  5: { pillar: 'reach_reel', label: 'Reach Reel', job: 'Top-of-funnel eyeballs' },
  6: { pillar: 'weekend_story', label: 'Stories Only', job: 'Monitor + behind-the-scenes' },
  0: { pillar: 'weekend_story', label: 'Stories Only', job: 'Monitor + behind-the-scenes' },
};

export const PILLAR_LABELS: Record<Pillar, string> = {
  framework: 'Framework',
  story: 'Story / Relatability',
  myth_buster: 'Myth Buster',
  conversion_cta: 'Conversion CTA',
  reach_reel: 'Reach Reel',
  weekend_story: 'Weekend Story',
};

export const FORMAT_LABELS: Record<PostFormat, string> = {
  multi_character_pov: 'Multi-Character POV',
  talking_head_broll: 'Talking Head + B-Roll',
  storytelling_arc: 'Storytelling Arc',
};

// ── Pipeline stages ────────────────────────────────────────────────────────
export const STAGES: { key: LeadStage; label: string }[] = [
  { key: 'new', label: 'New Lead' },
  { key: 'qualifying', label: 'Qualifying' },
  { key: 'discovery_booked', label: 'Discovery Booked' },
  { key: 'sales_call_booked', label: 'Sales Call Booked' },
  { key: 'followup_48hr', label: '48hr Follow-Up' },
  { key: 'closed_won', label: 'Closed Won' },
  { key: 'onboarding', label: 'Onboarding' },
  { key: 'long_game', label: 'Long Game / Nurture' },
  { key: 'closed_lost', label: 'Closed Lost' },
];

// ── Seed leads (current pipeline at handoff) ──────────────────────────────
const seedDate = '2026-06-11T12:00:00.000Z';
export const SEED_LEADS: Lead[] = [
  {
    id: 'lead-brandon',
    name: 'Brandon Perdomo',
    handle: '',
    source: 'friend',
    fit: 'green',
    stage: 'sales_call_booked',
    goal: 'Reach 175 lbs; muscle, strength, food structure',
    why: '',
    nextAction: 'Run standard close — friend-lead rule applies',
    callDateTime: null,
    isFriendLead: true,
    paymentPlan: null,
    notes: 'Friend / inbound. Sales call booked Thursday.',
    lastTouch: seedDate,
    history: [{ date: seedDate, event: 'Seeded from handoff — sales call booked (Thursday)' }],
  },
  {
    id: 'lead-bige',
    name: 'ItsMeBigE',
    handle: 'ItsMeBigE',
    source: 'inbound',
    fit: 'green',
    stage: 'sales_call_booked',
    goal: '210 → 180 lbs; fat loss, nutrition gap',
    why: 'Emotionally motivated — anchor close to his WHY',
    nextAction: 'Anchor close to his WHY',
    callDateTime: null,
    isFriendLead: false,
    paymentPlan: null,
    notes: 'Inbound. Sales call booked Sunday.',
    lastTouch: seedDate,
    history: [{ date: seedDate, event: 'Seeded from handoff — sales call booked (Sunday)' }],
  },
  {
    id: 'lead-jj8',
    name: 'Theysleeponjj_8',
    handle: 'theysleeponjj_8',
    source: 'outbound',
    fit: 'yellow',
    stage: 'discovery_booked',
    goal: 'Nutrition structure',
    why: '',
    nextAction: 'Run diagnostic → book sales call',
    callDateTime: null,
    isFriendLead: false,
    paymentPlan: null,
    notes: 'Wingstop lead. In diagnostic chat stage.',
    lastTouch: seedDate,
    history: [{ date: seedDate, event: 'Seeded from handoff — diagnostic chat' }],
  },
  {
    id: 'lead-jacob',
    name: 'Jacob Lainez',
    handle: '',
    source: 'reactivation',
    fit: 'yellow',
    stage: 'long_game',
    goal: 'Nutrition systems gap',
    why: '',
    nextAction: 'Nurture, no pitch',
    callDateTime: null,
    isFriendLead: true,
    paymentPlan: null,
    notes: 'Past client / friend. Stage 2 — long game.',
    lastTouch: seedDate,
    history: [{ date: seedDate, event: 'Seeded from handoff — long game' }],
  },
  {
    id: 'lead-lauren',
    name: 'Lauren English',
    handle: '',
    source: 'reactivation',
    fit: 'yellow',
    stage: 'long_game',
    goal: 'Currently with another trainer',
    why: '',
    nextAction: 'Nurture, stay top of mind',
    callDateTime: null,
    isFriendLead: false,
    paymentPlan: null,
    notes: 'Past client / coworker. Stage 2 — long game.',
    lastTouch: seedDate,
    history: [{ date: seedDate, event: 'Seeded from handoff — long game' }],
  },
];

// ── Objection Matrix (5 types — always run Money first) ───────────────────
export const OBJECTION_PLAYS: Record<ObjectionType, { title: string; steps: string[] }> = {
  money: {
    title: 'Money — run this FIRST on every objection',
    steps: [
      'Ask permission to dig in.',
      '"Money aside, do you actually believe this could be the answer for you?"',
      '"Why though?" — let them sell themselves. Stay quiet.',
      '"What happens if nothing changes?"',
      '"So is it really just the financials?"',
      'Let THEM propose funding ideas first. Stay quiet.',
      'Payment plan walk-down, anchored highest-first (PIF $2,850 → 2-pay → 3-pay → 6-pay).',
      'Ask for their real cash-on-hand number.',
    ],
  },
  time: {
    title: 'Time — almost never time. It’s priority or belief.',
    steps: [
      'Get the SPECIFIC reason behind "no time."',
      'Logistical → show how the program fits their schedule (it usually saves time).',
      'Belief-based → not having time is the REASON to do this.',
      'NEVER offer to "circle back when things calm down."',
    ],
  },
  partner: {
    title: 'Partner / Spouse',
    steps: [
      '"What would your partner say if you brought it up tonight?"',
      'Supportive → loop back to Money play.',
      'Pushback → surface the specific concern (almost always money or fear) and handle it.',
      'NEVER let them leave to "go ask" without identifying the concern.',
      'Reframe: "If they asked you the same question, would you support them?"',
    ],
  },
  think: {
    title: '"Think about it" — never the real objection',
    steps: [
      'Validate: "Totally fair."',
      '"What specifically do you need to think about?"',
      'Whatever surfaces is the REAL objection — run that play.',
      'If vague: "What would need to be true for you to say yes today?"',
      'Remember: 95% who leave to think never come back.',
    ],
  },
  fear: {
    title: 'Fear / DIY — attack the broken belief',
    steps: [
      'Address the broken belief directly: "transformation works for others, not for me."',
      'Reference their WHY from the discovery call.',
      'Proof story: Kelvin — broke the yo-yo dieting cycle with a structured, flexible food plan.',
      'Proof story: Victor — 30+ lbs down over 6–8 months, visible muscle, full identity shift.',
    ],
  },
};

export const OBJECTION_LABELS: Record<ObjectionType, string> = {
  money: 'MONEY',
  time: 'Time',
  partner: 'Partner',
  think: 'Think About It',
  fear: 'Fear / DIY',
};

// ── Discovery call sections (15 min, NO SELLING) ──────────────────────────
export const DISCOVERY_SECTIONS: { key: string; label: string; minutes: number; prompts: string[] }[] = [
  { key: 'rapport', label: 'Rapport', minutes: 2, prompts: ['Warm open. Their world first. No agenda yet.'] },
  {
    key: 'currentSituation',
    label: 'Current Situation',
    minutes: 3,
    prompts: ['What does training/eating look like right now?', 'What have you already tried?'],
  },
  {
    key: 'goalWhy',
    label: 'Goal + Emotional WHY',
    minutes: 5,
    prompts: [
      '"What’s your biggest goal right now — fat loss, muscle, or both?"',
      'Dig for the emotional WHY. This is what you reference at the close when they hesitate.',
    ],
  },
  {
    key: 'gap',
    label: 'Diagnose the Gap',
    minutes: 3,
    prompts: ['Name the gap between where they are and the goal. Diagnose only — do NOT prescribe the offer.'],
  },
  {
    key: 'book',
    label: 'Book the Sales Call',
    minutes: 2,
    prompts: ['Book it on the spot via Calendly. Confirm date/time before hanging up.'],
  },
];

// ── Sales call checklist (SOP Phases 3–4) ─────────────────────────────────
export const SALES_CHECKLIST: string[] = [
  'Recap discovery insights — their words, their WHY',
  'Present deck slides 1–4',
  'PAUSE DECK — demo MyCoachAI LIVE',
  'Resume deck → Slide 5 (Investment)',
  'Present $3,000 / 6 months with all 4 payment cards together',
  'SILENCE. Do not justify the price.',
  'Anchor with PIF $2,850 first · 6-Pay = "Most Popular"',
  'Commitment question: "So — pay in full, or split into 2, 3, or 6?"',
  'Handle objections — run Money first, always',
  'Collect payment on the call OR set a 48-hour follow-up (no open loops)',
  'Slide 7 (next steps) ONLY after commitment',
];

// ── Qualifying questions (Phase 1) ────────────────────────────────────────
export const QUALIFYING_QUESTIONS: string[] = [
  '"What’s your biggest goal right now — fat loss, muscle, or both?"',
  '"Have you tried working with a coach or following a plan before?"',
  '"If we figured out a plan that works, are you in a position to invest in coaching?"',
];

// ── DM script library ─────────────────────────────────────────────────────
export interface DMScript {
  id: string;
  lane: 'cold' | 'warm' | 'reactivation' | 'qualify' | 'followup' | 'convert' | 'objection';
  title: string;
  body: string;
  counter: CounterKey;
}

export const DM_SCRIPTS: DMScript[] = [
  // Cold lane — move cold → warm. Never book from a cold message.
  {
    id: 'cold-comment-bridge',
    lane: 'cold',
    title: 'Cold open — content bridge',
    body: 'Yo [name], your last post about [specific topic] actually stopped my scroll. Curious — how long have you been training like that?',
    counter: 'coldDMs',
  },
  {
    id: 'cold-peer',
    lane: 'cold',
    title: 'Cold open — peer respect',
    body: 'Hey [name], been seeing your stuff pop up on my feed. Respect the consistency man. What got you started?',
    counter: 'coldDMs',
  },
  // Warm lane — micro-rapport → casual qualify → diagnostic invite.
  {
    id: 'warm-story-reply',
    lane: 'warm',
    title: 'Warm — story viewer / liker',
    body: 'Hey [name], noticed you’ve been checking out the training stuff I post. You training right now or just gathering intel? haha',
    counter: 'warmDMs',
  },
  {
    id: 'warm-known',
    lane: 'warm',
    title: 'Warm — someone you know',
    body: '[name]! Been a minute man. Saw your [recent thing] — looked good. How’s everything going on your end?',
    counter: 'warmDMs',
  },
  // Reactivation lane — verbatim templates from the handoff.
  {
    id: 'react-ghosted',
    lane: 'reactivation',
    title: 'Ghosted lead (verbatim)',
    body: 'Hey [name], been a minute. Was running through old conversations and yours stuck out. You were looking at [goal] back in [timeframe]. Did you end up solving it, hiring someone, or putting it on the shelf?',
    counter: 'reactivationDMs',
  },
  {
    id: 'react-noshow',
    lane: 'reactivation',
    title: 'No-show (verbatim)',
    body: 'Hey [name], no hard feelings on the call falling through a while back. Is [original problem] still a thing for you, or did it sort itself out?',
    counter: 'reactivationDMs',
  },
  {
    id: 'react-pastclient',
    lane: 'reactivation',
    title: 'Past client (verbatim — relationship first)',
    body: '[name], last we worked together you hit [specific result]. Where are you with [goal area] now — maintained, plateaued, or gone backwards?',
    counter: 'reactivationDMs',
  },
  // Qualify scripts (open item #2)
  {
    id: 'qualify-inbound',
    lane: 'qualify',
    title: 'Inbound response (within 2 hours)',
    body: 'Hey man, appreciate you reaching out. What made you send that message?',
    counter: 'followUps',
  },
  {
    id: 'qualify-q1',
    lane: 'qualify',
    title: 'Qualify Q1 — goal',
    body: 'What’s your biggest goal right now — fat loss, muscle, or both?',
    counter: 'followUps',
  },
  {
    id: 'qualify-q2',
    lane: 'qualify',
    title: 'Qualify Q2 — history',
    body: 'Have you tried working with a coach or following a plan before?',
    counter: 'followUps',
  },
  {
    id: 'qualify-q3',
    lane: 'qualify',
    title: 'Qualify Q3 — investment',
    body: 'If we figured out a plan that works, are you in a position to invest in coaching?',
    counter: 'followUps',
  },
  // Follow-up scripts
  {
    id: 'followup-open-thread',
    lane: 'followup',
    title: 'Warm thread re-open',
    body: 'Hey [name], been thinking about what you said about [specific thing they mentioned]. Did you ever get anywhere with that?',
    counter: 'followUps',
  },
  {
    id: 'followup-one-nudge',
    lane: 'followup',
    title: 'One-week nudge (then move on)',
    body: 'Hey [name], tossing this back to the top of your inbox. Still curious where you landed on [goal]. If now’s not the time, all good — just say the word.',
    counter: 'followUps',
  },
  {
    id: 'followup-48hr',
    lane: 'followup',
    title: '48-hour post-call follow-up',
    body: 'Hey [name], following up like we talked about. Where’s your head at since the call?',
    counter: 'followUps',
  },
  // Convert scripts — the bridge to a booked call.
  {
    id: 'convert-diagnostic',
    lane: 'convert',
    title: 'Diagnostic chat invite (verbatim)',
    body: 'Want to hop on a quick 15? Leave the credit card at home haha. Just want to look at what’s going on with you now and figure out the fix. Way easier than typing.',
    counter: 'chatsBooked',
  },
  {
    id: 'convert-confirm',
    lane: 'convert',
    title: 'Booking confirmation DM',
    body: 'Locked in for [timeframe]. I’ll send the link. Come ready to talk about where you’re at — I’ll handle the rest.',
    counter: 'followUps',
  },
  {
    id: 'convert-morning-of',
    lane: 'convert',
    title: 'Morning-of reminder',
    body: 'Morning [name] — we’re on for today. See you at [timeframe].',
    counter: 'followUps',
  },
  // Objection-handling DMs (price / time / "tried before") — never pricing in DMs.
  {
    id: 'obj-price-dm',
    lane: 'objection',
    title: 'Price asked in DM (deflect to chat — NO pricing in DMs)',
    body: 'Good question — it depends on what we’d actually be fixing, and I’d be guessing without seeing your situation. That’s exactly what the quick 15 is for. Want to grab one?',
    counter: 'followUps',
  },
  {
    id: 'obj-time-dm',
    lane: 'objection',
    title: '"Too busy right now"',
    body: 'Totally get it. Real talk though — [goal] doesn’t usually wait for a calm week. The guys I work with are busy too; the system is built around that. What does a typical week look like for you?',
    counter: 'followUps',
  },
  {
    id: 'obj-tried-dm',
    lane: 'objection',
    title: '"I’ve tried before"',
    body: 'That actually makes you a BETTER fit, not worse. Most guys I work with came in off 2–3 failed runs. What did the last attempt look like — and where did it fall apart?',
    counter: 'followUps',
  },
];

// ── Keyword triggers ───────────────────────────────────────────────────────
export const KEYWORD_TRIGGERS: { keyword: string; flow: string }[] = [
  {
    keyword: 'MONDAY',
    flow: 'Open: "Hey! Saw you dropped MONDAY. What’s got you ready to start?" → Diagnose → Qualify (3 Qs) → Bridge to diagnostic chat → Confirm.',
  },
  {
    keyword: 'SYSTEM',
    flow: 'Open: "You asked for the system — love it. Quick one first: what are you working toward right now?" → Diagnose → Qualify → Bridge → Confirm.',
  },
  {
    keyword: 'READY',
    flow: 'Open: "READY — let’s go. What changed that made today the day?" → Diagnose (urgency!) → Qualify → Bridge → Confirm.',
  },
  {
    keyword: 'DIFFERENT',
    flow: 'Open: "DIFFERENT is right. What have you tried that DIDN’T work?" → Diagnose the broken belief → Qualify → Bridge → Confirm.',
  },
];

// ── AI Strategist system prompt (HANDOFF.md Section 10, verbatim) ─────────
export const STRATEGIST_SYSTEM_PROMPT = `You are the SSI Strategist — the operating brain for Fernando's online fitness coaching business, Super Saiyan Incubator (@nandotrains_). You behave exactly like the Claude project Fernando built this dashboard from.

BUSINESS CONTEXT
- Offer: 1:1 coaching, $3,000 / 6 months, one program. Payment plans: PIF $2,850 (5% off, always anchor first), 2-pay, 3-pay, 6-pay (Most Popular). 6-month minimum.
- Avatar: "the on-again-off-again guy" — male 25–40, body recomp, broken belief that transformation isn't possible for HIM specifically. Proof stories: Kelvin (broke yo-yo dieting), Victor (30+ lbs down, muscle built, identity shift).
- Stack: MyCoachAI, Calendly, Instagram, Google Sheets tracker.
- Sprint: 30-day Tier 2 sprint. Daily weekday targets: 5 cold DMs, 10 warm DMs, 5 reactivation DMs, 10 peer comments, 15 follow-ups, 1 post per calendar slot, 2–3 stories (1 with DM trigger). Weekends = stories only.

HOW YOU RESPOND
- Before answering, always: (1) identify the bottleneck, (2) determine the highest-ROI action, (3) deliver a simple system that solves it.
- Be direct, structured, actionable. No fluff. Think in systems, not one-off tips.
- Default outputs: step-by-step plans, copy-paste verbatim scripts, checklists, workflows.
- If a request is unclear or missing key info, ask clarifying questions first.
- Always aim to improve the system, not just answer the question.
- Use any dashboard state provided in the message (counters, pipeline, rollup) as ground truth and reference the real numbers.

LOCKED RULES (never violate, never relitigate)
1. Discovery calls (15 min): diagnose and book only. No pitching, no pricing.
2. Never pitch the offer or mention pricing in a DM. The DM books the chat; the chat sells.
3. Friend leads get the standard process and full price. Never pre-discount. If price comes up, make the prospect explain their actual situation first.
4. On objections, always run Money first. The five types: Money, Time, Partner, Think About It, Fear/DIY.
5. After stating the offer: silence. Don't justify the price.
6. Personalize the first 8–12 words of every DM. One ask per message. Reply to inbound within 60 minutes.
7. Content rules: reels build authority and mirror pain — never deep-explain the offer in a reel. One DM-trigger story per day. Keyword triggers: MONDAY, SYSTEM, READY, DIFFERENT.
8. Content calendar: Mon Framework, Tue Story/Relatability, Wed Myth Buster, Thu Conversion CTA, Fri Reach reel. Formats: Multi-Character POV, Talking Head + B-Roll, Storytelling Arc. Filming notes are timestamp-aligned, side-by-side with the script.
9. If sprint results lag, diagnose in this order: offer clarity → DM scripts not run as written → call framework skipped. Fix the input; don't blame the audience.
10. Friday review: find the ONE worst input of the week and prescribe one fix.

TONE
Coach-to-coach. Confident, no hedging, no corporate filler. Push back when Fernando is about to break a locked rule (especially pitching early or pre-discounting a friend). Brand voice can carry DBZ energy — power levels, ascension — without copyrighted references.`;

export const QUICK_ACTIONS: { label: string; prompt: string }[] = [
  { label: 'Grade my week', prompt: 'Grade my week using the rollup numbers in context. Give me the letter grade, the ONE worst input, and one fix for next week.' },
  { label: "What's my bottleneck?", prompt: 'Look at my current dashboard state. What is my #1 bottleneck right now and what is the highest-ROI action to fix it?' },
  { label: 'Prep me for a call', prompt: 'Prep me for my next booked call. Use the pipeline context: recap the lead, their goal and WHY, the friend-lead rule if it applies, and the exact close sequence.' },
  { label: "Write today's post", prompt: "Write today's post for the calendar slot shown in context. Give me the hook, full script, and timestamp-aligned filming notes side-by-side. Talking Head in car unless the pillar demands otherwise." },
  { label: 'Draft a reactivation DM', prompt: 'Draft a reactivation DM. Ask me who it is for if you need to, then personalize the first 8–12 words, one ask, no pricing.' },
];
