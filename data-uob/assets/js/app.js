/**
 * Starlink Finance - Main Application JavaScript
 */

// Global state
const state = {
    transactions: [],
    currentPage: 1,
    totalPages: 1,
    limit: 20,
    showAll: false,
    filters: {
        search: '',
        startDate: '',
        endDate: '',
        type: '',
        month: '',
        paket: [],
        prevPeriod: false
    },
    editingId: null,
    deleteId: null,
    editingUserId: null,
    // Auth state
    isLoggedIn: false,
    user: null,
    canAdd: false,
    canEdit: false,
    // Submit state
    isSubmitting: false
};

// Bulk Search State
const bulkSearchState = {
    period: 'this-month',
    startDate: '',
    endDate: '',
    results: [],
    viewMode: 'compact',
    lastKitList: []
};

// DOM Elements
const elements = {
    // Summary
    totalPemasukan: document.getElementById('totalPemasukan'),
    totalPengeluaran: document.getElementById('totalPengeluaran'),
    totalSaldo: document.getElementById('totalSaldo'),
    totalTransaksi: document.getElementById('totalTransaksi'),
    totalTransIn: document.getElementById('totalTransIn'),
    totalTransOut: document.getElementById('totalTransOut'),

    // Monthly Summary
    monthFilter: document.getElementById('monthFilter'),
    monthlyCards: document.getElementById('monthlyCards'),
    monthlyIncome: document.getElementById('monthlyIncome'),
    monthlyExpense: document.getElementById('monthlyExpense'),
    monthlyBalance: document.getElementById('monthlyBalance'),
    monthlyTransTotal: document.getElementById('monthlyTransTotal'),
    monthlyTransIn: document.getElementById('monthlyTransIn'),
    monthlyTransOut: document.getElementById('monthlyTransOut'),

    // Table
    transactionsBody: document.getElementById('transactionsBody'),

    // Filters
    searchInput: document.getElementById('searchInput'),
    startDate: document.getElementById('startDate'),
    endDate: document.getElementById('endDate'),
    typeFilter: document.getElementById('typeFilter'),
    resetFilters: document.getElementById('resetFilters'),
    quickFilters: document.getElementById('quickFilters'),
    paketDropdown: document.getElementById('paketDropdown'),
    paketDropdownBtn: document.getElementById('paketDropdownBtn'),
    paketDropdownLabel: document.getElementById('paketDropdownLabel'),
    paketDropdownMenu: document.getElementById('paketDropdownMenu'),
    paketClearBtn: document.getElementById('paketClearBtn'),
    tipeDropdown: document.getElementById('tipeDropdown'),
    tipeDropdownBtn: document.getElementById('tipeDropdownBtn'),
    tipeDropdownLabel: document.getElementById('tipeDropdownLabel'),
    tipeDropdownMenu: document.getElementById('tipeDropdownMenu'),

    // Pagination
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    loadAllBtn: document.getElementById('loadAllBtn'),

    // Buttons
    themeToggle: document.getElementById('themeToggle'),
    importCsvBtn: document.getElementById('importCsvBtn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    exportPdfBtn: document.getElementById('exportPdfBtn'),
    addBtn: document.getElementById('addBtn'),
    userMgmtBtn: document.getElementById('userMgmtBtn'),
    refreshNowBtn: document.getElementById('refreshNowBtn'),
    countdownValue: document.getElementById('countdownValue'),

    // Auth elements
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    userInfo: document.getElementById('userInfo'),
    userName: document.getElementById('userName'),
    userRole: document.getElementById('userRole'),

    // Login Modal
    loginModal: document.getElementById('loginModal'),
    loginForm: document.getElementById('loginForm'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    closeLoginModal: document.getElementById('closeLoginModal'),
    cancelLogin: document.getElementById('cancelLogin'),

    // Transaction Modal
    transactionModal: document.getElementById('transactionModal'),
    modalTitle: document.getElementById('modalTitle'),
    transactionForm: document.getElementById('transactionForm'),
    transactionId: document.getElementById('transactionId'),
    tanggal: document.getElementById('tanggal'),
    deskripsi: document.getElementById('deskripsi'),
    pemasukan: document.getElementById('pemasukan'),
    pengeluaran: document.getElementById('pengeluaran'),
    closeModal: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),

    // Delete Modal
    deleteModal: document.getElementById('deleteModal'),
    deleteInfo: document.getElementById('deleteInfo'),
    closeDeleteModal: document.getElementById('closeDeleteModal'),
    cancelDelete: document.getElementById('cancelDelete'),
    confirmDelete: document.getElementById('confirmDelete'),

    // User Management Modal
    userModal: document.getElementById('userModal'),
    closeUserModal: document.getElementById('closeUserModal'),
    usersBody: document.getElementById('usersBody'),
    addUserBtn: document.getElementById('addUserBtn'),

    // User Form Modal
    userFormModal: document.getElementById('userFormModal'),
    userFormTitle: document.getElementById('userFormTitle'),
    userForm: document.getElementById('userForm'),
    userId: document.getElementById('userId'),
    userUsername: document.getElementById('userUsername'),
    userNama: document.getElementById('userNama'),
    userPassword: document.getElementById('userPassword'),
    userRoleSelect: document.getElementById('userRoleSelect'),
    userActive: document.getElementById('userActive'),
    closeUserFormModal: document.getElementById('closeUserFormModal'),
    cancelUserForm: document.getElementById('cancelUserForm'),
    pwdNote: document.getElementById('pwdNote'),

    // Import CSV Modal
    importModal: document.getElementById('importModal'),
    importForm: document.getElementById('importForm'),
    csvFile: document.getElementById('csvFile'),
    closeImportModal: document.getElementById('closeImportModal'),
    cancelImport: document.getElementById('cancelImport'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),

    // Bulk Search Modal
    bulkSearchBtn: document.getElementById('bulkSearchBtn'),
    bulkSearchModal: document.getElementById('bulkSearchModal'),
    closeBulkSearchModal: document.getElementById('closeBulkSearchModal'),
    cancelBulkSearch: document.getElementById('cancelBulkSearch'),
    executeBulkSearch: document.getElementById('executeBulkSearch'),
    bulkKitInput: document.getElementById('bulkKitInput'),
    bulkPeriodGroup: document.getElementById('bulkPeriodGroup'),
    bulkCustomDates: document.getElementById('bulkCustomDates'),
    bulkStartDate: document.getElementById('bulkStartDate'),
    bulkEndDate: document.getElementById('bulkEndDate'),
    bulkSearchForm: document.getElementById('bulkSearchForm'),
    bulkSearchResults: document.getElementById('bulkSearchResults'),
    bulkResultsSummary: document.getElementById('bulkResultsSummary'),
    bulkResultsByKit: document.getElementById('bulkResultsByKit'),
    bulkNewSearch: document.getElementById('bulkNewSearch'),
    bulkExportCsv: document.getElementById('bulkExportCsv'),
    bulkCopyFound: document.getElementById('bulkCopyFound'),
    bulkCopyEmpty: document.getElementById('bulkCopyEmpty'),
    bulkViewToggle: document.querySelector('.bulk-view-toggle'),

    // Structured Description Form Elements
    autoModeFields: document.getElementById('autoModeFields'),
    manualModeField: document.getElementById('manualModeField'),
    tipeTransaksi: document.getElementById('tipeTransaksi'),
    topUpField: document.getElementById('topUpField'),
    topUpBank: document.getElementById('topUpBank'),
    clientFields: document.getElementById('clientFields'),
    namaClient: document.getElementById('namaClient'),
    kitContainer: document.getElementById('kitContainer'),
    addKitBtn: document.getElementById('addKitBtn'),
    kodePayment: document.getElementById('kodePayment'),
    descriptionPreview: document.getElementById('descriptionPreview'),

    // Periode Tagihan
    periodeTagihan: document.getElementById('periodeTagihan'),
    periodeTagihanField: document.getElementById('periodeTagihanField'),
    periodeHint: document.getElementById('periodeHint'),

    // Prev-period filter
    prevPeriodFilter: document.getElementById('prevPeriodFilter'),
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMonthSelector();
    initDefaultDateFilter();
    initPeriodeOptions();
    initEventListeners();
    checkAuthStatus();
    migratePaketNames();
    loadSummary();
    loadQuickFilterCounts();
    loadTransactions();
    startAutoRefresh();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize month selector
function initMonthSelector() {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    let options = '<option value="">Pilih Bulan</option>';
    for (let y = currentYear; y >= currentYear - 2; y--) {
        for (let m = 11; m >= 0; m--) {
            if (y === currentYear && m > currentMonth) continue;
            const value = `${y}-${String(m + 1).padStart(2, '0')}`;
            options += `<option value="${value}">${months[m]} ${y}</option>`;
        }
    }
    elements.monthFilter.innerHTML = options;
}

// Initialize default date filter to current month
function initDefaultDateFilter() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // First day of current month
    const firstDay = `${year}-${month}-01`;

    // Last day of current month
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const lastDayStr = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    // Set the input values
    elements.startDate.value = firstDay;
    elements.endDate.value = lastDayStr;

    // Update state
    state.filters.startDate = firstDay;
    state.filters.endDate = lastDayStr;
}

// Populate periode tagihan select with last 12 months
function initPeriodeOptions() {
    const months = ['Januari','Februari','Maret','April','Mei','Juni',
                    'Juli','Agustus','September','Oktober','November','Desember'];
    const now = new Date();
    let options = '';
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
        options += `<option value="${value}">${label}</option>`;
    }
    if (elements.periodeTagihan) elements.periodeTagihan.innerHTML = options;
}

// Sync periode select to match a given date string (YYYY-MM-DD)
function syncPeriodeToDate(dateStr) {
    if (!elements.periodeTagihan || !dateStr) return;
    const month = dateStr.substring(0, 7); // YYYY-MM
    if ([...elements.periodeTagihan.options].some(o => o.value === month)) {
        elements.periodeTagihan.value = month;
    }
    updatePeriodeHint();
}

