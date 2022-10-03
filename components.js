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

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        if(this.x == 0 && this.y == 0)
            return new Vector2(0,0);
        let mag = this.magnitude();
        let x = this.x/mag;
        let y = this.y/mag;
        return new Vector2(x, y);
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