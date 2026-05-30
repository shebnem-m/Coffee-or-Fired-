// ═══════════════════════════════════════════
//      OFFICE vs COFFEE: CAREER progression
// ═══════════════════════════════════════════
const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');
 
const COLS = 20, ROWS = 16, TILE = 32;
canvas.width  = COLS * TILE;   
canvas.height = ROWS * TILE;   
 
// ── Screens & Buttons ──────────────────────
const startScreen     = document.getElementById('start-screen');
const gameScreen      = document.getElementById('game-screen');
const gameoverScreen  = document.getElementById('gameover-screen');
const startBtn        = document.getElementById('start-btn');
const continueBtn     = document.getElementById('continue-btn'); 
const endContinueBtn  = document.getElementById('end-continue-btn'); 
const levelsBtn       = document.getElementById('levels-btn');
const levelSelection  = document.getElementById('level-selection');
const restartBtn      = document.getElementById('restart-btn');
const levelUpBanner   = document.getElementById('level-up-banner'); 
 
// ── HUD refs ─────────────────────────────
const scoreEl         = document.getElementById('score');
const comboEl         = document.getElementById('combo-display');
const levelEl         = document.getElementById('current-level');
const powerupEl       = document.getElementById('active-powerup');
const highScoreEl     = document.getElementById('high-score');
const finalScoreEl    = document.getElementById('final-score');
const finalHSEl       = document.getElementById('final-high-score');
const startHSEl       = document.getElementById('start-high-score');
const coffeeBar       = document.getElementById('coffee-bar');
 
// ── Game State ────────────────────────────
let state = 'start'; 
let score = 0, highScore = 0, coffeeLevel, animFrame, currentLevel = 1;
let player, bosses, coffeeMachines, desks, activeDeskIndex, powerUps;
let keys = {};
let lastTime = 0;
let bossSpawnTimer = 0;
let comboCount = 0;
let comboTimer = 0;
let globalAnimTime = 0;
let hasWonToday = false; 

// Balance settings
let COFFEE_DRAIN_RATE = 0.007; 
const COFFEE_MAX = 100;
let BOSS_SPAWN_INTERVAL = 5000;

const C = {
  bg           : '#1a1a2e',
  gridLine     : '#1f2f55',
  bossSuit     : '#7f8c8d',   
  coffee       : '#c8853a',
  coffeeTop    : '#ffd460',
  laptop       : '#4ecca3',
  laptopScreen : '#a8fce8',
  desk         : '#8b6340',
  deskTop      : '#a0784e',
  cubicleWall  : '#475569',  
  skin         : '#f0c89a',
  hair         : '#b5459b',
  bossHair     : '#2c2c2c',
  invincible   : '#00ffff'
};
 
// ══════════════════════════════════════════
//    CAREER RANK & CROWN SYSTEM
// ══════════════════════════════════════════
function getCareerDetails(lvl) {
  if (lvl <= 2) {
    return { title: "🟢 INTERN", color: "#2ecc71", skirt: "#27ae60", crown: false };
  } else if (lvl <= 4) {
    return { title: "🔵 JUNIOR", color: "#3498db", skirt: "#2980b9", crown: false };
  } else if (lvl <= 6) {
    return { title: "🟡 MIDDLE", color: "#f1c40f", skirt: "#f39c12", crown: false };
  } else if (lvl <= 8) {
    return { title: "🌸 SENIOR", color: "#ff79c6", skirt: "#e056fd", crown: false };
  } else if (lvl < 15) {
    return { title: "🔴 LEAD DEV", color: "#e74c3c", skirt: "#c0392b", crown: false };
  } else {
    return { title: "👑 CHIEF ARCHITECT (WIN)", color: "#f1c40f", skirt: "#d35400", crown: true };
  }
}

