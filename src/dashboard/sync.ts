// Google Sheets sync client. Talks to the Apps Script bridge in
// apps-script/SSI_Sync.gs. Contract: the dashboard is the source of truth —
// push upserts sheet rows by Date/ID; pull only imports leads that don't
// exist in the dashboard yet.
import { STAGES } from './data';
import type { AppState, DailyLog, Lead, LeadFit, LeadSource } from './types';

type SheetRow = Record<string, string | number | boolean>;

function logToRow(log: DailyLog): SheetRow {
  return {
    Date: log.date,
    Posts: log.posts,
    Stories: log.stories,
    'Peer Comments': log.comments,
    'Cold DMs': log.coldDMs,
    'Warm DMs': log.warmDMs,
    'Reactivation DMs': log.reactivationDMs,
    'Follow-ups': log.followUps,
    'Chats Booked': log.chatsBooked,
    'Chats Held': log.chatsHeld,
    'Sales Calls': log.salesCalls,
    Closes: log.closes,
  };
}

function leadToRow(lead: Lead): SheetRow {
  const stage = STAGES.find((s) => s.key === lead.stage);
  return {
    ID: lead.id,
    Name: lead.name,
    Handle: lead.handle,
    Source: lead.source,
    Fit: lead.fit.toUpperCase(),
    Stage: stage ? stage.label : lead.stage,
    Goal: lead.goal,
    WHY: lead.why,
    'Next Action': lead.nextAction,
    'Call Date/Time': lead.callDateTime ? new Date(lead.callDateTime).toLocaleString() : '',
    'Friend Lead': lead.isFriendLead ? 'YES' : '',
    'Payment Plan': lead.paymentPlan ?? '',
    Notes: lead.notes,
    'Last Touch': lead.lastTouch.slice(0, 10),
  };
}

function str(v: unknown): string {
  return v == null ? '' : String(v).trim();
}

export function rowToLead(row: SheetRow): Lead | null {
  const name = str(row['Name']);
  if (!name) return null;
  const stageLabel = str(row['Stage']).toLowerCase();
  const stage =
    STAGES.find((s) => s.label.toLowerCase() === stageLabel || s.key === stageLabel)?.key ?? 'new';
  const fitRaw = str(row['Fit']).toLowerCase();
  const fit: LeadFit = fitRaw.startsWith('g') ? 'green' : fitRaw.startsWith('r') ? 'red' : 'yellow';
  const sourceRaw = str(row['Source']).toLowerCase();
  const source: LeadSource = (
    ['inbound', 'outbound', 'reactivation', 'referral', 'friend'] as LeadSource[]
  ).includes(sourceRaw as LeadSource)
    ? (sourceRaw as LeadSource)
    : 'inbound';
  const now = new Date().toISOString();
  return {
    id: str(row['ID']) || `lead-sheet-${name.toLowerCase().replace(/\W+/g, '-')}`,
    name,
    handle: str(row['Handle']),
    source,
    fit,
    stage,
    goal: str(row['Goal']),
    why: str(row['WHY']),
    nextAction: str(row['Next Action']),
    callDateTime: null,
    isFriendLead: str(row['Friend Lead']).toLowerCase().startsWith('y'),
    paymentPlan: null,
    notes: str(row['Notes']),
    lastTouch: now,
    history: [{ date: now, event: 'Imported from Lead Tracker sheet' }],
  };
}

interface PushResult {
  ok: boolean;
  logs?: number;
  leads?: number;
  error?: string;
}

/** Push all daily logs + all leads. POST body stays text/plain so the
 *  browser skips the CORS preflight that Apps Script can't answer. */
export async function syncPush(url: string, state: AppState): Promise<PushResult> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      action: 'push',
      logs: Object.values(state.logs).map(logToRow),
      leads: state.leads.map(leadToRow),
    }),
  });
  if (!res.ok) throw new Error(`Sheets bridge returned ${res.status}`);
  return (await res.json()) as PushResult;
}

export async function syncPullLeads(url: string): Promise<Lead[]> {
  const sep = url.includes('?') ? '&' : '?';
  const res = await fetch(`${url}${sep}action=pull`);
  if (!res.ok) throw new Error(`Sheets bridge returned ${res.status}`);
  const data = (await res.json()) as { ok: boolean; leads?: SheetRow[]; error?: string };
  if (!data.ok) throw new Error(data.error ?? 'Pull failed');
  return (data.leads ?? []).map(rowToLead).filter((l): l is Lead => l !== null);
}
