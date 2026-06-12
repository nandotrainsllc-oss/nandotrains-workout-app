import { useState } from 'react';
import { useStore } from '../store';
import { syncPullLeads, syncPush } from '../sync';

export type SyncStatus = 'idle' | 'busy' | 'ok' | 'error';

export function SyncPanel({
  onClose,
  setStatus,
}: {
  onClose: () => void;
  setStatus: (s: SyncStatus) => void;
}) {
  const { state, saveSettings, importLeads } = useStore();
  const [urlDraft, setUrlDraft] = useState(state.settings.syncUrl);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const savedUrl = state.settings.syncUrl;

  const run = async (kind: 'push' | 'pull') => {
    if (!savedUrl) {
      setMessage('Save your Apps Script URL first.');
      return;
    }
    setBusy(true);
    setStatus('busy');
    setMessage(kind === 'push' ? 'Pushing to Sheets…' : 'Pulling leads from the tracker…');
    try {
      if (kind === 'push') {
        const result = await syncPush(savedUrl, state);
        if (!result.ok) throw new Error(result.error ?? 'Push failed');
        setMessage(`✓ Pushed ${result.logs ?? 0} daily log rows and ${result.leads ?? 0} leads.`);
      } else {
        const leads = await syncPullLeads(savedUrl);
        const before = state.leads.length;
        importLeads(leads);
        setMessage(
          `✓ Tracker has ${leads.length} leads — new ones (not already on the board) were imported. Board had ${before}.`,
        );
      }
      saveSettings({ ...state.settings, lastSync: new Date().toISOString() });
      setStatus('ok');
    } catch (e) {
      setStatus('error');
      setMessage(`⚠️ ${e instanceof Error ? e.message : 'Sync failed.'}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ssi-modal-backdrop" onClick={onClose}>
      <div className="ssi-modal" onClick={(e) => e.stopPropagation()}>
        <h2>⟳ Google Sheets Sync</h2>
        <p style={{ fontSize: 13, color: '#9a9a9a', lineHeight: 1.6, marginTop: 0 }}>
          Connects to your 30-Day Sprint sheet and Lead Tracker through a Google Apps Script
          bridge. One-time setup lives in <code>apps-script/SSI_Sync.gs</code> — paste it into
          your sheet via Extensions → Apps Script, deploy as a web app, and drop the URL here.
        </p>
        <label>Apps Script Web App URL</label>
        <input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder="https://script.google.com/macros/s/…/exec"
        />
        <div className="ssi-row" style={{ marginTop: 10 }}>
          <button
            className="ssi-btn"
            onClick={() => {
              saveSettings({ ...state.settings, syncUrl: urlDraft.trim() });
              setMessage('URL saved.');
            }}
          >
            Save URL
          </button>
        </div>

        <h3 style={{ marginTop: 20 }}>Actions</h3>
        <p style={{ fontSize: 12, color: '#9a9a9a', margin: '0 0 10px' }}>
          The dashboard is the source of truth: <strong>Push</strong> updates sheet rows by
          date/lead. <strong>Pull</strong> only imports tracker leads that aren’t on the board
          yet — it never edits existing cards.
        </p>
        <div className="ssi-row">
          <button className="ssi-btn gold" disabled={busy || !savedUrl} onClick={() => void run('push')}>
            ▲ Push to Sheets
          </button>
          <button className="ssi-btn ghost" disabled={busy || !savedUrl} onClick={() => void run('pull')}>
            ▼ Pull New Leads
          </button>
          <button className="ssi-btn ghost" onClick={onClose}>Close</button>
        </div>
        {message && <p style={{ fontSize: 13, color: '#ffb800', marginTop: 12 }}>{message}</p>}
        {state.settings.lastSync && (
          <p style={{ fontSize: 12, color: '#9a9a9a', marginTop: 6 }}>
            Last synced: {new Date(state.settings.lastSync).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
