<?php
/**
 * data.php — Melayani request data dari data.html.
 *
 * GET ?sheet=client-aktif          → data satu sheet
 * GET ?sheet=semua-client          → gabungan semua sheet
 * GET ?sheet=client-aktif&ts=1     → hanya kembalikan timestamp sync terakhir
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // izinkan akses dari domain manapun (batasi jika perlu)

require_once __DIR__ . '/db.php';

$sheet = $_GET['sheet'] ?? 'client-aktif';
$tsOnly = isset($_GET['ts']);

$validSheets = ['client-aktif', 'client-non-aktif', 'client-lepas', 'client-tertagih', 'akun-kosong', 'semua-client'];
if (!in_array($sheet, $validSheets, true)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Sheet tidak valid']);
    exit;
}

try {
    $pdo = getDB();

    // ── Hanya kembalikan waktu sync terakhir ────────────────────────────────
    if ($tsOnly) {
        if ($sheet === 'semua-client') {
            $stmt = $pdo->query('SELECT MAX(synced_at) AS ts FROM clients');
        } else {
            $stmt = $pdo->prepare('SELECT MAX(synced_at) AS ts FROM clients WHERE sheet_name = ?');
            $stmt->execute([$sheet]);
        }
        $row = $stmt->fetch();
        echo json_encode(['status' => 'success', 'synced_at' => $row['ts']]);
        exit;
    }

    // ── Ambil data ──────────────────────────────────────────────────────────
    $colMap = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X'];

    if ($sheet === 'semua-client') {
        $stmt = $pdo->query('SELECT * FROM clients ORDER BY sheet_name, row_index');
    } else {
        $stmt = $pdo->prepare('SELECT * FROM clients WHERE sheet_name = ? ORDER BY row_index');
        $stmt->execute([$sheet]);
    }

    $rows = [];
    $categoryMap = [
        'client-aktif'     => 'aktif',
        'client-non-aktif' => 'non-aktif',
        'client-lepas'     => 'lepas',
        'client-tertagih'  => 'tertagih',
        'akun-kosong'      => 'kosong',
    ];

    while ($dbRow = $stmt->fetch()) {
        $row = [];
        foreach ($colMap as $col) {
            $dbCol = 'col_' . strtolower($col);
            $row[$col] = $dbRow[$dbCol] ?? '';
        }
        // Tambahkan _category untuk sheet semua-client (dibutuhkan data.html)
        if ($sheet === 'semua-client') {
            $row['_category'] = $categoryMap[$dbRow['sheet_name']] ?? '';
        }
        $rows[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'sheet'  => $sheet,
        'count'  => count($rows),
        'data'   => $rows,
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
