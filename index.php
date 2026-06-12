<?php
session_start();

// ─── PIN CONFIG (ubah di sini, tidak pernah terekspos ke browser) ───
define('ACCESS_PIN', '1234');

// ─── PIN VERIFY endpoint (AJAX POST dari modal) ──────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['verify'])) {
    header('Content-Type: application/json');
    $input = json_decode(file_get_contents('php://input'), true);
    $pin   = preg_replace('/\D/', '', $input['pin'] ?? '');
    if ($pin === ACCESS_PIN) {
        $_SESSION['pin_ok'] = true;
        echo json_encode(['ok' => true]);
    } else {
        echo json_encode(['ok' => false]);
    }
    exit;
}

// ─── ROUTER ───────────────────────────────────────────────────
if (isset($_GET['p'])) {
    $token = trim($_GET['p']);
    $allowed_pages = ['data', 'report', 'status', 'admin', 'client', 'add', 'uob'];

    if (
        !empty($token) &&
        !empty($_SESSION['token_map']) &&
        isset($_SESSION['token_map'][$token])
    ) {
        $page = $_SESSION['token_map'][$token];
        if (in_array($page, $allowed_pages, true)) {
            // UOB: redirect ke subfolder PHP app
            if ($page === 'uob') {
                $_SESSION['uob_ok'] = true;
                header('Location: /data-uob/');
                exit;
            }
            $file = __DIR__ . '/' . $page . '.html';
            if (file_exists($file)) { readfile($file); exit; }
        }
    }
    header('Location: /'); exit;
}

