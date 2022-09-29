let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let drag = 0.01;
let gravity = 800;
let deltaTime = 0;
let lastFrame = Date.now();
let timescale = 1;
let tps = 80;

player1 = new Player(100, 600, 30, 30);
let ball = new Ball(100, 450, 15, 0.7);

document.addEventListener('keydown', KeyDownHandler, false);
document.addEventListener('keyup', KeyUpHandler, false);
let input = {
    'x' : 0,
    'y' : 0
}


Start();
setInterval(Update, 1000/tps);

function Start() {
    CreateCollisionBox(0, 700, 2000, 10);
    CreateCollisionBox(15, 620, 35, 10);
    CreateCollisionBox(5, 620, 10, 100);


    for(let i=0; i<ColBoxes.length; i++) {
        console.log(ColBoxes[i]);
    }
}

function Update() {
    player1.col = "red";
    deltaTime = 1/tps;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    DrawCollisionBoxes();

    ctx.fillStyle = player1.col;
    ctx.fillRect(player1.pos.x, player1.pos.y, player1.width, player1.height);

    ctx.fillStyle = ball.col;
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
    UpdatePlayer(player1);
    UpdateBall(ball);
}

function UpdatePlayer(player) {
    player.vel.y += gravity * deltaTime;
    
    player.vel.y += -drag * player.xDrag * player.vel.y * Math.abs(player.vel.y) * deltaTime;
    player.vel.x += -drag * player.yDrag * player.vel.x * Math.abs(player.vel.x) * deltaTime;
    
    player.vel.x += -(0.8 * player.vel.x) * deltaTime; // friction
    
    // player input
    ProcessInput()
    let hasCollided = false;
    let nextFramePos = new Vector2(player.pos.x + player.vel.x * deltaTime * timescale, player.pos.y + player.vel.y * deltaTime * timescale);
    for(let i=0; i<ColBoxes.length; i++) {
        if(isPointInsideAABB(nextFramePos, player.width, player.height, ColBoxes[i])) {
            hasCollided = true;
            player.col = "blue";

            let topMiddle = new Vector2((nextFramePos.x + player.width)/2, nextFramePos.y);

            let topFace = isPointInsideAABB(new Vector2(nextFramePos.x, nextFramePos.y), player.width/2, 1, ColBoxes[i]);
            let rightFace = isPointInsideAABB(new Vector2(nextFramePos.x + player.width, nextFramePos.y), 1, player.height/2, ColBoxes[i]);
            let bottomFace = isPointInsideAABB(new Vector2(nextFramePos.x + player.width / 4, nextFramePos.y + player.height), player.width/2, 2, ColBoxes[i]);
            let leftFace = isPointInsideAABB(new Vector2(nextFramePos.x, nextFramePos.y), 1, player.height/2, ColBoxes[i]);
            ctx.fillStyle = 'purple';
            ctx.fillRect(nextFramePos.x + player.width / 4, nextFramePos.y + player.height, player.width/2, 3);
            player.isGrounded = bottomFace;

            if(topFace && !bottomFace) { // top collision
                player.vel.y = clamp(player.vel.y, 0, 10000);
            } else if(!topFace && bottomFace) { // bottom collision
                player.vel.y = clamp(player.vel.y, -10000, 0);
                player.isGrounded = true;
            }
            
            if(leftFace && !rightFace) { // left collision
                player.vel.x = clamp(player.vel.x, 0, 10000);
            } else if(!leftFace && rightFace) { // right collision
                player.vel.x = clamp(player.vel.x, -10000, 0);
            }
        }
    }

    if(!hasCollided)
        player.isGrounded = false;
    hasCollided = false;
    player.pos.x += player.vel.x * deltaTime * timescale;
    player.pos.y += player.vel.y * deltaTime * timescale;    
    
}

