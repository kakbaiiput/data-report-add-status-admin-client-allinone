<?php
session_start();

// ─── ROUTER: jika ada token ?p=, serve halaman yang diminta ───
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
            if (file_exists($file)) {
                readfile($file);
                exit;
            }
        }
    }

    // Token tidak valid → kembali ke index
    header('Location: /');
    exit;
}

// ─── INDEX: generate token baru & tampilkan menu ───
function generateToken($length = 10) {
    return bin2hex(random_bytes($length));
}

$pages = ['data', 'report', 'status', 'admin', 'client', 'add'];
$_SESSION['page_tokens'] = [];
$_SESSION['token_map']   = [];

foreach ($pages as $page) {
    $token = generateToken();
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
    <title>Starlink OctoLink - Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            color: #f1f5f9;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        body::before {
            content: '';
            position: fixed;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background:
                radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 40%),
                radial-gradient(ellipse at 60% 80%, rgba(34,197,94,0.05) 0%, transparent 40%);
            animation: bgPulse 12s ease-in-out infinite alternate;
            pointer-events: none;
            z-index: 0;
        }

        @keyframes bgPulse {
            0%   { transform: translate(0,0) rotate(0deg); }
            100% { transform: translate(20px,-20px) rotate(2deg); }
        }

        .container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 540px;
            padding: 24px 20px;
        }

        .header { text-align: center; margin-bottom: 36px; }

        .logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
        }

        .logo-icon {
            width: 48px; height: 48px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(59,130,246,0.4);
        }

        .logo-title {
            font-size: 1.5rem; font-weight: 700;
            background: linear-gradient(90deg, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .logo-sub {
            font-size: 0.75rem; color: #64748b;
            letter-spacing: 0.05em; text-transform: uppercase;
        }

        .menu-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .menu-card {
            background: rgba(30,41,59,0.6);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 18px;
            padding: 22px 18px;
            cursor: pointer;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
        }

        .menu-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }

        .menu-card:hover {
            transform: translateY(-3px);
            border-color: rgba(255,255,255,0.18);
            box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .menu-card:active { transform: translateY(-1px); }

        .card-icon {
            width: 42px; height: 42px;
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px;
        }

        .card-label { font-size: 0.95rem; font-weight: 600; color: #e2e8f0; }
        .card-desc  { font-size: 0.72rem; color: #64748b; line-height: 1.4; }

        .card-data   .card-icon { background: rgba(59,130,246,0.2);  color: #60a5fa; }
        .card-report .card-icon { background: rgba(34,197,94,0.2);   color: #4ade80; }
        .card-status .card-icon { background: rgba(245,158,11,0.2);  color: #fbbf24; }
        .card-admin  .card-icon { background: rgba(239,68,68,0.2);   color: #f87171; }
        .card-client .card-icon { background: rgba(139,92,246,0.2);  color: #a78bfa; }
        .card-add    .card-icon { background: rgba(20,184,166,0.2);  color: #2dd4bf; }

        .card-data:hover   { background: rgba(59,130,246,0.12); }
        .card-report:hover { background: rgba(34,197,94,0.12); }
        .card-status:hover { background: rgba(245,158,11,0.12); }
        .card-admin:hover  { background: rgba(239,68,68,0.12); }
        .card-client:hover { background: rgba(139,92,246,0.12); }
        .card-add:hover    { background: rgba(20,184,166,0.12); }

        .footer {
            text-align: center;
            margin-top: 28px;
            font-size: 0.7rem;
            color: #334155;
        }

        .loading-overlay {
            display: none;
            position: fixed; inset: 0;
            background: rgba(15,23,42,0.85);
            backdrop-filter: blur(8px);
            z-index: 100;
            align-items: center; justify-content: center;
            flex-direction: column; gap: 16px;
        }
        .loading-overlay.active { display: flex; }

        .spinner {
            width: 40px; height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .loading-text { font-size: 0.85rem; color: #94a3b8; }

        @media (max-width: 400px) {
            .menu-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

<div class="loading-overlay" id="loadingOverlay">
    <div class="spinner"></div>
    <div class="loading-text">Memuat halaman...</div>
</div>

<div class="container">
    <div class="header">
        <div class="logo">
            <div class="logo-icon">🛰️</div>
            <div>
                <div class="logo-title">Starlink</div>
                <div class="logo-sub">OctoLink Management</div>
            </div>
        </div>
    </div>

    <div class="menu-grid">
        <a class="menu-card card-data" href="#" data-page="data" onclick="navigate(this,event)">
            <div class="card-icon">📊</div>
            <div>
                <div class="card-label">Data Client</div>
                <div class="card-desc">Lihat & kelola data pelanggan</div>
            </div>
        </a>

        <a class="menu-card card-report" href="#" data-page="report" onclick="navigate(this,event)">
            <div class="card-icon">🧾</div>
            <div>
                <div class="card-label">Report</div>
                <div class="card-desc">Form pembayaran & laporan</div>
            </div>
        </a>

        <a class="menu-card card-status" href="#" data-page="status" onclick="navigate(this,event)">
            <div class="card-icon">📡</div>
            <div>
                <div class="card-label">Status</div>
                <div class="card-desc">Cek status client aktif</div>
            </div>
        </a>

        <a class="menu-card card-admin" href="#" data-page="admin" onclick="navigate(this,event)">
            <div class="card-icon">🔧</div>
            <div>
                <div class="card-label">Admin</div>
                <div class="card-desc">Panel administrasi sistem</div>
            </div>
        </a>

        <a class="menu-card card-client" href="#" data-page="client" onclick="navigate(this,event)">
            <div class="card-icon">👤</div>
            <div>
                <div class="card-label">Client</div>
                <div class="card-desc">Cek data & status akun</div>
            </div>
        </a>

        <a class="menu-card card-add" href="#" data-page="add" onclick="navigate(this,event)">
            <div class="card-icon">➕</div>
            <div>
                <div class="card-label">Add Client</div>
                <div class="card-desc">Daftarkan client baru</div>
            </div>
        </a>
    </div>

    <div class="footer">
        &copy; <?= date('Y') ?> OctoBizTech &mdash; starlink.octolink.id
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
</script>

</body>
</html>
