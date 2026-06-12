<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
    <meta name="googlebot" content="noindex, nofollow">
    <title>Starlink Finance - Laporan Keuangan</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📡</text></svg>">
</head>
<body>
    <div class="app-container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <span class="logo-icon">📡</span>
                    <h1>Starlink Finance</h1>
                </div>
                <div class="header-actions">
                    <button id="themeToggle" class="btn btn-icon" title="Toggle Theme">
                        <span class="icon-sun">☀️</span>
                        <span class="icon-moon">🌙</span>
                    </button>
                    <button id="userMgmtBtn" class="btn btn-secondary" style="display: none;">Kelola User</button>
                    <button id="importCsvBtn" class="btn btn-secondary" style="display: none;">Import CSV</button>
                    <button id="exportCsvBtn" class="btn btn-secondary">Export CSV</button>
                    <button id="exportPdfBtn" class="btn btn-secondary">Export PDF</button>
                    <button id="addBtn" class="btn btn-primary" style="display: none;">+ Tambah Transaksi</button>

                    <!-- Auto Refresh Countdown -->
                    <div class="refresh-timer">
                        <button id="refreshNowBtn" class="btn btn-icon" title="Refresh Sekarang">
                            🔄
                        </button>
                        <div class="countdown-display">
                            <span class="countdown-label">Refresh otomatis dalam</span>
                            <span class="countdown-value" id="countdownValue">10:00</span>
                        </div>
                    </div>

                    <!-- User Info (shown when logged in) -->
                    <div id="userInfo" class="user-info" style="display: none;">
                        <span id="userName" class="user-name"></span>
                        <span id="userRole" class="user-role"></span>
                        <button id="logoutBtn" class="btn btn-secondary btn-sm">Logout</button>
                    </div>

                    <!-- Login Button (shown when not logged in) -->
                    <button id="loginBtn" class="btn btn-primary">Login</button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Dashboard -->
            <section class="dashboard-section">
                <div class="dashboard-card">
                    <div class="dash-header">
                        <span class="dash-title">Dashboard</span>
                        <span class="dash-badge" id="currentMonthBadge"></span>
                    </div>
                    <div class="dash-row">
                        <div class="dash-item income">
                            <span class="dash-label">💰 Pemasukan</span>
                            <span class="dash-value" id="totalPemasukan">Rp 0</span>
                        </div>
                        <div class="dash-item expense">
                            <span class="dash-label">💸 Pengeluaran</span>
                            <span class="dash-value" id="totalPengeluaran">Rp 0</span>
                        </div>
                        <div class="dash-item balance">
                            <span class="dash-label">🏦 Saldo</span>
                            <span class="dash-value" id="totalSaldo">Rp 0</span>
                        </div>
                        <div class="dash-item total">
                            <span class="dash-label">📊 Transaksi</span>
                            <span class="dash-value" id="totalTransaksi">0</span>
                            <span class="dash-sub"><span id="totalTransIn">0</span> masuk · <span id="totalTransOut">0</span> keluar</span>
                        </div>
                    </div>
                    <div class="dash-divider"></div>
                    <div class="dash-monthly-header">
                        <span class="dash-monthly-label">📅 Ringkasan Bulan</span>
                        <select id="monthFilter">
                            <option value="">Pilih Bulan</option>
                        </select>
                    </div>
                    <div class="dash-row dash-monthly" id="monthlyCards" style="display: none;">
                        <div class="dash-item income">
                            <span class="dash-label">💰 Pemasukan</span>
                            <span class="dash-value" id="monthlyIncome">Rp 0</span>
                        </div>
                        <div class="dash-item expense">
                            <span class="dash-label">💸 Pengeluaran</span>
                            <span class="dash-value" id="monthlyExpense">Rp 0</span>
                        </div>
                        <div class="dash-item balance">
                            <span class="dash-label">🏦 Saldo</span>
                            <span class="dash-value" id="monthlyBalance">Rp 0</span>
                        </div>
                        <div class="dash-item total">
                            <span class="dash-label">📊 Transaksi</span>
                            <span class="dash-value" id="monthlyTransTotal">0</span>
                            <span class="dash-sub"><span id="monthlyTransIn">0</span> masuk · <span id="monthlyTransOut">0</span> keluar</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Filters -->
            <section class="filters-section">
                <div class="filters-container">
                    <div class="filter-inline filter-grow">
                        <input type="text" id="searchInput" placeholder="Cari...">
                    </div>
                    <div class="filter-inline">
                        <div class="qf-group" id="quickFilters">
                            <button type="button" class="qf-btn" data-filter="today">Hari Ini<span class="qf-count" id="countToday" style="display:none;"></span></button>
                            <button type="button" class="qf-btn" data-filter="yesterday">Kemarin<span class="qf-count" id="countYesterday" style="display:none;"></span></button>
                            <button type="button" class="qf-btn active" data-filter="this-month">Bulan Ini</button>
                            <button type="button" class="qf-btn" data-filter="last-month">Bulan Lalu</button>
                            <button type="button" class="qf-btn" data-filter="all">Semua</button>
                        </div>
                    </div>
                    <div class="filter-inline">
                        <div class="paket-dropdown" id="paketDropdown">
                            <button type="button" class="paket-dropdown-btn" id="paketDropdownBtn">
                                <span id="paketDropdownLabel">Paket</span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2.5 4.5L6 8l3.5-3.5"/></svg>
                            </button>
                            <div class="paket-dropdown-menu" id="paketDropdownMenu">
                                <label class="paket-option">
                                    <input type="checkbox" value="lite"> <span class="paket-dot lite"></span> Lite
                                </label>
                                <label class="paket-option">
                                    <input type="checkbox" value="regular"> <span class="paket-dot regular"></span> Regular
                                </label>
                                <label class="paket-option">
                                    <input type="checkbox" value="roam"> <span class="paket-dot roam"></span> Roam
                                </label>
                                <label class="paket-option">
                                    <input type="checkbox" value="local priority"> <span class="paket-dot local-priority"></span> Local Priority
                                </label>
                                <label class="paket-option">
                                    <input type="checkbox" value="international"> <span class="paket-dot international"></span> International
                                </label>
                                <div class="paket-menu-footer">
                                    <button type="button" class="paket-clear-btn" id="paketClearBtn">Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="filter-inline">
                        <div class="tipe-dropdown" id="tipeDropdown">
                            <button type="button" class="tipe-dropdown-btn" id="tipeDropdownBtn">
                                <span id="tipeDropdownLabel">Semua Tipe</span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2.5 4.5L6 8l3.5-3.5"/></svg>
                            </button>
                            <div class="tipe-dropdown-menu" id="tipeDropdownMenu">
                                <div class="tipe-option active" data-value="">Semua Tipe</div>
                                <div class="tipe-option" data-value="pemasukan"><span class="tipe-dot pemasukan"></span> Pemasukan</div>
                                <div class="tipe-option" data-value="pengeluaran"><span class="tipe-dot pengeluaran"></span> Pengeluaran</div>
                                <div class="tipe-option" data-value="zero"><span class="tipe-dot zero"></span> Nominal Kosong</div>
                            </div>
                        </div>
                        <select id="typeFilter" style="display:none;">
                            <option value="">Semua Tipe</option>
                            <option value="pemasukan">Pemasukan</option>
                            <option value="pengeluaran">Pengeluaran</option>
                            <option value="zero">Nominal Kosong</option>
                        </select>
                    </div>
                    <div class="filter-inline filter-grow">
                        <input type="date" id="startDate" title="Dari tanggal">
                    </div>
                    <div class="filter-inline filter-grow">
                        <input type="date" id="endDate" title="Sampai tanggal">
                    </div>
                    <label class="prev-period-toggle" id="prevPeriodLabel" title="Tampilkan hanya pembayaran yang periodenya berbeda dari bulan transaksi">
                        <input type="checkbox" id="prevPeriodFilter">
                        <span>Periode sebelumnya</span>
                    </label>
                    <button id="resetFilters" class="btn btn-secondary btn-sm">Reset</button>
                    <button id="bulkSearchBtn" class="btn btn-secondary btn-sm" title="Cari beberapa KIT sekaligus">🔍 Bulk Search</button>
                </div>
            </section>

            <!-- Transactions Table -->
            <section class="table-section">
                <div class="table-container">
                    <table class="data-table" id="transactionsTable">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tanggal</th>
                                <th>Deskripsi</th>
                                <th class="text-right col-pemasukan">Pemasukan</th>
                                <th class="text-right col-pengeluaran">Pengeluaran</th>
                                <th class="text-right col-nominal">Nominal</th>
                                <th class="text-right">Saldo</th>
                                <th id="actionHeader">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="transactionsBody">
                            <tr>
                                <td colspan="7" class="loading" id="loadingCell">Memuat data...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination" id="pagination">
                    <button id="prevPage" class="btn btn-secondary" disabled>← Prev</button>
                    <span id="pageInfo">Halaman 1 dari 1</span>
                    <button id="nextPage" class="btn btn-secondary" disabled>Next →</button>
                    <button id="loadAllBtn" class="btn btn-primary">Lihat Semua</button>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <p>Starlink Finance v1.0 - Laporan Keuangan</p>
        </footer>
    </div>

    <!-- Modal for Add/Edit -->
    <div class="modal" id="transactionModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Tambah Transaksi</h2>
                <button class="modal-close" id="closeModal">&times;</button>
            </div>
            <form id="transactionForm">
                <input type="hidden" id="transactionId">
                <div class="form-group">
                    <label for="tanggal">Tanggal *</label>
                    <input type="date" id="tanggal" required>
                </div>

                <!-- Mode Toggle -->
                <div class="form-group">
                    <label>Mode Input Deskripsi</label>
                    <div class="mode-toggle">
                        <label class="toggle-option">
                            <input type="radio" name="descMode" value="auto" checked>
                            <span>Otomatis</span>
                        </label>
                        <label class="toggle-option">
                            <input type="radio" name="descMode" value="manual">
                            <span>Manual</span>
                        </label>
                    </div>
                </div>

                <!-- Auto Mode Fields -->
                <div id="autoModeFields">
                    <div class="form-group">
                        <label for="tipeTransaksi">Tipe Transaksi *</label>
                        <select id="tipeTransaksi">
                            <option value="Payment">Payment</option>
                            <option value="Aktivasi">Aktivasi</option>
                            <option value="Top Up">Top Up</option>
                            <option value="Refund">Refund</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <!-- Top Up specific field -->
                    <div class="form-group" id="topUpField" style="display: none;">
                        <label for="topUpBank">Bank/Akun *</label>
                        <select id="topUpBank">
                            <option value="UOB">UOB</option>
                            <option value="BCA">BCA</option>
                            <option value="Mandiri">Mandiri</option>
                            <option value="BRI">BRI</option>
                            <option value="BNI">BNI</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <!-- Client fields (hidden for Top Up) -->
                    <div id="clientFields">
                        <div class="form-group">
                            <label for="namaClient">Nama Client *</label>
                            <input type="text" id="namaClient" placeholder="Contoh: Khabib Ridhoi" list="clientSuggestions">
                            <datalist id="clientSuggestions"></datalist>
                        </div>

                        <div class="form-group">
                            <label>Kit & Paket</label>
                            <div id="kitContainer">
                                <div class="kit-row">
                                    <input type="text" class="kit-input" placeholder="KIT303946946" maxlength="20">
                                    <select class="paket-select">
                                        <option value="lite">Lite</option>
                                        <option value="regular">Regular</option>
                                        <option value="roam">Roam</option>
                                        <option value="local priority">Local Priority</option>
                                        <option value="international">International</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                    <input type="text" class="paket-custom" placeholder="Nama paket..." style="display:none;">
                                    <button type="button" class="btn btn-sm btn-secondary btn-remove-kit" style="display:none;">✕</button>
                                </div>
                            </div>
                            <button type="button" class="btn btn-sm btn-secondary" id="addKitBtn">+ Tambah Kit</button>
                        </div>

                        <div class="form-group">
                            <label for="kodePayment">Kode Payment *</label>
                            <select id="kodePayment">
                                <option value="0900">0900</option>
                                <option value="2811">2811</option>
                                <option value="3402">3402</option>
                                <option value="7778">7778</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                            <input type="text" id="kodePaymentCustom" placeholder="Kode payment..." style="display:none; margin-top: 0.5rem;">
                        </div>

                        <!-- Periode Tagihan -->
                        <div class="form-group" id="periodeTagihanField">
                            <label for="periodeTagihan">Periode Tagihan
                                <span class="field-label-hint">(bulan yang dibayarkan)</span>
                            </label>
                            <select id="periodeTagihan">
                                <!-- populated dynamically by JS -->
                            </select>
                            <div class="periode-hint" id="periodeHint" style="display:none;">
                                ⚠️ Periode berbeda dari bulan transaksi — akan ditandai sebagai <strong>pembayaran periode sebelumnya</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Preview -->
                    <div class="form-group">
                        <label>Preview Deskripsi</label>
                        <div class="description-preview" id="descriptionPreview">-</div>
                    </div>
                </div>

                <!-- Manual Mode Field -->
                <div id="manualModeField" style="display: none;">
                    <div class="form-group">
                        <label for="deskripsi">Deskripsi *</label>
                        <textarea id="deskripsi" rows="3" placeholder="Contoh: Langganan bulanan - Pelanggan A"></textarea>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="pemasukan">Pemasukan (Rp)</label>
                        <input type="text" id="pemasukan" value="0" placeholder="0">
                    </div>
                    <div class="form-group">
                        <label for="pengeluaran">Pengeluaran (Rp)</label>
                        <input type="text" id="pengeluaran" value="0" placeholder="0">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Batal</button>
                    <button type="submit" class="btn btn-primary" id="saveBtn">Simpan</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" id="deleteModal">
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h2>Konfirmasi Hapus</h2>
                <button class="modal-close" id="closeDeleteModal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Apakah Anda yakin ingin menghapus transaksi ini?</p>
                <p class="delete-info" id="deleteInfo"></p>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" id="cancelDelete">Batal</button>
                <button type="button" class="btn btn-danger" id="confirmDelete">Hapus</button>
            </div>
        </div>
    </div>

    <!-- Login Modal -->
    <div class="modal" id="loginModal">
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h2>Login</h2>
                <button class="modal-close" id="closeLoginModal">&times;</button>
            </div>
            <form id="loginForm">
                <div class="form-group">
                    <label for="loginUsername">Username</label>
                    <input type="text" id="loginUsername" required autocomplete="username">
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" required autocomplete="current-password">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelLogin">Batal</button>
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Import CSV Modal -->
    <div class="modal" id="importModal">
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h2>Import Data dari CSV</h2>
                <button class="modal-close" id="closeImportModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="import-info">
                    <p><strong>Format CSV yang dibutuhkan:</strong></p>
                    <ul>
                        <li>Header: <code>tanggal,deskripsi,pemasukan,pengeluaran</code></li>
                        <li>Tanggal format: <code>YYYY-MM-DD</code> (contoh: 2025-01-15)</li>
                        <li>Angka tanpa titik atau koma ribuan (contoh: 100000 bukan 100.000)</li>
                        <li>Jika tidak ada pemasukan/pengeluaran, isi dengan 0</li>
                    </ul>
                    <p>Download contoh: <a href="starlink-finance/sample-import.csv" download>sample-import.csv</a></p>
                </div>
                <form id="importForm">
                    <div class="form-group">
                        <label for="csvFile">Pilih File CSV</label>
                        <input type="file" id="csvFile" accept=".csv" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelImport">Batal</button>
                        <button type="submit" class="btn btn-primary">Upload & Import</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- User Management Modal -->
    <div class="modal" id="userModal">
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>Kelola User</h2>
                <button class="modal-close" id="closeUserModal">&times;</button>
            </div>
            <div class="modal-body">
                <button id="addUserBtn" class="btn btn-primary" style="margin-bottom: 1rem;">+ Tambah User</button>
                <table class="data-table" id="usersTable">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Nama</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="usersBody">
                        <tr><td colspan="6" class="loading">Memuat...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div class="modal" id="userFormModal">
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h2 id="userFormTitle">Tambah User</h2>
                <button class="modal-close" id="closeUserFormModal">&times;</button>
            </div>
            <form id="userForm">
                <input type="hidden" id="userId">
                <div class="form-group">
                    <label for="userUsername">Username *</label>
                    <input type="text" id="userUsername" required>
                </div>
                <div class="form-group">
                    <label for="userNama">Nama *</label>
                    <input type="text" id="userNama" required>
                </div>
                <div class="form-group">
                    <label for="userPassword">Password <span id="pwdNote">(kosongkan jika tidak diubah)</span></label>
                    <input type="password" id="userPassword">
                </div>
                <div class="form-group">
                    <label for="userRoleSelect">Role *</label>
                    <select id="userRoleSelect" required>
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="userActive" checked> Aktif
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelUserForm">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Bulk Search Modal -->
    <div class="modal" id="bulkSearchModal">
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>🔍 Bulk Search KIT</h2>
                <button class="modal-close" id="closeBulkSearchModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="bulk-search-form" id="bulkSearchForm">
                    <div class="form-group">
                        <label for="bulkKitInput">Nomor KIT <span style="font-weight:normal; color:var(--text-muted);">(satu per baris atau dipisah koma)</span></label>
                        <textarea id="bulkKitInput" rows="5" placeholder="KIT303925311&#10;KIT303946946&#10;KIT303947000"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Periode</label>
                        <div class="qf-group" id="bulkPeriodGroup">
                            <button type="button" class="qf-btn active" data-period="this-month">Bulan Ini</button>
                            <button type="button" class="qf-btn" data-period="last-month">Bulan Lalu</button>
                            <button type="button" class="qf-btn" data-period="custom">Custom</button>
                        </div>
                    </div>
                    <div class="form-row" id="bulkCustomDates" style="display:none;">
                        <div class="form-group">
                            <label for="bulkStartDate">Dari Tanggal</label>
                            <input type="date" id="bulkStartDate">
                        </div>
                        <div class="form-group">
                            <label for="bulkEndDate">Sampai Tanggal</label>
                            <input type="date" id="bulkEndDate">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBulkSearch">Batal</button>
                        <button type="button" class="btn btn-primary" id="executeBulkSearch">Cari Transaksi</button>
                    </div>
                </div>

                <div id="bulkSearchResults" style="display:none;">
                    <div class="bulk-results-header">
                        <span id="bulkResultsSummary" class="bulk-results-summary"></span>
                        <div class="bulk-results-actions">
                            <div class="bulk-view-toggle">
                                <button type="button" class="bulk-view-btn active" data-view="compact">Compact</button>
                                <button type="button" class="bulk-view-btn" data-view="detail">Detail</button>
                            </div>
                            <button type="button" class="btn btn-secondary btn-sm" id="bulkNewSearch">← Cari Lagi</button>
                            <button type="button" class="btn btn-secondary btn-sm" id="bulkCopyFound" style="display:none;" title="Copy semua KIT yang ada transaksinya">Copy KIT ada</button>
                            <button type="button" class="btn btn-secondary btn-sm" id="bulkCopyEmpty" style="display:none;" title="Copy semua KIT yang tidak ada transaksinya">Copy KIT kosong</button>
                            <button type="button" class="btn btn-secondary btn-sm" id="bulkExportCsv">Export CSV</button>
                        </div>
                    </div>
                    <div id="bulkResultsByKit"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" id="toast">
        <span id="toastMessage"></span>
    </div>

    <script src="assets/js/app.js"></script>
</body>
</html>