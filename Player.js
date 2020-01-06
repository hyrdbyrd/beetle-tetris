(() => {
    const { Controller } = window;

    window.Player = class extends Controller {
        constructor(canvasSelector, ...args) {
            super(canvasSelector, true, ...args);
        }
    };
})();