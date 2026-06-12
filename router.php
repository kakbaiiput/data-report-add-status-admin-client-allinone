<?php
session_start();

// Halaman yang boleh diakses
$allowed_pages = ['data', 'report', 'status', 'admin', 'client', 'add'];

$token = isset($_GET['p']) ? trim($_GET['p']) : '';

// Validasi token ada di session
if (
    empty($token) ||
    empty($_SESSION['token_map']) ||
    !isset($_SESSION['token_map'][$token])
) {
    // Token tidak valid atau tidak ada — redirect ke index
    header('Location: /');
    exit;
}

$page = $_SESSION['token_map'][$token];

// Double-check page yang valid
if (!in_array($page, $allowed_pages, true)) {
    header('Location: /');
    exit;
}

$file = __DIR__ . '/' . $page . '.html';

if (!file_exists($file)) {
    http_response_code(404);
    echo '<!DOCTYPE html><html><body><h2>Halaman tidak ditemukan.</h2><a href="/">Kembali</a></body></html>';
    exit;
}

// Invalidate token setelah dipakai (one-time use) — opsional, nonaktifkan jika perlu refresh
// unset($_SESSION['token_map'][$token]);

// Serve file HTML
readfile($file);
