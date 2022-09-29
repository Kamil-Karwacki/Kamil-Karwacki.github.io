class Player {
    constructor(x, y, width, height) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.width = width;
        this.height = height;
        this.xDrag = 1;
        this.yDrag = 3.5;
        this.col = "red";
        this.isGrounded = false;
    }
}

var ColBoxes = [];

function CreateCollisionBox(x, y, width, height) {
    var tempCol = {
        'pos': new Vector2(x, y),
        'width' : width,
        'height' : height
    };
    console.log(tempCol)
    ColBoxes.push(tempCol);
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Ball {
    constructor(x, y, radius, bounciness) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.radius = radius;
        this.xDrag = 0.5;
        this.yDrag = 0.5;
        this.bounciness = bounciness;
        this.col = "blue";
    }
}