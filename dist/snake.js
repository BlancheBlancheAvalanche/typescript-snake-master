"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
function randomInt(upperRange, lowerRange) {
    return Math.floor(Math.random() * (upperRange - lowerRange + 1)) + lowerRange;
}
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.tail = null;
    }
    moveToPoint(p) {
        if (this.tail != null) {
            this.tail.moveToPoint(this);
        }
        this.x = p.x;
        this.y = p.y;
    }
}
class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.width = 400;
        this.canvas.height = 400; // Changed to 400x400 for better gameplay
        this.context = this.canvas.getContext("2d");
        this.snakeHead = null;
        this.food = null;
        this.direction = Direction.Right;
        this.tileSize = 10;
    }
    start() {
        this.restart();
        setInterval(() => this.loop(), 70);
    }
    restart() {
        this.snakeHead = new Point(20, 20); // Adjusted for 400x400 grid
        this.snakeHead.tail = new Point(10, 20);
        this.snakeHead.tail.tail = new Point(0, 20);
        this.direction = Direction.Right;
        this.placeFood();
    }
    loop() {
        this.move();
        if (this.gameOver()) {
            this.restart();
        }
        this.draw();
    }
    snakeOutsideBounds() {
        if (!this.snakeHead)
            return true;
        return (this.snakeHead.x < 0 ||
            this.snakeHead.y < 0 ||
            this.snakeHead.x + this.snakeHead.width > this.canvas.width ||
            this.snakeHead.y + this.snakeHead.height > this.canvas.height);
    }
    snakeTouchingItself() {
        if (!this.snakeHead)
            return false;
        var p = this.snakeHead.tail;
        while (p != null) {
            if (p.x == this.snakeHead.x &&
                p.y == this.snakeHead.y)
                return true;
            p = p.tail;
        }
        return false;
    }
    gameOver() {
        return this.snakeOutsideBounds() || this.snakeTouchingItself();
    }
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#000000";
        var p = this.snakeHead;
        while (p != null) {
            this.context.fillRect(p.x, p.y, p.width - 1, p.height - 1);
            p = p.tail;
        }
        if (this.food) {
            this.context.fillStyle = "#ff0000"; // Make food red for visibility
            this.context.fillRect(this.food.x, this.food.y, this.food.width - 1, this.food.height - 1);
        }
        // Reset fill style
        this.context.fillStyle = "#000000";
    }
    move() {
        if (!this.snakeHead || !this.food)
            return;
        var xNew = this.snakeHead.x;
        var yNew = this.snakeHead.y;
        switch (this.direction) {
            case Direction.Left:
                xNew -= this.tileSize;
                break;
            case Direction.Right:
                xNew += this.tileSize;
                break;
            case Direction.Up:
                yNew -= this.tileSize;
                break;
            case Direction.Down:
                yNew += this.tileSize;
                break;
            default:
                break;
        }
        if (xNew == this.food.x &&
            yNew == this.food.y) {
            this.eat();
        }
        else {
            if (this.snakeHead.tail) {
                this.snakeHead.tail.moveToPoint(this.snakeHead);
            }
            this.snakeHead.x = xNew;
            this.snakeHead.y = yNew;
        }
    }
    moveLeft() {
        if (this.direction != Direction.Right)
            this.direction = Direction.Left;
    }
    moveRight() {
        if (this.direction != Direction.Left)
            this.direction = Direction.Right;
    }
    moveUp() {
        if (this.direction != Direction.Down)
            this.direction = Direction.Up;
    }
    moveDown() {
        if (this.direction != Direction.Up)
            this.direction = Direction.Down;
    }
    eat() {
        if (!this.food || !this.snakeHead)
            return;
        const newHead = new Point(this.food.x, this.food.y);
        newHead.tail = this.snakeHead;
        this.snakeHead = newHead;
        this.placeFood();
    }
    placeFood() {
        if (!this.snakeHead)
            return;
        const tilesX = this.canvas.width / this.tileSize;
        const tilesY = this.canvas.height / this.tileSize;
        const noOfTiles = tilesX * tilesY;
        var a = new Array(noOfTiles);
        for (var i = 0; i < noOfTiles; i++) {
            var x = (i % tilesX) * this.tileSize;
            var y = (Math.floor(i / tilesX)) * this.tileSize;
            a[i] = new Point(x, y);
        }
        var snakeParts = new Array();
        var p = this.snakeHead;
        while (p != null) {
            snakeParts.push(p);
            p = p.tail;
        }
        var validPoints = new Array();
        for (var i = 0; i < a.length; i++) {
            if (!this.pointInArray(a[i], snakeParts))
                validPoints.push(a[i]);
        }
        if (validPoints.length > 0) {
            var newPointIndex = randomInt(validPoints.length - 1, 0);
            this.food = validPoints[newPointIndex];
        }
    }
    pointInArray(p, pointArray) {
        for (var i = 0; i < pointArray.length; i++) {
            var pointAtIndex = pointArray[i];
            if (pointAtIndex.x == p.x && pointAtIndex.y == p.y)
                return true;
        }
        return false;
    }
}
function keyboardListener(e) {
    const key = e.key.toLowerCase();
    if (key == 'a') {
        game.moveLeft();
    }
    else if (key == 'd') {
        game.moveRight();
    }
    else if (key == 'w') {
        game.moveUp();
    }
    else if (key == 's') {
        game.moveDown();
    }
}
var game;
window.onload = () => {
    document.onkeydown = keyboardListener;
    var el = document.getElementById('game-canvas');
    game = new SnakeGame(el);
    game.start();
};
