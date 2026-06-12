// SSI Operating System — data models (per HANDOFF.md Section 9)

export type LeadSource = 'inbound' | 'outbound' | 'reactivation' | 'referral' | 'friend';
export type LeadFit = 'green' | 'yellow' | 'red';
export type LeadStage =
  | 'new'
  | 'qualifying'
  | 'discovery_booked'
  | 'sales_call_booked'
  | 'followup_48hr'
  | 'closed_won'
  | 'onboarding'
  | 'long_game'
  | 'closed_lost';
export type PaymentPlan = 'pif' | '2pay' | '3pay' | '6pay' | null;

export interface LeadEvent {
  date: string; // ISO
  event: string;
}

export interface Lead {
  id: string;
  name: string;
  handle: string;
  source: LeadSource;
  fit: LeadFit;
  stage: LeadStage;
  goal: string;
  why: string;
  nextAction: string;
  callDateTime: string | null; // ISO
  isFriendLead: boolean;
  paymentPlan: PaymentPlan;
  notes: string;
  lastTouch: string; // ISO
  history: LeadEvent[];
}

export type CounterKey =
  | 'posts'
  | 'stories'
  | 'comments'
  | 'coldDMs'
  | 'warmDMs'
  | 'reactivationDMs'
  | 'followUps'
  | 'chatsBooked'
  | 'chatsHeld'
  | 'salesCalls'
  | 'closes';

export type DailyLog = Record<CounterKey, number> & { date: string };

export type Pillar =
  | 'framework'
  | 'story'
  | 'myth_buster'
  | 'conversion_cta'
  | 'reach_reel'
  | 'weekend_story';
export type PostFormat = 'multi_character_pov' | 'talking_head_broll' | 'storytelling_arc';
export type PostStatus = 'idea' | 'scripted' | 'filmed' | 'posted';
export type DMTrigger = 'MONDAY' | 'SYSTEM' | 'READY' | 'DIFFERENT' | null;

export interface FilmingNote {
  timestamp: string;
  note: string;
}

export interface ContentPost {
  id: string;
  date: string; // YYYY-MM-DD
  pillar: Pillar;
  format: PostFormat;
  hook: string;
  script: string;
  filmingNotes: FilmingNote[];
  dmTrigger: DMTrigger;
  status: PostStatus;
}

export type CallType = 'discovery' | 'sales';
export type ObjectionType = 'money' | 'time' | 'partner' | 'think' | 'fear';
export type CallOutcome =
  | 'booked_sales_call'
  | 'closed_pif'
  | 'closed_plan'
  | 'followup_48hr'
  | 'lost';

export interface CallSession {
  id: string;
  leadId: string;
  type: CallType;
  sectionNotes: Record<string, string>;
  objectionsHit: ObjectionType[];
  outcome: CallOutcome | null;
  date: string; // ISO
}

export interface WeeklyReview {
  weekStart: string; // YYYY-MM-DD (Monday)
  worstInput: string;
  fix: string;
  grade: string; // A–F
}

export interface Settings {
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AppState {
  leads: Lead[];
  logs: Record<string, DailyLog>; // keyed by YYYY-MM-DD
  posts: ContentPost[];
  calls: CallSession[];
  reviews: Record<string, WeeklyReview>; // keyed by weekStart
  settings: Settings;
  chat: ChatMessage[];
}
