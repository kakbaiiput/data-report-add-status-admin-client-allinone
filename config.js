const CONFIG = {

    API_URL: 'https://script.google.com/macros/s/AKfycbwE9TamMNcJgqTBCXgcZqS40jmxK_nA4sFWiKu3cZpdgwcluVWQovxnXD3LnNhz6UZ9/exec',

    VPS_API_URL: 'https://starlink.octolink.id/api/data.php',

    // API key untuk request ke VPS — harus sama dengan API_KEY di api/db.php
    API_KEY: 'sk-octolink-x9f2mK7pQr4nZvBw',

    API_TIMEOUT: 35000,

    RETRY_ATTEMPTS: 2,

    VALIDATE_ORIGIN: false,

    FORCE_MOBILE_LAYOUT: false,

    DEBUG_MODE: false,

    getApiUrl(type) { return this.API_URL; },

    getCurrentOrigin() { return window.location.origin; },

    log(...args) { if (this.DEBUG_MODE) console.log('[STARLINK]', ...args); },

    warn(...args) { console.warn('[STARLINK WARN]', ...args); },

    error(...args) { console.error('[STARLINK ERROR]', ...args); }

};

// ── Auto-inject X-Api-Key ke semua fetch yang menuju VPS API ─────────────────
// Dengan ini semua file tidak perlu diubah satu per satu
(function () {
    const _fetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
        const url = (typeof input === 'string') ? input : (input.url || '');
        if (url.includes('/api/data.php')) {
            init = init || {};
            init.headers = Object.assign({}, init.headers, {
                'X-Api-Key': CONFIG.API_KEY
            });
        }
        return _fetch(input, init);
    };
})();
