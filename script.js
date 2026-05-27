const player = document.getElementById('player');
let x = 285, y = 185;

document.addEventListener('keydown', (e) => {
    const step = 20;
    if (e.key === 'w' && y > 0) y -= step;
    if (e.key === 's' && y < 370) y += step;
    if (e.key === 'a' && x > 0) x -= step;
    if (e.key === 'd' && x < 570) x += step;
    
    player.style.top = y + 'px';
    player.style.left = x + 'px';
});