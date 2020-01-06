(() => {
    const { Controller } = window;

    window.Player = class extends Controller {
        constructor(canvasSelector, stoppedByDefault) {
            super(canvasSelector, true, stoppedByDefault);
        }
    };
})();