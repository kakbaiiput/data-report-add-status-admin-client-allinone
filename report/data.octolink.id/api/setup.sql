-- Jalankan SQL ini sekali saja di phpMyAdmin / aaPanel Database Manager
-- untuk membuat database, user, dan tabel

-- 1. Buat database (jalankan sebagai root)
CREATE DATABASE IF NOT EXISTS starlink_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Buat user dan beri akses (jalankan sebagai root, ganti password)
CREATE USER IF NOT EXISTS 'starlink_user'@'localhost' IDENTIFIED BY 'GANTI_PASSWORD';
GRANT ALL PRIVILEGES ON starlink_db.* TO 'starlink_user'@'localhost';
FLUSH PRIVILEGES;

USE starlink_db;

-- 3. Tabel utama untuk setiap sheet
-- sheet_name: client-aktif | client-non-aktif | client-lepas | client-tertagih | akun-kosong
CREATE TABLE IF NOT EXISTS clients (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sheet_name    VARCHAR(30)   NOT NULL,
    row_index     INT UNSIGNED  NOT NULL,       -- urutan baris di sheet (untuk preserve order)

    -- Kolom A-S (data utama)
    col_a VARCHAR(255)  DEFAULT NULL COMMENT 'Nama',
    col_b TEXT          DEFAULT NULL COMMENT 'Login Gmail',
    col_c TEXT          DEFAULT NULL COMMENT 'Login Starlink',
    col_d TEXT          DEFAULT NULL COMMENT 'Login Alt',
    col_e VARCHAR(100)  DEFAULT NULL COMMENT 'ACC No',
    col_f VARCHAR(255)  DEFAULT NULL COMMENT 'Email Client',
    col_g VARCHAR(100)  DEFAULT NULL COMMENT 'Nomor CS',
    col_h TEXT          DEFAULT NULL COMMENT 'Alamat',
    col_i VARCHAR(100)  DEFAULT NULL COMMENT 'KIT Number',
    col_j TEXT          DEFAULT NULL COMMENT 'Serial Number',
    col_k VARCHAR(50)   DEFAULT NULL COMMENT 'Jatuh Tempo',
    col_l VARCHAR(100)  DEFAULT NULL COMMENT 'Kode',
    col_m VARCHAR(100)  DEFAULT NULL COMMENT 'Payment',
    col_n TEXT          DEFAULT NULL COMMENT 'ID Transaksi',
    col_o VARCHAR(100)  DEFAULT NULL COMMENT 'Status',
    col_p VARCHAR(100)  DEFAULT NULL COMMENT 'Paket',
    col_q VARCHAR(50)   DEFAULT NULL COMMENT 'Last 4 Digit',
    col_r VARCHAR(100)  DEFAULT NULL COMMENT 'No Register',
    col_s VARCHAR(100)  DEFAULT NULL COMMENT 'Tipe Pelanggan',

    -- Kolom T-X (label/helper)
    col_t VARCHAR(100)  DEFAULT NULL COMMENT 'Cadangan',
    col_u VARCHAR(50)   DEFAULT NULL COMMENT 'Label Jatuh Tempo',
    col_v VARCHAR(50)   DEFAULT NULL COMMENT 'Label Proses',
    col_w VARCHAR(50)   DEFAULT NULL COMMENT 'Label Segera',
    col_x VARCHAR(50)   DEFAULT NULL COMMENT 'Label Observasi',

    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_sheet_row (sheet_name, row_index),
    INDEX idx_sheet  (sheet_name),
    INDEX idx_status (col_o),
    INDEX idx_nama   (col_a(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel log sync (opsional, untuk monitoring)
CREATE TABLE IF NOT EXISTS sync_log (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sheet_name VARCHAR(30) NOT NULL,
    rows_synced INT UNSIGNED DEFAULT 0,
    synced_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