// ─── INDEX: generate tokens ────────────────────────────────────
$pages = ['data', 'uob', 'add', 'status', 'report', 'admin', 'client'];
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

        /* ── Menu list (vertical) ── */
        .menu-grid {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .menu-card {
            position: relative; overflow: hidden;
            background: var(--c-surface);
            border: 1px solid var(--c-border);
            border-radius: 16px;
            padding: 16px 20px;
            text-decoration: none; color: inherit;
            display: flex; flex-direction: row;
            align-items: center; gap: 16px;
            cursor: pointer;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, transform 0.22s ease;
            will-change: transform;
        }

        /* spotlight: mengikuti posisi mouse via JS */
        .menu-card .spotlight {
            position: absolute; inset: 0; border-radius: 16px;
            pointer-events: none; z-index: 0;
            background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%),
                var(--card-glow) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .menu-card:hover .spotlight { opacity: 1; }

        /* border sweep kiri */
        .menu-card::before {
            content: '';
            position: absolute; left: 0; top: 10%; bottom: 10%;
            width: 2px; border-radius: 2px;
            background: linear-gradient(180deg, transparent, var(--card-accent-solid), transparent);
            transform: scaleY(0);
            transform-origin: center;
            transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .menu-card:hover::before { transform: scaleY(1); }

        .menu-card:hover {
            transform: translateX(6px);
            border-color: var(--card-accent);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.04);
        }
        .menu-card:active { transform: translateX(3px); }

        /* Card themes */
        .card-data   { --card-accent: rgba(59,130,246,0.45);  --card-glow: rgba(59,130,246,0.1);  --card-accent-solid: #3b82f6; }
        .card-report { --card-accent: rgba(34,197,94,0.45);   --card-glow: rgba(34,197,94,0.1);   --card-accent-solid: #22c55e; }
        .card-status { --card-accent: rgba(245,158,11,0.45);  --card-glow: rgba(245,158,11,0.1);  --card-accent-solid: #f59e0b; }
        .card-admin  { --card-accent: rgba(239,68,68,0.45);   --card-glow: rgba(239,68,68,0.1);   --card-accent-solid: #ef4444; }
        .card-client { --card-accent: rgba(139,92,246,0.45);  --card-glow: rgba(139,92,246,0.1);  --card-accent-solid: #8b5cf6; }
        .card-add    { --card-accent: rgba(20,184,166,0.45);  --card-glow: rgba(20,184,166,0.1);  --card-accent-solid: #14b8a6; }
        .card-uob    { --card-accent: rgba(234,179,8,0.45);  --card-glow: rgba(234,179,8,0.1);   --card-accent-solid: #eab308; }

        .card-icon-wrap {
            width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            font-size: 19px;
            border: 1px solid rgba(255,255,255,0.07);
            position: relative; z-index: 1;
            transition: transform 0.25s ease;
        }
        .menu-card:hover .card-icon-wrap { transform: scale(1.1) rotate(-4deg); }

        .card-data   .card-icon-wrap { background: rgba(59,130,246,0.15); }
        .card-report .card-icon-wrap { background: rgba(34,197,94,0.15); }
        .card-status .card-icon-wrap { background: rgba(245,158,11,0.15); }
        .card-admin  .card-icon-wrap { background: rgba(239,68,68,0.15); }
        .card-client .card-icon-wrap { background: rgba(139,92,246,0.15); }
        .card-add    .card-icon-wrap { background: rgba(20,184,166,0.15); }
        .card-uob    .card-icon-wrap { background: rgba(234,179,8,0.15); }

        .card-body {
            flex: 1; position: relative; z-index: 1;
        }
        .card-label {
            font-size: 0.88rem; font-weight: 700; color: #f1f5f9;
            letter-spacing: -0.01em; margin-bottom: 2px;
            transition: color 0.2s ease;
        }
        .card-data:hover   .card-label { color: #93c5fd; }
        .card-report:hover .card-label { color: #86efac; }
        .card-status:hover .card-label { color: #fcd34d; }
        .card-admin:hover  .card-label { color: #fca5a5; }
        .card-client:hover .card-label { color: #c4b5fd; }
        .card-add:hover    .card-label { color: #5eead4; }
        .card-uob:hover    .card-label { color: #fde047; }

        .card-desc {
            font-size: 0.71rem; color: #475569; line-height: 1.4; font-weight: 400;
        }

        .card-arrow {
            flex-shrink: 0; position: relative; z-index: 1;
            width: 28px; height: 28px; border-radius: 9px;
            border: 1px solid rgba(255,255,255,0.07);
            background: rgba(255,255,255,0.03);
            display: flex; align-items: center; justify-content: center;
            color: #334155; font-size: 14px; font-weight: 600;
            transition: all 0.25s ease;
        }
        .menu-card:hover .card-arrow {
            color: var(--card-accent-solid);
            border-color: var(--card-accent);
            background: rgba(255,255,255,0.06);
            transform: translateX(3px);
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

        /* ── PIN Modal ── */
        .pin-overlay {
            position: fixed; inset: 0; z-index: 9998;
            background: rgba(6,10,20,0.97);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            display: flex; align-items: center; justify-content: center;
            padding: 20px;
        }
        .pin-overlay.hidden { display: none; }

        .pin-box {
            width: 100%; max-width: 340px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            padding: 36px 32px 32px;
            text-align: center;
            box-shadow:
                0 0 0 1px rgba(59,130,246,0.1),
                0 32px 80px rgba(0,0,0,0.6),
                inset 0 1px 0 rgba(255,255,255,0.06);
            animation: pinBoxIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes pinBoxIn {
            from { opacity: 0; transform: scale(0.88) translateY(20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .pin-icon {
            width: 56px; height: 56px; margin: 0 auto 16px;
            background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2));
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            font-size: 26px;
            box-shadow: 0 0 24px rgba(59,130,246,0.2);
        }

        .pin-title {
            font-size: 1.1rem; font-weight: 700; color: #f1f5f9;
            letter-spacing: -0.02em; margin-bottom: 4px;
        }
        .pin-sub {
            font-size: 0.75rem; color: #475569; margin-bottom: 28px;
            line-height: 1.5;
        }

        /* Dots indicator */
        .pin-dots {
            display: flex; justify-content: center; gap: 12px;
            margin-bottom: 28px;
        }
        .pin-dot {
            width: 14px; height: 14px; border-radius: 50%;
            border: 2px solid #334155;
            background: transparent;
            transition: all 0.15s ease;
        }
        .pin-dot.filled {
            background: #3b82f6;
            border-color: #3b82f6;
            box-shadow: 0 0 10px rgba(59,130,246,0.6);
            transform: scale(1.15);
        }
        .pin-dot.error {
            background: #ef4444; border-color: #ef4444;
            box-shadow: 0 0 10px rgba(239,68,68,0.6);
            animation: dotShake 0.35s ease;
        }
        @keyframes dotShake {
            0%,100% { transform: translateX(0); }
            20%      { transform: translateX(-5px); }
            60%      { transform: translateX(5px); }
        }

        /* Numpad */
        .pin-numpad {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
        .pin-key {
            height: 54px; border-radius: 13px;
            border: 1px solid rgba(255,255,255,0.07);
            background: rgba(255,255,255,0.04);
            color: #e2e8f0; font-size: 1.1rem; font-weight: 600;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
            transition: all 0.12s ease;
            user-select: none;
        }
        .pin-key:hover {
            background: rgba(59,130,246,0.12);
            border-color: rgba(59,130,246,0.35);
            color: #fff;
        }
        .pin-key:active {
            transform: scale(0.93);
            background: rgba(59,130,246,0.2);
        }
        .pin-key.del {
            color: #64748b; font-size: 1rem;
        }
        .pin-key.del:hover { color: #f87171; border-color: rgba(239,68,68,0.35); background: rgba(239,68,68,0.08); }
        .pin-key.empty { pointer-events: none; background: transparent; border-color: transparent; }

        .pin-error-msg {
            font-size: 0.72rem; color: #f87171; margin-top: 14px;
            min-height: 18px; font-weight: 500;
            transition: opacity 0.2s;
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
            .menu-card    { padding: 14px 16px; }
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

<!-- PIN Modal -->
<div class="pin-overlay<?= !empty($_SESSION['pin_ok']) ? ' hidden' : '' ?>" id="pinOverlay">
    <div class="pin-box">
        <div class="pin-icon">🔐</div>
        <div class="pin-title">Masukkan PIN</div>
        <div class="pin-sub">Akses panel Starlink OctoLink<br>memerlukan PIN 4 digit</div>

        <div class="pin-dots">
            <div class="pin-dot" id="d0"></div>
            <div class="pin-dot" id="d1"></div>
            <div class="pin-dot" id="d2"></div>
            <div class="pin-dot" id="d3"></div>
        </div>

        <div class="pin-numpad">
            <button class="pin-key" onclick="pinInput('1')">1</button>
            <button class="pin-key" onclick="pinInput('2')">2</button>
            <button class="pin-key" onclick="pinInput('3')">3</button>
            <button class="pin-key" onclick="pinInput('4')">4</button>
            <button class="pin-key" onclick="pinInput('5')">5</button>
            <button class="pin-key" onclick="pinInput('6')">6</button>
            <button class="pin-key" onclick="pinInput('7')">7</button>
            <button class="pin-key" onclick="pinInput('8')">8</button>
            <button class="pin-key" onclick="pinInput('9')">9</button>
            <div class="pin-key empty"></div>
            <button class="pin-key" onclick="pinInput('0')">0</button>
            <button class="pin-key del" onclick="pinDelete()">⌫</button>
        </div>

        <div class="pin-error-msg" id="pinError"></div>
    </div>
</div>

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

    <!-- Menu list -->
    <div class="menu-grid">

        <a class="menu-card card-data" href="#" data-page="data" onclick="navigate(this,event)">
            <div class="spotlight"></div>
            <div class="card-icon-wrap">📊</div>
            <div class="card-body">
                <div class="card-label">Data Client</div>
                <div class="card-desc">Lihat & kelola data pelanggan</div>
            </div>
            <div class="card-arrow">›</div>
        </a>

        <a class="menu-card card-uob" href="#" data-page="uob" onclick="navigate(this,event)">
            <div class="spotlight"></div>
            <div class="card-icon-wrap">🏦</div>
            <div class="card-body">
                <div class="card-label">Data UOB</div>
                <div class="card-desc">Data pembayaran UOB Starlink</div>
            </div>
            <div class="card-arrow">›</div>
        </a>

        <a class="menu-card card-add" href="#" data-page="add" onclick="navigate(this,event)">
            <div class="spotlight"></div>
            <div class="card-icon-wrap">➕</div>
            <div class="card-body">
                <div class="card-label">Add Client</div>
                <div class="card-desc">Daftarkan client baru</div>
            </div>
            <div class="card-arrow">›</div>
        </a>

        <a class="menu-card card-status" href="#" data-page="status" onclick="navigate(this,event)">
            <div class="spotlight"></div>
            <div class="card-icon-wrap">📡</div>
            <div class="card-body">
                <div class="card-label">Status</div>
                <div class="card-desc">Cek status client aktif</div>
            </div>
            <div class="card-arrow">›</div>
        </a>

        <a class="menu-card card-report" href="#" data-page="report" onclick="navigate(this,event)">
            <div class="spotlight"></div>
            <div class="card-icon-wrap">🧾</div>
            <div class="card-body">
                <div class="card-label">Report Finance</div>
                <div class="card-desc">Form pembayaran & laporan</div>
            </div>
            <div class="card-arrow">›</div>
        </a>

        <a class="menu-card card-admin" href="#" data-page="admin" onclick="navigate(this,event)">
            <div class="spotlight"></div>
            <div class="card-icon-wrap">🔧</div>
            <div class="card-body">
                <div class="card-label">Data Admin</div>
                <div class="card-desc">Panel administrasi sistem</div>
            </div>
            <div class="card-arrow">›</div>
        </a>

        <a class="menu-card card-client" href="#" data-page="client" onclick="navigate(this,event)">
            <div class="spotlight"></div>
            <div class="card-icon-wrap">👤</div>
            <div class="card-body">
                <div class="card-label">Data Client</div>
                <div class="card-desc">Cek data & status akun</div>
            </div>
            <div class="card-arrow">›</div>
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
// ── PIN Logic (verifikasi server-side, PIN tidak pernah di JS) ──
const PIN_STORAGE_KEY = 'sl_pin_v';

let pinBuffer  = '';
let pinLocked  = false; // cegah double-submit

function checkPinSession() {
    // Session PHP sudah verified? Langsung sembunyikan modal
    <?php if (!empty($_SESSION['pin_ok'])): ?>
    hidePinOverlay();
    <?php else: ?>
    // localStorage belum ada → tampilkan modal (sudah default visible)
    if (localStorage.getItem(PIN_STORAGE_KEY) !== '1') return;
    // Ada di localStorage → re-validasi ke server sekali (anti bypass)
    fetch('/?verify=1', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({pin: '__recheck__'})
    }).then(r => r.json()).then(d => {
        // Jika session PHP hilang (tab baru incognito), minta PIN lagi
        if (!d.ok) {
            localStorage.removeItem(PIN_STORAGE_KEY);
        } else {
            hidePinOverlay();
        }
    }).catch(() => {});
    <?php endif; ?>
}

function pinInput(digit) {
    if (pinLocked || pinBuffer.length >= 4) return;
    pinBuffer += digit;
    updateDots();
    if (pinBuffer.length === 4) {
        pinLocked = true;
        setTimeout(verifyPin, 120);
    }
}

function pinDelete() {
    if (pinLocked) return;
    pinBuffer = pinBuffer.slice(0, -1);
    updateDots();
    clearError();
}

function updateDots() {
    for (let i = 0; i < 4; i++) {
        const dot = document.getElementById('d' + i);
        dot.classList.toggle('filled', i < pinBuffer.length);
        dot.classList.remove('error');
    }
}

function verifyPin() {
    fetch('/?verify=1', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({pin: pinBuffer})
    })
    .then(r => r.json())
    .then(data => {
        if (data.ok) {
            localStorage.setItem(PIN_STORAGE_KEY, '1');
            hidePinOverlay();
        } else {
            pinWrong();
        }
    })
    .catch(() => { pinWrong(); });
}

function pinWrong() {
    for (let i = 0; i < 4; i++) {
        const dot = document.getElementById('d' + i);
        dot.classList.remove('filled');
        dot.classList.add('error');
    }
    document.getElementById('pinError').textContent = 'PIN salah, coba lagi';
    setTimeout(() => {
        pinBuffer = '';
        pinLocked = false;
        updateDots();
    }, 700);
}

function hidePinOverlay() {
    const box = document.querySelector('.pin-box');
    box.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    box.style.opacity    = '0';
    box.style.transform  = 'scale(0.92)';
    setTimeout(() => document.getElementById('pinOverlay').classList.add('hidden'), 260);
}

function clearError() {
    document.getElementById('pinError').textContent = '';
}

document.addEventListener('keydown', function(e) {
    if (document.getElementById('pinOverlay').classList.contains('hidden')) return;
    if (e.key >= '0' && e.key <= '9') pinInput(e.key);
    if (e.key === 'Backspace') pinDelete();
});

checkPinSession();
// ── End PIN Logic ──────────────────────────────────────────────

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

// Spotlight: update posisi CSS var sesuai posisi mouse di tiap card
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--mx', x);
        card.style.setProperty('--my', y);
    });
});
</script>

</body>
</html>
