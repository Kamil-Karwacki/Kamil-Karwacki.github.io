let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let drag = 0.01;
let gravity = 800;
let deltaTime = 0;
let lastFrame = Date.now();
let timescale = 1;
let tps = 80;

player1 = new Rigidbody(100, 600, 30, 30);
player2 = new Rigidbody(200, 600, 30, 30);
let ball = new SphereRb(100, 450, 15);

document.addEventListener('keydown', KeyDownHandler, false);
document.addEventListener('keyup', KeyUpHandler, false);
let input = {
    'x' : 0,
    'y' : 0
}


Start();
setInterval(Update, 1000/tps);



function Start() {
    let bottom = new CollisionBox(0, 700, 2000, 10);

    let topL = new CollisionBox(20, 600, 35, 10);
    let left = new CollisionBox(35, 620, 10, 100);

    let topR = new CollisionBox(420, 600, 35, 10);
    let right = new CollisionBox(435, 620, 10, 100);
    ball.vel.x += 20;
    console.log(-Math.abs(0.8)+1);
    console.log(-Math.abs(1)+1);

    for(let i=0; i<ColBoxes.length; i++) {
        console.log(ColBoxes[i]);
    }
}

function Update() {
    deltaTime = 1/tps;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    DrawCollisionBoxes();
    
    ctx.fillStyle = player1.col;
    ctx.fillRect(player1.pos.x, player1.pos.y, player1.width, player1.height);

    ctx.fillStyle = ball.col;
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();


    
    UpdateRigidbody(player1);
    UpdateSphereRb(ball);

    // update each elements position
    player1.pos.x += player1.vel.x * deltaTime * timescale;
    player1.pos.y += player1.vel.y * deltaTime * timescale; 

    ball.pos.x += ball.vel.x * deltaTime * timescale;
    ball.pos.y += ball.vel.y * deltaTime * timescale; 

}

function UpdateRigidbody(rb) {
    rb.vel.y += gravity * deltaTime;
    
    rb.vel.y += -drag * rb.xDrag * rb.vel.y * Math.abs(rb.vel.y) * deltaTime;
    rb.vel.x += -drag * rb.yDrag * rb.vel.x * Math.abs(rb.vel.x) * deltaTime;
    
    rb.vel.x += -(0.8 * rb.vel.x) * deltaTime; // friction
    
    ProcessInput()
    let hasCollided = false;
    let nextFramePos = new Vector2(rb.pos.x + rb.vel.x * deltaTime * timescale, rb.pos.y + rb.vel.y * deltaTime * timescale);
    for(let i=0; i<ColBoxes.length; i++) {
        if(isPointInsideAABB(nextFramePos, rb.width, rb.height, ColBoxes[i])) { // collision detection
            hasCollided = true;

            let topFace = isPointInsideAABB(new Vector2(nextFramePos.x, nextFramePos.y), rb.width/2, 1, ColBoxes[i]);
            let rightFace = isPointInsideAABB(new Vector2(nextFramePos.x + rb.width, nextFramePos.y), 1, rb.height/2, ColBoxes[i]);
            let bottomFace = isPointInsideAABB(new Vector2(nextFramePos.x + rb.width / 4, nextFramePos.y + rb.height), rb.width/2, 2, ColBoxes[i]);
            let leftFace = isPointInsideAABB(new Vector2(nextFramePos.x, nextFramePos.y), 1, rb.height/2, ColBoxes[i]);
            ctx.fillStyle = 'purple';
            ctx.fillRect(nextFramePos.x + rb.width / 4, nextFramePos.y + rb.height, rb.width/2, 3);
            rb.isGrounded = bottomFace;

            if(topFace && !bottomFace) { // top collision
                rb.vel.y = Clamp(rb.vel.y, 0, 10000);
            } else if(!topFace && bottomFace) { // bottom collision
                rb.vel.y = Clamp(rb.vel.y, -10000, 0);
                rb.isGrounded = true;
            }
            
            if(leftFace && !rightFace) { // left collision
                rb.vel.x = Clamp(rb.vel.x, 0, 10000);
            } else if(!leftFace && rightFace) { // right collision
                rb.vel.x = Clamp(rb.vel.x, -10000, 0);
            }
        }
    }

    if(!hasCollided)
        rb.isGrounded = false;
    hasCollided = false;   
}

