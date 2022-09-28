let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let drag = 0.01;
let gravity = 800;
let deltaTime = 0;
let lastFrame = Date.now();
let timescale = 1;
let tps = 50;

player1 = new Player(100, 500, 30, 30);

document.addEventListener('keydown', KeyDownHandler, false);
document.addEventListener('keyup', KeyUpHandler, false);
let input = {
    'x' : 0,
    'y' : 0
}


Start();
setInterval(Update, 1000/tps);

function Start() {
    CreateCollisionBox(0, 700, 1000, 10);
    CreateCollisionBox(0, 50, 1000, 10);
    CreateCollisionBox(0, 0, 50, 1000);
    CreateCollisionBox(400, 0, 50, 1000);


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
    UpdatePlayer(player1);
}

function UpdatePlayer(player) {
    player.vel.y += gravity * deltaTime;
    
    player.vel.y += -drag * player.xDrag * player.vel.y * Math.abs(player.vel.y) * deltaTime;
    player.vel.x += -drag * player.yDrag * player.vel.x * Math.abs(player.vel.x) * deltaTime;
    
    player.vel.x += -(0.8 * player.vel.x) * deltaTime; // friction
    
    //let nextPlayerPos = new Vector2(player.pos.x + player.vel.x * deltaTime, player.pos.y + player.vel.y * deltaTime)

    // player input
    ProcessInput()
    let hasCollided = false;
    for(let i=0; i<ColBoxes.length; i++) {
        if(isPointInsideAABB(player.pos, player.width, player.height, ColBoxes[i])) {
            hasCollided = true;
            player.col = "blue";

            let topMiddle = new Vector2((player.pos.x + player.width)/2, player.pos.y);

            let topFace = isPointInsideAABB(new Vector2(player.pos.x, player.pos.y), player.width/2, 1, ColBoxes[i]);
            let rightFace = isPointInsideAABB(new Vector2(player.pos.x + player.width, player.pos.y), 1, player.height/2, ColBoxes[i]);
            let bottomFace = isPointInsideAABB(new Vector2(player.pos.x + player.width / 4, player.pos.y + player.height), player.width/2, 2, ColBoxes[i]);
            let leftFace = isPointInsideAABB(new Vector2(player.pos.x, player.pos.y), 1, player.height/2, ColBoxes[i]);
            ctx.fillStyle = 'purple';
            ctx.fillRect(player.pos.x + player.width / 4, player.pos.y + player.height, player.width/2, 3);
            player.isGrounded = bottomFace;
            console.log("bottom " + bottomFace)
            console.log("top " + topFace)

            if(topFace && !bottomFace) { // top collision
                player.vel.y = clamp(player.vel.y, 0, 100);
            } else if(!topFace && bottomFace) { // bottom collision
                player.vel.y = clamp(player.vel.y, -100, 0);
                player.isGrounded = true;
            }
            
            if(leftFace && !rightFace) { // left collision
                player.vel.x = clamp(player.vel.x, 0, 100);
            } else if(!leftFace && rightFace) { // right collision
                player.vel.x = clamp(player.vel.x, -100, 0);
            }
        }
    }

    if(!hasCollided)
        player.isGrounded = false;
    hasCollided = false;
    player.pos.x += player.vel.x * deltaTime * timescale;
    player.pos.y += player.vel.y * deltaTime * timescale;    
    
}


function ProcessInput() {
    if(input.x > 0) 
        player1.vel.x += 500 * deltaTime;
    if(input.x < 0) 
        player1.vel.x += -500 * deltaTime;
    if(input.y > 0 && player1.isGrounded) {
        player1.vel.y += -40000 * deltaTime;
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