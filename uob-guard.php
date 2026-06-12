<?php
// Guard untuk /data-uob/ — di-inject otomatis via nginx fastcgi_param PHP_VALUE
// Tidak perlu modifikasi file UOB sama sekali
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (empty($_SESSION['uob_ok'])) {
    header('Location: /');
    exit;
}
