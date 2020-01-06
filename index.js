const { Player, AI } = window;

(() => {
    try {
        // Player
        const player = document.querySelector('.player');

        const scoreElement = player.querySelector('.score');
        scoreElement.innerText = 'Score: 0';

        const play = player.querySelector('.play');
        const pause = player.querySelector('.pause');

        const paused = player.querySelector('.paused');

        let playerController;

        // Для получения размера контейнера
        playerController = new Player('#player', true);

        play.addEventListener('click', () => {
            play.classList.add('hidden');

            playerController.start();
            playerController
                .on('score', score => {
                    console.log('\n\n\n\n1\n\n\n', score);
                    if (score) scoreElement.innerText = `Score: ${score}`;
                });
        });

        pause.addEventListener('click', () => {
            playerController.stop();
            paused.classList.remove('hidden');
        });

        paused.addEventListener('click', () => {
            playerController.start();
            paused.classList.add('hidden');
        });

        // AI
        // new AI('#ai');
    } catch (e) {
        console.error(e);
    }
})();
