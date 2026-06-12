import { useState } from 'react';
import { COUNTER_LABELS } from '../data';
import { computeRollup, counterColor, weekDates, weekStartKey } from '../lib';
import { useStore } from '../store';
import type { CounterKey } from '../types';

const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SPRINT_CLOSE_TARGET = 5; // sprint goal: 3–5 closes
const COLUMNS: CounterKey[] = [
  'posts', 'stories', 'comments', 'coldDMs', 'warmDMs', 'reactivationDMs',
  'followUps', 'chatsBooked', 'chatsHeld', 'salesCalls', 'closes',
];

export function Scoreboard() {
  const { state, saveReview } = useStore();
  const [weekOffset, setWeekOffset] = useState(0);

  const base = new Date();
  base.setDate(base.getDate() + weekOffset * 7);
  const weekStart = weekStartKey(base);
  const dates = weekDates(weekStart);
  const rollup = computeRollup(state.logs, weekStart, COUNTER_LABELS);

  const review = state.reviews[weekStart] ?? { weekStart, worstInput: '', fix: '', grade: '' };

  const closedLeads = state.leads.filter((l) => l.stage === 'closed_won' || l.stage === 'onboarding');
  const revenue = closedLeads.reduce((sum, l) => sum + (l.paymentPlan === 'pif' ? 2850 : 3000), 0);
  const totalCloses = Object.values(state.logs).reduce((sum, log) => sum + log.closes, 0);
  const sprintCloses = Math.max(totalCloses, closedLeads.length);

  return (
    <div>
      <div className="ssi-row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
        <h1 className="ssi-h1">Scoreboard</h1>
        <div className="ssi-row">
          <button className="ssi-btn ghost" onClick={() => setWeekOffset((w) => w - 1)}>← Prev</button>
          <button className="ssi-btn ghost" onClick={() => setWeekOffset(0)}>This Week</button>
          <button className="ssi-btn ghost" onClick={() => setWeekOffset((w) => w + 1)}>Next →</button>
        </div>
      </div>
      <p className="ssi-sub">
        Week of {weekStart}. The sheet is the scoreboard. If behind, fix the input — don’t blame the audience.
      </p>

      <div className="ssi-card">
        <h3>Sprint Progress — closes vs the 3–5 target</h3>
        <div className="ssi-progress">
          <div style={{ width: `${Math.min(100, (sprintCloses / SPRINT_CLOSE_TARGET) * 100)}%` }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#ccc' }}>
          {sprintCloses} closed · target 3–5 · revenue closed:{' '}
          <strong style={{ color: '#ffb800' }}>${revenue.toLocaleString()}</strong>
        </div>
      </div>

      <div className="ssi-card" style={{ overflowX: 'auto' }}>
        <h3>Daily Log</h3>
        <table className="ssi-table">
          <thead>
            <tr>
              <th>Day</th>
              {COLUMNS.map((c) => (
                <th key={c}>{COUNTER_LABELS[c]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map((d, i) => {
              const log = state.logs[d];
              return (
                <tr key={d}>
                  <td>{DAY_SHORT[i]} {d.slice(5)}</td>
                  {COLUMNS.map((c) => (
                    <td key={c} style={{ color: log && log[c] > 0 ? '#f2f2f2' : '#555' }}>
                      {log ? log[c] : 0}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr style={{ fontWeight: 800 }}>
              <td style={{ color: '#ffb800' }}>TOTAL</td>
              {COLUMNS.map((c) => (
                <td key={c} style={{ color: '#ffb800' }}>{rollup.totals[c]}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ssi-counters" style={{ marginBottom: 16 }}>
        <div className="ssi-card ssi-metric" style={{ margin: 0 }}>
          <div className="big">{rollup.dmToChatPct.toFixed(1)}%</div>
          <div className="small">DM → Chat</div>
        </div>
        <div className="ssi-card ssi-metric" style={{ margin: 0 }}>
          <div className="big">{rollup.showRatePct.toFixed(0)}%</div>
          <div className="small">Show Rate</div>
        </div>
        <div className="ssi-card ssi-metric" style={{ margin: 0 }}>
          <div className="big">{rollup.closeRatePct.toFixed(0)}%</div>
          <div className="small">Close Rate</div>
        </div>
        <div className="ssi-card ssi-metric" style={{ margin: 0 }}>
          <div className="big">{rollup.totals.closes}</div>
          <div className="small">Closes This Week</div>
        </div>
      </div>

      <div className="ssi-card">
        <h3>Input Attainment (weekday targets)</h3>
        {rollup.attainment.map((a) => {
          const color = counterColor(a.actual, a.target);
          return (
            <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 150, fontSize: 13 }}>{a.label}</div>
              <div className="ssi-progress" style={{ flex: 1 }}>
                <div
                  style={{
                    width: `${Math.min(100, a.pct)}%`,
                    background: color === 'green' ? '#2ecc71' : color === 'yellow' ? '#ffb800' : '#ff3b3b',
                  }}
                />
              </div>
              <div style={{ width: 110, fontSize: 13, textAlign: 'right' }}>
                {a.actual} / {a.target} ({Math.round(a.pct)}%)
              </div>
            </div>
          );
        })}
      </div>

      <div className="ssi-card" style={{ borderColor: '#ffb800' }}>
        <h3>Friday Review — find the ONE input that’s off, fix it next week</h3>
        <div style={{ fontSize: 14, marginBottom: 10 }}>
          Worst input this week: <strong style={{ color: '#ff6b00' }}>{rollup.worstInput}</strong>
        </div>
        <label>The Fix (one fix, next week)</label>
        <textarea
          value={review.fix}
          onChange={(e) => saveReview({ ...review, worstInput: rollup.worstInput, fix: e.target.value })}
          placeholder="What changes Monday?"
        />
        <label>Week Grade</label>
        <select
          value={review.grade}
          onChange={(e) => saveReview({ ...review, worstInput: rollup.worstInput, grade: e.target.value })}
          style={{ maxWidth: 120 }}
        >
          <option value="">—</option>
          {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
