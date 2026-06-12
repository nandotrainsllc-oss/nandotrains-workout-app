import { useState } from 'react';
import { STAGES } from '../data';
import { daysSince } from '../lib';
import { useStore } from '../store';
import type { Lead, LeadFit, LeadSource, LeadStage } from '../types';

const STALE_DAYS = 5;

function blankLead(): Lead {
  return {
    id: `lead-${Date.now()}`,
    name: '',
    handle: '',
    source: 'inbound',
    fit: 'yellow',
    stage: 'new',
    goal: '',
    why: '',
    nextAction: '',
    callDateTime: null,
    isFriendLead: false,
    paymentPlan: null,
    notes: '',
    lastTouch: new Date().toISOString(),
    history: [{ date: new Date().toISOString(), event: 'Lead created' }],
  };
}

function LeadEditor({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const { upsertLead, deleteLead, touchLead } = useStore();
  const [draft, setDraft] = useState<Lead>(lead);
  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="ssi-modal-backdrop" onClick={onClose}>
      <div className="ssi-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{lead.name ? lead.name : 'New Lead'}</h2>
        {draft.isFriendLead && (
          <div className="ssi-banner gold" style={{ fontSize: 12 }}>
            FRIEND LEAD — STANDARD PROCESS, STANDARD PRICE. NEVER PRE-DISCOUNT.
          </div>
        )}
        <div className="ssi-grid2">
          <div>
            <label>Name</label>
            <input value={draft.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label>IG Handle</label>
            <input value={draft.handle} onChange={(e) => set('handle', e.target.value)} />
          </div>
          <div>
            <label>Source</label>
            <select value={draft.source} onChange={(e) => set('source', e.target.value as LeadSource)}>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
              <option value="reactivation">Reactivation</option>
              <option value="referral">Referral</option>
              <option value="friend">Friend</option>
            </select>
          </div>
          <div>
            <label>Fit (G/Y/R)</label>
            <select value={draft.fit} onChange={(e) => set('fit', e.target.value as LeadFit)}>
              <option value="green">Green — clear goal, tried before, open to investing</option>
              <option value="yellow">Yellow — vague but worth a call</option>
              <option value="red">Red — free-advice seeker / no budget / no urgency</option>
            </select>
          </div>
          <div>
            <label>Stage</label>
            <select value={draft.stage} onChange={(e) => set('stage', e.target.value as LeadStage)}>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Call Date / Time</label>
            <input
              type="datetime-local"
              value={draft.callDateTime ? draft.callDateTime.slice(0, 16) : ''}
              onChange={(e) => set('callDateTime', e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
          </div>
        </div>
        <label>Goal</label>
        <input value={draft.goal} onChange={(e) => set('goal', e.target.value)} />
        <label>Emotional WHY (from discovery — reference at the close)</label>
        <textarea value={draft.why} onChange={(e) => set('why', e.target.value)} />
        <label>Next Action</label>
        <input value={draft.nextAction} onChange={(e) => set('nextAction', e.target.value)} />
        <label>Notes</label>
        <textarea value={draft.notes} onChange={(e) => set('notes', e.target.value)} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontSize: 13 }}>
          <input
            type="checkbox"
            style={{ width: 'auto' }}
            checked={draft.isFriendLead}
            onChange={(e) => set('isFriendLead', e.target.checked)}
          />
          Friend lead (standard process + full price applies)
        </label>
        {draft.history.length > 0 && (
          <>
            <label>History</label>
            <div style={{ maxHeight: 110, overflowY: 'auto', fontSize: 12, color: '#9a9a9a' }}>
              {[...draft.history].reverse().map((h, i) => (
                <div key={i}>
                  {new Date(h.date).toLocaleDateString()} — {h.event}
                </div>
              ))}
            </div>
          </>
        )}
        <div className="ssi-row" style={{ marginTop: 16, justifyContent: 'space-between' }}>
          <div className="ssi-row">
            <button
              className="ssi-btn"
              onClick={() => {
                upsertLead(draft);
                onClose();
              }}
            >
              Save
            </button>
            <button
              className="ssi-btn ghost"
              onClick={() => {
                upsertLead(draft);
                touchLead(draft.id, 'Touched');
                onClose();
              }}
            >
              Save + Log Touch
            </button>
            <button className="ssi-btn ghost" onClick={onClose}>Cancel</button>
          </div>
          <button
            className="ssi-btn danger"
            onClick={() => {
              if (confirm(`Delete ${draft.name || 'this lead'}?`)) {
                deleteLead(draft.id);
                onClose();
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function PipelineBoard() {
  const { state } = useStore();
  const [editing, setEditing] = useState<Lead | null>(null);

  return (
    <div>
      <div className="ssi-row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
        <h1 className="ssi-h1">Pipeline Board</h1>
        <button className="ssi-btn" onClick={() => setEditing(blankLead())}>+ New Lead</button>
      </div>
      <p className="ssi-sub">Cards glow orange after {STALE_DAYS}+ days without a touch. The sheet is the scoreboard — keep it current.</p>
      <div className="ssi-board">
        {STAGES.map((stage) => {
          const leads = state.leads.filter((l) => l.stage === stage.key);
          return (
            <div className="ssi-col" key={stage.key}>
              <h4>
                {stage.label} <span style={{ color: '#666' }}>({leads.length})</span>
              </h4>
              {leads.map((lead) => {
                const stale =
                  daysSince(lead.lastTouch) >= STALE_DAYS &&
                  !['closed_won', 'closed_lost', 'onboarding'].includes(lead.stage);
                return (
                  <div
                    key={lead.id}
                    className={`ssi-lead-card${stale ? ' stale' : ''}`}
                    onClick={() => setEditing(lead)}
                  >
                    <div className="name">
                      {lead.name}
                      <span className={`ssi-badge ${lead.fit}`}>{lead.fit[0]}</span>
                      {lead.isFriendLead && <span className="ssi-badge orange">friend</span>}
                    </div>
                    <div className="meta">
                      {lead.goal && <div>{lead.goal}</div>}
                      {lead.callDateTime && <div>📞 {new Date(lead.callDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>}
                      <div>Last touch: {daysSince(lead.lastTouch)}d ago</div>
                    </div>
                    {lead.nextAction && <div className="next">→ {lead.nextAction}</div>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {editing && <LeadEditor lead={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
