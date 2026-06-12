const CONFIG = {

    API_URL: 'https://script.google.com/macros/s/AKfycbwE9TamMNcJgqTBCXgcZqS40jmxK_nA4sFWiKu3cZpdgwcluVWQovxnXD3LnNhz6UZ9/exec',

    VPS_API_URL: 'https://data.octolink.id/api/data.php',

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
