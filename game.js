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