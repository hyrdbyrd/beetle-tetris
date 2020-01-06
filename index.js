const { Player, AI } = window;



(() => {
    // Player
    const player = document.querySelector('.player');
    if (player) {
        const scoreElement = player.querySelector('.score');
        if (scoreElement)
            scoreElement.innerText = 'Score: 0';

        const play = player.querySelector('.play');

        let playerController;

        // Для получения размера контейнера
        playerController = new Player('#player', true);

        if (play)
            play.addEventListener('click', () => {
                playerController = new Player('#player');

                play.classList.add('hidden');

                playerController.start();
                playerController
                    .on('score', score => {
                        console.log('\n\n\n\n1\n\n\n', score);
                        if (score) scoreElement.innerText = `Score: ${score}`;
                    })
                    .on('gameOver', score => {
                        play.classList.remove('hidden');
                        playerController.stop();

                    });
            });
    }

    // AI
    // new AI('#ai');
})();