// Show/hide the warning hint based on whether periode ≠ transaction month
function updatePeriodeHint() {
    if (!elements.periodeHint || !elements.periodeTagihan) return;
    const show = isCrossPeriod();
    elements.periodeHint.style.display = show ? 'block' : 'none';
}

// Returns true when billing period differs from transaction month
function isCrossPeriod() {
    const tanggal = elements.tanggal ? elements.tanggal.value : '';
    const periode = elements.periodeTagihan ? elements.periodeTagihan.value : '';
    if (!tanggal || !periode) return false;
    return tanggal.substring(0, 7) !== periode;
}

// Extract [periode:YYYY-MM] tag from description; returns null if not found
function parsePeriodeFromDesc(desc) {
    const m = desc.match(/\[periode:(\d{4}-\d{2})\]/i);
    return m ? m[1] : null;
}

// Remove [periode:...] tag from description string
function stripPeriodeTag(desc) {
    return desc.replace(/\s*\[periode:\d{4}-\d{2}\]/gi, '').trim();
}

// Format "2024-11" → "Nov 2024"
function formatPeriodLabel(yyyyMm) {
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun',
                    'Jul','Agu','Sep','Okt','Nov','Des'];
    const [y, m] = yyyyMm.split('-');
    return `${months[parseInt(m, 10) - 1]} ${y}`;
}

// Event Listeners
function initEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Add button
    elements.addBtn.addEventListener('click', () => {
        if (!state.canAdd) {
            showToast('Anda harus login untuk menambah transaksi', 'error');
            return;
        }
        openModal();
    });

    // Export buttons
    elements.exportCsvBtn.addEventListener('click', exportToCSV);
    elements.exportPdfBtn.addEventListener('click', exportToPDF);

    // Refresh button
    elements.refreshNowBtn.addEventListener('click', refreshData);

    // Import button
    elements.importCsvBtn.addEventListener('click', openImportModal);

    // Import modal events
    elements.closeImportModal.addEventListener('click', closeImportModal);
    elements.cancelImport.addEventListener('click', closeImportModal);
    elements.importForm.addEventListener('submit', handleImport);
    elements.importModal.addEventListener('click', (e) => {
        if (e.target === elements.importModal) closeImportModal();
    });

    // User management button
    elements.userMgmtBtn.addEventListener('click', openUserModal);

    // Auth buttons
    elements.loginBtn.addEventListener('click', openLoginModal);
    elements.logoutBtn.addEventListener('click', logout);

    // Login modal events
    elements.closeLoginModal.addEventListener('click', closeLoginModal);
    elements.cancelLogin.addEventListener('click', closeLoginModal);
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.loginModal.addEventListener('click', (e) => {
        if (e.target === elements.loginModal) closeLoginModal();
    });

    // Monthly filter
    elements.monthFilter.addEventListener('change', (e) => {
        state.filters.month = e.target.value;
        if (e.target.value) {
            loadMonthlySummary(e.target.value);
            elements.monthlyCards.style.display = 'flex';
        } else {
            elements.monthlyCards.style.display = 'none';
        }
    });

    // Filter inputs with debounce
    let searchTimeout;
    elements.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.filters.search = e.target.value;
            state.currentPage = 1;
            state.showAll = false;
            loadTransactions();
        }, 300);
    });

    elements.startDate.addEventListener('change', (e) => {
        state.filters.startDate = e.target.value;
        state.currentPage = 1;
        state.showAll = false;
        elements.quickFilters.querySelectorAll('.qf-btn').forEach(b => b.classList.remove('active'));
        loadTransactions();
    });

    elements.endDate.addEventListener('change', (e) => {
        state.filters.endDate = e.target.value;
        state.currentPage = 1;
        state.showAll = false;
        elements.quickFilters.querySelectorAll('.qf-btn').forEach(b => b.classList.remove('active'));
        loadTransactions();
    });

    elements.typeFilter.addEventListener('change', (e) => {
        state.filters.type = e.target.value;
        state.currentPage = 1;
        state.showAll = false;
        loadTransactions();
    });

    // Quick filters
    elements.quickFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('.qf-btn');
        if (!btn) return;
        const filter = btn.dataset.filter;
        const now = new Date();
        let startDate = '';
        let endDate = '';

        if (filter === 'today') {
            const today = formatDateStr(now);
            startDate = today;
            endDate = today;
        } else if (filter === 'yesterday') {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yd = formatDateStr(yesterday);
            startDate = yd;
            endDate = yd;
        } else if (filter === 'this-month') {
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            startDate = `${year}-${month}-01`;
            const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
            endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
        } else if (filter === 'last-month') {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const year = lastMonth.getFullYear();
            const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
            startDate = `${year}-${month}-01`;
            const lastDay = new Date(year, lastMonth.getMonth() + 1, 0).getDate();
            endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
        }
        // 'all' => startDate and endDate stay empty

        elements.startDate.value = startDate;
        elements.endDate.value = endDate;
        state.filters.startDate = startDate;
        state.filters.endDate = endDate;
        state.currentPage = 1;
        state.showAll = false;

        // Update active button
        elements.quickFilters.querySelectorAll('.qf-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        loadTransactions();
    });

    // Paket dropdown toggle
    elements.paketDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = elements.paketDropdownMenu;
        const btn = elements.paketDropdownBtn;
        const isOpen = menu.classList.contains('show');
        menu.classList.toggle('show');
        btn.classList.toggle('open');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.paketDropdown.contains(e.target)) {
            elements.paketDropdownMenu.classList.remove('show');
            elements.paketDropdownBtn.classList.remove('open');
        }
        if (!elements.tipeDropdown.contains(e.target)) {
            elements.tipeDropdownMenu.classList.remove('show');
            elements.tipeDropdownBtn.classList.remove('open');
        }
    });

    // Paket checkbox change
    elements.paketDropdownMenu.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            updatePaketFilter();
        }
    });

    // Paket clear button
    elements.paketClearBtn.addEventListener('click', () => {
        elements.paketDropdownMenu.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        updatePaketFilter();
    });

    // Tipe dropdown toggle
    elements.tipeDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.tipeDropdownMenu.classList.toggle('show');
        elements.tipeDropdownBtn.classList.toggle('open');
    });

    // Tipe option click
    elements.tipeDropdownMenu.addEventListener('click', (e) => {
        const option = e.target.closest('.tipe-option');
        if (!option) return;
        const value = option.dataset.value;
        // Update hidden select for compatibility
        elements.typeFilter.value = value;
        state.filters.type = value;
        state.currentPage = 1;
        state.showAll = false;
        // Update active state
        elements.tipeDropdownMenu.querySelectorAll('.tipe-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        // Update button label
        elements.tipeDropdownLabel.textContent = option.textContent.trim();
        elements.tipeDropdownBtn.classList.toggle('has-selection', !!value);
        // Close menu
        elements.tipeDropdownMenu.classList.remove('show');
        elements.tipeDropdownBtn.classList.remove('open');
        loadTransactions();
    });

    // Reset filters
    elements.resetFilters.addEventListener('click', () => {
        elements.searchInput.value = '';
        elements.startDate.value = '';
        elements.endDate.value = '';
        elements.typeFilter.value = '';
        // Reset paket dropdown
        elements.paketDropdownMenu.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        updatePaketLabel([]);
        // Reset tipe dropdown
        elements.tipeDropdownMenu.querySelectorAll('.tipe-option').forEach(o => o.classList.remove('active'));
        elements.tipeDropdownMenu.querySelector('[data-value=""]').classList.add('active');
        elements.tipeDropdownLabel.textContent = 'Semua Tipe';
        elements.tipeDropdownBtn.classList.remove('has-selection');
        elements.prevPeriodFilter.checked = false;
        state.filters = { search: '', startDate: '', endDate: '', type: '', month: state.filters.month, paket: [], prevPeriod: false };
        state.currentPage = 1;
        state.showAll = false;
        // Reset quick filters
        elements.quickFilters.querySelectorAll('.qf-btn').forEach(b => b.classList.remove('active'));
        elements.quickFilters.querySelector('[data-filter="all"]').classList.add('active');
        loadTransactions();
    });

    // Pagination
    elements.prevPage.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            loadTransactions();
        }
    });

    elements.nextPage.addEventListener('click', () => {
        if (state.currentPage < state.totalPages) {
            state.currentPage++;
            loadTransactions();
        }
    });

    // Load all button
    elements.loadAllBtn.addEventListener('click', () => {
        state.showAll = !state.showAll;
        elements.loadAllBtn.textContent = state.showAll ? 'Tampilkan 20' : 'Lihat Semua';
        loadTransactions();
    });

    // Modal events
    elements.closeModal.addEventListener('click', closeModal);
    elements.cancelBtn.addEventListener('click', closeModal);
    elements.transactionForm.addEventListener('submit', handleFormSubmit);

    // Delete modal events
    elements.closeDeleteModal.addEventListener('click', closeDeleteModal);
    elements.cancelDelete.addEventListener('click', closeDeleteModal);
    elements.confirmDelete.addEventListener('click', confirmDelete);

    // Close modals on backdrop click
    elements.transactionModal.addEventListener('click', (e) => {
        if (e.target === elements.transactionModal) closeModal();
    });

    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) closeDeleteModal();
    });

    // User management modal events
    elements.closeUserModal.addEventListener('click', closeUserModal);
    elements.userModal.addEventListener('click', (e) => {
        if (e.target === elements.userModal) closeUserModal();
    });
    elements.addUserBtn.addEventListener('click', () => openUserFormModal());

    // User form modal events
    elements.closeUserFormModal.addEventListener('click', closeUserFormModal);
    elements.cancelUserForm.addEventListener('click', closeUserFormModal);
    elements.userFormModal.addEventListener('click', (e) => {
        if (e.target === elements.userFormModal) closeUserFormModal();
    });
    elements.userForm.addEventListener('submit', handleUserFormSubmit);

    // Sync periode when transaction date changes
    elements.tanggal.addEventListener('change', (e) => {
        syncPeriodeToDate(e.target.value);
        updateDescriptionPreview();
    });

    // Periode tagihan change → update hint + preview
    if (elements.periodeTagihan) {
        elements.periodeTagihan.addEventListener('change', () => {
            updatePeriodeHint();
            updateDescriptionPreview();
        });
    }

    // Rupiah formatting on input
    elements.pemasukan.addEventListener('input', formatRupiahInput);
    elements.pengeluaran.addEventListener('input', formatRupiahInput);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeDeleteModal();
            closeLoginModal();
            closeUserModal();
            closeUserFormModal();
            closeBulkSearchModal();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'n' && state.canAdd) {
            e.preventDefault();
            openModal();
        }
    });

    // Periode sebelumnya filter checkbox
    elements.prevPeriodFilter.addEventListener('change', (e) => {
        state.filters.prevPeriod = e.target.checked;
        state.currentPage = 1;
        state.showAll = false;
        loadTransactions();
    });

    // Bulk Search events
    initBulkSearchEvents();

    // Structured Description Form Events
    initStructuredFormEvents();
}

