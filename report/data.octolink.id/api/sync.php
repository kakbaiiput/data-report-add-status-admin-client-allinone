<?php
/**
 * sync.php — Endpoint yang dipanggil Google Apps Script untuk menyimpan data ke MySQL.
 *
 * Method : POST
 * Header : X-Sync-Secret: <SYNC_SECRET dari db.php>
 * Body   : JSON { "sheet": "client-aktif", "data": [ {A,B,C,...} ] }
 */

header('Content-Type: application/json');

require_once __DIR__ . '/db.php';

// ── Autentikasi ──────────────────────────────────────────────────────────────
$secret = $_SERVER['HTTP_X_SYNC_SECRET'] ?? '';
if ($secret !== SYNC_SECRET) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// ── Baca body ────────────────────────────────────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true);

$sheetName = $body['sheet'] ?? '';
$rows      = $body['data']  ?? [];

$validSheets = ['client-aktif', 'client-non-aktif', 'client-lepas', 'client-tertagih', 'akun-kosong'];
if (!in_array($sheetName, $validSheets, true)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Sheet tidak valid: ' . $sheetName]);
    exit;
}

if (!is_array($rows)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Data harus berupa array']);
    exit;
}

// ── Simpan ke database (replace seluruh sheet) ───────────────────────────────
try {
    $pdo = getDB();
    $pdo->beginTransaction();

    // Hapus semua baris sheet ini, lalu insert ulang
    // (lebih sederhana dan aman daripada diff per baris)
    $pdo->prepare('DELETE FROM clients WHERE sheet_name = ?')->execute([$sheetName]);

    $sql = 'INSERT INTO clients
                (sheet_name, row_index,
                 col_a,col_b,col_c,col_d,col_e,col_f,col_g,col_h,col_i,col_j,
                 col_k,col_l,col_m,col_n,col_o,col_p,col_q,col_r,col_s,
                 col_t,col_u,col_v,col_w,col_x)
            VALUES
                (:sheet,:idx,
                 :a,:b,:c,:d,:e,:f,:g,:h,:i,:j,
                 :k,:l,:m,:n,:o,:p,:q,:r,:s,
                 :t,:u,:v,:w,:x)';

    $stmt = $pdo->prepare($sql);

    $colMap = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X'];

    foreach ($rows as $idx => $row) {
        $params = [':sheet' => $sheetName, ':idx' => $idx];
        foreach ($colMap as $col) {
            $params[':' . strtolower($col)] = isset($row[$col]) && $row[$col] !== '' ? (string)$row[$col] : null;
        }
        $stmt->execute($params);
    }

    // Catat log
    $pdo->prepare('INSERT INTO sync_log (sheet_name, rows_synced) VALUES (?, ?)')->execute([$sheetName, count($rows)]);

    $pdo->commit();

    echo json_encode([
        'status'  => 'success',
        'sheet'   => $sheetName,
        'rows'    => count($rows),
        'synced_at' => date('c'),
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
