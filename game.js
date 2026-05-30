const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const COLS = 20, ROWS = 16, TILE = 32;
canvas.width = COLS * TILE; canvas.height = ROWS * TILE;
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreEl = document.getElementById('final-score');

const C = { bg: '#1a1a2e', gridLine: '#1f2f55', coffee: '#c8853a', laptop: '#2ecc71' };
let player, bosses = [], machines = [], laptopObj;
let keys = {}, score = 0, coffeeLevel = 100;
let state = 'start';
let animFrameId; 

function rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
function drawGrid() {
    rect(0, 0, canvas.width, canvas.height, C.bg);
    ctx.strokeStyle = C.gridLine; ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * TILE, 0); ctx.lineTo(c * TILE, canvas.height); ctx.stroke(); }
    for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * TILE); ctx.lineTo(canvas.width, r * TILE); ctx.stroke(); }
}

class Player {
    constructor(x, y) { this.x = x; this.y = y; this.size = TILE; this.speed = 3; }
    draw() { rect(this.x, this.y, this.size, this.size, '#ff69b4'); }
    move() {
        if (state !== 'playing') return;
        if (keys['w']) this.y -= this.speed; if (keys['s']) this.y += this.speed;
        if (keys['a']) this.x -= this.speed; if (keys['d']) this.x += this.speed;
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.size));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.size));
    }
}

class Boss {
    constructor(x, y) {
        this.x = x; this.y = y; this.size = TILE; this.speed = 1.5;
        this.dirX = Math.random() > 0.5 ? 1 : -1; this.dirY = Math.random() > 0.5 ? 1 : -1;
    }
    draw() { rect(this.x, this.y, this.size, this.size, '#7f8c8d'); rect(this.x+12, this.y+10, 8, 12, '#c0392b'); }
    move() {
        this.x += this.dirX * this.speed; this.y += this.dirY * this.speed;
        if (this.x <= 0 || this.x >= canvas.width - this.size) this.dirX *= -1;
        if (this.y <= 0 || this.y >= canvas.height - this.size) this.dirY *= -1;
    }
}

function checkCollisions() {
    if (state !== 'playing') return;
    bosses.forEach(b => {
        if (player.x < b.x + b.size && player.x + player.size > b.x && player.y < b.y + b.size && player.y + player.size > b.y) {
            endGame();
        }
    });
    machines.forEach(m => {
        if (!m.alive) return;
        if (Math.abs(player.x - m.x) < 32 && Math.abs(player.y - m.y) < 32) {
            coffeeLevel = Math.min(100, coffeeLevel + 30); m.alive = false;
            setTimeout(() => m.alive = true, 5000);
        }
    });
    if (Math.abs(player.x - laptopObj.x) < 32 && Math.abs(player.y - laptopObj.y) < 32) {
        if (coffeeLevel > 20) { score += 10; coffeeLevel -= 20; }
    }
}

function drawUI() {
    ctx.fillStyle = 'white'; ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Coffee: ${Math.floor(coffeeLevel)}%`, 10, 40);
    rect(10, 50, 100 * (coffeeLevel/100), 10, coffeeLevel < 20 ? 'red' : 'orange');
}

function showScreen(screenName) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    
    if (screenName === 'start') startScreen.classList.add('active');
    if (screenName === 'game') gameScreen.classList.add('active');
    if (screenName === 'gameover') gameoverScreen.classList.add('active');
    
    state = screenName === 'game' ? 'playing' : (screenName === 'start' ? 'start' : 'over');
}

function endGame() {
    state = 'over';
    cancelAnimationFrame(animFrameId); 
    finalScoreEl.textContent = score;
    showScreen('gameover');
}

function initGame() {
    cancelAnimationFrame(animFrameId); 
    score = 0; coffeeLevel = 100;
    player = new Player(9 * TILE, 13 * TILE);
    bosses = [new Boss(0, 0), new Boss(19 * TILE, 15 * TILE)];
    machines = [{x:0, y:0, alive:true}, {x:19*TILE, y:0, alive:true}];
    laptopObj = {x: 9*TILE, y: 7*TILE};
    showScreen('game');
    gameLoop();
}

function gameLoop() {
    if (state !== 'playing') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    player.move(); player.draw();
    bosses.forEach(b => { b.move(); b.draw(); });
    machines.forEach(m => { if(m.alive) rect(m.x, m.y, 32, 32, C.coffee); });
    rect(laptopObj.x, laptopObj.y, 64, 32, C.laptop);
    
    coffeeLevel -= 0.1;
    if (coffeeLevel <= 0) { endGame(); return; }
    
    checkCollisions();
    drawUI();
    animFrameId = requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

startBtn.addEventListener('click', () => { initGame(); });

// RESTART WITHOUT REFRESH
restartBtn.addEventListener('click', () => { 
    showScreen('start'); 
});

window.onload = () => { showScreen('start'); };