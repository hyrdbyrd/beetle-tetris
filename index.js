const { Player, AI } = window;

// Player

const desk = document.querySelector('.player');
if (desk) {
    const scoreElement = desk.querySelector('.score');
    if (scoreElement) {
        scoreElement.innerText = 'Score: 0';
    }

    const playerController = new Player('#player');

    playerController
        .on('score', score => {
            console.log('\n\n\n\n1\n\n\n', score);
            if (score) scoreElement.innerText = `Score: ${score}`;
        });
}

// new AI('#ai');