function drawPlayerSprite(context, x, y, lvl, isMovingAnim) {
  context.fillStyle = '#00000033';
  context.fillRect(x+4, y+28, 24, 4); 
  
  let career = getCareerDetails(lvl);
  let clothesColor = career.color;
  let skirtColor = career.skirt;
  
  let armOffset = 0;
  if (isMovingAnim) {
    armOffset = Math.sin(globalAnimTime * 0.01) * 3;
  }

  context.fillStyle = clothesColor;
  context.fillRect(x+4,  y+14 + armOffset, 3, 8); 
  context.fillRect(x+25, y+14 - armOffset, 3, 8); 
  context.fillRect(x+8,  y+12, 16, 14); 
  
  context.fillStyle = skirtColor;
  context.fillRect(x+6,  y+22, 20, 8);   
  
  context.fillStyle = C.skin;
  context.fillRect(x+9,  y+28, 5, 4);
  context.fillRect(x+18, y+28, 5, 4);
  
  context.fillRect(x+9,  y+3, 14, 12);
  
  context.fillStyle = '#333';
  context.fillRect(x+12, y+7, 2, 2);
  context.fillRect(x+18, y+7, 2, 2);

  context.fillStyle = C.hair;
  context.fillRect(x+8,  y+1,  16, 6);
  context.fillRect(x+7,  y+5,  4,  10); 
  context.fillRect(x+21, y+5,  4,  10);

  if (career.crown) {
    context.fillStyle = '#f1c40f'; 
    context.beginPath();
    context.moveTo(x+9,  y+1); 
    context.lineTo(x+8,  y-4); 
    context.lineTo(x+13, y-1); 
    context.lineTo(x+16, y-6); 
    context.lineTo(x+19, y-1); 
    context.lineTo(x+24, y-4); 
    context.lineTo(x+23, y+1); 
    context.closePath();
    context.fill();
  }
}

function drawPlayer(x, y) {
  let isMoving = !player.isWorking && (keys['w'] || keys['s'] || keys['a'] || keys['d'] || keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight']);
  
  if (player.invincible) {
    ctx.fillStyle = '#00000033';
    ctx.fillRect(x+4, y+28, 24, 4); 
    rect(x+4,  y+14, 3, 8, C.invincible); 
    rect(x+25, y+14, 3, 8, C.invincible); 
    rect(x+8,  y+12, 16, 14, C.invincible); 
    rect(x+6,  y+22, 20, 8,  '#00aaaa');   
    rect(x+9,  y+28, 5, 4, C.skin);
    rect(x+18, y+28, 5, 4, C.skin);
    rect(x+9,  y+3, 14, 12, C.skin);
    rect(x+12, y+7, 2, 2, '#333');
    rect(x+18, y+7, 2, 2, '#333');
    rect(x+8,  y+1,  16, 6,  C.hair);
    rect(x+7,  y+5,  4,  10, C.hair); 
    rect(x+21, y+5,  4,  10, C.hair);
    
    ctx.strokeStyle = C.invincible;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 2, y - 2, TILE + 4, TILE + 4);
  } else {
    drawPlayerSprite(ctx, x, y, currentLevel, isMoving);
  }
}

function rect(x,y,w,h,color) {
  ctx.fillStyle = color;
  ctx.fillRect(x,y,w,h);
}
 
function drawGrid() {
  rect(0,0,canvas.width,canvas.height, C.bg);
  ctx.strokeStyle = C.gridLine;
  ctx.lineWidth = 0.5;
  for (let c=0;c<=COLS;c++) {
    ctx.beginPath(); ctx.moveTo(c*TILE,0); ctx.lineTo(c*TILE,canvas.height); ctx.stroke();
  }
  for (let r=0;r<=ROWS;r++) {
    ctx.beginPath(); ctx.moveTo(0,r*TILE); ctx.lineTo(canvas.width,r*TILE); ctx.stroke();
  }
}
 
function drawBoss(b) {
  rect(b.px+4, b.py+28, 24, 4, '#00000033');
  let bArmOffset = Math.sin((globalAnimTime + b.px) * 0.008) * 3;
  rect(b.px+3,  b.py+14 + bArmOffset, 3, 8, C.bossSuit);
  rect(b.px+26, b.py+14 - bArmOffset, 3, 8, C.bossSuit);
  rect(b.px+6,  b.py+12, 20, 14, C.bossSuit);
  rect(b.px+14, b.py+12, 4,  12, '#445577'); 
  rect(b.px+12, b.py+12, 8, 4, '#ccc');
  rect(b.px+8,  b.py+24, 6, 8, '#2c3a50');
  rect(b.px+18, b.py+24, 6, 8, '#2c3a50');
  rect(b.px+9,  b.py+3,  14, 12, C.skin);
  rect(b.px+8,  b.py+1,  16, 5,  C.bossHair);
  rect(b.px+11, b.py+7,  3, 2, '#333');
  rect(b.px+18, b.py+7,  3, 2, '#333');
}
 
