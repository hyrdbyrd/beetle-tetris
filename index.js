window.addEventListener('DOMContentLoaded', () => {
    const { Player } = window;

    // Контейнер ВСЕГО
    const player = document.querySelector('.player');

    // Для отображения счета
    const scoreElement = player.querySelector('.score');
    scoreElement.innerText = 'Score: 0';

    // Контроллы
    const pause = player.querySelector('.pause');
    const reload = player.querySelector('.reload');
    // Контролл-обложка
    const play = player.querySelector('.play');

    // Обложка для паузы
    const paused = player.querySelector('.paused');

    // Для получения размера контейнера
    const playerController = new Player('#player', true);

    const scoreCallback = score => scoreElement.innerText = `Score: ${score}`;

    // Начало игры
    play.addEventListener('click', () => {
        play.classList.add('hidden');

        playerController.start();

        playerController
            .on('score', scoreCallback)
            .on('gameOver', scoreCallback);
    });

    reload.addEventListener('click', () => {
        playerController.newGame();
    });

    // Кнопка паузы
    pause.addEventListener('click', () => {
        playerController.stop();
        paused.classList.remove('hidden');
    });

    // Продолжить игру
    paused.addEventListener('click', () => {
        playerController.start();
        paused.classList.add('hidden');
    });
});