function UpdateSphereRb(rb) {
    rb.vel.y += gravity * deltaTime;
    
    //rb.vel.y += -drag/10 * rb.xDrag * rb.vel.y * Math.abs(rb.vel.y) * deltaTime;
    //rb.vel.x += -drag/10 * rb.yDrag * rb.vel.x * Math.abs(rb.vel.x) * deltaTime;
    
    rb.vel.x += -(0.8 * rb.vel.x) * deltaTime; // friction

    let nextFramePos = new Vector2(rb.pos.x + rb.vel.x * deltaTime * timescale, rb.pos.y + rb.vel.y * deltaTime * timescale);

    //sphere ball collision

    if(isSphereCollidingWithAABB(nextFramePos, rb.radius, player1)) {
        console.log("Sphere collision with player");
        let colPoint = new Vector2(nextFramePos.x, nextFramePos.y);

        if(colPoint.x < player1.pos.x) colPoint.x = player1.pos.x;
        if(colPoint.x > player1.pos.x + player1.width) colPoint.x = player1.pos.x + player1.width;
        
        if(colPoint.y < player1.pos.y) colPoint.y = player1.pos.y;
        if(colPoint.y > player1.pos.y + player1.height) colPoint.y = player1.pos.y + player1.height;

        let colVec = new Vector2(rb.pos.x - colPoint.x, rb.pos.y - colPoint.y);
        let normColVel = colVec.normalize();

        ctx.fillStyle = "yellow";
        ctx.fillRect(colPoint.x - 5, colPoint.y - 5, 10, 10);
        
        rb.vel.x *= -Math.abs(normColVel.x)+1;
        rb.vel.y *= -Math.abs(normColVel.y)+1;

        // Hookes law F = -kx
        // Need to find how deep into object collision has happened, deeper = more force

        // get vector to collision point
        let ToColPointVec = new Vector2(colPoint.x - rb.pos.x, colPoint.y - rb.pos.y);
        ToColPointVec = ToColPointVec.normalize();
        ToColPointVec.x *= rb.radius;
        ToColPointVec.y *= rb.radius;

        // distance from
        let dist = new Vector2((nextFramePos.x + ToColPointVec.x) - colPoint.x, (nextFramePos.y + ToColPointVec.y) - colPoint.y).magnitude();
        console.log(dist)

        ctx.fillStyle = "aqua";
        ctx.fillRect(nextFramePos.x + ToColPointVec.x - 5, nextFramePos.y + ToColPointVec.y - 5, 10, 10);

        
        rb.vel.x += 45 * dist * normColVel.x;
        rb.vel.y += 50 * dist * normColVel.y;
    }
    
    
    for(let i=0; i<ColBoxes.length; i++) {
        if(!isSphereCollidingWithAABB(nextFramePos, rb.radius, ColBoxes[i]))
        continue;
        console.log("Sphere collision with box");
        let oldVel = new Vector2(rb.vel.x, rb.vel.y);

        let colPoint = new Vector2(nextFramePos.x, nextFramePos.y);

        if(colPoint.x < ColBoxes[i].pos.x) colPoint.x = ColBoxes[i].pos.x;
        if(colPoint.x > ColBoxes[i].pos.x + ColBoxes[i].width) colPoint.x = ColBoxes[i].pos.x + ColBoxes[i].width;
        
        if(colPoint.y < ColBoxes[i].pos.y) colPoint.y = ColBoxes[i].pos.y;
        if(colPoint.y > ColBoxes[i].pos.y + ColBoxes[i].height) colPoint.y = ColBoxes[i].pos.y + ColBoxes[i].height;

        let colVec = new Vector2(nextFramePos.x - colPoint.x, nextFramePos.y - colPoint.y);
        let normColVel = colVec.normalize();

        ctx.fillStyle = "purple";
        ctx.fillRect(colPoint.x - 5, colPoint.y - 5, 10, 10);
        
        rb.vel.x *= -Math.abs(normColVel.x)+1;
        rb.vel.y *= -Math.abs(normColVel.y)+1;

        // Hookes law F = -kx
        // Need to find how deep into object collision has happened, deeper = more force

        // get vector to collision point
        let ToColPointVec = new Vector2(colPoint.x - nextFramePos.x, colPoint.y - nextFramePos.y);
        ToColPointVec = ToColPointVec.normalize();
        ToColPointVec.x *= rb.radius;
        ToColPointVec.y *= rb.radius;

        // distance from
        let dist = new Vector2((rb.pos.x + ToColPointVec.x) - colPoint.x, (rb.pos.y + ToColPointVec.y) - colPoint.y).magnitude();
        console.log(dist)

        ctx.fillStyle = "aqua";
        ctx.fillRect(rb.pos.x + ToColPointVec.x - 5, rb.pos.y + ToColPointVec.y - 5, 10, 10);

        
        rb.vel.x += 90 * dist * normColVel.x;
        rb.vel.y += 90 * dist * normColVel.y;

        // add spring from that object to push it back/ add bounciness idk maybe both

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

function isSphereCollidingWithAABB(pos, radius, box) {
    let x = Math.max(box.pos.x, Math.min(pos.x, box.pos.x + box.width));
    let y = Math.max(box.pos.y, Math.min(pos.y, box.pos.y + box.height));
    
    let distance = (x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y);

    if(distance < radius * radius) 
        return true
    return false
}

function ProcessInput() {
    if(input.x > 0) 
        player1.vel.x += 500 * deltaTime;
    if(input.x < 0) 
    player1.vel.x += -500 * deltaTime;
    if(input.y > 0 && player1.isGrounded) {
        player1.vel.y += -35000 * deltaTime;
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


const Clamp = (num, min, max) => Math.min(Math.max(num, min), max);