# Connecting the Dashboard to Your Google Sheets

The dashboard syncs with your **30-Day Sprint Tracking Sheet** and **Lead Tracker**
through a small Google Apps Script "bridge" that runs inside your own Google
account. No third-party services, nothing to pay for.

**The contract:** the dashboard is the source of truth.

- **Push** writes your daily counters into the Sprint sheet (one row per day,
  matched by Date) and your leads into the Lead Tracker (matched by ID, then
  Name). Existing formula/percent columns in your sheets are never touched —
  the script only fills the columns it owns and appends any that are missing.
- **Pull** imports leads from the tracker that aren't on the board yet. It
  never edits cards that already exist.

## One-time setup (~5 minutes)

1. **Grab your two spreadsheet IDs.** Open each sheet in the browser; the ID is
   the long string in the URL between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

2. **Install the bridge.** Open your Sprint sheet → **Extensions → Apps
   Script**. Delete the starter code and paste the entire contents of
   [`apps-script/SSI_Sync.gs`](apps-script/SSI_Sync.gs) from this repo.

3. **Fill in the config** at the top of the script:
   ```js
   var SPRINT_SPREADSHEET_ID = '…your sprint sheet ID…';
   var LEAD_SPREADSHEET_ID = '…your lead tracker ID…';
   ```
   By default the script writes to tabs named `SSI Daily Log` and `SSI Leads`
   (it creates them if they don't exist). If you'd rather it write straight
   into your existing tabs, change `DAILY_LOG_TAB` / `LEADS_TAB` to those tab
   names — the script will append any column headers it needs and leave the
   rest of your layout alone.

4. **Deploy it.** Click **Deploy → New deployment** → gear icon → **Web app**:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Click **Deploy**, approve the permissions prompt, and **copy the Web app URL**
     (it ends in `/exec`).

   > "Anyone" means anyone **with that exact unguessable URL** can write rows to
   > those two sheets. Don't post the URL publicly. You can revoke it any time
   > from Deploy → Manage deployments.

5. **Connect the dashboard.** Open the dashboard → **⟳ SYNC** in the top bar →
   paste the URL → **Save URL** → hit **▲ Push to Sheets**. Your counters and
   pipeline appear in the sheets.

## Daily use

- End of the grind (or any time): **⟳ SYNC → Push to Sheets.**
- Added leads directly in the tracker? **⟳ SYNC → Pull New Leads** brings them
  onto the board.
- If you redeploy the script, the URL can change — update it in the panel.

## Troubleshooting

- **"Sheets bridge returned 401/403"** — the deployment isn't set to *Anyone*,
  or you copied the editor URL instead of the `/exec` web-app URL.
- **Rows duplicating instead of updating** — the Date or ID column header got
  renamed in the sheet. Keep the headers the script created.
- **Changed the script?** You must create a **new deployment** (or update the
  existing one) for changes to take effect.
