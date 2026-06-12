import { COUNTER_LABELS, TARGETS, WEEKDAY_PILLARS } from '../data';
import { counterColor, isWeekend } from '../lib';
import { useStore } from '../store';
import type { CounterKey } from '../types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Counter({ k }: { k: CounterKey }) {
  const { todayLog, bump } = useStore();
  const actual = todayLog[k];
  const target = TARGETS[k] ?? 0;
  const color = target > 0 ? counterColor(actual, target) : 'green';
  const pct = target > 0 ? Math.min(100, (actual / target) * 100) : actual > 0 ? 100 : 0;
  return (
    <div className="ssi-counter">
      <div className="label">{COUNTER_LABELS[k]}</div>
      <div className={`value ${color}`}>
        {actual}
        {target > 0 && <span style={{ fontSize: 15, color: '#9a9a9a' }}> / {target}</span>}
      </div>
      <div className="bar">
        <div className={color} style={{ width: `${pct}%` }} />
      </div>
      <div className="ops">
        <button onClick={() => bump(k, -1)} aria-label={`decrement ${k}`}>−</button>
        <button className="plus" onClick={() => bump(k, 1)} aria-label={`increment ${k}`}>+</button>
      </div>
    </div>
  );
}

export function CommandCenter() {
  const now = new Date();
  const weekend = isWeekend(now);
  const slot = WEEKDAY_PILLARS[now.getDay()];

  if (weekend) {
    return (
      <div>
        <h1 className="ssi-h1">Command Center — Weekend Mode</h1>
        <p className="ssi-sub">{DAY_NAMES[now.getDay()]} · Stories + monitor only. The engine rests; you don’t chase.</p>
        <div className="ssi-card ssi-today-slot">
          <h3>Today’s Job</h3>
          <div className="pillar">Stories Only</div>
          <p style={{ color: '#ccc', margin: '6px 0 0' }}>
            Light story posts + behind-the-scenes. Monitor DMs, reply to inbound within 60 minutes. No outbound volume.
          </p>
        </div>
        <div className="ssi-counters" style={{ maxWidth: 400 }}>
          <Counter k="stories" />
          <Counter k="followUps" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="ssi-h1">Command Center</h1>
      <p className="ssi-sub">
        {DAY_NAMES[now.getDay()]} · Run the four motions in order: Content → Outbound → Follow-up → Calls.
      </p>

      <div className="ssi-card ssi-today-slot">
        <h3>Today’s Content Slot</h3>
        <div className="pillar">{slot.label}</div>
        <p style={{ color: '#ccc', margin: '6px 0 0' }}>{slot.job} · At least 1 story carries a DM trigger.</p>
      </div>

      <div className="ssi-card ssi-motion">
        <h3><span className="motion-num">1</span>Content <span style={{ color: '#9a9a9a', fontWeight: 400 }}>(15–30 min)</span></h3>
        <div className="ssi-counters">
          <Counter k="posts" />
          <Counter k="stories" />
        </div>
      </div>

      <div className="ssi-card ssi-motion">
        <h3><span className="motion-num">2</span>Outbound DMs <span style={{ color: '#9a9a9a', fontWeight: 400 }}>(30–60 min)</span></h3>
        <div className="ssi-counters">
          <Counter k="coldDMs" />
          <Counter k="warmDMs" />
          <Counter k="reactivationDMs" />
          <Counter k="comments" />
        </div>
      </div>

      <div className="ssi-card ssi-motion">
        <h3><span className="motion-num">3</span>Follow-up <span style={{ color: '#9a9a9a', fontWeight: 400 }}>(15–30 min) — the thread you already have is closest to money</span></h3>
        <div className="ssi-counters">
          <Counter k="followUps" />
        </div>
      </div>

      <div className="ssi-card ssi-motion">
        <h3><span className="motion-num">4</span>Calls <span style={{ color: '#9a9a9a', fontWeight: 400 }}>(variable)</span></h3>
        <div className="ssi-counters">
          <Counter k="chatsBooked" />
          <Counter k="chatsHeld" />
          <Counter k="salesCalls" />
          <Counter k="closes" />
        </div>
      </div>
    </div>
  );
}
