(() => {
    window.ApiError = class extends Error {
        constructor(msg) {
            super(`API Error: ${msg}`);
        }
    };
})();