function drawCoffeeMachine(x,y, glowing) {
  rect(x+4,  y+6,  24, 22, '#2255aa');
  rect(x+7,  y+12, 10, 6,  glowing ? '#88ffcc' : '#1a6644');
  rect(x+10, y+21, 12, 5,  '#1a3e88');
  if (glowing) {
    rect(x+15, y+26, 2, 4, C.coffee);
    ctx.strokeStyle = C.coffeeTop;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x+2, y+4, 28, 26);
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('COFFEE', x + TILE/2, y + 8); 
}
 
function drawOfficeCubicles() {
  desks.forEach((d, index) => {
    let isCurrentActive = (index === activeDeskIndex);
    let wallColor = isCurrentActive ? C.laptop : C.cubicleWall; 
    let x = d.gx * TILE;
    let y = d.gy * TILE;

    ctx.strokeStyle = wallColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + TILE * 1.5);
    ctx.lineTo(x, y);
    ctx.lineTo(x + TILE * 2, y);
    ctx.lineTo(x + TILE * 2, y + TILE * 1.5);
    ctx.stroke();

    rect(x + 6, y + 18, TILE * 2 - 12, 8, C.desk);
    rect(x + 6, y + 18, TILE * 2 - 12, 3, C.deskTop);
    
    if (isCurrentActive) {
      rect(x + 18, y + 13, 28, 5, '#444');        
      rect(x + 20, y + 6,  24, 7, C.laptopScreen); 
    }
  });
}

