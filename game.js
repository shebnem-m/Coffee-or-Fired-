// STEP 1: CANVAS SETUP & GRID
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const COLS = 20, ROWS = 16, TILE = 32;
canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

const C = {
    bg: '#1a1a2e',
    gridLine: '#1f2f55'
};

function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawGrid() {
    rect(0, 0, canvas.width, canvas.height, C.bg);
    ctx.strokeStyle = C.gridLine;
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) {
        ctx.beginPath(); ctx.moveTo(c * TILE, 0); ctx.lineTo(c * TILE, canvas.height); ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * TILE); ctx.lineTo(canvas.width, r * TILE); ctx.stroke();
    }
}

function initGame() {
    drawGrid();
}

window.onload = initGame;

// STEP 2: PLAYER MOVEMENT
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const COLS = 20, ROWS = 16, TILE = 32;
canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

const C = { bg: '#1a1a2e', gridLine: '#1f2f55' };
let player;
let keys = {};

function rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }

function drawGrid() {
    rect(0, 0, canvas.width, canvas.height, C.bg);
    ctx.strokeStyle = C.gridLine; ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * TILE, 0); ctx.lineTo(c * TILE, canvas.height); ctx.stroke(); }
    for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * TILE); ctx.lineTo(canvas.width, r * TILE); ctx.stroke(); }
}

class Player {
    constructor(x, y) { this.x = x; this.y = y; this.size = TILE; this.speed = 3; this.color = '#ff69b4'; }
    draw() { ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.size, this.size); }
    move() {
        if (keys['w'] || keys['ArrowUp']) this.y -= this.speed;
        if (keys['s'] || keys['ArrowDown']) this.y += this.speed;
        if (keys['a'] || keys['ArrowLeft']) this.x -= this.speed;
        if (keys['d'] || keys['ArrowRight']) this.x += this.speed;
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.size));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.size));
    }
}

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    player.move();
    player.draw();
    requestAnimationFrame(gameLoop);
}

function initGame() {
    player = new Player(9 * TILE, 13 * TILE);
    gameLoop();
}
window.onload = initGame;

// STEP 3: BOSS & COLLISION
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const COLS = 20, ROWS = 16, TILE = 32;
canvas.width = COLS * TILE; canvas.height = ROWS * TILE;

const C = { bg: '#1a1a2e', gridLine: '#1f2f55' };
let player, bosses = [];
let keys = {};

function rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
function drawGrid() {
    rect(0, 0, canvas.width, canvas.height, C.bg);
    ctx.strokeStyle = C.gridLine; ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * TILE, 0); ctx.lineTo(c * TILE, canvas.height); ctx.stroke(); }
    for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * TILE); ctx.lineTo(canvas.width, r * TILE); ctx.stroke(); }
}

class Player {
    constructor(x, y) { this.x = x; this.y = y; this.size = TILE; this.speed = 3; this.color = '#ff69b4'; }
    draw() { ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.size, this.size); }
    move() {
        if (keys['w'] || keys['ArrowUp']) this.y -= this.speed;
        if (keys['s'] || keys['ArrowDown']) this.y += this.speed;
        if (keys['a'] || keys['ArrowLeft']) this.x -= this.speed;
        if (keys['d'] || keys['ArrowRight']) this.x += this.speed;
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.size));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.size));
    }
}

class Boss {
    constructor(x, y) {
        this.x = x; this.y = y; this.size = TILE; this.speed = 1.5; this.color = '#7f8c8d';
        this.dirX = Math.random() > 0.5 ? 1 : -1; this.dirY = Math.random() > 0.5 ? 1 : -1;
    }
    draw() {
        ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = '#c0392b'; ctx.fillRect(this.x + 12, this.y + 10, 8, 12); // Tie
    }
    move() {
        this.x += this.dirX * this.speed; this.y += this.dirY * this.speed;
        if (this.x <= 0 || this.x >= canvas.width - this.size) this.dirX *= -1;
        if (this.y <= 0 || this.y >= canvas.height - this.size) this.dirY *= -1;
    }
}

function checkCollisions() {
    bosses.forEach(boss => {
        if (player.x < boss.x + boss.size && player.x + player.size > boss.x &&
            player.y < boss.y + boss.size && player.y + player.size > boss.y) {
            console.log("GAME OVER: Boss caught you!");
        }
    });
}

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    player.move(); player.draw();
    bosses.forEach(b => { b.move(); b.draw(); });
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function initGame() {
    player = new Player(9 * TILE, 13 * TILE);
    bosses.push(new Boss(0, 0));
    bosses.push(new Boss(19 * TILE, 15 * TILE));
    gameLoop();
}
window.onload = initGame;