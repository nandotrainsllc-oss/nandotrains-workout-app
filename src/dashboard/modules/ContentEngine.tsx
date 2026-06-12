import { useState } from 'react';
import { FORMAT_LABELS, PILLAR_LABELS, WEEKDAY_PILLARS } from '../data';
import { todayKey, weekDates, weekStartKey } from '../lib';
import { useStore } from '../store';
import type { ContentPost, DMTrigger, Pillar, PostFormat, PostStatus } from '../types';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STATUS_FLOW: PostStatus[] = ['idea', 'scripted', 'filmed', 'posted'];

function blankPost(date: string): ContentPost {
  const dow = new Date(`${date}T12:00:00`).getDay();
  return {
    id: `post-${Date.now()}`,
    date,
    pillar: WEEKDAY_PILLARS[dow].pillar,
    format: 'talking_head_broll',
    hook: '',
    script: '',
    filmingNotes: [{ timestamp: '0:00', note: '' }],
    dmTrigger: null,
    status: 'idea',
  };
}

function PostEditor({ post, onClose }: { post: ContentPost; onClose: () => void }) {
  const { upsertPost, deletePost, bump } = useStore();
  const [draft, setDraft] = useState<ContentPost>(post);
  const set = <K extends keyof ContentPost>(k: K, v: ContentPost[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="ssi-modal-backdrop" onClick={onClose}>
      <div className="ssi-modal" style={{ maxWidth: 860 }} onClick={(e) => e.stopPropagation()}>
        <h2>{post.hook ? post.hook : 'New Post'}</h2>
        <div className="ssi-grid2">
          <div>
            <label>Date</label>
            <input type="date" value={draft.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div>
            <label>Status</label>
            <select value={draft.status} onChange={(e) => set('status', e.target.value as PostStatus)}>
              {STATUS_FLOW.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Pillar</label>
            <select value={draft.pillar} onChange={(e) => set('pillar', e.target.value as Pillar)}>
              {(Object.keys(PILLAR_LABELS) as Pillar[]).map((p) => (
                <option key={p} value={p}>{PILLAR_LABELS[p]}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Format</label>
            <select value={draft.format} onChange={(e) => set('format', e.target.value as PostFormat)}>
              {(Object.keys(FORMAT_LABELS) as PostFormat[]).map((f) => (
                <option key={f} value={f}>{FORMAT_LABELS[f]}</option>
              ))}
            </select>
          </div>
        </div>
        <label>Hook</label>
        <input value={draft.hook} onChange={(e) => set('hook', e.target.value)} placeholder="The scroll-stopper" />
        <label>DM Trigger (which keyword the CTA drives)</label>
        <select
          value={draft.dmTrigger ?? ''}
          onChange={(e) => set('dmTrigger', (e.target.value || null) as DMTrigger)}
        >
          <option value="">— none —</option>
          <option value="MONDAY">MONDAY</option>
          <option value="SYSTEM">SYSTEM</option>
          <option value="READY">READY</option>
          <option value="DIFFERENT">DIFFERENT</option>
        </select>

        <div className="ssi-sidebyside" style={{ marginTop: 10 }}>
          <div>
            <label>Script</label>
            <textarea
              style={{ minHeight: 220 }}
              value={draft.script}
              onChange={(e) => set('script', e.target.value)}
              placeholder="Word-for-word script…"
            />
          </div>
          <div>
            <label>Filming Notes (timestamp-aligned)</label>
            {draft.filmingNotes.map((fn, i) => (
              <div className="ssi-fnote" key={i}>
                <input
                  value={fn.timestamp}
                  onChange={(e) =>
                    set('filmingNotes', draft.filmingNotes.map((n, j) => (j === i ? { ...n, timestamp: e.target.value } : n)))
                  }
                />
                <input
                  value={fn.note}
                  placeholder="Shot / delivery note"
                  onChange={(e) =>
                    set('filmingNotes', draft.filmingNotes.map((n, j) => (j === i ? { ...n, note: e.target.value } : n)))
                  }
                />
              </div>
            ))}
            <button
              className="ssi-btn ghost"
              onClick={() => set('filmingNotes', [...draft.filmingNotes, { timestamp: '', note: '' }])}
            >
              + Note
            </button>
          </div>
        </div>

        <div className="ssi-row" style={{ marginTop: 16, justifyContent: 'space-between' }}>
          <div className="ssi-row">
            <button
              className="ssi-btn"
              onClick={() => {
                const wasPosted = post.status === 'posted';
                if (draft.status === 'posted' && !wasPosted) bump('posts', 1, draft.date);
                upsertPost(draft);
                onClose();
              }}
            >
              Save
            </button>
            <button className="ssi-btn ghost" onClick={onClose}>Cancel</button>
          </div>
          <button
            className="ssi-btn danger"
            onClick={() => {
              if (confirm('Delete this post?')) {
                deletePost(draft.id);
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

export function ContentEngine() {
  const { state } = useStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [editing, setEditing] = useState<ContentPost | null>(null);

  const base = new Date();
  base.setDate(base.getDate() + weekOffset * 7);
  const dates = weekDates(weekStartKey(base));
  const today = todayKey();

  return (
    <div>
      <div className="ssi-row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
        <h1 className="ssi-h1">Content Engine</h1>
        <div className="ssi-row">
          <button className="ssi-btn ghost" onClick={() => setWeekOffset((w) => w - 1)}>← Prev</button>
          <button className="ssi-btn ghost" onClick={() => setWeekOffset(0)}>This Week</button>
          <button className="ssi-btn ghost" onClick={() => setWeekOffset((w) => w + 1)}>Next →</button>
        </div>
      </div>
      <p className="ssi-sub">
        Content is pre-call objection handling in public. Repeat what performed; vary the angle. Speak to the 25–40 guy with income.
      </p>

      <div className="ssi-week">
        {dates.map((date) => {
          const dow = new Date(`${date}T12:00:00`).getDay();
          const slot = WEEKDAY_PILLARS[dow];
          const posts = state.posts.filter((p) => p.date === date);
          return (
            <div className={`ssi-daycard${date === today ? ' today' : ''}`} key={date}>
              <div className="day">{DAY_SHORT[dow]} · {date.slice(5)}</div>
              <div className="slot">{slot.label}</div>
              {posts.map((p) => (
                <div className="ssi-post" key={p.id} onClick={() => setEditing(p)}>
                  <span className={`ssi-badge ${p.status === 'posted' ? 'green' : p.status === 'idea' ? 'gray' : 'yellow'}`}>
                    {p.status}
                  </span>
                  <div style={{ marginTop: 4 }}>{p.hook || PILLAR_LABELS[p.pillar]}</div>
                  {p.dmTrigger && <div style={{ color: '#ff6b00', fontSize: 11, marginTop: 2 }}>→ {p.dmTrigger}</div>}
                </div>
              ))}
              <button className="ssi-btn ghost" style={{ width: '100%', marginTop: 4 }} onClick={() => setEditing(blankPost(date))}>
                + Post
              </button>
            </div>
          );
        })}
      </div>

      <div className="ssi-card" style={{ marginTop: 16 }}>
        <h3>Locked Rules</h3>
        <ul style={{ fontSize: 13, lineHeight: 1.9, color: '#ccc', margin: 0, paddingLeft: 18 }}>
          <li>At least one story per day carries a DM trigger (poll, question sticker, “DM me X”).</li>
          <li>Reels = authority and pain mirrors. Never explain the offer in depth in a reel.</li>
          <li>Formats: Multi-Character POV · Talking Head + B-Roll · Storytelling Arc (Struggle → Twist → Lesson).</li>
          <li>Primary filming setup: Talking Head in car. Notes are timestamp-aligned next to the script.</li>
        </ul>
      </div>

      {editing && <PostEditor post={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