// Initialize Structured Description Form Events
function initStructuredFormEvents() {
    // Mode toggle
    document.querySelectorAll('input[name="descMode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const isAuto = e.target.value === 'auto';
            elements.autoModeFields.style.display = isAuto ? 'block' : 'none';
            elements.manualModeField.style.display = isAuto ? 'none' : 'block';
        });
    });

    // Transaction type change
    elements.tipeTransaksi.addEventListener('change', handleTransactionTypeChange);

    // Add kit button
    elements.addKitBtn.addEventListener('click', addKitRow);

    // Remove kit button and paket select change (delegated)
    elements.kitContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-kit')) {
            e.target.closest('.kit-row').remove();
            updateRemoveButtons();
            updateDescriptionPreview();
        }
    });

    // Handle paket select change for "Lainnya" option (delegated)
    elements.kitContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('paket-select')) {
            const customInput = e.target.closest('.kit-row').querySelector('.paket-custom');
            if (customInput) {
                customInput.style.display = e.target.value === 'lainnya' ? 'block' : 'none';
            }
        }
        updateDescriptionPreview();
    });

    // Update preview on input changes
    elements.namaClient.addEventListener('input', updateDescriptionPreview);
    elements.kodePayment.addEventListener('change', handleKodePaymentChange);
    elements.tipeTransaksi.addEventListener('change', updateDescriptionPreview);
    elements.topUpBank.addEventListener('change', updateDescriptionPreview);

    // Kode payment custom input
    const kodeCustom = document.getElementById('kodePaymentCustom');
    if (kodeCustom) {
        kodeCustom.addEventListener('input', updateDescriptionPreview);
    }

    // Kit/Paket input changes (delegated)
    elements.kitContainer.addEventListener('input', updateDescriptionPreview);
}

// Handle kode payment change for "Lainnya" option
function handleKodePaymentChange() {
    const kodeCustom = document.getElementById('kodePaymentCustom');
    if (kodeCustom) {
        kodeCustom.style.display = elements.kodePayment.value === 'lainnya' ? 'block' : 'none';
    }
    updateDescriptionPreview();
}

// Handle transaction type change
function handleTransactionTypeChange() {
    const type = elements.tipeTransaksi.value;
    const isTopUp = type === 'Top Up';
    const showPeriode = (type === 'Payment' || type === 'Aktivasi');

    elements.topUpField.style.display = isTopUp ? 'block' : 'none';
    elements.clientFields.style.display = isTopUp ? 'none' : 'block';
    if (elements.periodeTagihanField) {
        elements.periodeTagihanField.style.display = showPeriode ? 'block' : 'none';
    }

    updateDescriptionPreview();
}

// Add new kit row
function addKitRow() {
    const kitRow = document.createElement('div');
    kitRow.className = 'kit-row';
    kitRow.innerHTML = `
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
        <button type="button" class="btn btn-sm btn-secondary btn-remove-kit">✕</button>
    `;
    elements.kitContainer.appendChild(kitRow);
    updateRemoveButtons();
    kitRow.querySelector('.kit-input').focus();
}

// Update remove buttons visibility
function updateRemoveButtons() {
    const rows = elements.kitContainer.querySelectorAll('.kit-row');
    rows.forEach((row, index) => {
        const removeBtn = row.querySelector('.btn-remove-kit');
        removeBtn.style.display = rows.length > 1 ? 'inline-flex' : 'none';
    });
}

// Update description preview
function updateDescriptionPreview() {
    const type = elements.tipeTransaksi.value;
    let preview = '';

    if (type === 'Top Up') {
        const bank = elements.topUpBank.value;
        preview = `Top Up ${bank}`;
    } else if (type === 'Lainnya') {
        preview = '(Gunakan mode manual untuk deskripsi custom)';
    } else {
        const nama = elements.namaClient.value.trim();

        // Get kode payment (check for custom)
        let kode = elements.kodePayment.value;
        if (kode === 'lainnya') {
            const kodeCustom = document.getElementById('kodePaymentCustom');
            kode = kodeCustom ? kodeCustom.value.trim() : '';
        }

        // Get all kits
        const kitRows = elements.kitContainer.querySelectorAll('.kit-row');
        const kits = [];
        kitRows.forEach(row => {
            const kitInput = row.querySelector('.kit-input').value.trim().toUpperCase();
            const paketSelect = row.querySelector('.paket-select');
            let paket = paketSelect.value;

            // Check for custom paket
            if (paket === 'lainnya') {
                const paketCustom = row.querySelector('.paket-custom');
                paket = paketCustom ? paketCustom.value.trim() : '';
            }

            if (kitInput) {
                kits.push({ kit: kitInput, paket });
            }
        });

        if (nama || kits.length > 0) {
            preview = `${type} ${nama}`;
            if (kits.length > 0) {
                kits.forEach(k => {
                    preview += `\n→ ${k.kit} - ${capitalizeFirst(k.paket)}`;
                });
            }
            if (kode) {
                preview += `\n→ ${kode}`;
            }
            if (isCrossPeriod()) {
                const periodeVal = elements.periodeTagihan ? elements.periodeTagihan.value : '';
                if (periodeVal) preview += `\n→ Periode: ${formatPeriodLabel(periodeVal)}`;
            }
        } else {
            preview = '-';
        }
    }

    elements.descriptionPreview.textContent = preview;
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function migratePaketNames() {
    if (localStorage.getItem('paketMigrated')) return;
    try {
        await apiCall('?migrate_paket=1');
        localStorage.setItem('paketMigrated', '1');
    } catch (e) {
        // silent fail
    }
}

function normalizePaket(paket) {
    const map = {
        'reguler': 'regular',
        'residensial': 'regular',
        'internasional': 'international',
        'inter': 'international',
        'local': 'local priority'
    };
    const lower = paket.toLowerCase();
    return map[lower] || lower;
}

// Generate description from structured form
function generateDescription() {
    const type = elements.tipeTransaksi ? elements.tipeTransaksi.value : 'Payment';

    if (type === 'Top Up') {
        const bank = elements.topUpBank ? elements.topUpBank.value : 'UOB';
        return `Top Up ${bank}`;
    }

    if (type === 'Lainnya') {
        return elements.deskripsi ? elements.deskripsi.value.trim() : '';
    }

    const nama = elements.namaClient ? elements.namaClient.value.trim() : '';

    // Get kode payment (check for custom)
    let kode = elements.kodePayment ? elements.kodePayment.value : '0900';
    if (kode === 'lainnya') {
        const kodeCustom = document.getElementById('kodePaymentCustom');
        kode = kodeCustom ? kodeCustom.value.trim() : '';
    }

    // Get all kits
    const kitContainer = elements.kitContainer || document.getElementById('kitContainer');
    const kitRows = kitContainer ? kitContainer.querySelectorAll('.kit-row') : [];
    const kits = [];
    kitRows.forEach(row => {
        const kitInputEl = row.querySelector('.kit-input');
        const kitInput = kitInputEl ? kitInputEl.value.trim().toUpperCase() : '';
        const paketSelect = row.querySelector('.paket-select');
        let paket = paketSelect ? paketSelect.value : 'regular';

        // Check for custom paket
        if (paket === 'lainnya') {
            const paketCustom = row.querySelector('.paket-custom');
            paket = paketCustom ? paketCustom.value.trim() : '';
        }

        if (kitInput) {
            kits.push({ kit: kitInput, paket });
        }
    });

    // Build description
    let desc = `${type} ${nama}`;
    kits.forEach(k => {
        desc += ` (${k.kit}) - ${k.paket}`;
    });
    if (kode) {
        desc += ` (${kode})`;
    }

    // Append billing period tag only when it differs from transaction month
    if (isCrossPeriod()) {
        const periodeVal = elements.periodeTagihan ? elements.periodeTagihan.value : '';
        if (periodeVal) desc += ` [periode:${periodeVal}]`;
    }

    return desc.trim();
}

// Reset structured form
function resetStructuredForm() {
    // Reset to auto mode
    document.querySelector('input[name="descMode"][value="auto"]').checked = true;
    elements.autoModeFields.style.display = 'block';
    elements.manualModeField.style.display = 'none';

    // Reset fields
    elements.tipeTransaksi.value = 'Payment';
    elements.topUpBank.value = 'UOB';
    elements.namaClient.value = '';
    elements.kodePayment.value = '0900';

    // Hide custom kode payment input
    const kodeCustom = document.getElementById('kodePaymentCustom');
    if (kodeCustom) {
        kodeCustom.style.display = 'none';
        kodeCustom.value = '';
    }

    // Reset kit container to single row
    elements.kitContainer.innerHTML = `
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
    `;

    // Show client fields, hide top up field; show periode field
    elements.clientFields.style.display = 'block';
    elements.topUpField.style.display = 'none';
    if (elements.periodeTagihanField) elements.periodeTagihanField.style.display = 'block';
    if (elements.periodeHint) elements.periodeHint.style.display = 'none';

    // Reset preview
    elements.descriptionPreview.textContent = '-';
}

// Format rupiah on input
function formatRupiahInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
        e.target.value = parseInt(value).toLocaleString('id-ID');
    }
}

