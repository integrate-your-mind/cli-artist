// THIS IS A REALLY EARLY PROTOTYPE. THE CODE IS VERY MESSY. PLZ DONT KILL ME. If you want you can refactor it into two files. One library file and another sketch.js file. 

// START RENDERING ENGINE CODE:

let funcs = {}

let setup, draw, keyPressed, frameRate;

funcs.BOX = "\u2588";
funcs.CIRCLE = "\u26AA";
funcs.EMPTY = ' ';
// These are needed for ease of use to easily detect arrow keys. Even p5.js has them. DO NOT DELETE
funcs.UP = '\u001B\u005B\u0041';
funcs.DOWN = '\u001B\u005B\u0042';
funcs.LEFT = '\u001B\u005B\u0044';
funcs.RIGHT = '\u001B\u005B\u0043';

let matrix = []; // Matrix should not be accesible outside engine

funcs.avaliableColors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'lightblack', 'lightred', 'lightgreen', 'lightyellow', 'lightblue', 'lightmagenta', 'lightcyan', 'lightwhite'];

let foregroundColours = {
    black: "\u001b[30m",
    red: "\u001b[31m",
    green: "\u001b[32m",
    yellow: "\u001b[33m",
    blue: "\u001b[34m",
    magenta: "\u001b[35m",
    cyan: "\u001b[36m",
    white: "\u001b[37m",
    lightblack: "\u001b[30;1m",
    lightred: "\u001b[31;1m",
    lightgreen: "\u001b[32;1m",
    lightyellow: "\u001b[33;1m",
    lightblue: "\u001b[34;1m",
    lightmagenta: "\u001b[35;1m",
    lightcyan: "\u001b[36;1m",
    lightwhite: "\u001b[37;1m"
}

let backgroundColours = {
    black: "\u001b[40m",
    red: "\u001b[41m",
    green: "\u001b[42m",
    yellow: "\u001b[43m",
    blue: "\u001b[44m",
    magenta: "\u001b[45m",
    cyan: "\u001b[46m",
    white: "\u001b[47m",
    lightblack: "\u001b[40;1m",
    lightred: "\u001b[41;1m",
    lightgreen: "\u001b[42;1m",
    lightyellow: "\u001b[43;1m",
    lightblue: "\u001b[44;1m",
    lightmagenta: "\u001b[45;1m",
    lightcyan: "\u001b[46;1m",
    lightwhite: "\u001b[47;1m"
}

let bg = "",
    fg = "";

let createMatrix = function () {
    funcs.width = process.stdout.columns;
    funcs.height = process.stdout.rows;

    matrix = [];
    for (let i = 0; i < funcs.height; i++) {
        matrix[i] = [];
        for (let j = 0; j < funcs.width; j++) {
            matrix[i][j] = {
                value: '',
                fg: '',
                bg: ''
            };

        }
    }
}

let lastFGColor, lastBGColor;
let renderMatrix = function () {
    let string = "\033[?25h";
    for (let y = 0; y < funcs.height; y++) {
        for (let x = 0; x < funcs.width; x++) {
            string += matrix[y][x].fg;
            string += matrix[y][x].bg;

            if (lastBGColor != matrix[y][x].bg || lastFGColor != matrix[y][x].fg) {
                if (matrix[y][x].value) {
                    string += matrix[y][x].value
                    string += "\u001b[0m"
                } else {
                    string += "\u001b[0m"
                    string += " "
                }
            } else {
                string += matrix[y][x].value || ' ';
            }

            lastBGColor = matrix[y][x].bg;
            lastFGColor = matrix[y][x].fg;
        }
    }
    process.stdout.write('\033[0;0f') // move cursor to 0, 0
    process.stdout.write(string); // print contents of matrix
}



funcs.clear = function () {
    for (let y = 0; y < funcs.height; y++) {
        for (let x = 0; x < funcs.width; x++) {
            matrix[y][x] = {
                value: '',
                fg: '',
                bg: ''
            };
        }
    }
}

funcs.drawRect = function (x, y, w, h, value) {
    for (let i = y; i < y + h; i++) {
        for (let j = x; j < x + w; j++) {
            funcs.drawPoint(j, i, value);
        }
    }
}

funcs.drawCircle = function (x, y, r, value) {

    var px, py;

    for (let d = r; d > 0; d -= 0.5) {
        for (let i = 0; i < d * 36; i++) {
            px = Math.round((Math.sin(i) * d * 1.95) + x);
            py = Math.round(Math.cos(i) * d + y);
            funcs.drawPoint(px, py, value);
        }
    }

}

funcs.loop = function (n, min, max) {
    return (n < min) ? max - Math.abs(n % max) : n % max
}

funcs.drawPoint = function (x, y, value) {
    if (y >= 0 && y < funcs.height && x >= 0 && x < funcs.width) {
        matrix[funcs.constrain(Math.floor(y), 0, funcs.height)][funcs.constrain(Math.floor(x), 0, funcs.width)] = {
            value: value[0],
            fg: fg || "",
            bg: bg || ""
        };
    }
}

funcs.drawLine = function (x, y, dirX, dirY, length, value) {
    for (let i = 0; i < length; i++) {
        funcs.drawPoint(x, y, value);
        x += dirX;
        y += dirY;
    }
}

funcs.drawText = function (x, y, text) {
    for (var i = 0; i < text.length; i++) {
        funcs.drawPoint(x + i, y, text[i]);
    }
}

funcs.constrain = function (x, min, max) {
    return x < min ? min : x > max ? max : x;
}

funcs.map = function (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}


funcs.fillForeground = function (colour) {
    let clr = foregroundColours[colour.toLowerCase()];
    if (!clr)
        if (colour[0] == "\\") clr = clr
        else clr = "";

    fg = clr;
}
funcs.fillBackground = function (colour) {
    let clr = backgroundColours[colour.toLowerCase()];
    if (!clr)
        if (colour[0] == "\\") clr = clr
        else clr = "";

    bg = clr;
}
funcs.noBg = function () {
    bg = ""
    process.stdout.write('\u001b[0m')
}
funcs.noFg = function () {
    fg = ""
    process.stdout.write('\u001b[0m')
}

funcs.drawBorder = function (value) {
    funcs.drawLine(0, 0, 1, 0, funcs.width, value);
    funcs.drawLine(0, funcs.height - 1, 1, 0, funcs.width, value);
    funcs.drawLine(0, 0, 0, 1, funcs.height, value);
    funcs.drawLine(funcs.width - 1, 0, 0, 1, funcs.height, value);
}

// Init function used, so users script has access to engine variable like width in setup; Was not possible in draw
funcs.init = function (s, d, k, f) {
    setup = s;
    draw = d;
    keyPressed = k;
    frameRate = f || 30;

    process.stdout.write('\033[?25h')

    createMatrix();// Setup called after matrix is created
    setup();

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on("data", key => { // The event listener only needs to be set once. Not every frame in draw. 
        if (key === '\u0003') exit();
        if (keyPressed) keyPressed(key);
    })

    process.stdout.on('resize', createMatrix); // Recreate the matrix if window resized.

    setInterval(() => {
        funcs.clear();
        draw();
        renderMatrix();
    }, 1000 / frameRate);
}

module.exports = funcs;


process.on('SIGINT', e => exit())

let exit = e => {
    process.stdout.write('\033[2J\u001b[0m\033[?25l\033c');
    require('child_process').exec(process.platform == "win32" ? "cls" : "clear");
    process.exit();
}