function drawPowerUps() {
  powerUps.forEach(p => {
    ctx.fillStyle = p.type === 'speed' ? '#00ff00' : '#00ffff';
    ctx.beginPath();
    ctx.arc(p.x * TILE + TILE/2, p.y * TILE + TILE/2, 8, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText(p.type === 'speed' ? '⚡' : '🛡️', p.x * TILE + 8, p.y * TILE + 20);
  });
}
 
function setLevelDifficulty(lvl) {
  currentLevel = lvl;
  COFFEE_DRAIN_RATE = 0.007 + (lvl * 0.0012); 
  BOSS_SPAWN_INTERVAL = Math.max(2000, 6000 - (lvl * 1000)); 
}

function triggerFloatingLevelUp() {
  if (levelUpBanner) {
    let career = getCareerDetails(currentLevel);
    levelUpBanner.textContent = `🚀 LEVEL UP: ${career.title}`;
    levelUpBanner.style.background = `linear-gradient(45deg, ${career.color}, #2c3e50)`;
    levelUpBanner.classList.add('show');
    
    setTimeout(() => {
      levelUpBanner.classList.remove('show');
    }, 2000);
  }
}

function initGame(mode = 'new') {
  if (animFrame) cancelAnimationFrame(animFrame);
  bosses = []; 
  powerUps = [];

  if (mode === 'new') {
    score = 0;
    currentLevel = 1;
  } else if (mode === 'levelSelect') {
    score = 0; 
  } else if (mode === 'continue') {
    score = parseInt(localStorage.getItem('officeVsCoffee_savedScore') || '0');
    currentLevel = parseInt(localStorage.getItem('officeVsCoffee_savedLevel') || '1');
  }
  
  setLevelDifficulty(currentLevel);
  coffeeLevel = COFFEE_MAX;
  bossSpawnTimer = 0;
  comboCount = 0;
  highScore = parseInt(localStorage.getItem('officeVsCoffeeHS') || '0');
  
  player = {
    px: 9*TILE, py: 13*TILE,
    speed: 3.5, baseSpeed: 3.5,
    invincible: false, invincibleTimer: 0, speedTimer: 0,
    isWorking: false, workTimer: 0          
  };
 
  coffeeMachines = [
    { gx: 0, gy: 1, alive: true }, { gx: COLS-1, gy: 1, alive: true }, 
    { gx: 0, gy: ROWS-2, alive: true }, { gx: COLS-1, gy: ROWS-2, alive: true }, 
    { gx: 0, gy: Math.floor((ROWS-1)/2), alive: true }, { gx: COLS-1, gy: Math.floor((ROWS-1)/2), alive: true }  
  ];
 
  desks = [ { gx: 2, gy: 4 }, { gx: 15, gy: 4 }, { gx: 3, gy: 9 }, { gx: 14, gy: 9 } ];
  activeDeskIndex = Math.floor(Math.random() * desks.length);
  
  for(let i=0; i < currentLevel + 1; i++) spawnBoss();
  updateHUD();
}
 
function spawnBoss() {
  let speed = 0.6 + Math.random()*0.4;
  if (Math.random() > 0.6) speed = 1.3 + Math.random()*0.3; 
  bosses.push({
    px: Math.random() * canvas.width, py: 0, speed: speed,
    moveTimer: 0, moveCooldown: 600, targetX: 9, targetY: 7
  });
}

function spawnPowerUp() {
  if (Math.random() < 0.4) { 
    powerUps.push({
      x: Math.floor(Math.random() * (COLS - 2)) + 1,
      y: Math.floor(Math.random() * (ROWS - 2)) + 1,
      type: Math.random() > 0.5 ? 'speed' : 'invincible'
    });
  }
}
 
function loop(timestamp) {
  if (state !== 'playing') return;
  const dt = Math.min(timestamp - lastTime, 50);
  lastTime = timestamp;
  globalAnimTime += dt; 
  update(dt);
  render();
  animFrame = requestAnimationFrame(loop);
}
 
function update(dt) {
  if (player.isWorking) {
    player.workTimer -= dt;
    if (player.workTimer <= 0) {
      player.isWorking = false;
      let nextDeskIndex = activeDeskIndex;
      while (nextDeskIndex === activeDeskIndex) {
        nextDeskIndex = Math.floor(Math.random() * desks.length);
      }
      activeDeskIndex = nextDeskIndex;
      updateHUD();
    }
  } else {
    let dx = 0, dy = 0;
    if (keys['w'] || keys['ArrowUp'])    dy = -1;
    if (keys['s'] || keys['ArrowDown'])  dy =  1;
    if (keys['a'] || keys['ArrowLeft'])  dx = -1;
    if (keys['d'] || keys['ArrowRight']) dx =  1;
 
    player.px = Math.max(0, Math.min(player.px + dx * player.speed, (COLS-1)*TILE));
    player.py = Math.max(0, Math.min(player.py + dy * player.speed, (ROWS-1)*TILE));
  }

  player.gx = Math.round(player.px / TILE);
  player.gy = Math.round(player.py / TILE);

  if (player.invincible) {
    player.invincibleTimer -= dt;
    if (player.invincibleTimer <= 0) player.invincible = false;
  }
  if (player.speed > player.baseSpeed) {
    player.speedTimer -= dt;
    if (player.speedTimer <= 0) player.speed = player.baseSpeed;
  }
  if (comboCount > 0) {
    comboTimer -= dt;
    if (comboTimer <= 0) { comboCount = 0; comboEl.textContent = ''; }
  }

  bossSpawnTimer += dt;
  if (bossSpawnTimer >= BOSS_SPAWN_INTERVAL && bosses.length < 8) {
    spawnBoss(); bossSpawnTimer = 0;
  }
 
  bosses.forEach(b => {
    b.moveTimer += dt;
    if (b.moveTimer >= b.moveCooldown) {
      b.moveTimer = 0;
      if (Math.random() < 0.85) { b.targetX = player.gx; b.targetY = player.gy; }
    }
    const tx = b.targetX * TILE, ty = b.targetY * TILE;
    const ddx = tx - b.px, ddy = ty - b.py;
    const dist = Math.sqrt(ddx*ddx + ddy*ddy);
    if (dist > 2) { b.px += (ddx / dist) * b.speed; b.py += (ddy / dist) * b.speed; }
  });
 
  coffeeLevel -= COFFEE_DRAIN_RATE * dt;
  checkCollisions();
  updateHUD();
}
 
function checkCollisions() {
  const pr = 14; 
  const ppx = player.px + TILE/2;
  const ppy = player.py + TILE/2;
  if (player.isWorking) return; 

  coffeeMachines.forEach(cm => {
    if (!cm.alive) return;
    const cx = cm.gx * TILE + TILE/2; const cy = cm.gy * TILE + TILE/2;
    if (Math.abs(ppx - cx) < pr+8 && Math.abs(ppy - cy) < pr+8) {
      coffeeLevel = Math.min(COFFEE_MAX, coffeeLevel + 40); cm.alive = false;
      comboCount++; comboTimer = 3500; score += 5 * comboCount; 
      spawnPowerUp();
      setTimeout(() => { cm.alive = true; }, 3000);
    }
  });

  powerUps = powerUps.filter(p => {
    const pX = p.x * TILE + TILE/2; const pY = p.y * TILE + TILE/2;
    if (Math.abs(ppx - pX) < pr+8 && Math.abs(ppy - pY) < pr+8) {
      if (p.type === 'speed') { player.speed = player.baseSpeed * 1.7; player.speedTimer = 5000; } 
      else if (p.type === 'invincible') { player.invincible = true; player.invincibleTimer = 4000; }
      return false;
    }
    return true;
  });

  let currentCubicle = desks[activeDeskIndex];
  const cx = currentCubicle.gx * TILE + TILE; const cy = currentCubicle.gy * TILE + TILE/2;
  if (Math.abs(ppx - cx) < 26 && Math.abs(ppy - cy) < 24) {
    player.isWorking = true; player.workTimer = 500; 
    score += 50 * (comboCount > 0 ? comboCount : 1); 
    coffeeLevel = Math.min(COFFEE_MAX, coffeeLevel + 20);

    if (score > 0 && Math.floor(score / 100) > currentLevel - 1) { 
      currentLevel++;
      
      if (currentLevel >= 15 && !hasWonToday) { 
        hasWonToday = true; 
        triggerWinGame(); 
        return; 
      }
      
      setLevelDifficulty(currentLevel);
      triggerFloatingLevelUp(); 
    }
  }
 
  bosses.forEach(b => {
    const bpx = b.px + TILE/2; const bpy = b.py + TILE/2;
    if (Math.abs(ppx - bpx) < pr && Math.abs(ppy - bpy) < pr) { if (!player.invincible) endGame(); }
  });
  if (coffeeLevel <= 0) endGame();
}
 
function updateHUD() {
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;
  coffeeBar.style.width = coffeeLevel + '%';
  let career = getCareerDetails(currentLevel);
  levelEl.textContent = `${currentLevel} [${career.title}]`;
  levelEl.style.color = career.color;

  if (comboCount > 1) { comboEl.textContent = ` X${comboCount} COMBO!`; comboEl.style.color = C.coffeeTop; } 
  else { comboEl.textContent = ''; }

  if (player.isWorking) powerupEl.textContent = "💻 CODING...";
  else if (player.invincible && player.speed > player.baseSpeed) powerupEl.textContent = "ACTIVE: ALL-POWERFUL";
  else if (player.invincible) powerupEl.textContent = "ACTIVE: SHIELD";
  else if (player.speed > player.baseSpeed) powerupEl.textContent = "ACTIVE: SPEED";
  else powerupEl.textContent = ""; 
}
 
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  coffeeMachines.forEach(cm => drawCoffeeMachine(cm.gx * TILE, cm.gy * TILE, cm.alive));
  drawOfficeCubicles();
  drawPowerUps();
  bosses.forEach(b => drawBoss(b));
  drawPlayer(Math.round(player.px), Math.round(player.py));
}
 
