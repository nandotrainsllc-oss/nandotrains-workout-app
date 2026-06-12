/**
 * SSI Dashboard ⇄ Google Sheets sync bridge.
 *
 * SETUP (one time):
 * 1. Open your 30-Day Sprint sheet (or any sheet) → Extensions → Apps Script.
 * 2. Delete the starter code, paste this whole file.
 * 3. Fill in the two spreadsheet IDs below (the long string in each sheet's
 *    URL between /d/ and /edit).
 * 4. Deploy → New deployment → type: Web app → Execute as: Me →
 *    Who has access: Anyone → Deploy → copy the Web app URL.
 * 5. Paste that URL into the dashboard: ⟳ SYNC → Apps Script URL → Save.
 *
 * The script upserts rows by Date (Daily Log) and by ID/Name (Leads).
 * Missing column headers are appended automatically, so your existing
 * formula/percent columns are left untouched.
 */

// ── CONFIG ──────────────────────────────────────────────────────────────
var SPRINT_SPREADSHEET_ID = 'PASTE_SPRINT_SHEET_ID_HERE';
var LEAD_SPREADSHEET_ID = 'PASTE_LEAD_TRACKER_SHEET_ID_HERE';
var DAILY_LOG_TAB = 'SSI Daily Log'; // change to your existing tab name if you prefer
var LEADS_TAB = 'SSI Leads';

var LOG_HEADERS = [
  'Date', 'Posts', 'Stories', 'Peer Comments', 'Cold DMs', 'Warm DMs',
  'Reactivation DMs', 'Follow-ups', 'Chats Booked', 'Chats Held',
  'Sales Calls', 'Closes',
];
var LEAD_HEADERS = [
  'ID', 'Name', 'Handle', 'Source', 'Fit', 'Stage', 'Goal', 'WHY',
  'Next Action', 'Call Date/Time', 'Friend Lead', 'Payment Plan',
  'Notes', 'Last Touch',
];

// ── ENTRY POINTS ────────────────────────────────────────────────────────
function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.action === 'pull') {
      var rows = readRows(getSheet(LEAD_SPREADSHEET_ID, LEADS_TAB, LEAD_HEADERS), LEAD_HEADERS);
      return json({ ok: true, leads: rows });
    }
    return json({ ok: true, status: 'SSI sync online' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === 'push') {
      var logSheet = getSheet(SPRINT_SPREADSHEET_ID, DAILY_LOG_TAB, LOG_HEADERS);
      var leadSheet = getSheet(LEAD_SPREADSHEET_ID, LEADS_TAB, LEAD_HEADERS);
      (body.logs || []).forEach(function (row) {
        upsertRow(logSheet, LOG_HEADERS, 'Date', row);
      });
      (body.leads || []).forEach(function (row) {
        upsertRow(leadSheet, LEAD_HEADERS, 'ID', row, 'Name');
      });
      return json({
        ok: true,
        logs: (body.logs || []).length,
        leads: (body.leads || []).length,
      });
    }
    return json({ ok: false, error: 'Unknown action: ' + body.action });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// ── HELPERS ─────────────────────────────────────────────────────────────
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getSheet(spreadsheetId, tabName, headers) {
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    return sheet;
  }
  // Append any headers the tab is missing; never touch existing columns.
  var lastCol = Math.max(1, sheet.getLastColumn());
  var existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  headers.forEach(function (h) {
    if (existing.indexOf(h) === -1) {
      sheet.getRange(1, existing.length + 1).setValue(h);
      existing.push(h);
    }
  });
  return sheet;
}

function headerMap(sheet) {
  var lastCol = sheet.getLastColumn();
  var row = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  row.forEach(function (h, i) {
    if (h !== '') map[String(h)] = i + 1;
  });
  return map;
}

/** Normalize cell/key values so '2026-06-12' matches a real Date cell. */
function keyString(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value).trim();
}

function upsertRow(sheet, headers, keyHeader, rowObj, fallbackKeyHeader) {
  var map = headerMap(sheet);
  var keyCol = map[keyHeader];
  var key = keyString(rowObj[keyHeader] || '');
  var fallbackCol = fallbackKeyHeader ? map[fallbackKeyHeader] : null;
  var fallbackKey = fallbackKeyHeader ? keyString(rowObj[fallbackKeyHeader] || '') : '';

  var lastRow = sheet.getLastRow();
  var targetRow = -1;
  if (lastRow > 1) {
    var keys = sheet.getRange(2, keyCol, lastRow - 1, 1).getValues();
    for (var i = 0; i < keys.length; i++) {
      if (key && keyString(keys[i][0]) === key) {
        targetRow = i + 2;
        break;
      }
    }
    if (targetRow === -1 && fallbackCol && fallbackKey) {
      var names = sheet.getRange(2, fallbackCol, lastRow - 1, 1).getValues();
      for (var j = 0; j < names.length; j++) {
        if (keyString(names[j][0]).toLowerCase() === fallbackKey.toLowerCase()) {
          targetRow = j + 2;
          break;
        }
      }
    }
  }
  if (targetRow === -1) targetRow = lastRow + 1;

  headers.forEach(function (h) {
    if (map[h] && rowObj.hasOwnProperty(h)) {
      sheet.getRange(targetRow, map[h]).setValue(rowObj[h]);
    }
  });
}

function readRows(sheet, headers) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var map = headerMap(sheet);
  var lastCol = sheet.getLastColumn();
  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return values
    .map(function (row) {
      var obj = {};
      headers.forEach(function (h) {
        if (map[h]) {
          var v = row[map[h] - 1];
          obj[h] = v instanceof Date ? keyString(v) : v;
        }
      });
      return obj;
    })
    .filter(function (obj) {
      return keyString(obj['Name'] || obj['Date'] || '') !== '';
    });
}
