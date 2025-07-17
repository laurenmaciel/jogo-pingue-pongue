const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');


const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const PADDLE_MARGIN = 18;
const BALL_SPEED = 5; 
const AI_SPEED = 3; 

let playerScore = 0;
let aiScore = 0;

const playerPaddle = {
    x: PADDLE_MARGIN,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

const aiPaddle = {
    x: CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

const ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    vy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    radius: BALL_RADIUS
};

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerPaddle.y = mouseY - playerPaddle.height / 2;
    playerPaddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - playerPaddle.height, playerPaddle.y));
});

function resetBall(loser = 'player') {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;

    let angle = Math.random() * Math.PI / 3 - Math.PI / 6; // entre -30° e +30°
    let direction = loser === 'player' ? -1 : 1;

    ball.vx = direction * BALL_SPEED * Math.cos(angle);
    ball.vy = BALL_SPEED * Math.sin(angle);
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    for (let i = 0; i < CANVAS_HEIGHT; i += 24) {
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2, i);
        ctx.lineTo(CANVAS_WIDTH / 2, i + 12);
        ctx.stroke();
    }
}

function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawNet();
    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, "#8B0000");
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, "#FF4500");
    drawCircle(ball.x, ball.y, ball.radius, "#fff");
}

function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -1;
    }
    if (ball.y + ball.radius > CANVAS_HEIGHT) {
        ball.y = CANVAS_HEIGHT - ball.radius;
        ball.vy *= -1;
    }

   
    if (
        ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height
    ) {
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
        ball.vx *= -1;

        let collidePoint = ball.y - (playerPaddle.y + playerPaddle.height / 2);
        collidePoint = collidePoint / (playerPaddle.height / 2);
        let angleRad = collidePoint * (Math.PI / 4);
        let direction = ball.vx > 0 ? 1 : -1;
        ball.vx = direction * BALL_SPEED * Math.cos(angleRad);
        ball.vy = BALL_SPEED * Math.sin(angleRad);
    }

    
    if (
        ball.x + ball.radius > aiPaddle.x &&
        ball.y > aiPaddle.y &&
        ball.y < aiPaddle.y + aiPaddle.height
    ) {
        ball.x = aiPaddle.x - ball.radius;
        ball.vx *= -1;

        let collidePoint = ball.y - (aiPaddle.y + aiPaddle.height / 2);
        collidePoint = collidePoint / (aiPaddle.height / 2);
        let angleRad = collidePoint * (Math.PI / 4);
        let direction = ball.vx > 0 ? 1 : -1;
        ball.vx = direction * BALL_SPEED * Math.cos(angleRad);
        ball.vy = BALL_SPEED * Math.sin(angleRad);
    }

   
    if (ball.x + ball.radius < 0) {
        aiScore++;
        document.getElementById('aiScore').textContent = aiScore;
        resetBall('player');
    }
    if (ball.x - ball.radius > CANVAS_WIDTH) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall('ai');
    }
}

function updateAI() {
    const reactionOffset = 40;
    const missChance = 0.1;
    if (ball.x > CANVAS_WIDTH/ 2 + reactionOffset) {

        if (Math.random() < missChance){
            return;
        }

        let targetY = ball.y - aiPaddle.height / 2;

        if(aiPaddle.y < targetY){
           aiPaddle.y += AI_SPEED;
    } else if (aiPaddle.y > targetY) {
        aiPaddle.y -= AI_SPEED;
    }
    aiPaddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - aiPaddle.height, aiPaddle.y));
}
}

function gameLoop() {
    updateBall();
    updateAI();
    draw();
    requestAnimationFrame(gameLoop);
}

draw();
gameLoop();