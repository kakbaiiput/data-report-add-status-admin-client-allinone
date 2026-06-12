<?php
/**
 * data.php — Melayani request data dari data.html dan validasi KIT dari form report.
 *
 * GET ?sheet=client-aktif              → data satu sheet
 * GET ?sheet=semua-client              → gabungan semua sheet
 * GET ?sheet=client-aktif&ts=1         → hanya kembalikan timestamp sync terakhir
 * GET ?action=validate&kit=OUTD-12345  → validasi KIT/SN dari MySQL (untuk form report)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';

// ── Validasi KIT/SN untuk form report ───────────────────────────────────────
if ($action === 'validate') {
    $kit = trim($_GET['kit'] ?? '');
    if ($kit === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Parameter kit diperlukan']);
        exit;
    }

    $kitUpper = strtoupper($kit);

    $sheetDisplayNames = [
        'client-aktif'     => 'Client Aktif',
        'client-non-aktif' => 'Client Non Aktif',
        'client-lepas'     => 'Client Lepas',
    ];

    try {
        $pdo = getDB();

        // Pre-filter dengan LIKE, lalu exact boundary match di PHP
        // FIELD() menjaga prioritas: Aktif > Non Aktif > Lepas
        $stmt = $pdo->prepare("
            SELECT * FROM clients
            WHERE sheet_name IN ('client-aktif', 'client-non-aktif', 'client-lepas')
              AND (col_i LIKE :pat OR col_j LIKE :pat)
            ORDER BY FIELD(sheet_name, 'client-aktif', 'client-non-aktif', 'client-lepas'), row_index
        ");
        $stmt->execute([':pat' => '%' . $kit . '%']);
        $rows = $stmt->fetchAll();

        $found   = null;
        $foundBy = null;

        foreach ($rows as $row) {
            // Exact match di KIT Number (col_i), bisa multi-nilai dipisah \n
            $kitNums = array_map('trim', explode("\n", $row['col_i'] ?? ''));
            foreach ($kitNums as $kn) {
                if (strtoupper($kn) === $kitUpper) {
                    $found   = $row;
                    $foundBy = 'KIT Number';
                    break 2;
                }
            }

            // Exact match di Serial Number (col_j)
            $serials = array_map('trim', explode("\n", $row['col_j'] ?? ''));
            foreach ($serials as $sn) {
                if (strtoupper($sn) === $kitUpper) {
                    $found   = $row;
                    $foundBy = 'Serial Number';
                    break 2;
                }
            }
        }

        if (!$found) {
            echo json_encode([
                'validation' => [
                    'status'       => 'not_found',
                    'clientStatus' => null,
                    'isActive'     => false,
                    'data'         => null,
                    'warning'      => '❌ KIT/Serial Number tidak ditemukan dalam database!',
                ],
                'duplicate' => ['hasDuplicate' => false, 'duplicateKits' => []],
            ]);
            exit;
        }

        // Bangun allKits — satu baris client bisa punya banyak KIT (dipisah \n)
        $kitNums = array_values(array_filter(array_map('trim', explode("\n", $found['col_i'] ?? ''))));
        $serials = array_values(array_map('trim', explode("\n", $found['col_j'] ?? '')));
        $pakets  = array_values(array_map('trim', explode("\n", $found['col_p'] ?? '')));

        $allKits = [];
        foreach ($kitNums as $k => $kn) {
            if ($kn === '') continue;
            $sn    = $serials[$k] ?? ($serials[0] ?? '');
            $paket = $pakets[$k]  ?? ($pakets[0]  ?? '');

            $isMatched = $foundBy === 'KIT Number'
                ? strtoupper($kn) === $kitUpper
                : strtoupper($sn) === $kitUpper;

            $allKits[] = [
                'kitNumber'    => $kn,
                'serialNumber' => $sn,
                'paket'        => $paket,
                'isSelected'   => $isMatched,
            ];
        }

        $sheetName   = $found['sheet_name'];
        $displayName = $sheetDisplayNames[$sheetName] ?? $sheetName;
        $isActive    = $sheetName === 'client-aktif';

        echo json_encode([
            'validation' => [
                'status'       => 'found',
                'clientStatus' => $displayName,
                'isActive'     => $isActive,
                'foundBy'      => $foundBy,
                'data'         => [
                    'nama'      => trim($found['col_a'] ?? ''),
                    'rowNumber' => (int)$found['row_index'] + 1,
                    'sheetName' => $displayName,
                    'allKits'   => $allKits,
                    'totalKits' => count($allKits),
                ],
                'warning' => !$isActive
                    ? "⚠️ PERHATIAN: Client tidak berada di 'Client Aktif'. Segera update data!"
                    : null,
            ],
            'duplicate' => ['hasDuplicate' => false, 'duplicateKits' => []],
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// ── Data viewer (sheet listing) ─────────────────────────────────────────────
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
