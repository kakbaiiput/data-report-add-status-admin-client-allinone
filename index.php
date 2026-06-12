<?php
session_start();

// ─── ROUTER ───────────────────────────────────────────────────
if (isset($_GET['p'])) {
    $token = trim($_GET['p']);
    $allowed_pages = ['data', 'report', 'status', 'admin', 'client', 'add'];

    if (
        !empty($token) &&
        !empty($_SESSION['token_map']) &&
        isset($_SESSION['token_map'][$token])
    ) {
        $page = $_SESSION['token_map'][$token];
        if (in_array($page, $allowed_pages, true)) {
            $file = __DIR__ . '/' . $page . '.html';
            if (file_exists($file)) { readfile($file); exit; }
        }
    }
    header('Location: /'); exit;
}

// ─── INDEX: generate tokens ────────────────────────────────────
$pages = ['data', 'report', 'status', 'admin', 'client', 'add'];
$_SESSION['page_tokens'] = [];
$_SESSION['token_map']   = [];
foreach ($pages as $page) {
    $token = bin2hex(random_bytes(10));
    $_SESSION['page_tokens'][$page] = $token;
    $_SESSION['token_map'][$token]  = $page;
}
$tokens = $_SESSION['page_tokens'];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Starlink OctoLink — Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --c-bg:      #060a14;
            --c-surface: rgba(255,255,255,0.04);
            --c-border:  rgba(255,255,255,0.07);
            --c-text:    #e2e8f0;
            --c-muted:   #475569;
            --c-blue:    #3b82f6;
            --c-purple:  #8b5cf6;
            --c-green:   #22c55e;
            --c-amber:   #f59e0b;
            --c-red:     #ef4444;
            --c-teal:    #14b8a6;
        }

        html, body {
            min-height: 100vh;
            background: var(--c-bg);
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
            color: var(--c-text);
            overflow-x: hidden;
        }

        /* ── Animated mesh background ── */
        .bg-mesh {
            position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
        }
        .bg-mesh span {
            position: absolute; border-radius: 50%;
            filter: blur(80px); opacity: 0.18;
            animation: drift 18s ease-in-out infinite alternate;
        }
        .bg-mesh span:nth-child(1) {
            width: 500px; height: 500px; top: -10%; left: -10%;
            background: radial-gradient(circle, #3b82f6, transparent 70%);
            animation-duration: 20s;
        }
        .bg-mesh span:nth-child(2) {
            width: 400px; height: 400px; top: 30%; right: -8%;
            background: radial-gradient(circle, #8b5cf6, transparent 70%);
            animation-duration: 24s; animation-delay: -6s;
        }
        .bg-mesh span:nth-child(3) {
            width: 350px; height: 350px; bottom: -5%; left: 30%;
            background: radial-gradient(circle, #14b8a6, transparent 70%);
            animation-duration: 22s; animation-delay: -3s;
        }
        @keyframes drift {
            0%   { transform: translate(0, 0) scale(1); }
            50%  { transform: translate(30px, -20px) scale(1.08); }
            100% { transform: translate(-20px, 30px) scale(0.95); }
        }

        /* ── Grid noise overlay ── */
        body::after {
            content: '';
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background-image:
                linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
            background-size: 48px 48px;
        }

        /* ── Layout ── */
        .page {
            position: relative; z-index: 1;
            min-height: 100vh;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 32px 20px 48px;
        }

        .wrapper {
            width: 100%; max-width: 580px;
        }

        /* ── Header ── */
        .header {
            text-align: center; margin-bottom: 48px;
        }

        .badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 5px 14px;
            border: 1px solid rgba(59,130,246,0.35);
            border-radius: 100px;
            background: rgba(59,130,246,0.08);
            font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
            text-transform: uppercase; color: #93c5fd;
            margin-bottom: 20px;
        }
        .badge-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #3b82f6;
            box-shadow: 0 0 6px #3b82f6;
            animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.5; transform: scale(0.7); }
        }

        .logo-wrap {
            display: flex; align-items: center; justify-content: center;
            gap: 16px; margin-bottom: 12px;
        }

        .logo-icon {
            position: relative;
            width: 60px; height: 60px;
            background: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25));
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 18px;
            display: flex; align-items: center; justify-content: center;
            font-size: 28px;
            backdrop-filter: blur(8px);
            box-shadow:
                0 0 0 1px rgba(59,130,246,0.2),
                0 8px 32px rgba(59,130,246,0.2),
                inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .logo-icon::before {
            content: '';
            position: absolute; inset: -1px;
            border-radius: 18px;
            background: linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4), transparent);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
            -webkit-mask-composite: xor;
            padding: 1px;
        }

        .logo-text h1 {
            font-size: 2rem; font-weight: 800; line-height: 1;
            background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.03em;
        }
        .logo-text p {
            font-size: 0.8rem; color: var(--c-muted);
            letter-spacing: 0.04em; margin-top: 2px;
            text-transform: uppercase; font-weight: 500;
        }

        .header-sub {
            font-size: 0.875rem; color: #64748b; font-weight: 400;
        }

        /* ── Menu grid ── */
        .menu-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .menu-card {
            position: relative; overflow: hidden;
            background: var(--c-surface);
            border: 1px solid var(--c-border);
            border-radius: 20px;
            padding: 20px;
            text-decoration: none; color: inherit;
            display: flex; flex-direction: column; gap: 14px;
            cursor: pointer;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
            will-change: transform;
        }

        /* shimmer line top */
        .menu-card::before {
            content: '';
            position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            border-radius: 1px;
        }

        /* colored glow on hover via pseudo */
        .menu-card::after {
            content: '';
            position: absolute; inset: 0; border-radius: 20px;
            opacity: 0; transition: opacity 0.25s ease;
            background: radial-gradient(ellipse at 30% 40%, var(--card-glow) 0%, transparent 65%);
        }

        .menu-card:hover {
            transform: translateY(-4px) scale(1.01);
            border-color: var(--card-accent);
            box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px var(--card-accent);
        }
        .menu-card:hover::after { opacity: 1; }
        .menu-card:active { transform: translateY(-1px) scale(1); }

        /* Card themes */
        .card-data   { --card-accent: rgba(59,130,246,0.5);  --card-glow: rgba(59,130,246,0.12); }
        .card-report { --card-accent: rgba(34,197,94,0.5);   --card-glow: rgba(34,197,94,0.12); }
        .card-status { --card-accent: rgba(245,158,11,0.5);  --card-glow: rgba(245,158,11,0.12); }
        .card-admin  { --card-accent: rgba(239,68,68,0.5);   --card-glow: rgba(239,68,68,0.12); }
        .card-client { --card-accent: rgba(139,92,246,0.5);  --card-glow: rgba(139,92,246,0.12); }
        .card-add    { --card-accent: rgba(20,184,166,0.5);  --card-glow: rgba(20,184,166,0.12); }

        .card-top {
            display: flex; align-items: flex-start; justify-content: space-between;
        }

        .card-icon-wrap {
            width: 44px; height: 44px; border-radius: 13px;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px;
            border: 1px solid rgba(255,255,255,0.08);
            position: relative; z-index: 1;
        }
        .card-data   .card-icon-wrap { background: rgba(59,130,246,0.18); }
        .card-report .card-icon-wrap { background: rgba(34,197,94,0.18); }
        .card-status .card-icon-wrap { background: rgba(245,158,11,0.18); }
        .card-admin  .card-icon-wrap { background: rgba(239,68,68,0.18); }
        .card-client .card-icon-wrap { background: rgba(139,92,246,0.18); }
        .card-add    .card-icon-wrap { background: rgba(20,184,166,0.18); }

        .card-arrow {
            width: 26px; height: 26px; border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.04);
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.2s ease;
            color: #94a3b8; font-size: 13px;
            position: relative; z-index: 1;
        }
        .menu-card:hover .card-arrow { opacity: 1; }

        .card-body { position: relative; z-index: 1; }
        .card-label {
            font-size: 0.9rem; font-weight: 700; color: #f1f5f9;
            letter-spacing: -0.01em; margin-bottom: 3px;
        }
        .card-desc {
            font-size: 0.72rem; color: #475569; line-height: 1.45;
            font-weight: 400;
        }

        /* ── Divider ── */
        .section-divider {
            display: flex; align-items: center; gap: 12px;
            margin: 28px 0 20px;
        }
        .section-divider span {
            font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em;
            text-transform: uppercase; color: #334155; white-space: nowrap;
        }
        .section-divider::before,
        .section-divider::after {
            content: ''; flex: 1; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }

        /* ── Footer ── */
        .footer {
            text-align: center; margin-top: 36px;
            display: flex; flex-direction: column; gap: 6px;
        }
        .footer-brand {
            font-size: 0.72rem; color: #1e293b; font-weight: 600;
            letter-spacing: 0.06em; text-transform: uppercase;
        }
        .footer-domain {
            font-size: 0.68rem; color: #1e293b;
        }
        .footer-status {
            display: inline-flex; align-items: center; gap: 5px;
            font-size: 0.65rem; color: #22c55e; font-weight: 500;
        }
        .footer-status-dot {
            width: 5px; height: 5px; border-radius: 50%;
            background: #22c55e; box-shadow: 0 0 6px #22c55e;
        }

        /* ── Loading overlay ── */
        .loading-overlay {
            display: none; position: fixed; inset: 0;
            background: rgba(6,10,20,0.9);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            z-index: 9999;
            align-items: center; justify-content: center; flex-direction: column; gap: 18px;
        }
        .loading-overlay.active { display: flex; }

        .loading-ring {
            position: relative; width: 48px; height: 48px;
        }
        .loading-ring::before, .loading-ring::after {
            content: ''; position: absolute; inset: 0; border-radius: 50%;
        }
        .loading-ring::before {
            border: 2px solid rgba(255,255,255,0.06);
        }
        .loading-ring::after {
            border: 2px solid transparent;
            border-top-color: #3b82f6;
            border-right-color: rgba(59,130,246,0.3);
            animation: spin 0.75s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .loading-label {
            font-size: 0.8rem; color: #475569; font-weight: 500;
            letter-spacing: 0.04em;
        }

        /* ── Responsive ── */
        @media (max-width: 420px) {
            .logo-text h1 { font-size: 1.6rem; }
            .menu-grid    { grid-template-columns: 1fr 1fr; gap: 10px; }
            .menu-card    { padding: 16px; border-radius: 16px; }
        }
        @media (max-width: 320px) {
            .menu-grid { grid-template-columns: 1fr; }
        }

        /* ── Card entrance animation ── */
        .menu-card {
            animation: cardIn 0.4s ease both;
        }
        .menu-card:nth-child(1) { animation-delay: 0.05s; }
        .menu-card:nth-child(2) { animation-delay: 0.10s; }
        .menu-card:nth-child(3) { animation-delay: 0.15s; }
        .menu-card:nth-child(4) { animation-delay: 0.20s; }
        .menu-card:nth-child(5) { animation-delay: 0.25s; }
        .menu-card:nth-child(6) { animation-delay: 0.30s; }
        @keyframes cardIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .header {
            animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>

<!-- Background mesh -->
<div class="bg-mesh">
    <span></span><span></span><span></span>
</div>

<!-- Loading overlay -->
<div class="loading-overlay" id="loadingOverlay">
    <div class="loading-ring"></div>
    <div class="loading-label">Memuat halaman...</div>
</div>

<div class="page">
<div class="wrapper">

    <!-- Header -->
    <div class="header">
        <div class="badge">
            <span class="badge-dot"></span>
            System Online
        </div>
        <div class="logo-wrap">
            <div class="logo-icon">🛰️</div>
            <div class="logo-text">
                <h1>Starlink</h1>
                <p>OctoLink Management</p>
            </div>
        </div>
        <p class="header-sub">Pilih modul yang ingin diakses</p>
    </div>

    <!-- Menu grid -->
    <div class="menu-grid">

        <a class="menu-card card-data" href="#" data-page="data" onclick="navigate(this,event)">
            <div class="card-top">
                <div class="card-icon-wrap">📊</div>
                <div class="card-arrow">›</div>
            </div>
            <div class="card-body">
                <div class="card-label">Data Client</div>
                <div class="card-desc">Lihat & kelola data pelanggan</div>
            </div>
        </a>

        <a class="menu-card card-report" href="#" data-page="report" onclick="navigate(this,event)">
            <div class="card-top">
                <div class="card-icon-wrap">🧾</div>
                <div class="card-arrow">›</div>
            </div>
            <div class="card-body">
                <div class="card-label">Report</div>
                <div class="card-desc">Form pembayaran & laporan</div>
            </div>
        </a>

        <a class="menu-card card-status" href="#" data-page="status" onclick="navigate(this,event)">
            <div class="card-top">
                <div class="card-icon-wrap">📡</div>
                <div class="card-arrow">›</div>
            </div>
            <div class="card-body">
                <div class="card-label">Status</div>
                <div class="card-desc">Cek status client aktif</div>
            </div>
        </a>

        <a class="menu-card card-admin" href="#" data-page="admin" onclick="navigate(this,event)">
            <div class="card-top">
                <div class="card-icon-wrap">🔧</div>
                <div class="card-arrow">›</div>
            </div>
            <div class="card-body">
                <div class="card-label">Admin</div>
                <div class="card-desc">Panel administrasi sistem</div>
            </div>
        </a>

        <a class="menu-card card-client" href="#" data-page="client" onclick="navigate(this,event)">
            <div class="card-top">
                <div class="card-icon-wrap">👤</div>
                <div class="card-arrow">›</div>
            </div>
            <div class="card-body">
                <div class="card-label">Client</div>
                <div class="card-desc">Cek data & status akun</div>
            </div>
        </a>

        <a class="menu-card card-add" href="#" data-page="add" onclick="navigate(this,event)">
            <div class="card-top">
                <div class="card-icon-wrap">➕</div>
                <div class="card-arrow">›</div>
            </div>
            <div class="card-body">
                <div class="card-label">Add Client</div>
                <div class="card-desc">Daftarkan client baru</div>
            </div>
        </a>

    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="footer-status">
            <span class="footer-status-dot"></span>
            All systems operational
        </div>
        <div class="footer-brand">OctoBizTech &mdash; <?= date('Y') ?></div>
        <div class="footer-domain">starlink.octolink.id</div>
    </div>

</div>
</div>

<script>
const PAGE_TOKENS = <?= json_encode($tokens) ?>;

function navigate(el, event) {
    event.preventDefault();
    const page  = el.getAttribute('data-page');
    const token = PAGE_TOKENS[page];
    if (!token) return;
    document.getElementById('loadingOverlay').classList.add('active');
    window.location.href = '/?p=' + token;
}

window.addEventListener('pageshow', function() {
    document.getElementById('loadingOverlay').classList.remove('active');
});
</script>

</body>
</html>
