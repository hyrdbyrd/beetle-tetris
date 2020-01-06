(() => {
    const { COLORS } = window.CONSTANTS;
    const { floor, random } = Math;

    const genArray = size => new Array(size).fill(0);

    const genMatrix = (width, height) => genArray(height).map(() => genArray(width));

    const rand = (min, max) => floor(random() * (max - min)) + min;

    const genRandomColor = () => rand(1, COLORS.length);

    const rotate2DArray = arr => {
        const { length: height } = arr;
        if (!height) return arr;

        const { length: width } = arr[0];

        const res = [];
        for (let x = 0; x < width; x++) {
            res.push([]);
            for (let y = height - 1; y >= 0; y--) {
                res[x][height - 1 - y] = arr[y][x];
            }
        }

        return res;
    };

    const flatForEach = (array, callback) => array.forEach((row, y) => row.forEach((value, x) => callback(value, x, y)));

    const logTable = matrix => console.table(matrix.map(row => row.map(fill => COLORS[fill])));

    const notMaxThen = (cur, max) => cur > max ? max : cur;

    window.HELPERS = { genArray, genMatrix, rand, logTable, rotate2DArray, flatForEach, genRandomColor, notMaxThen };
})();
