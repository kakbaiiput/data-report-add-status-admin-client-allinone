<?php
// Konfigurasi koneksi MySQL
// Ganti nilai di bawah sesuai setting aaPanel Anda
define('DB_HOST', 'localhost');
define('DB_NAME', 'dataclientstarlink');       // nama database
define('DB_USER', 'dataclientstarlink');     // username database
define('DB_PASS', 'dataclientstarlink');    // password database
define('SYNC_SECRET', 'dataclientstarlink'); // kunci rahasia untuk endpoint sync

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}
