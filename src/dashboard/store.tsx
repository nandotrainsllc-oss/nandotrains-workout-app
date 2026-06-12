/* eslint-disable react-refresh/only-export-components -- context provider + hook live together */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  AppState,
  CallSession,
  ChatMessage,
  ContentPost,
  CounterKey,
  DailyLog,
  Lead,
  Settings,
  WeeklyReview,
} from './types';
import { SEED_LEADS } from './data';
import { emptyLog, todayKey } from './lib';

const STORAGE_KEY = 'ssi-dashboard-v1';

function defaultState(): AppState {
  return {
    leads: SEED_LEADS,
    logs: {},
    posts: [],
    calls: [],
    reviews: {},
    settings: { apiKey: '', model: 'claude-sonnet-4-6' },
    chat: [],
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...(JSON.parse(raw) as AppState) };
  } catch {
    return defaultState();
  }
}

export interface Store {
  state: AppState;
  todayLog: DailyLog;
  bump: (key: CounterKey, delta?: number, date?: string) => void;
  upsertLead: (lead: Lead) => void;
  touchLead: (id: string, event: string) => void;
  deleteLead: (id: string) => void;
  upsertPost: (post: ContentPost) => void;
  deletePost: (id: string) => void;
  addCall: (call: CallSession) => void;
  saveReview: (review: WeeklyReview) => void;
  saveSettings: (settings: Settings) => void;
  setChat: (chat: ChatMessage[]) => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const today = todayKey();
  const todayLog = state.logs[today] ?? emptyLog(today);

  const store: Store = {
    state,
    todayLog,
    bump: (key, delta = 1, date = today) =>
      setState((s) => {
        const log = s.logs[date] ?? emptyLog(date);
        const next = Math.max(0, log[key] + delta);
        return { ...s, logs: { ...s.logs, [date]: { ...log, [key]: next } } };
      }),
    upsertLead: (lead) =>
      setState((s) => {
        const exists = s.leads.some((l) => l.id === lead.id);
        return {
          ...s,
          leads: exists ? s.leads.map((l) => (l.id === lead.id ? lead : l)) : [...s.leads, lead],
        };
      }),
    touchLead: (id, event) =>
      setState((s) => ({
        ...s,
        leads: s.leads.map((l) =>
          l.id === id
            ? {
                ...l,
                lastTouch: new Date().toISOString(),
                history: [...l.history, { date: new Date().toISOString(), event }],
              }
            : l,
        ),
      })),
    deleteLead: (id) => setState((s) => ({ ...s, leads: s.leads.filter((l) => l.id !== id) })),
    upsertPost: (post) =>
      setState((s) => {
        const exists = s.posts.some((p) => p.id === post.id);
        return {
          ...s,
          posts: exists ? s.posts.map((p) => (p.id === post.id ? post : p)) : [...s.posts, post],
        };
      }),
    deletePost: (id) => setState((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== id) })),
    addCall: (call) => setState((s) => ({ ...s, calls: [...s.calls, call] })),
    saveReview: (review) =>
      setState((s) => ({ ...s, reviews: { ...s.reviews, [review.weekStart]: review } })),
    saveSettings: (settings) => setState((s) => ({ ...s, settings })),
    setChat: (chat) => setState((s) => ({ ...s, chat })),
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
