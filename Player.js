(() => {
    const { Controller } = window;

    window.Player = class extends Controller {
        constructor(canvasSelector) {
            super(canvasSelector, true);
        }
    };
})();