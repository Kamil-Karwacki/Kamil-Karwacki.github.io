let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let drag = 0.03;
let gravity = 800;
let deltaTime = 0;
let lastFrame = Date.now();

player1 = new Player(100, 100, 30, 30);

document.addEventListener('keydown', KeyDownHandler, false);
document.addEventListener('keyup', KeyUpHandler, false);
let input = {
    'x' : 0,
    'y' : 0
}


Start();
setInterval(Update, 20);

function Start() {
    CreateCollisionBox(0, 700, 1000, 10);
    CreateCollisionBox(0, 0, 10, 1000);
}

function Update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    UpdatePlayer(player1);
    DrawCollisionBoxes();
    deltaTime = (Date.now() - lastFrame) / 1000;
    lastFrame = Date.now();
}

function UpdatePlayer(player) {
    player.bottomCollision = false;

    player.vY += gravity * deltaTime;
    
    player.vY += -drag * player.xDrag * player.vY * Math.abs(player.vY) * deltaTime;
    player.vX += -drag * player.yDrag * player.vX * Math.abs(player.vX) * deltaTime;
    
    player.vX += -(0.8 * player.vX) * deltaTime; // friction
    
    for(let i=0; i<ColBoxes.length; i++) {
        let playerBottom = player.y + player.height;
        let playerRight = player.x + player.width;
        let boxBottom = ColBoxes[i].y + ColBoxes[i].height;
        let boxRight = ColBoxes[i].x + ColBoxes[i].width;


        //bottom collision
        if(playerBottom >= ColBoxes[i].y && playerBottom - ColBoxes[i].y <= player.height) {
            player.vY = 0;
            player.bottomCollision = true;
        }

    }
    
    ProcessInput()
    // player input
    
    player.x += player.vX * deltaTime;
    player.y += player.vY * deltaTime;    
    
}


function ProcessInput() {
    if(input.x > 0) 
        player1.vX += 500 * deltaTime;
    if(input.x < 0) 
        player1.vX += -500 * deltaTime;
    if(input.y > 0 && player1.bottomCollision) {
        player1.vY += -60000 * deltaTime;
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
    if(event.key.toLowerCase() == "w" || event.key.toLowerCase() == "s")
        input.y = 0;
    if(event.key.toLowerCase() == "a" || event.key.toLowerCase() == "d")
        input.x = 0;
}

function DrawCollisionBoxes() {
    for(let i=0; i<ColBoxes.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(ColBoxes[i].x, ColBoxes[i].y, ColBoxes[i].width, ColBoxes[i].height);
    }
}