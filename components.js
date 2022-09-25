class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vX = 0;
        this.vY = 0;
        this.topCollision = false;
        this.rightCollision = false;
        this.bottomCollision = false;
        this.leftCollision = false;
        this.xDrag = 1;
        this.yDrag = 3.5;
    }
}

var ColBoxes = [];

function CreateCollisionBox(x, y, width, height) {
    var tempCol = {
        'x' : x,
        'y' : y,
        'width' : width,
        'height' : height
    };
    console.log(tempCol)
    ColBoxes.push(tempCol);
}