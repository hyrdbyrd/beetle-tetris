(() => {
    const { Controller } = window;

    window.AI = class extends Controller {
        constructor(canvasSelector) {
            super(canvasSelector, false);
        }
    };
})();