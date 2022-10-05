var ColBoxes = [];
class Rigidbody {
    constructor(x, y, width, height) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.width = width;
        this.height = height;
        this.xDrag = 1;
        this.yDrag = 3.5;
        this.col = "red";
    }
}

class SphereRb {
    constructor(x, y, radius) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.radius = radius;
        this.xDrag = 1;
        this.yDrag = 3.5;
        this.col = "blue";
    }
}

class CollisionBox {
    constructor(x, y, width, height) {
        this.pos = new Vector2(x, y);
        this.width = width;
        this.height = height;
        ColBoxes.push(this);
    }
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