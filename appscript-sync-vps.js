// ============================================================
// SYNC GOOGLE SHEETS → VPS MySQL
// Tambahkan script ini ke Google Apps Script project yang sama
// ============================================================

// ── KONFIGURASI — sesuaikan dengan domain dan secret Anda ───
var VPS_SYNC_URL  = 'https://DOMAIN_ANDA/api/sync.php'; // ganti dengan domain Anda
var SYNC_SECRET   = 'GANTI_SECRET_KEY_ACAK';            // harus sama dengan di db.php

var SHEET_MAP = {
  'Client Aktif'     : 'client-aktif',
  'Client Non Aktif' : 'client-non-aktif',
  'Client Lepas'     : 'client-lepas',
  'Client Tertagih'  : 'client-tertagih',
  'Akun Kosong'      : 'akun-kosong',
};

// Kolom yang diambil: A(0) sampai X(23), sesuai COLUMNS di appscript utama
var COL_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X'];

// ── FUNGSI UTAMA: sync satu sheet ────────────────────────────
function syncSheet(sheetDisplayName) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetDisplayName);
  if (!sheet) {
    Logger.log('Sheet tidak ditemukan: ' + sheetDisplayName);
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log('Sheet kosong: ' + sheetDisplayName);
    return;
  }

  // Ambil semua data sekaligus (lebih cepat dari getRange per baris)
  var numCols  = COL_LETTERS.length; // 24 kolom (A-X)
  var rawData  = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();

  var rows = [];
  for (var i = 0; i < rawData.length; i++) {
    var row    = rawData[i];
    var rowObj = {};
    var isEmpty = true;

    for (var j = 0; j < COL_LETTERS.length; j++) {
      var val = row[j];

      // Format tanggal (kolom K = index 10)
      if (j === 10 && val instanceof Date && !isNaN(val.getTime())) {
        var d = val.getDate().toString().padStart(2,'0');
        var m = (val.getMonth()+1).toString().padStart(2,'0');
        val = d + '/' + m + '/' + val.getFullYear();
      } else if (val instanceof Date) {
        val = '';
      }

      val = (val === null || val === undefined) ? '' : val.toString().trim();
      rowObj[COL_LETTERS[j]] = val;
      if (val !== '') isEmpty = false;
    }

    // Lewati baris yang benar-benar kosong
    if (!isEmpty) rows.push(rowObj);
  }

  var payload = JSON.stringify({ sheet: SHEET_MAP[sheetDisplayName], data: rows });

  var options = {
    method      : 'post',
    contentType : 'application/json',
    headers     : { 'X-Sync-Secret': SYNC_SECRET },
    payload     : payload,
    muteHttpExceptions: true,
  };

  try {
    var response = UrlFetchApp.fetch(VPS_SYNC_URL, options);
    var code     = response.getResponseCode();
    var result   = JSON.parse(response.getContentText());
    Logger.log('[' + sheetDisplayName + '] HTTP ' + code + ' — ' + JSON.stringify(result));
  } catch (e) {
    Logger.log('[' + sheetDisplayName + '] ERROR: ' + e.message);
  }
}

// ── Sync semua sheet sekaligus ───────────────────────────────
function syncAllSheets() {
  var sheetNames = Object.keys(SHEET_MAP);
  for (var i = 0; i < sheetNames.length; i++) {
    syncSheet(sheetNames[i]);
    Utilities.sleep(500); // jeda 0.5 detik antar sheet agar tidak throttle
  }
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Sync ke VPS selesai', 'Sync', 4);
}

// ── Sync otomatis saat ada edit (installable trigger) ────────
// Fungsi ini didaftarkan sebagai installable onEdit trigger.
// JANGAN rename fungsi ini.
function onEditSyncTrigger(e) {
  try {
    var sheetName = e.source.getActiveSheet().getName();
    if (SHEET_MAP[sheetName]) {
      syncSheet(sheetName);
    }
  } catch (err) {
    Logger.log('onEditSyncTrigger error: ' + err.message);
  }
}

// ── Daftarkan trigger onEdit (jalankan sekali manual) ────────
function registerOnEditTrigger() {
  // Hapus trigger lama agar tidak dobel
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onEditSyncTrigger') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  // Buat trigger baru
  ScriptApp.newTrigger('onEditSyncTrigger')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Trigger onEdit terdaftar', 'Setup', 4);
}

// ── Daftarkan time-based trigger tiap 5 menit (backup) ──────
function registerTimeTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'syncAllSheets') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('syncAllSheets')
    .timeBased()
    .everyMinutes(5)
    .create();
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Trigger 5 menit terdaftar', 'Setup', 4);
}

// ── Tambahkan menu "Sync VPS" di toolbar Sheets ──────────────
// JANGAN tambahkan onOpen() di sini — sudah ada di file utama.
// Panggil addSyncMenu() dari onOpen() di file utama.
function addSyncMenu() {
  SpreadsheetApp.getUi()
    .createMenu('☁️ Sync VPS')
    .addItem('🔄 Sync Semua Sheet Sekarang', 'syncAllSheets')
    .addItem('🔄 Sync Sheet Ini Saja', 'syncActiveSheet')
    .addSeparator()
    .addItem('⚙️ Daftarkan Trigger onEdit', 'registerOnEditTrigger')
    .addItem('⚙️ Daftarkan Trigger 5 Menit', 'registerTimeTrigger')
    .addToUi();
}

function syncActiveSheet() {
  var name = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
  if (SHEET_MAP[name]) {
    syncSheet(name);
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Sync selesai: ' + name, 'Sync', 4);
  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast('⚠️ Sheet ini tidak perlu di-sync', 'Sync', 4);
  }
}
