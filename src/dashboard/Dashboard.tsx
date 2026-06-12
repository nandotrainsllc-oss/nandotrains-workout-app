import { useState } from 'react';
import './dashboard.css';
import { StoreProvider } from './store';
import { CommandCenter } from './modules/CommandCenter';
import { PipelineBoard } from './modules/PipelineBoard';
import { CallMode } from './modules/CallMode';
import { DMConsole } from './modules/DMConsole';
import { ContentEngine } from './modules/ContentEngine';
import { Scoreboard } from './modules/Scoreboard';
import { Strategist } from './modules/Strategist';
import { SyncPanel } from './modules/SyncPanel';
import type { SyncStatus } from './modules/SyncPanel';

type Tab = 'today' | 'pipeline' | 'call' | 'dm' | 'content' | 'score';

const TABS: { key: Tab; label: string }[] = [
  { key: 'today', label: 'TODAY' },
  { key: 'pipeline', label: 'PIPELINE' },
  { key: 'call', label: 'CALL MODE' },
  { key: 'dm', label: 'DM CONSOLE' },
  { key: 'content', label: 'CONTENT' },
  { key: 'score', label: 'SCOREBOARD' },
];

const SYNC_ICONS: Record<SyncStatus, string> = {
  idle: '⟳',
  busy: '⟳ …',
  ok: '⟳ ✓',
  error: '⟳ ⚠',
};

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('today');
  const [aiOpen, setAiOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  return (
    <StoreProvider>
      <div className="ssi">
        <header className="ssi-topbar">
          <div className="ssi-logo">
            SSI <span>OS</span>
          </div>
          <nav className="ssi-nav">
            {TABS.map((t) => (
              <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </nav>
          <button className="ssi-ai-toggle" onClick={() => setSyncOpen(true)}>
            {SYNC_ICONS[syncStatus]} SYNC
          </button>
          <button className={`ssi-ai-toggle${aiOpen ? ' open' : ''}`} onClick={() => setAiOpen((o) => !o)}>
            ⚡ STRATEGIST
          </button>
        </header>
        <div className="ssi-body">
          <main className="ssi-main">
            {tab === 'today' && <CommandCenter />}
            {tab === 'pipeline' && <PipelineBoard />}
            {tab === 'call' && <CallMode />}
            {tab === 'dm' && <DMConsole />}
            {tab === 'content' && <ContentEngine />}
            {tab === 'score' && <Scoreboard />}
          </main>
          {aiOpen && <Strategist onClose={() => setAiOpen(false)} />}
        </div>
        {syncOpen && <SyncPanel onClose={() => setSyncOpen(false)} setStatus={setSyncStatus} />}
      </div>
    </StoreProvider>
  );
}
