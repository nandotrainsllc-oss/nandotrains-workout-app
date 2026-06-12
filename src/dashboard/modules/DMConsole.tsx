import { useState } from 'react';
import { DM_SCRIPTS, KEYWORD_TRIGGERS } from '../data';
import { useStore } from '../store';
import type { DMScript } from '../data';

const LANES: { key: DMScript['lane']; label: string; note: string }[] = [
  { key: 'cold', label: 'Cold (5/day)', note: 'Move cold → warm. Earn the follow. NEVER book from a cold message.' },
  { key: 'warm', label: 'Warm (10/day)', note: 'Likers, commenters, story viewers, peers, past coworkers. Micro-rapport → casual qualify → invite when a real goal/pain surfaces.' },
  { key: 'reactivation', label: 'Reactivation (5/day)', note: 'Converts 2–3x cold. Lead with curiosity, never apologize. One nudge a week later if ghosted, then move on.' },
  { key: 'qualify', label: 'Qualify', note: 'Respond to inbound within 2 hours. Grade GREEN / YELLOW / RED — only book green and yellow.' },
  { key: 'followup', label: 'Follow-Up', note: 'The thread you already have is closest to money. Reply to every DM.' },
  { key: 'convert', label: 'Convert → Call', note: 'The DM doesn’t sell. The chat sells. Bridge to a 15-min diagnostic.' },
  { key: 'objection', label: 'Objections', note: 'Price / time / “tried before” in the DMs. Deflect price to the chat — always.' },
];

const MERGE_FIELDS = ['name', 'goal', 'timeframe', 'specific result', 'specific topic', 'original problem', 'goal area', 'recent thing', 'specific thing they mentioned'] as const;

function fillScript(body: string, values: Record<string, string>): string {
  let out = body;
  for (const [k, v] of Object.entries(values)) {
    if (v.trim()) out = out.split(`[${k}]`).join(v.trim());
  }
  return out;
}

export function DMConsole() {
  const { bump } = useStore();
  const [lane, setLane] = useState<DMScript['lane']>('cold');
  const [values, setValues] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const laneInfo = LANES.find((l) => l.key === lane)!;
  const scripts = DM_SCRIPTS.filter((s) => s.lane === lane);
  const usedFields = MERGE_FIELDS.filter((f) => scripts.some((s) => s.body.includes(`[${f}]`)));

  const copy = async (script: DMScript) => {
    const text = fillScript(script.body, values);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard can fail outside secure contexts; counter still logs the send
    }
    bump(script.counter, 1);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <h1 className="ssi-h1">DM Console</h1>
      <p className="ssi-sub">Fill the merge fields, copy, send. Every copy logs to the Command Center counter.</p>
      <div className="ssi-rulebar">
        Personalize first 8–12 words · One ask per message · NO PRICING IN DMs — EVER
      </div>

      <div className="ssi-lanes">
        {LANES.map((l) => (
          <button key={l.key} className={lane === l.key ? 'active' : ''} onClick={() => setLane(l.key)}>
            {l.label}
          </button>
        ))}
      </div>
      <p className="ssi-sub" style={{ marginTop: -6 }}>{laneInfo.note}</p>

      {usedFields.length > 0 && (
        <div className="ssi-card">
          <h3>Merge Fields</h3>
          <div className="ssi-merge">
            {usedFields.map((f) => (
              <input
                key={f}
                placeholder={`[${f}]`}
                value={values[f] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
              />
            ))}
          </div>
        </div>
      )}

      {scripts.map((script) => (
        <div className="ssi-card" key={script.id}>
          <h3>{script.title}</h3>
          <div className="ssi-script">{fillScript(script.body, values)}</div>
          <button className="ssi-btn" onClick={() => copy(script)}>
            {copiedId === script.id ? '✓ Copied + Logged' : 'Copy + Log Send'}
          </button>
        </div>
      ))}

      <div className="ssi-card">
        <h3>Keyword Triggers (content CTA → canned DM flow)</h3>
        {KEYWORD_TRIGGERS.map((t) => (
          <div key={t.keyword} style={{ marginBottom: 12 }}>
            <span className="ssi-badge orange" style={{ fontSize: 12 }}>{t.keyword}</span>
            <div style={{ fontSize: 13, color: '#ccc', marginTop: 4, lineHeight: 1.6 }}>{t.flow}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
