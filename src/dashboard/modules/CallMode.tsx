import { useEffect, useState } from 'react';
import {
  DISCOVERY_SECTIONS,
  OBJECTION_LABELS,
  OBJECTION_PLAYS,
  SALES_CHECKLIST,
} from '../data';
import { useStore } from '../store';
import type { CallType, Lead, ObjectionType } from '../types';

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function ObjectionDrawer({
  objection,
  onClose,
}: {
  objection: ObjectionType;
  onClose: () => void;
}) {
  const play = OBJECTION_PLAYS[objection];
  return (
    <div className="ssi-modal-backdrop" onClick={onClose}>
      <div className="ssi-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{play.title}</h2>
        <ol style={{ lineHeight: 1.9, fontSize: 14, paddingLeft: 20 }}>
          {play.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        {objection !== 'money' && (
          <p style={{ color: '#ff6b00', fontWeight: 700, fontSize: 13 }}>
            Reminder: did you run Money first? It flushes out the real objection.
          </p>
        )}
        <button className="ssi-btn" onClick={onClose}>Back to call</button>
      </div>
    </div>
  );
}

export function CallMode() {
  const { state, upsertLead, touchLead, addCall, bump } = useStore();
  const [leadId, setLeadId] = useState<string>('');
  const [callType, setCallType] = useState<CallType>('discovery');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<boolean[]>(SALES_CHECKLIST.map(() => false));
  const [objection, setObjection] = useState<ObjectionType | null>(null);
  const [objectionsHit, setObjectionsHit] = useState<ObjectionType[]>([]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const lead = state.leads.find((l) => l.id === leadId) ?? null;
  const callable = state.leads.filter((l) => !['closed_won', 'closed_lost'].includes(l.stage));

  // Which discovery section is active based on cumulative minutes
  let activeIdx = -1;
  for (let i = 0, cum = 0; i < DISCOVERY_SECTIONS.length; i++) {
    cum += DISCOVERY_SECTIONS[i].minutes * 60;
    if (elapsed < cum) {
      activeIdx = i;
      break;
    }
  }

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setNotes({});
    setChecked(SALES_CHECKLIST.map(() => false));
    setObjectionsHit([]);
  };

  const finishCall = (
    outcome: 'booked_sales_call' | 'closed_pif' | 'closed_plan' | 'followup_48hr' | 'lost',
  ) => {
    if (!lead) return;
    addCall({
      id: `call-${Date.now()}`,
      leadId: lead.id,
      type: callType,
      sectionNotes: notes,
      objectionsHit,
      outcome,
      date: new Date().toISOString(),
    });

    const updated: Lead = { ...lead };
    if (callType === 'discovery') {
      bump('chatsHeld');
      if (notes.goalWhy) updated.why = updated.why ? `${updated.why}\n${notes.goalWhy}` : notes.goalWhy;
      const sectionSummary = Object.entries(notes)
        .filter(([, v]) => v.trim())
        .map(([k, v]) => `[${k}] ${v}`)
        .join('\n');
      if (sectionSummary) updated.notes = updated.notes ? `${updated.notes}\n--- Discovery ---\n${sectionSummary}` : sectionSummary;
      if (outcome === 'booked_sales_call') {
        updated.stage = 'sales_call_booked';
        updated.nextAction = 'Run the sales call framework — recap WHY, deck 1–4, app demo, slide 5';
        bump('chatsBooked');
      } else if (outcome === 'lost') {
        updated.stage = 'closed_lost';
      }
    } else {
      bump('salesCalls');
      if (outcome === 'closed_pif' || outcome === 'closed_plan') {
        updated.stage = 'closed_won';
        updated.paymentPlan = outcome === 'closed_pif' ? 'pif' : updated.paymentPlan ?? '6pay';
        updated.nextAction = 'Onboard: welcome email + SSI Packet + app invite SAME DAY';
        bump('closes');
      } else if (outcome === 'followup_48hr') {
        updated.stage = 'followup_48hr';
        updated.nextAction = 'Follow up in 48 hours — no open loops';
      } else {
        updated.stage = 'closed_lost';
      }
    }
    upsertLead(updated);
    touchLead(lead.id, `${callType === 'discovery' ? 'Discovery' : 'Sales'} call → ${outcome}`);
    reset();
    setLeadId('');
  };

  if (!lead || !running) {
    return (
      <div className="ssi-callmode">
        <h1 className="ssi-h1">Call Mode</h1>
        <p className="ssi-sub">Full-screen script runner. Discovery diagnoses and books; the sales call sells.</p>
        <div className="ssi-card">
          <h3>Set Up the Call</h3>
          <label>Lead</label>
          <select value={leadId} onChange={(e) => setLeadId(e.target.value)}>
            <option value="">— pick a lead —</option>
            {callable.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.stage.replace(/_/g, ' ')})
              </option>
            ))}
          </select>
          <label>Call Type</label>
          <div className="ssi-row">
            <button
              className={`ssi-btn ${callType === 'discovery' ? '' : 'ghost'}`}
              onClick={() => setCallType('discovery')}
            >
              Discovery (15 min)
            </button>
            <button
              className={`ssi-btn ${callType === 'sales' ? '' : 'ghost'}`}
              onClick={() => setCallType('sales')}
            >
              Sales Call (30–45 min)
            </button>
          </div>
          {lead && (
            <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.7 }}>
              <strong style={{ color: '#ffb800' }}>{lead.name}</strong>
              {lead.isFriendLead && <span className="ssi-badge orange" style={{ marginLeft: 8 }}>friend — full price</span>}
              <div>Goal: {lead.goal || '—'}</div>
              <div>WHY: {lead.why || '— (capture it on the discovery call)'}</div>
              <div>Next: {lead.nextAction || '—'}</div>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <button className="ssi-btn gold" disabled={!lead} onClick={() => setRunning(true)}>
              ▶ Start Call
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (callType === 'discovery') {
    return (
      <div className="ssi-callmode">
        <div className="ssi-banner">NO SELLING. NO PRICING.</div>
        <div className="ssi-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{lead.name}</div>
            <div style={{ color: '#9a9a9a', fontSize: 13 }}>Discovery · diagnose + book only</div>
          </div>
          <div className="ssi-timer">{fmt(elapsed)} <span style={{ fontSize: 16, color: '#9a9a9a' }}>/ 15:00</span></div>
        </div>
        {DISCOVERY_SECTIONS.map((sec, i) => (
          <div className={`ssi-section${i === activeIdx ? ' active' : ''}`} key={sec.key}>
            <div className="sec-head">
              <span className="sec-title">{i + 1}. {sec.label}</span>
              <span className="sec-min">{sec.minutes} min</span>
            </div>
            {sec.prompts.map((p, j) => (
              <div className="prompt" key={j}>{p}</div>
            ))}
            <textarea
              placeholder={sec.key === 'goalWhy' ? 'THE WHY — this saves to the lead card' : 'Notes…'}
              value={notes[sec.key] ?? ''}
              onChange={(e) => setNotes((n) => ({ ...n, [sec.key]: e.target.value }))}
            />
          </div>
        ))}
        <div className="ssi-card">
          <h3>End the Call</h3>
          <div className="ssi-row">
            <button className="ssi-btn gold" onClick={() => finishCall('booked_sales_call')}>✓ Sales Call Booked</button>
            <button className="ssi-btn ghost" onClick={() => finishCall('followup_48hr')}>Needs Follow-Up</button>
            <button className="ssi-btn danger" onClick={() => finishCall('lost')}>Not a Fit</button>
            <button className="ssi-btn ghost" onClick={reset}>Abort (no log)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ssi-callmode">
      <div className="ssi-banner gold">SLIDE 7 ONLY AFTER COMMITMENT · STOP TALKING AFTER THE OFFER</div>
      <div className="ssi-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            {lead.name}
            {lead.isFriendLead && <span className="ssi-badge orange" style={{ marginLeft: 8 }}>friend — standard price</span>}
          </div>
          <div style={{ color: '#ffb800', fontSize: 13, maxWidth: 560 }}>
            WHY: {lead.why || 'No WHY captured — dig it up in the recap.'}
          </div>
        </div>
        <div className="ssi-timer">{fmt(elapsed)}</div>
      </div>

      <div className="ssi-card">
        <h3>Phase 3–4 Checklist</h3>
        <ul className="ssi-checklist">
          {SALES_CHECKLIST.map((item, i) => (
            <li
              key={i}
              className={checked[i] ? 'done' : ''}
              onClick={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
            >
              <span className="box">{checked[i] ? '✓' : ''}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="ssi-card">
        <h3>Objection Quick-Draw — always run Money first</h3>
        <div className="ssi-objections">
          {(Object.keys(OBJECTION_LABELS) as ObjectionType[]).map((o) => (
            <button
              key={o}
              className={o === 'money' ? 'money' : ''}
              onClick={() => {
                setObjection(o);
                setObjectionsHit((hits) => (hits.includes(o) ? hits : [...hits, o]));
              }}
            >
              {OBJECTION_LABELS[o]}
            </button>
          ))}
        </div>
        {objectionsHit.length > 0 && (
          <div style={{ fontSize: 12, color: '#9a9a9a' }}>
            Hit this call: {objectionsHit.map((o) => OBJECTION_LABELS[o]).join(' · ')}
          </div>
        )}
      </div>

      <div className="ssi-card">
        <h3>Outcome</h3>
        <div className="ssi-row">
          <button className="ssi-btn gold" onClick={() => finishCall('closed_pif')}>Closed — PIF $2,850</button>
          <button className="ssi-btn" onClick={() => finishCall('closed_plan')}>Closed — 2/3/6 Pay</button>
          <button className="ssi-btn ghost" onClick={() => finishCall('followup_48hr')}>48hr Follow-Up</button>
          <button className="ssi-btn danger" onClick={() => finishCall('lost')}>Lost</button>
          <button className="ssi-btn ghost" onClick={reset}>Abort (no log)</button>
        </div>
      </div>

      {objection && <ObjectionDrawer objection={objection} onClose={() => setObjection(null)} />}
    </div>
  );
}