// Parse rupiah input to number
function parseRupiahInput(value) {
    return parseInt(value.replace(/\D/g, '')) || 0;
}

// Auth Functions
async function checkAuthStatus() {
    try {
        const response = await fetch('api/auth.php?action=status');
        const data = await response.json();

        state.isLoggedIn = data.logged_in;
        state.user = data.user;
        state.canAdd = data.can_add;
        state.canEdit = data.can_edit;

        updateAuthUI();
    } catch (error) {
        console.error('Failed to check auth status:', error);
    }
}

function updateAuthUI() {
    if (state.isLoggedIn && state.user) {
        elements.loginBtn.style.display = 'none';
        elements.userInfo.style.display = 'flex';
        elements.userName.textContent = state.user.nama;
        elements.userRole.textContent = state.user.role;
        elements.userRole.className = `user-role ${state.user.role}`;

        elements.addBtn.style.display = state.canAdd ? 'inline-flex' : 'none';
        elements.userMgmtBtn.style.display = state.canEdit ? 'inline-flex' : 'none';
        elements.importCsvBtn.style.display = state.canEdit ? 'inline-flex' : 'none';
    } else {
        elements.loginBtn.style.display = 'inline-flex';
        elements.userInfo.style.display = 'none';
        elements.addBtn.style.display = 'none';
        elements.userMgmtBtn.style.display = 'none';
        elements.importCsvBtn.style.display = 'none';
    }

    // Show/hide action column based on role
    const actionHeader = document.getElementById('actionHeader');
    if (actionHeader) {
        actionHeader.style.display = state.canEdit ? '' : 'none';
    }

    if (state.transactions.length > 0) {
        renderTransactions();
    }
}

function openLoginModal() {
    elements.loginForm.reset();
    elements.loginModal.classList.add('active');
    elements.loginUsername.focus();
}

function closeLoginModal() {
    elements.loginModal.classList.remove('active');
}

async function handleLogin(e) {
    e.preventDefault();

    const username = elements.loginUsername.value.trim();
    const password = elements.loginPassword.value;

    if (!username || !password) {
        showToast('Username dan password harus diisi', 'error');
        return;
    }

    try {
        const response = await fetch('api/auth.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.error || 'Login gagal', 'error');
            return;
        }

        state.isLoggedIn = true;
        state.user = data.user;
        state.canAdd = data.can_add;
        state.canEdit = data.can_edit;

        closeLoginModal();
        updateAuthUI();
        showToast(`Selamat datang, ${data.user.nama}!`, 'success');
    } catch (error) {
        console.error('Login error:', error);
        showToast('Terjadi kesalahan saat login', 'error');
    }
}

async function logout() {
    try {
        await fetch('api/auth.php?action=logout');

        state.isLoggedIn = false;
        state.user = null;
        state.canAdd = false;
        state.canEdit = false;

        updateAuthUI();
        showToast('Logout berhasil', 'success');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// API Calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`api/transactions.php${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.code === 'AUTH_REQUIRED') {
                showToast('Silakan login terlebih dahulu', 'error');
                openLoginModal();
                throw new Error(data.error);
            }
            if (data.code === 'ADMIN_REQUIRED' || data.code === 'ADD_REQUIRED') {
                showToast('Anda tidak memiliki akses', 'error');
                throw new Error(data.error);
            }
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load Summary
async function loadSummary() {
    try {
        const data = await apiCall('?summary=1');
        elements.totalPemasukan.textContent = formatRupiah(data.total_pemasukan);
        elements.totalPengeluaran.textContent = formatRupiah(data.total_pengeluaran);
        elements.totalSaldo.textContent = formatRupiah(data.saldo);
        elements.totalTransaksi.textContent = data.total_transaksi;
        elements.totalTransIn.textContent = data.transaksi_masuk || 0;
        elements.totalTransOut.textContent = data.transaksi_keluar || 0;

        // Update current month badge
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const now = new Date();
        const currentMonthName = months[now.getMonth()];
        const currentYear = now.getFullYear();
        const badge = document.getElementById('currentMonthBadge');
        if (badge) {
            badge.textContent = `${currentMonthName} ${currentYear}`;
        }

        if (parseFloat(data.saldo) < 0) {
            elements.totalSaldo.classList.add('amount-negative');
        } else {
            elements.totalSaldo.classList.remove('amount-negative');
        }
    } catch (error) {
        console.error('Failed to load summary:', error);
    }
}

// Load quick filter counts for Hari Ini & Kemarin
async function loadQuickFilterCounts() {
    const now = new Date();
    const today = formatDateStr(now);
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = formatDateStr(yesterdayDate);

    async function fetchCount(date) {
        try {
            const params = new URLSearchParams({ start_date: date, end_date: date, limit: 1000 });
            const data = await apiCall(`?${params.toString()}`);
            let inc = 0, exp = 0;
            data.data.forEach(t => {
                if (parseFloat(t.pemasukan) > 0) inc++;
                if (parseFloat(t.pengeluaran) > 0) exp++;
            });
            return { inc, exp };
        } catch { return null; }
    }

    function applyCount(spanId, counts) {
        const el = document.getElementById(spanId);
        if (!el || !counts) return;
        el.innerHTML = `<span class="qf-count-in">${counts.inc}</span>/<span class="qf-count-out">${counts.exp}</span>`;
        el.style.display = 'inline';
    }

    const [todayData, yesterdayData] = await Promise.all([fetchCount(today), fetchCount(yesterday)]);
    applyCount('countToday', todayData);
    applyCount('countYesterday', yesterdayData);
}

// Load Monthly Summary
async function loadMonthlySummary(month) {
    try {
        const [year, m] = month.split('-');
        const monthNum = parseInt(m);
        const startDate = `${year}-${m}-01`;

        // Get last day of month properly
        const lastDay = new Date(parseInt(year), monthNum, 0).getDate();
        const endDate = `${year}-${m}-${String(lastDay).padStart(2, '0')}`;

        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            limit: 10000
        });

        const data = await apiCall(`?${params.toString()}`);

        let income = 0, expense = 0, transIn = 0, transOut = 0;
        data.data.forEach(t => {
            const pem = parseFloat(t.pemasukan);
            const pen = parseFloat(t.pengeluaran);
            income += pem;
            expense += pen;
            if (pem > 0) transIn++;
            if (pen > 0) transOut++;
        });

        elements.monthlyIncome.textContent = formatRupiah(income);
        elements.monthlyExpense.textContent = formatRupiah(expense);
        elements.monthlyBalance.textContent = formatRupiah(income - expense);
        elements.monthlyTransTotal.textContent = data.data.length;
        elements.monthlyTransIn.textContent = transIn;
        elements.monthlyTransOut.textContent = transOut;
    } catch (error) {
        console.error('Failed to load monthly summary:', error);
    }
}

// Load Transactions
async function loadTransactions() {
    elements.transactionsBody.innerHTML = '<tr><td colspan="7" class="loading">Memuat data...</td></tr>';

    try {
        const params = new URLSearchParams({
            page: state.showAll ? 1 : state.currentPage,
            limit: state.showAll ? 10000 : state.limit
        });

        if (state.filters.search) params.append('search', state.filters.search);
        if (state.filters.startDate) params.append('start_date', state.filters.startDate);
        if (state.filters.endDate) params.append('end_date', state.filters.endDate);
        if (state.filters.type) params.append('type', state.filters.type);
        if (state.filters.paket && state.filters.paket.length > 0) params.append('paket', state.filters.paket.join(','));
        if (state.filters.prevPeriod) params.append('prev_period', '1');

        const data = await apiCall(`?${params.toString()}`);

        state.transactions = data.data;
        state.totalPages = data.pages;

        renderTransactions();
        updatePagination(data.total);
    } catch (error) {
        elements.transactionsBody.innerHTML = '<tr><td colspan="7" class="empty">Gagal memuat data</td></tr>';
    }
}

// Render Transactions
function renderTransactions() {
    const colspan = state.canEdit ? '7' : '6';

    const transactions = state.transactions;

    if (transactions.length === 0) {
        elements.transactionsBody.innerHTML = `<tr><td colspan="${colspan}" class="empty">Tidak ada transaksi</td></tr>`;
        return;
    }

    const startNo = state.showAll ? 1 : (state.currentPage - 1) * state.limit + 1;

    elements.transactionsBody.innerHTML = transactions.map((trans, index) => `
        <tr>
            <td>${startNo + index}</td>
            <td>${formatDate(trans.tanggal)}</td>
            <td class="description-cell">${formatDescriptionDisplay(trans.deskripsi)}</td>
            <td class="text-right col-pemasukan ${trans.pemasukan > 0 ? 'amount-income' : ''}">
                ${trans.pemasukan > 0 ? formatRupiah(trans.pemasukan) : '-'}
            </td>
            <td class="text-right col-pengeluaran ${trans.pengeluaran > 0 ? 'amount-expense' : ''}">
                ${trans.pengeluaran > 0 ? formatRupiah(trans.pengeluaran) : '-'}
            </td>
            <td class="text-right col-nominal ${trans.pemasukan > 0 ? 'amount-income' : 'amount-expense'}">
                ${trans.pemasukan > 0
                    ? '<span class="nominal-icon">↑</span>' + formatRupiah(trans.pemasukan)
                    : '<span class="nominal-icon">↓</span>' + formatRupiah(trans.pengeluaran)}
            </td>
            <td class="text-right amount-balance ${trans.saldo < 0 ? 'amount-negative' : ''}">
                ${formatRupiah(trans.saldo)}
            </td>
            ${state.canEdit ? `
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="editTransaction(${trans.id})" title="Edit">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${trans.id})" title="Hapus">🗑️</button>
                    </div>
                </td>
            ` : ''}
        </tr>
    `).join('');
}

