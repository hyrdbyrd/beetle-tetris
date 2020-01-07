(() => {
    const { ApiError, CONSTANTS, HELPERS } = window;
    const { WIDTH, HEIGHT, SIZE, COLORS, DROP_THROTTLE, EMPTY } = CONSTANTS;
    const { genMatrix, flatForEach, genRandomColor, rotate2DArray, notMaxThen } = HELPERS;

    window.Controller = class {
        _isFalling = false;

        _score = 0;
        _listeners = {};
        _stopped = false;
        _pos = { x: 0, y: 0 };
        _piece = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        /** Конструктор и его состовляющие */
        constructor(canvasSelector, withListener, stoppedByDefault, bg) {
            this.canvas = document.querySelector(canvasSelector);
            if (!this.canvas) throw new ApiError('canvas is not defined');

            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) throw new ApiError('it seems like element is not HTMLCanvasElement');

            this.bg = bg;

            this.canvas.width = WIDTH * SIZE;
            this.canvas.height = HEIGHT * SIZE;

            if (withListener) this._setListeners();

            this._stopped = stoppedByDefault;

            this._newGame();
            this.start();
        }

        _newGame = () => {
            this._score = 0;
            this.matrix = genMatrix(WIDTH, HEIGHT);
            this._createNewPiece();
        };

        _createNewPiece = () => {
            const { floor } = Math;

            const centerX = floor(WIDTH / 2) - 1;

            if (this.matrix[0][centerX + 1] !== EMPTY)
                this._gameOver();

            this._pos = {
                x: centerX,
                y: -2
            };

            this._piece = [
                [0, genRandomColor(), 0],
                [0, genRandomColor(), 0],
                [0, 0,                0]
            ];
        };

        _setListeners() {
            window.addEventListener('keydown', e => {
                console.log(e.key, e.keyCode);

                switch (e.keyCode) {
                    // SPACE
                    case 32:
                        // Гарантия того, что мы упадем не за пределами view
                        this._isFalling = true;
                        break;
                    // UP
                    case 38:
                    case 87: {
                        this._rotate();
                        break;
                    }
                    // RIGHT
                    case 39:
                    case 68: {
                        this._right();
                        break;
                    }
                    // LEFT
                    case 37:
                    case 65: {
                        this._left();
                        break;
                    }
                    // DOWN
                    case 40:
                    case 83: {
                        this._drop(true);
                        break;
                    }
                }
            });
        }

        _move = (onMove, catchMove = () => undefined, xFunc = x => x, yFunc = y => y, piece = this._piece, matrix = this.matrix) => {
            const { x, y } = this;

            const canSet = !piece.some((row, pY) =>
                row.some((fill, pX) => {
                    const cY = y + pY;
                    const cX = x + pX;

                    const rX = xFunc(cX);
                    const rY = yFunc(cY);

                    return fill === EMPTY
                        ? false
                        : (matrix[cY] && matrix[cY][cX] === EMPTY) && (matrix[rY] && matrix[rY][rX] !== EMPTY) || rY === HEIGHT;
                })
            );

            if (canSet) onMove();
            else catchMove();
        };

        /** Публичное API */
        on = (toListen, callback) => {
            this._listeners[toListen] = callback;
            return this;
        };

        stop = () => {
            this._stopped = true;
        };

        start = () => {
            this._stopped = false;
            this._loop();
        };

        newGame = this._newGame;

        get x() {
            return Math.round(this._pos.x);
        }

        get y() {
            return Math.floor(this._pos.y);
        }

        get score() {
            return this._score;
        }

        /** Методы передвижений */
        _drop = (hardDrop) => {
            const { _isFalling, score } = this;

            let dropСoefficient = (score / 1000 + 1) * 0.02;

            if (_isFalling)
                dropСoefficient += 0.5;

            if (hardDrop)
                dropСoefficient += 0.2;

            this._move(() => this._pos.y += dropСoefficient, this._save, undefined, y => Math.ceil(y + dropСoefficient));

            if (this._listeners.drop) this._listeners.drop();
        };

        _rotate = () => {
            const { matrix, x, y } = this;
            const piece = rotate2DArray(this._piece);

            const canSet = piece.every((row, pY) =>
                row.every((fill, pX) => {
                    const cY = y + pY;
                    const cX = x + pX;

                    return fill === EMPTY
                        ? true
                        : matrix[cY] && matrix[cY][cX] === EMPTY;
                })
            );

            if (canSet) this._piece = piece;
        };

        _left = this._move.bind(this, () => this._pos.x--, undefined, x => --x);

        _right = this._move.bind(this, () => this._pos.x++, undefined, x => ++x);

        /** Хелперы */
        _fillPixel = (fill, x, y) => {
            const { floor: f } = Math;

            if (fill === EMPTY)
                return;

            const { ctx } = this;

            const X = x * SIZE;
            const Y = y * SIZE;

            const rotatingArgs = [1, 0, 360];

            /* Тело букашки */
            ctx.fillStyle = COLORS[fill];
            ctx.strokeStyle = '#000';

            ctx.beginPath();
            ctx.ellipse(f(X + SIZE / 2), f(Y + SIZE / 2), f(SIZE / 2.5), f(SIZE / 2.5), ...rotatingArgs);
            ctx.fill();
            ctx.stroke();

            /** Глазочки букашечки */
            const eyeSize = 5;

            const drawEye = (x, y, pupilSize) => {
                /** Глазочек */
                ctx.fillStyle = '#fff';

                ctx.beginPath();
                ctx.ellipse(x, y, eyeSize, eyeSize, ...rotatingArgs);
                ctx.fill();

                /** Зрачок */
                ctx.fillStyle = '#000';

                ctx.beginPath();
                ctx.ellipse(x, y, pupilSize, pupilSize, ...rotatingArgs);
                ctx.fill();
            };

            drawEye(f(X + SIZE / 1.5), f(Y + SIZE / 2), 2.3);
            drawEye(f(X + SIZE / 3.3), f(Y + SIZE / 2), 2);
        };

        _draw = () => {
            const { matrix, _fillPixel, _piece, _pos: { x, y } } = this;

            this.ctx.clearRect(0, 0, WIDTH * SIZE, HEIGHT * SIZE);

            if (this.bg) {
                this.ctx.drawImage(
                    this.bg,
                    this.bg.width / 2 - WIDTH * SIZE / 2,
                    this.bg.height / 2 - HEIGHT * SIZE / 2,
                    WIDTH * SIZE,
                    HEIGHT * SIZE,
                    0,
                    0,
                    WIDTH * SIZE,
                    HEIGHT * SIZE
                );
            }

            flatForEach(matrix, _fillPixel);
            flatForEach(_piece, (fill, pX, pY) => _fillPixel(fill, pX + x, pY + y));
        };

        _matrixWithPiece = () => {
            const { x, y, matrix, _piece: piece } = this;
            const newMatrix = matrix.map(e => [...e]);

            flatForEach(piece, (fill, pX, pY) => {
                if (fill !== EMPTY && newMatrix[pY + y])
                    newMatrix[pY + y][pX + x] = fill;
            });

            return newMatrix;
        };

        _matrixWithGravityDrop = (matrix = this.matrix) => {
            const newMatrix = matrix.map(e => [...e]);

            let changed = true;
            while (changed) {
                changed = false;
                flatForEach(newMatrix, (fill, x, y) => {
                    const nextY = y + 1;

                    if (fill !== EMPTY && newMatrix[nextY] && newMatrix[nextY][x] === EMPTY) {
                        newMatrix[y][x] = EMPTY;
                        newMatrix[nextY][x] = fill;

                        changed = true;
                    }
                });
            }

            return newMatrix;
        };

        _createBeetleName = (x, y) => `${x}_${y}`;

        _getCoordsByBeetleName = name => name.split('_');

        /** Методы цикла */
        _addScore = count => {
            if (count >= 3) {
                this._score += (count - 2) * 5;
                console.log(`%cScore ${this._score}`, 'background: #f33; padding: 5px; border: 1px solid #000; color: #000;');
                if (this._listeners.score) this._listeners.score(this._score);
            }
        };

        _checkBeatles = () => {
            const { _createBeetleName: newName, _getCoordsByBeetleName: getCoords } = this;

            let total = 0;

            let changed;
            do {
                this.matrix = this._matrixWithGravityDrop();
                changed = false;

                flatForEach(this.matrix, (fill, x, y) => {
                    if (fill !== EMPTY) {
                        const checked = new Set();

                        const stack = [[x, y]];
                        while (stack.length) {
                            const [x, y] = stack.pop();
                            checked.add(newName(x, y));

                            [
                                [x, y + 1],
                                [x, y - 1],
                                [x + 1, y],
                                [x - 1, y]
                            ]
                                .filter(([x, y]) => !checked.has(newName(x, y)))
                                .forEach(([x, y]) => {
                                    if (this.matrix[y] && this.matrix[y][x] === fill) {
                                        stack.push([x, y]);
                                    }
                                });
                        }

                        if (checked.size >= 3) {
                            checked.forEach(name => {
                                const [x, y] = getCoords(name);

                                this.matrix[y][x] = EMPTY;

                                total += checked.size;
                            });

                            changed = true;
                        }
                    }
                });
            } while (changed);

            this._addScore(total);
        };

        _gameOver = () => {
            console.log('%cGame Over', 'background: #333333; border: 1px solid #ffffff; color: #ffffff; padding: 5px;')

            this._newGame();
            if (this._listeners.gameOver) this._listeners.gameOver(this._score);
        };

        _save = () => {
            const { x, y } = this._pos;

            this._isFalling = false;

            if (this._piece.some((row, pY) => row.some((fill, pX) => fill !== EMPTY && x + pX < 0 || y + pY < 0)))
                this._gameOver();

            this.matrix = this._matrixWithGravityDrop(this._matrixWithPiece());

            this._checkBeatles();

            this._createNewPiece();

            console.log('%cSaved', 'background: #fc0; color: #000; padding: 5px; border: 1px solid #000');
        };

        _loop = () => {
            if (this._stopped)
                return;

            this._drop();
            this._draw();

            requestAnimationFrame(this._loop);
        };
    };
})();