function showScreen(name) {
  [startScreen, gameScreen, gameoverScreen].forEach(s => s.classList.remove('active'));
  if (name === 'start')    { startScreen.classList.add('active');   state = 'start'; }
  if (name === 'game')     { gameScreen.classList.add('active');    state = 'playing'; }
  if (name === 'gameover'){ gameoverScreen.classList.add('active'); state = 'over'; }
}
 
function startGame(mode = 'new') {
  if (animFrame) cancelAnimationFrame(animFrame);
  initGame(mode);
  showScreen('game');
  lastTime = performance.now();
  animFrame = requestAnimationFrame(loop);
}


function updateContinueButtonVisibility() {
  const savedLevel = localStorage.getItem('officeVsCoffee_savedLevel');
  if (savedLevel !== null) {
    continueBtn.classList.remove('locked'); 
  } else {
    continueBtn.classList.add('locked');    
  }
}

function injectEndLevelStats(isWin = false) {
  let career = getCareerDetails(currentLevel);
  
  let statsContainer = document.getElementById('dynamic-gameover-stats');
  if (!statsContainer) {
    statsContainer = document.createElement('div');
    statsContainer.id = 'dynamic-gameover-stats';
    restartBtn.parentNode.insertBefore(statsContainer, restartBtn);
  }

  let message = isWin 
    ? "🎉 You reached the corporate peak! Splendid! 🎉" 
    : "You got fired! Better luck next time.";

  statsContainer.innerHTML = `
    <div style="margin: 20px 0; font-family: monospace; text-align: center; color: #fff;">
      <p style="font-size: 15px; opacity: 0.8; margin-bottom: 5px;">${message}</p>
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">
        STATUS: <span style="color:${career.color};">${currentLevel} [${career.title}]</span>
      </div>
      <div style="background: #111424; border: 2px solid ${career.color}; display: inline-block; padding: 12px; border-radius: 10px; box-shadow: 0 0 15px ${career.color}55;">
        <canvas id="endPlayerCanvas" width="40" height="40" style="display: block;"></canvas>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const endCanvas = document.getElementById('endPlayerCanvas');
    if (endCanvas) {
      const eCtx = endCanvas.getContext('2d');
      eCtx.clearRect(0, 0, 40, 40);
      drawPlayerSprite(eCtx, 4, 5, currentLevel, false);
    }
  }, 40);
}
 
// 💀 ── STANDART DEFEAT:── 💀
function endGame() {
  state = 'over';
  cancelAnimationFrame(animFrame);
 
  const loseBanner = document.getElementById('lose-banner');
  const winBanner = document.getElementById('win-banner');
  if (loseBanner) loseBanner.style.display = 'block';
  if (winBanner) winBanner.style.display = 'none';

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('officeVsCoffeeHS', highScore);
  }
  
  localStorage.setItem('officeVsCoffee_savedScore', 0);
  localStorage.setItem('officeVsCoffee_savedLevel', currentLevel);
  
  if (endContinueBtn) {
    endContinueBtn.style.display = 'none';
  }

  finalScoreEl.textContent = score;
  finalHSEl.textContent    = highScore;
  
  injectEndLevelStats(false); 
  showScreen('gameover');
}

// 🏆 ── WIN CONDITION ── 🏆
function triggerWinGame() {
  state = 'over';
  cancelAnimationFrame(animFrame);
 
  const loseBanner = document.getElementById('lose-banner');
  const winBanner = document.getElementById('win-banner');
  if (loseBanner) loseBanner.style.display = 'none'; 
  if (winBanner) winBanner.style.display = 'block'; 

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('officeVsCoffeeHS', highScore);
  }
  
  localStorage.setItem('officeVsCoffee_savedScore', score);
  localStorage.setItem('officeVsCoffee_savedLevel', currentLevel);
  
  if (endContinueBtn) {
    endContinueBtn.style.display = 'inline-block';
    endContinueBtn.classList.remove('locked');
  }

  finalScoreEl.textContent = score;
  finalHSEl.textContent    = highScore;
  
  injectEndLevelStats(true); 
  showScreen('gameover');
}
 
// ── EVENT LISTENERS ────────────────────────
document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup',   e => { keys[e.key] = false; });
 
startBtn.addEventListener('click', () => { 
  localStorage.removeItem('officeVsCoffee_savedScore');
  localStorage.removeItem('officeVsCoffee_savedLevel');
  continueBtn.classList.add('locked'); 
  hasWonToday = false; 
  startGame('new'); 
});

continueBtn.addEventListener('click', () => {
  if (!continueBtn.classList.contains('locked')) {
    startGame('continue');
  }
});

if (endContinueBtn) {
  endContinueBtn.addEventListener('click', () => {
    startGame('continue');
  });
}

levelsBtn.addEventListener('click', () => { levelSelection.classList.toggle('hidden'); });

document.querySelectorAll('.lvl-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    let selectedLvl = parseInt(e.target.getAttribute('data-lvl'));
    currentLevel = selectedLvl;
    if (selectedLvl >= 15) hasWonToday = true; 
    levelSelection.classList.add('hidden');
    startGame('levelSelect'); 
  });
});

restartBtn.addEventListener('click', () => { 
  if (animFrame) cancelAnimationFrame(animFrame); 
  updateContinueButtonVisibility(); 
  showScreen('start'); 
});
 
window.addEventListener('load', () => {
  startHSEl.textContent = localStorage.getItem('officeVsCoffeeHS') || '0';
  updateContinueButtonVisibility(); 
  showScreen('start');
});

// ── How to Play Modal ────────────────
const howToPlayBtn = document.getElementById('how-to-play-btn');
const howToPlayModal = document.getElementById('how-to-play-modal');
const closeModalSpan = document.querySelector('.close-modal');

howToPlayBtn.addEventListener('click', () => {
  howToPlayModal.classList.remove('hidden');
});
closeModalSpan.addEventListener('click', () => {
  howToPlayModal.classList.add('hidden');
});
window.addEventListener('click', (event) => {
  if (event.target === howToPlayModal) {
    howToPlayModal.classList.add('hidden');
  }
});