// Format description for display with visual styling
function formatDescriptionDisplay(desc) {
    if (!desc) return '-';

    const parsed = parseDescriptionForDisplay(desc);

    if (!parsed.success) {
        return escapeHtml(stripPeriodeTag(desc));
    }

    // Build structured HTML
    let html = '<div class="desc-structured">';

    // Periode badge (shown only when billing period tag exists)
    if (parsed.periode) {
        html += `<div class="desc-periode-badge">📅 Pembayaran untuk: ${escapeHtml(formatPeriodLabel(parsed.periode))}</div>`;
    }

    // Header: type • kode  client
    html += '<div class="desc-header">';
    html += `<span class="desc-type ${parsed.typeClass}">${escapeHtml(parsed.type)}</span>`;
    if (parsed.kode) {
        html += `<span class="desc-separator">•</span>`;
        html += `<span class="desc-kode">${escapeHtml(parsed.kode)}</span>`;
    }
    if (parsed.client) {
        html += `<span class="desc-client">${escapeHtml(parsed.client)}</span>`;
    }
    html += '</div>';

    // Kit and paket details
    if (parsed.kits && parsed.kits.length > 0) {
        html += '<div class="desc-details">';
        parsed.kits.forEach(kit => {
            html += '<div class="desc-kit-row">';
            html += `<span class="desc-kit">${escapeHtml(kit.kit)}</span>`;
            if (kit.paket) {
                html += `<span class="desc-separator">•</span>`;
                html += `<span class="desc-paket ${kit.paket.toLowerCase()}">${escapeHtml(capitalizeFirst(kit.paket))}</span>`;
            }
            html += '</div>';
        });
        html += '</div>';
    }

    html += '</div>';
    return html;
}

