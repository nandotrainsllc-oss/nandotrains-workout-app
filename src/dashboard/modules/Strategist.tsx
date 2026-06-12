import { useEffect, useRef, useState } from 'react';
import { COUNTER_LABELS, QUICK_ACTIONS, STRATEGIST_SYSTEM_PROMPT, TARGETS, WEEKDAY_PILLARS } from '../data';
import { computeRollup, todayKey, weekStartKey } from '../lib';
import { useStore } from '../store';
import type { Store } from '../store';
import type { ChatMessage, CounterKey } from '../types';

/** Snapshot of live dashboard state, prepended to every request as ground truth. */
function buildContext(store: Store): string {
  const { state, todayLog } = store;
  const now = new Date();
  const slot = WEEKDAY_PILLARS[now.getDay()];
  const counters = (Object.entries(TARGETS) as [CounterKey, number][])
    .map(([k, t]) => `${COUNTER_LABELS[k]}: ${todayLog[k]}/${t}`)
    .join(', ');
  const pipeline = state.leads
    .filter((l) => l.stage !== 'closed_lost')
    .map(
      (l) =>
        `- ${l.name} [${l.stage.replace(/_/g, ' ')}] fit=${l.fit}${l.isFriendLead ? ' FRIEND-LEAD' : ''} | goal: ${l.goal || '?'} | WHY: ${l.why || 'not captured'} | next: ${l.nextAction || '?'}${l.callDateTime ? ` | call: ${new Date(l.callDateTime).toLocaleString()}` : ''}`,
    )
    .join('\n');
  const rollup = computeRollup(state.logs, weekStartKey(now), COUNTER_LABELS);
  return `[DASHBOARD STATE — ${todayKey()}]
Today's content slot: ${slot.label} (${slot.job})
Today's counters: ${counters} | Chats booked: ${todayLog.chatsBooked}, held: ${todayLog.chatsHeld}, sales calls: ${todayLog.salesCalls}, closes: ${todayLog.closes}

Pipeline:
${pipeline || '(empty)'}

This week's rollup: DM→Chat ${rollup.dmToChatPct.toFixed(1)}%, Show ${rollup.showRatePct.toFixed(0)}%, Close ${rollup.closeRatePct.toFixed(0)}%, closes ${rollup.totals.closes}.
Input attainment: ${rollup.attainment.map((a) => `${a.label} ${Math.round(a.pct)}%`).join(', ')}.
Worst input: ${rollup.worstInput}.
[END DASHBOARD STATE]`;
}

async function callStrategist(
  apiKey: string,
  model: string,
  context: string,
  history: ChatMessage[],
): Promise<string> {
  const messages = history.map((m, i) =>
    i === history.length - 1 && m.role === 'user'
      ? { role: m.role, content: `${context}\n\n${m.content}` }
      : { role: m.role, content: m.content },
  );
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: STRATEGIST_SYSTEM_PROMPT,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err.slice(0, 300)}`);
  }
  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  return data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('\n');
}

export function Strategist({ onClose }: { onClose: () => void }) {
  const store = useStore();
  const { state, setChat, saveSettings } = store;
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showSettings, setShowSettings] = useState(!state.settings.apiKey);
  const [keyDraft, setKeyDraft] = useState(state.settings.apiKey);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight });
  }, [state.chat, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    if (!state.settings.apiKey) {
      setShowSettings(true);
      return;
    }
    const history: ChatMessage[] = [...state.chat, { role: 'user', content: trimmed }];
    setChat(history);
    setInput('');
    setBusy(true);
    try {
      const reply = await callStrategist(
        state.settings.apiKey,
        state.settings.model,
        buildContext(store),
        history,
      );
      setChat([...history, { role: 'assistant', content: reply }]);
    } catch (e) {
      setChat([
        ...history,
        { role: 'assistant', content: `⚠️ ${e instanceof Error ? e.message : 'Request failed.'}` },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="ssi-ai">
      <div className="ssi-ai-head">
        <span className="title">⚡ SSI STRATEGIST</span>
        <div className="ssi-row" style={{ gap: 6 }}>
          <button className="ssi-btn ghost" style={{ padding: '4px 10px' }} onClick={() => setShowSettings((s) => !s)}>
            ⚙
          </button>
          <button className="ssi-btn ghost" style={{ padding: '4px 10px' }} onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      {showSettings && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #262626' }}>
          <label>Anthropic API Key (stored locally in your browser)</label>
          <input
            type="password"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            placeholder="sk-ant-…"
          />
          <label>Model</label>
          <select
            value={state.settings.model}
            onChange={(e) => saveSettings({ ...state.settings, model: e.target.value })}
          >
            <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (fast)</option>
            <option value="claude-opus-4-8">Claude Opus 4.8 (deep)</option>
          </select>
          <div className="ssi-row" style={{ marginTop: 10 }}>
            <button
              className="ssi-btn"
              onClick={() => {
                saveSettings({ ...state.settings, apiKey: keyDraft.trim() });
                setShowSettings(false);
              }}
            >
              Save
            </button>
            {state.chat.length > 0 && (
              <button className="ssi-btn ghost" onClick={() => setChat([])}>Clear chat</button>
            )}
          </div>
        </div>
      )}

      <div className="ssi-ai-msgs" ref={msgsRef}>
        {state.chat.length === 0 && (
          <div className="ssi-msg assistant">
            SSI Strategist online. Every request goes out with your live counters, pipeline, and weekly rollup attached — so ask with real numbers in mind. Use the quick actions below or just talk.
            {!state.settings.apiKey && '\n\n⚙ Add your Anthropic API key first (gear icon).'}
          </div>
        )}
        {state.chat.map((m, i) => (
          <div key={i} className={`ssi-msg ${m.role}`}>{m.content}</div>
        ))}
        {busy && <div className="ssi-msg assistant">Powering up…</div>}
      </div>

      <div className="ssi-quick">
        {QUICK_ACTIONS.map((qa) => (
          <button key={qa.label} onClick={() => send(qa.prompt)} disabled={busy}>
            {qa.label}
          </button>
        ))}
      </div>

      <div className="ssi-ai-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          placeholder="Ask the strategist…"
        />
        <button className="ssi-btn" onClick={() => void send(input)} disabled={busy || !input.trim()}>
          ➤
        </button>
      </div>
    </aside>
  );
}