function UpdateBall(ball) {
    
    ball.vel.y += gravity * deltaTime;
    
    ball.vel.y += -drag * ball.xDrag * ball.vel.y * Math.abs(ball.vel.y) * deltaTime;
    ball.vel.x += -drag * ball.yDrag * ball.vel.x * Math.abs(ball.vel.x) * deltaTime;
    
    ball.vel.x += -(0.2 * ball.vel.x) * deltaTime; // friction
    
    let nextFramePos = new Vector2(ball.pos.x + ball.vel.x * deltaTime * timescale, ball.pos.y + ball.vel.y * deltaTime * timescale);
    for(let i=0; i<ColBoxes.length; i++) {
        let sqrDist = 0;

        if(nextFramePos.x < ColBoxes[i].pos.x) sqrDist += (ColBoxes[i].pos.x - nextFramePos.x) * (ColBoxes[i].pos.x - nextFramePos.x);
        if(nextFramePos.x > ColBoxes[i].pos.x + ColBoxes[i].width) sqrDist += (nextFramePos.x - ColBoxes[i].pos.x + ColBoxes[i].width) * (nextFramePos.x - ColBoxes[i].pos.x + ColBoxes[i].width);

        if(nextFramePos.y < ColBoxes[i].pos.y) sqrDist += (ColBoxes[i].pos.y - nextFramePos.y) * (ColBoxes[i].pos.y - nextFramePos.y);
        if(nextFramePos.y > ColBoxes[i].pos.y + ColBoxes[i].height) sqrDist += (nextFramePos.y - ColBoxes[i].pos.y + ColBoxes[i].height) * (nextFramePos.y - ColBoxes[i].pos.y + ColBoxes[i].height);

        if(sqrDist < ball.radius * ball.radius) {
            console.log("collision")
            let bx = nextFramePos.x;
            let by = nextFramePos.y;
            if(bx < ColBoxes[i].pos.x) bx = ColBoxes[i].pos.x;
            if(bx > ColBoxes[i].pos.x + ColBoxes[i].width) bx = ColBoxes[i].pos.x + ColBoxes[i].width;

            if(by < ColBoxes[i].pos.y) by = ColBoxes[i].pos.y;
            if(by > ColBoxes[i].pos.y + ColBoxes[i].height) by = ColBoxes[i].pos.y + ColBoxes[i].height;

            ctx.fillStyle = "blue";
            ctx.fillRect(bx, by, 10, 10);

            ball.vel.x *= -ball.bounciness;
            ball.vel.y *= -ball.bounciness;

            ball.vel.x += (nextFramePos.x - bx);
            ball.vel.y += (nextFramePos.y - by);
            }
    }

    let sqrDist = 0;

    if(nextFramePos.x < player1.pos.x) sqrDist += (player1.pos.x - nextFramePos.x) * (player1.pos.x - nextFramePos.x);
    if(nextFramePos.x > player1.pos.x + player1.width) sqrDist += (nextFramePos.x - player1.pos.x + player1.width) * (nextFramePos.x - player1.pos.x + player1.width);

    if(nextFramePos.y < player1.pos.y) sqrDist += (player1.pos.y - nextFramePos.y) * (player1.pos.y - nextFramePos.y);
    if(nextFramePos.y > player1.pos.y + player1.height) sqrDist += (nextFramePos.y - player1.pos.y + player1.height) * (nextFramePos.y - player1.pos.y + player1.height);

    if(sqrDist < ball.radius * ball.radius) {
        console.log("player ball collision")
        let bx = nextFramePos.x;
        let by = nextFramePos.y;
        if(bx < player1.pos.x) bx = player1.pos.x; //bx = Math.max(bx, player1.pos.x);
        if(bx > player1.pos.x + player1.width) bx = player1.pos.x + player1.width; //bx = Math.min(bx, player1.pos.x + player1.width);

        if(by < player1.pos.y) by = player1.pos.y; //by = Math.max(by, player1.pos.y);
        if(by > player1.pos.y + player1.height) by = player1.pos.y + player1.height; //by = Math.min(by, player1.pos.y + player1.height);

        ctx.fillStyle = "yellow";
        ctx.fillRect(bx, by, 10, 10);

        ball.vel.x *= -ball.bounciness;
        ball.vel.y *= -ball.bounciness;

        ball.vel.x += player1.vel.x;
        ball.vel.y += player1.vel.y;

        ball.vel.x += (nextFramePos.x - bx) * deltaTime;
        ball.vel.y += (nextFramePos.y - by) * deltaTime;
    }

    ball.pos.x += ball.vel.x * deltaTime * timescale;
    ball.pos.y += ball.vel.y * deltaTime * timescale;  
}


function ProcessInput() {
    if(input.x > 0) 
        player1.vel.x += 500 * deltaTime;
    if(input.x < 0) 
        player1.vel.x += -500 * deltaTime;
    if(input.y > 0 && player1.isGrounded) {
        player1.vel.y += -25000 * deltaTime;
    }
}

function KeyDownHandler(event) {
    if(event.key.toLowerCase() == "w") {
        input.y = 1;
    }
    if(event.key.toLowerCase() == "s") {
        input.y = -1;
    }
    if(event.key.toLowerCase() == "a") {
        input.x = -1;
    }
    if(event.key.toLowerCase() == "d") {
        input.x = 1;
    }
}

function KeyUpHandler(event) {
    if(event.key.toLowerCase() == "w" && input.y == 1)
        input.y = 0
    if(event.key.toLowerCase() == "s" && input.y == -1)
        input.y = 0
    if(event.key.toLowerCase() == "a" && input.x == -1)
        input.x = 0
    if(event.key.toLowerCase() == "d" && input.x == 1)
        input.x = 0
}

function DrawCollisionBoxes() {
    for(let i=0; i<ColBoxes.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(ColBoxes[i].pos.x, ColBoxes[i].pos.y, ColBoxes[i].width, ColBoxes[i].height);
    }
}

function isPointInsideAABB(point, width, height, box) {
    return (
        point.x < box.pos.x + box.width &&
        point.x + width > box.pos.x &&
        point.y < box.pos.y + box.height &&
        height + point.y > box.pos.y
    );
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);