// Parse description for display purposes
function parseDescriptionForDisplay(desc) {
    if (!desc) return { success: false };

    // Extract billing period tag first, then work on clean description
    const periode = parsePeriodeFromDesc(desc);
    const cleanDesc = stripPeriodeTag(desc);

    // Handle Top Up
    const topUpMatch = cleanDesc.match(/^Top\s*Up\s+(.+)$/i);
    if (topUpMatch) {
        return {
            success: true,
            type: 'Top Up',
            typeClass: 'topup',
            client: topUpMatch[1].trim(),
            periode: null
        };
    }

    // Handle Refund
    const refundMatch = cleanDesc.match(/^Refund\s+(?:payment\s+)?\(?(KIT[A-Z0-9]+)\)?/i);
    if (refundMatch) {
        return {
            success: true,
            type: 'Refund',
            typeClass: 'refund',
            kits: [{ kit: refundMatch[1].toUpperCase() }],
            periode: null
        };
    }

    // Handle Payment/Aktivasi patterns
    // Pattern variations:
    // "Payment Nama (KIT123) - paket (kode)"
    // "Payment Nama (10) (KIT123) - paket (kode)"
    // "Payment Nama (KIT123) (KIT456) - paket, paket2 (kode)"

    const typeMatch = cleanDesc.match(/^(Payment|Aktivasi)\s+/i);
    if (!typeMatch) return { success: false };

    const type = capitalizeFirst(typeMatch[1].toLowerCase());
    const typeClass = type.toLowerCase();
    let remaining = cleanDesc.slice(typeMatch[0].length);

    // Extract location code from end
    const kodeMatch = remaining.match(/\((\d{4})\)\s*$/);
    const kode = kodeMatch ? kodeMatch[1] : null;
    if (kodeMatch) {
        remaining = remaining.slice(0, -kodeMatch[0].length).trim();
    }

    // Extract client name (everything before first KIT)
    let clientName = remaining.split(/\(?\s*KIT/i)[0].trim();

    // Extract all KIT-paket pairs: "(KITxxx) - paketname"
    const kits = [];
    const kitPaketRegex = /\(?(KIT[A-Z0-9]+)\)?\s*-\s*([^(]+?)(?=\s*\(?KIT|\s*$)/gi;
    let m;
    while ((m = kitPaketRegex.exec(remaining)) !== null) {
        kits.push({
            kit: m[1].toUpperCase(),
            paket: normalizePaket(m[2].trim())
        });
    }

    // Fallback: if no kit-paket pairs found, try extracting just KIT IDs
    if (kits.length === 0) {
        const kitMatches = remaining.match(/\(?(KIT[A-Z0-9]+)\)?/gi);
        if (kitMatches) {
            kitMatches.forEach(km => {
                kits.push({
                    kit: km.replace(/[()]/g, '').toUpperCase(),
                    paket: null
                });
            });
        }
    }

    if (clientName || kits.length > 0) {
        return {
            success: true,
            type: type,
            typeClass: typeClass,
            client: clientName,
            kits: kits,
            kode: kode,
            periode: periode
        };
    }

    return { success: false };
}

// Update Pagination
function updatePagination(total) {
    if (state.showAll) {
        elements.pageInfo.textContent = `Menampilkan semua (${total} transaksi)`;
        elements.prevPage.style.display = 'none';
        elements.nextPage.style.display = 'none';
    } else {
        elements.pageInfo.textContent = `Halaman ${state.currentPage} dari ${state.totalPages} (${total} transaksi)`;
        elements.prevPage.style.display = 'inline-flex';
        elements.nextPage.style.display = 'inline-flex';
        elements.prevPage.disabled = state.currentPage <= 1;
        elements.nextPage.disabled = state.currentPage >= state.totalPages;
    }
}

// Modal Functions
function openModal(id = null) {
    if (!state.canAdd) {
        showToast('Anda harus login untuk menambah transaksi', 'error');
        return;
    }

    state.editingId = id;
    elements.transactionForm.reset();
    resetStructuredForm();

    if (id) {
        if (!state.canEdit) {
            showToast('Anda tidak memiliki akses edit', 'error');
            return;
        }
        elements.modalTitle.textContent = 'Edit Transaksi';
        loadTransactionForEdit(id);
    } else {
        elements.modalTitle.textContent = 'Tambah Transaksi';
        const today = new Date().toISOString().split('T')[0];
        elements.tanggal.value = today;
        elements.pemasukan.value = '0';
        elements.pengeluaran.value = '0';
        syncPeriodeToDate(today);
    }

    elements.transactionModal.classList.add('active');
    elements.tanggal.focus();
}

function closeModal() {
    elements.transactionModal.classList.remove('active');
    state.editingId = null;
}

async function loadTransactionForEdit(id) {
    try {
        const data = await apiCall(`?id=${id}`);
        elements.transactionId.value = data.id;
        elements.tanggal.value = data.tanggal;
        elements.pemasukan.value = parseInt(data.pemasukan).toLocaleString('id-ID');
        elements.pengeluaran.value = parseInt(data.pengeluaran).toLocaleString('id-ID');

        // Try to parse and fill structured form, fallback to manual mode
        const parsed = parseDescription(data.deskripsi);

        if (parsed.success) {
            // Use auto mode with parsed data
            document.querySelector('input[name="descMode"][value="auto"]').checked = true;
            elements.autoModeFields.style.display = 'block';
            elements.manualModeField.style.display = 'none';

            elements.tipeTransaksi.value = parsed.type;
            handleTransactionTypeChange();

            // Restore billing period (default = transaction month)
            const periodeVal = parsed.periode || data.tanggal.substring(0, 7);
            if (elements.periodeTagihan && [...elements.periodeTagihan.options].some(o => o.value === periodeVal)) {
                elements.periodeTagihan.value = periodeVal;
            } else {
                syncPeriodeToDate(data.tanggal);
            }
            updatePeriodeHint();

            if (parsed.type === 'Top Up') {
                elements.topUpBank.value = parsed.bank || 'UOB';
            } else {
                elements.namaClient.value = parsed.nama || '';
                elements.kodePayment.value = parsed.kode || '3402';

                // Fill kit rows
                if (parsed.kits && parsed.kits.length > 0) {
                    elements.kitContainer.innerHTML = '';
                    parsed.kits.forEach((kit, index) => {
                        const kitRow = document.createElement('div');
                        kitRow.className = 'kit-row';
                        kitRow.innerHTML = `
                            <input type="text" class="kit-input" placeholder="KIT303946946" maxlength="20" value="${kit.kit}">
                            <select class="paket-select">
                                <option value="lite" ${kit.paket === 'lite' ? 'selected' : ''}>Lite</option>
                                <option value="regular" ${(kit.paket === 'regular' || kit.paket === 'reguler') ? 'selected' : ''}>Regular</option>
                                <option value="roam" ${kit.paket === 'roam' ? 'selected' : ''}>Roam</option>
                                <option value="local priority" ${(kit.paket === 'local priority' || kit.paket === 'local') ? 'selected' : ''}>Local Priority</option>
                                <option value="international" ${(kit.paket === 'international' || kit.paket === 'internasional' || kit.paket === 'inter') ? 'selected' : ''}>International</option>
                                <option value="lainnya" ${!['lite','regular','reguler','roam','local priority','local','international','internasional','inter','residensial'].includes(kit.paket) && kit.paket ? 'selected' : ''}>Lainnya</option>
                            </select>
                            <button type="button" class="btn btn-sm btn-secondary btn-remove-kit" style="display:${parsed.kits.length > 1 ? 'inline-flex' : 'none'};">✕</button>
                        `;
                        elements.kitContainer.appendChild(kitRow);
                    });
                }
            }

            updateDescriptionPreview();
        } else {
            // Use manual mode
            document.querySelector('input[name="descMode"][value="manual"]').checked = true;
            elements.autoModeFields.style.display = 'none';
            elements.manualModeField.style.display = 'block';
            elements.deskripsi.value = data.deskripsi;
        }
    } catch (error) {
        closeModal();
    }
}

// Parse description to structured data
function parseDescription(desc) {
    if (!desc) return { success: false };

    // Extract and strip billing period tag before parsing the rest
    const periode = parsePeriodeFromDesc(desc);
    const cleanDesc = stripPeriodeTag(desc);

    // Handle Top Up
    const topUpMatch = cleanDesc.match(/^Top\s*Up\s+(.+)$/i);
    if (topUpMatch) {
        return {
            success: true,
            type: 'Top Up',
            bank: topUpMatch[1].trim()
        };
    }

    // Handle Payment/Aktivasi/Refund patterns
    const typePattern = /^(Payment|Aktivasi|Refund)\s+(.+)/i;
    const typeMatch = cleanDesc.match(typePattern);
    if (typeMatch) {
        let remaining = typeMatch[2];

        // Extract kode from end
        const kodeMatch = remaining.match(/\((\d{4})\)\s*$/);
        const kode = kodeMatch ? kodeMatch[1] : '0900';
        if (kodeMatch) remaining = remaining.slice(0, -kodeMatch[0].length).trim();

        // Extract client name (before first KIT)
        const nama = remaining.split(/\(?\s*KIT/i)[0].trim();

        // Extract all KIT-paket pairs
        const kits = [];
        const kitPaketRegex = /\(?(KIT[A-Z0-9]+)\)?\s*-\s*([^(]+?)(?=\s*\(?KIT|\s*$)/gi;
        let m;
        while ((m = kitPaketRegex.exec(remaining)) !== null) {
            kits.push({ kit: m[1].toUpperCase(), paket: normalizePaket(m[2].trim()) });
        }

        // Fallback: just KIT IDs without paket
        if (kits.length === 0) {
            const kitOnly = remaining.match(/\(?(KIT[A-Z0-9]+)\)?/i);
            if (kitOnly) {
                kits.push({ kit: kitOnly[1].toUpperCase(), paket: 'regular' });
            }
        }

        if (kits.length > 0) {
            return {
                success: true,
                type: capitalizeFirst(typeMatch[1].toLowerCase()),
                nama: nama,
                kits: kits,
                kode: kode,
                periode: periode
            };
        }
    }

    return { success: false };
}

async function handleFormSubmit(e) {
    e.preventDefault();

    // Prevent double submission
    if (state.isSubmitting) return;

    // Get description based on mode
    const modeRadio = document.querySelector('input[name="descMode"]:checked');
    const isAutoMode = modeRadio ? modeRadio.value === 'auto' : true;
    let deskripsi = '';

    if (isAutoMode) {
        deskripsi = generateDescription();
    } else {
        deskripsi = elements.deskripsi ? elements.deskripsi.value.trim() : '';
    }

    // Trim deskripsi
    deskripsi = deskripsi.trim();

    const formData = {
        tanggal: elements.tanggal.value,
        deskripsi: deskripsi,
        pemasukan: parseRupiahInput(elements.pemasukan.value),
        pengeluaran: parseRupiahInput(elements.pengeluaran.value)
    };

    // Validation
    if (!formData.tanggal) {
        showToast('Tanggal harus diisi', 'error');
        return;
    }

    if (!formData.deskripsi) {
        showToast('Deskripsi harus diisi', 'error');
        return;
    }

    // Set submitting state
    state.isSubmitting = true;
    const submitBtn = elements.transactionForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = state.editingId ? 'Menyimpan...' : 'Menambahkan...';

    try {
        if (state.editingId) {
            formData.id = state.editingId;
            await apiCall('', { method: 'PUT', body: JSON.stringify(formData) });
            showToast('Transaksi berhasil diupdate', 'success');
        } else {
            await apiCall('', { method: 'POST', body: JSON.stringify(formData) });
            showToast('Transaksi berhasil ditambahkan', 'success');
        }

        closeModal();
        loadSummary();
        loadTransactions();
        if (state.filters.month) loadMonthlySummary(state.filters.month);
    } catch (error) {
        // Error handled in apiCall
    } finally {
        // Reset submitting state
        state.isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
    }
}

// Delete Functions
function deleteTransaction(id) {
    if (!state.canEdit) {
        showToast('Anda tidak memiliki akses hapus', 'error');
        return;
    }

    // Find transaction description from state
    const transaction = state.transactions.find(t => t.id === id);
    const description = transaction ? transaction.deskripsi : 'transaksi ini';

    state.deleteId = id;
    elements.deleteInfo.textContent = description;
    elements.deleteModal.classList.add('active');
}

function closeDeleteModal() {
    elements.deleteModal.classList.remove('active');
    state.deleteId = null;
}

async function confirmDelete() {
    if (!state.deleteId || !state.canEdit) return;

    try {
        await apiCall(`?id=${state.deleteId}`, { method: 'DELETE' });
        showToast('Transaksi berhasil dihapus', 'success');
        closeDeleteModal();
        loadSummary();
        loadTransactions();
        if (state.filters.month) loadMonthlySummary(state.filters.month);
    } catch (error) {
        // Error handled in apiCall
    }
}

// Global functions for onclick
window.editTransaction = function(id) {
    if (!state.canEdit) {
        showToast('Anda tidak memiliki akses edit', 'error');
        return;
    }
    openModal(id);
};

window.deleteTransaction = deleteTransaction;

// User Management Functions
function openUserModal() {
    elements.userModal.classList.add('active');
    loadUsers();
}

function closeUserModal() {
    elements.userModal.classList.remove('active');
}

async function loadUsers() {
    elements.usersBody.innerHTML = '<tr><td colspan="6" class="loading">Memuat...</td></tr>';

    try {
        const response = await fetch('api/auth.php?action=users');
        const users = await response.json();

        if (users.length === 0) {
            elements.usersBody.innerHTML = '<tr><td colspan="6" class="empty">Tidak ada user</td></tr>';
            return;
        }

        elements.usersBody.innerHTML = users.map(user => `
            <tr>
                <td>${escapeHtml(user.username)}</td>
                <td>${escapeHtml(user.nama)}</td>
                <td><span class="user-role ${user.role}">${user.role}</span></td>
                <td><span class="status-badge ${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                <td>${user.last_login ? formatDate(user.last_login) : '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="editUser(${user.id})" title="Edit">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id}, '${escapeHtml(user.username)}')" title="Hapus">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        elements.usersBody.innerHTML = '<tr><td colspan="6" class="empty">Gagal memuat user</td></tr>';
    }
}

function openUserFormModal(userId = null) {
    state.editingUserId = userId;
    elements.userForm.reset();
    elements.userActive.checked = true;

    if (userId) {
        elements.userFormTitle.textContent = 'Edit User';
        elements.pwdNote.style.display = 'inline';
        elements.userPassword.removeAttribute('required');
        loadUserForEdit(userId);
    } else {
        elements.userFormTitle.textContent = 'Tambah User';
        elements.pwdNote.style.display = 'none';
        elements.userPassword.setAttribute('required', 'required');
    }

    elements.userFormModal.classList.add('active');
}

function closeUserFormModal() {
    elements.userFormModal.classList.remove('active');
    state.editingUserId = null;
}

async function loadUserForEdit(userId) {
    try {
        const response = await fetch('api/auth.php?action=users');
        const users = await response.json();
        const user = users.find(u => u.id == userId);

        if (user) {
            elements.userId.value = user.id;
            elements.userUsername.value = user.username;
            elements.userNama.value = user.nama;
            elements.userRoleSelect.value = user.role;
            elements.userActive.checked = user.is_active;
        }
    } catch (error) {
        closeUserFormModal();
    }
}

async function handleUserFormSubmit(e) {
    e.preventDefault();

    const formData = {
        username: elements.userUsername.value.trim(),
        nama: elements.userNama.value.trim(),
        role: elements.userRoleSelect.value,
        is_active: elements.userActive.checked
    };

    if (elements.userPassword.value) {
        formData.password = elements.userPassword.value;
    }

    try {
        let response;
        if (state.editingUserId) {
            formData.id = state.editingUserId;
            response = await fetch('api/auth.php?action=update-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch('api/auth.php?action=create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        const data = await response.json();

        if (!response.ok) {
            showToast(data.error || 'Gagal menyimpan user', 'error');
            return;
        }

        showToast(state.editingUserId ? 'User berhasil diupdate' : 'User berhasil dibuat', 'success');
        closeUserFormModal();
        loadUsers();
    } catch (error) {
        showToast('Terjadi kesalahan', 'error');
    }
}

window.editUser = function(userId) {
    openUserFormModal(userId);
};

window.deleteUser = async function(userId, username) {
    if (!confirm(`Hapus user "${username}"?`)) return;

    try {
        const response = await fetch('api/auth.php?action=delete-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.error || 'Gagal menghapus user', 'error');
            return;
        }

        showToast('User berhasil dihapus', 'success');
        loadUsers();
    } catch (error) {
        showToast('Terjadi kesalahan', 'error');
    }
};

// Import CSV Functions
function openImportModal() {
    if (!state.canEdit) {
        showToast('Hanya admin yang dapat import data', 'error');
        return;
    }
    elements.importForm.reset();
    elements.importModal.classList.add('active');
}

function closeImportModal() {
    elements.importModal.classList.remove('active');
}

async function handleImport(e) {
    e.preventDefault();

    if (!state.canEdit) {
        showToast('Hanya admin yang dapat import data', 'error');
        return;
    }

    const fileInput = elements.csvFile;
    if (!fileInput.files || fileInput.files.length === 0) {
        showToast('Pilih file CSV terlebih dahulu', 'error');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('csv_file', file);

    try {
        const response = await fetch('api/transactions.php?action=import', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.error || 'Gagal import data', 'error');
            return;
        }

        let message = data.message;
        if (data.errors && data.errors.length > 0) {
            message += `\n\nPeringatan (${data.errors.length} baris dilewati):\n`;
            message += data.errors.slice(0, 5).join('\n');
            if (data.errors.length > 5) {
                message += `\n... dan ${data.errors.length - 5} error lainnya`;
            }
        }

        showToast(message, 'success');
        closeImportModal();
        loadSummary();
        loadTransactions();
        if (state.filters.month) loadMonthlySummary(state.filters.month);
    } catch (error) {
        showToast('Terjadi kesalahan saat import', 'error');
        console.error('Import error:', error);
    }
}

// Export to CSV
async function exportToCSV() {
    try {
        const params = new URLSearchParams({ limit: 10000 });
        if (state.filters.search) params.append('search', state.filters.search);
        if (state.filters.startDate) params.append('start_date', state.filters.startDate);
        if (state.filters.endDate) params.append('end_date', state.filters.endDate);
        if (state.filters.type) params.append('type', state.filters.type);

        const data = await apiCall(`?${params.toString()}`);

        if (data.data.length === 0) {
            showToast('Tidak ada data untuk diexport', 'error');
            return;
        }

        const headers = ['No', 'Tanggal', 'Deskripsi', 'Pemasukan', 'Pengeluaran', 'Saldo'];
        const rows = data.data.map((trans, index) => [
            index + 1,
            trans.tanggal,
            `"${trans.deskripsi.replace(/"/g, '""')}"`,
            trans.pemasukan,
            trans.pengeluaran,
            trans.saldo
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `starlink-finance-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        showToast(`Berhasil export ${data.data.length} transaksi`, 'success');
    } catch (error) {
        showToast('Gagal export data', 'error');
    }
}

// Export to PDF
async function exportToPDF() {
    try {
        const params = new URLSearchParams({ limit: 10000 });
        if (state.filters.search) params.append('search', state.filters.search);
        if (state.filters.startDate) params.append('start_date', state.filters.startDate);
        if (state.filters.endDate) params.append('end_date', state.filters.endDate);
        if (state.filters.type) params.append('type', state.filters.type);

        const data = await apiCall(`?${params.toString()}`);

        if (data.data.length === 0) {
            showToast('Tidak ada data untuk diexport', 'error');
            return;
        }

        // Create printable HTML
        let totalPemasukan = 0, totalPengeluaran = 0;
        const rows = data.data.map((trans, index) => {
            totalPemasukan += parseFloat(trans.pemasukan);
            totalPengeluaran += parseFloat(trans.pengeluaran);
            return `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${formatDate(trans.tanggal)}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; white-space: pre-wrap; text-align: left;">${escapeHtml(trans.deskripsi)}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${trans.pemasukan > 0 ? formatRupiah(trans.pemasukan) : '-'}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${trans.pengeluaran > 0 ? formatRupiah(trans.pengeluaran) : '-'}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${formatRupiah(trans.saldo)}</td>
                </tr>
            `;
        }).join('');

        const html = `
            <html>
            <head>
                <title>Laporan Keuangan Starlink</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; }
                    .summary { margin: 20px 0; display: flex; gap: 20px; justify-content: center; }
                    .summary div { padding: 10px 20px; background: #f5f5f5; border-radius: 8px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #333; color: white; padding: 10px; text-align: center; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <h1>Laporan Keuangan Starlink Finance</h1>
                <p style="text-align: center;">Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
                <div class="summary">
                    <div><strong>Total Pemasukan:</strong> ${formatRupiah(totalPemasukan)}</div>
                    <div><strong>Total Pengeluaran:</strong> ${formatRupiah(totalPengeluaran)}</div>
                    <div><strong>Saldo:</strong> ${formatRupiah(totalPemasukan - totalPengeluaran)}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th>Deskripsi</th>
                            <th>Pemasukan</th>
                            <th>Pengeluaran</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();

        showToast('PDF siap dicetak', 'success');
    } catch (error) {
        showToast('Gagal export PDF', 'error');
    }
}

// Utility Functions
function formatRupiah(amount) {
    const num = parseFloat(amount) || 0;
    return 'Rp ' + num.toLocaleString('id-ID');
}

function updatePaketFilter() {
    const checked = [...elements.paketDropdownMenu.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
    state.filters.paket = checked;
    state.currentPage = 1;
    state.showAll = false;
    updatePaketLabel(checked);
    loadTransactions();
}

function updatePaketLabel(selected) {
    const btn = elements.paketDropdownBtn;
    const label = elements.paketDropdownLabel;
    if (selected.length === 0) {
        label.textContent = 'Paket';
        btn.classList.remove('has-selection');
    } else {
        label.textContent = `Paket (${selected.length})`;
        btn.classList.add('has-selection');
    }
}

function formatDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast ${type} show`;
    setTimeout(() => elements.toast.classList.remove('show'), 3000);
}

// Auto Refresh Functions
let refreshTimer;
let countdownInterval;
let secondsRemaining = 600; // 10 minutes = 600 seconds

function startAutoRefresh() {
    secondsRemaining = 600;
    updateCountdownDisplay();

    // Clear any existing intervals
    if (countdownInterval) clearInterval(countdownInterval);
    if (refreshTimer) clearTimeout(refreshTimer);

    // Start countdown
    countdownInterval = setInterval(() => {
        secondsRemaining--;
        updateCountdownDisplay();

        if (secondsRemaining <= 0) {
            refreshData();
        }
    }, 1000);
}

function updateCountdownDisplay() {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    const display = `${minutes}:${String(seconds).padStart(2, '0')}`;
    elements.countdownValue.textContent = display;

    // Add visual warning when less than 1 minute
    if (secondsRemaining <= 60 && secondsRemaining > 0) {
        elements.countdownValue.classList.add('countdown-warning');
    } else {
        elements.countdownValue.classList.remove('countdown-warning');
    }
}

function refreshData() {
    // Add rotation animation to refresh button
    elements.refreshNowBtn.classList.add('rotating');

    // Reload all data
    loadSummary();
    loadQuickFilterCounts();
    loadTransactions();
    if (state.filters.month) {
        loadMonthlySummary(state.filters.month);
    }

    // Reset countdown
    startAutoRefresh();

    // Remove rotation after animation
    setTimeout(() => {
        elements.refreshNowBtn.classList.remove('rotating');
    }, 1000);

    showToast('Data berhasil di-refresh', 'success');
}

// =====================
// BULK SEARCH FUNCTIONS
// =====================

function initBulkSearchEvents() {
    elements.bulkSearchBtn.addEventListener('click', openBulkSearchModal);
    elements.closeBulkSearchModal.addEventListener('click', closeBulkSearchModal);
    elements.cancelBulkSearch.addEventListener('click', closeBulkSearchModal);
    elements.bulkSearchModal.addEventListener('click', (e) => {
        if (e.target === elements.bulkSearchModal) closeBulkSearchModal();
    });

    // Period selector
    elements.bulkPeriodGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.qf-btn');
        if (!btn) return;
        elements.bulkPeriodGroup.querySelectorAll('.qf-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        bulkSearchState.period = btn.dataset.period;
        elements.bulkCustomDates.style.display = bulkSearchState.period === 'custom' ? 'flex' : 'none';
    });

    // Execute search
    elements.executeBulkSearch.addEventListener('click', runBulkSearch);

    // New search button (back to form)
    elements.bulkNewSearch.addEventListener('click', () => {
        elements.bulkSearchResults.style.display = 'none';
        elements.bulkSearchForm.style.display = 'block';
    });

    // Copy found/empty KITs
    elements.bulkCopyFound.addEventListener('click', copyFoundKits);
    elements.bulkCopyEmpty.addEventListener('click', copyEmptyKits);

    // Export CSV
    elements.bulkExportCsv.addEventListener('click', exportBulkSearchCsv);

    // View toggle (compact / detail)
    elements.bulkViewToggle.addEventListener('click', (e) => {
        const btn = e.target.closest('.bulk-view-btn');
        if (!btn) return;
        const view = btn.dataset.view;
        if (view === bulkSearchState.viewMode) return;
        bulkSearchState.viewMode = view;
        elements.bulkViewToggle.querySelectorAll('.bulk-view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
        renderBulkResultsBody(bulkSearchState.lastKitList);
    });
}

function openBulkSearchModal() {
    // Reset to form view
    elements.bulkSearchForm.style.display = 'block';
    elements.bulkSearchResults.style.display = 'none';
    elements.bulkKitInput.value = '';

    // Reset view to compact
    bulkSearchState.viewMode = 'compact';
    bulkSearchState.lastKitList = [];
    elements.bulkViewToggle.querySelectorAll('.bulk-view-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.view === 'compact');
    });

    // Set default period to this-month
    bulkSearchState.period = 'this-month';
    elements.bulkPeriodGroup.querySelectorAll('.qf-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.period === 'this-month');
    });
    elements.bulkCustomDates.style.display = 'none';

    // Pre-fill custom dates with current month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    elements.bulkStartDate.value = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    elements.bulkEndDate.value = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    elements.bulkSearchModal.classList.add('active');
    elements.bulkKitInput.focus();
}

function closeBulkSearchModal() {
    elements.bulkSearchModal.classList.remove('active');
}

function getBulkDateRange() {
    const now = new Date();
    let startDate, endDate;

    if (bulkSearchState.period === 'this-month') {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        startDate = `${year}-${month}-01`;
        const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
        endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    } else if (bulkSearchState.period === 'last-month') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const year = lastMonth.getFullYear();
        const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
        startDate = `${year}-${month}-01`;
        const lastDay = new Date(year, lastMonth.getMonth() + 1, 0).getDate();
        endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    } else {
        startDate = elements.bulkStartDate.value;
        endDate = elements.bulkEndDate.value;
    }

    return { startDate, endDate };
}

async function runBulkSearch() {
    // Parse KIT numbers from textarea
    const rawInput = elements.bulkKitInput.value.trim();
    if (!rawInput) {
        showToast('Masukkan minimal satu nomor KIT', 'error');
        return;
    }

    // Split by newline or comma, clean up each entry
    const kitList = rawInput
        .split(/[\n,]+/)
        .map(k => k.trim().toUpperCase())
        .filter(k => k.length > 0);

    if (kitList.length === 0) {
        showToast('Tidak ada nomor KIT yang valid', 'error');
        return;
    }

    const { startDate, endDate } = getBulkDateRange();
    if (bulkSearchState.period === 'custom' && (!startDate || !endDate)) {
        showToast('Pilih rentang tanggal custom', 'error');
        return;
    }

    // Show loading state
    const btn = elements.executeBulkSearch;
    btn.disabled = true;
    btn.classList.add('loading');
    btn.textContent = 'Mencari...';

    try {
        const params = new URLSearchParams({ limit: 10000 });
        params.append('kits', kitList.join(','));
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        const data = await apiCall(`?${params.toString()}`);
        bulkSearchState.results = data.data;
        bulkSearchState.lastKitList = kitList;

        renderBulkSearchResults(kitList, startDate, endDate);

        // Switch to results view
        elements.bulkSearchForm.style.display = 'none';
        elements.bulkSearchResults.style.display = 'block';
    } catch (error) {
        showToast('Gagal melakukan bulk search', 'error');
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.textContent = 'Cari Transaksi';
    }
}

function renderBulkSearchResults(kitList, startDate, endDate) {
    const transactions = bulkSearchState.results;

    // Build period label
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let periodLabel = '';
    if (startDate && endDate) {
        const sd = new Date(startDate + 'T00:00:00');
        const ed = new Date(endDate + 'T00:00:00');
        if (startDate === endDate) {
            periodLabel = formatDate(startDate);
        } else if (sd.getDate() === 1 && ed.getDate() === new Date(ed.getFullYear(), ed.getMonth() + 1, 0).getDate() && sd.getMonth() === ed.getMonth()) {
            periodLabel = `${months[sd.getMonth()]} ${sd.getFullYear()}`;
        } else {
            periodLabel = `${formatDate(startDate)} – ${formatDate(endDate)}`;
        }
    }

    // Summary header
    let totalPemasukan = 0, totalPengeluaran = 0;
    transactions.forEach(t => {
        totalPemasukan += parseFloat(t.pemasukan);
        totalPengeluaran += parseFloat(t.pengeluaran);
    });

    elements.bulkResultsSummary.innerHTML =
        `<strong>${kitList.length}</strong> KIT dicari &nbsp;·&nbsp; ` +
        `<strong>${transactions.length}</strong> transaksi ditemukan` +
        (periodLabel ? ` &nbsp;·&nbsp; <span style="color:var(--text-muted)">${escapeHtml(periodLabel)}</span>` : '') +
        `<br><small style="color:var(--text-muted)">Pemasukan: ${formatRupiah(totalPemasukan)} &nbsp; Pengeluaran: ${formatRupiah(totalPengeluaran)}</small>`;

    renderBulkResultsBody(kitList);
}

function buildGrouped(kitList) {
    const transactions = bulkSearchState.results;
    const grouped = {};
    kitList.forEach(kit => { grouped[kit] = []; });
    transactions.forEach(t => {
        const upperDesc = t.deskripsi.toUpperCase();
        for (const kit of kitList) {
            if (upperDesc.includes(kit.toUpperCase())) {
                grouped[kit].push(t);
                break;
            }
        }
    });
    return grouped;
}

function renderBulkResultsBody(kitList) {
    const grouped = buildGrouped(kitList);
    if (bulkSearchState.viewMode === 'compact') {
        renderBulkCompact(kitList, grouped);
    } else {
        renderBulkDetail(kitList, grouped);
    }

    const emptyKits = kitList.filter(k => (grouped[k] || []).length === 0);
    const foundKits = kitList.filter(k => (grouped[k] || []).length > 0);

    elements.bulkCopyFound.style.display = foundKits.length > 0 ? 'inline-flex' : 'none';
    elements.bulkCopyFound.textContent = `Copy KIT ada (${foundKits.length})`;

    elements.bulkCopyEmpty.style.display = emptyKits.length > 0 ? 'inline-flex' : 'none';
    elements.bulkCopyEmpty.textContent = `Copy KIT kosong (${emptyKits.length})`;
}

function renderBulkCompact(kitList, grouped) {
    let html = `<table class="data-table bulk-compact-table">`;
    html += `<thead><tr>
        <th>KIT</th>
        <th class="text-right">Transaksi</th>
        <th class="text-right">Pemasukan</th>
        <th class="text-right">Pengeluaran</th>
        <th class="text-right">Selisih</th>
        <th>Status</th>
    </tr></thead><tbody>`;

    kitList.forEach(kit => {
        const kitTrans = grouped[kit] || [];
        let kitPemasukan = 0, kitPengeluaran = 0;
        kitTrans.forEach(t => {
            kitPemasukan += parseFloat(t.pemasukan);
            kitPengeluaran += parseFloat(t.pengeluaran);
        });
        const selisih = kitPemasukan - kitPengeluaran;
        const found = kitTrans.length > 0;

        html += `<tr class="${found ? '' : 'bulk-compact-empty'}">
            <td class="bulk-compact-kit">${escapeHtml(kit)}</td>
            <td class="text-right">${found ? kitTrans.length : '-'}</td>
            <td class="text-right ${kitPemasukan > 0 ? 'amount-income' : ''}">${kitPemasukan > 0 ? formatRupiah(kitPemasukan) : '-'}</td>
            <td class="text-right ${kitPengeluaran > 0 ? 'amount-expense' : ''}">${kitPengeluaran > 0 ? formatRupiah(kitPengeluaran) : '-'}</td>
            <td class="text-right ${selisih < 0 ? 'amount-expense' : selisih > 0 ? 'amount-income' : ''}">${found ? formatRupiah(selisih) : '-'}</td>
            <td>${found
                ? `<span class="bulk-status-badge found">Ada</span>`
                : `<span class="bulk-status-badge notfound">Tidak ada</span>`
            }</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    elements.bulkResultsByKit.innerHTML = html;
}

function renderBulkDetail(kitList, grouped) {
    let html = '';

    kitList.forEach(kit => {
        const kitTrans = grouped[kit] || [];
        let kitPemasukan = 0, kitPengeluaran = 0;
        kitTrans.forEach(t => {
            kitPemasukan += parseFloat(t.pemasukan);
            kitPengeluaran += parseFloat(t.pengeluaran);
        });

        const statusClass = kitTrans.length > 0 ? 'bulk-kit-found' : 'bulk-kit-notfound';

        html += `<div class="bulk-kit-group ${statusClass}">`;
        html += `<div class="bulk-kit-header">`;
        html += `<span class="bulk-kit-id">${escapeHtml(kit)}</span>`;
        if (kitTrans.length > 0) {
            html += `<span class="bulk-kit-count">${kitTrans.length} transaksi</span>`;
            html += `<span class="bulk-kit-total">`;
            if (kitPemasukan > 0) html += `<span class="amount-income">↑ ${formatRupiah(kitPemasukan)}</span>`;
            if (kitPengeluaran > 0) html += `<span class="amount-expense">↓ ${formatRupiah(kitPengeluaran)}</span>`;
            html += `</span>`;
        } else {
            html += `<span class="bulk-kit-empty">Tidak ada transaksi</span>`;
        }
        html += `</div>`;

        if (kitTrans.length > 0) {
            html += `<div class="bulk-kit-table-wrap"><table class="data-table bulk-kit-table">`;
            html += `<thead><tr><th>Tanggal</th><th>Deskripsi</th><th class="text-right">Pemasukan</th><th class="text-right">Pengeluaran</th></tr></thead>`;
            html += `<tbody>`;
            kitTrans.forEach(t => {
                html += `<tr>
                    <td style="white-space:nowrap">${formatDate(t.tanggal)}</td>
                    <td class="description-cell">${formatDescriptionDisplay(t.deskripsi)}</td>
                    <td class="text-right ${parseFloat(t.pemasukan) > 0 ? 'amount-income' : ''}">${parseFloat(t.pemasukan) > 0 ? formatRupiah(t.pemasukan) : '-'}</td>
                    <td class="text-right ${parseFloat(t.pengeluaran) > 0 ? 'amount-expense' : ''}">${parseFloat(t.pengeluaran) > 0 ? formatRupiah(t.pengeluaran) : '-'}</td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
        }

        html += `</div>`;
    });

    elements.bulkResultsByKit.innerHTML = html;
}

function copyFoundKits() {
    const kitList = bulkSearchState.lastKitList;
    const grouped = buildGrouped(kitList);
    const foundKits = kitList.filter(k => (grouped[k] || []).length > 0);

    if (foundKits.length === 0) return;

    navigator.clipboard.writeText(foundKits.join('\n')).then(() => {
        const btn = elements.bulkCopyFound;
        const original = btn.textContent;
        btn.textContent = '✓ Tersalin!';
        setTimeout(() => { btn.textContent = original; }, 2000);
    }).catch(() => {
        showToast('Gagal menyalin ke clipboard', 'error');
    });
}

function copyEmptyKits() {
    const kitList = bulkSearchState.lastKitList;
    const grouped = buildGrouped(kitList);
    const emptyKits = kitList.filter(k => (grouped[k] || []).length === 0);

    if (emptyKits.length === 0) return;

    navigator.clipboard.writeText(emptyKits.join('\n')).then(() => {
        const btn = elements.bulkCopyEmpty;
        const original = btn.textContent;
        btn.textContent = '✓ Tersalin!';
        setTimeout(() => { btn.textContent = original; }, 2000);
    }).catch(() => {
        showToast('Gagal menyalin ke clipboard', 'error');
    });
}

function exportBulkSearchCsv() {
    const transactions = bulkSearchState.results;
    if (transactions.length === 0) {
        showToast('Tidak ada data untuk diexport', 'error');
        return;
    }

    const headers = ['No', 'Tanggal', 'Deskripsi', 'Pemasukan', 'Pengeluaran'];
    const rows = transactions.map((t, i) => [
        i + 1,
        t.tanggal,
        `"${t.deskripsi.replace(/"/g, '""')}"`,
        t.pemasukan,
        t.pengeluaran
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bulk-search-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast(`Berhasil export ${transactions.length} transaksi`, 'success');
}