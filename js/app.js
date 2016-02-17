// Enemies our player must avoid
var Enemy = function() {

    var enemyPosY = [60, 150, 240];
    var enemySpeedMin = 100;
    var enemySpeedMax = 140;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Assign random speed initially
    this.speed =  Math.floor(Math.random() * (enemySpeedMax - enemySpeedMin + 1)) + enemySpeedMin;

    // Starting x position of Enemy must be off screen/canvas
    this.x = -95;

    // Pick a random index beteen 0 and 2
    var index = Math.floor(Math.random() * 3);

    this.y = enemyPosY[index];

};

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // My algorithm for increasing speed as score increases
    if (score.getVal() > 4){
        dt = dt * ((score.getVal() / 10) * 1.01);
    }
    this.x = this.x + (this.speed * dt);

    // Check for collision.
    // If collision detected, reset Player position and decrement health
    if (this.x > player.x - 50 && this.x < player.x + 50 &&
        this.y > player.y - 30 && this.y < player.y + 30 ){
        player.resetPos();
        health.decrement();
    }

    // Position Enemy back to beginning if he moves off screen
    if (this.x > ctx.canvas.width){
        this.x = -100;
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/********************************************************************/

// Now write your own player class
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.resetPos();
}

// On player update, re-render the player object
Player.prototype.update = function() {
    player.render();
};

Player.prototype.render = function() {
    // If player has lifes remaining, re-draw it
    if (health.life > 0){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Player.prototype.resetPos = function() {
    // Reset player back to start pos
    this.x = 305;
    this.y = 400;
};

Player.prototype.handleInput = function(inputkey) {
    // Handle key input for player
    if (this.x > 101 && inputkey === 'left'){
        this.x = this.x - 101;

    } else if (((this.x + 101)  < ctx.canvas.width) && inputkey === 'right'){
        this.x = this.x + 101;
    }

    if (inputkey === 'up'){
        if (this.y > 83 ){
            this.y = this.y - 83;
        } else {
            score.increment(1);
            this.resetPos();
        }
    } else if (((this.y + 83 ) < 483) && inputkey === 'down'){
        this.y = this.y + 83;
    }

    player.update();
};

/********************************************************************/

// Lives our player must lose when they are killed
var Health = function() {
    // The image/sprite for our lives, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Heart.png';

    // Assign initial lives to player
    this.life = 3;

};

// Render health on screen
Health.prototype.render = function() {
    var x = 0;
    for (var i = 0; i < this.life; i++) {
        ctx.drawImage(Resources.get(this.sprite), x, 588);
        x = x + 50;
    }
};

// Decrement lives
Health.prototype.decrement = function() {
    if (this.life > 0){
        this.life = this.life - 1;
    }

};

/********************************************************************/

// Gems we can collect for more points
var Gem = function() {
    // The image/sprite for our gems, this uses
    // a helper we've provided to easily load images
    var colours = ['Blue', 'Green', 'Orange'];
    var colourindex = Math.floor(Math.random() * 3);
    this.sprite = 'images/Gem ' + colours[colourindex] + '.png';

    var yvals = [85, 170, 255];
    var yindex = Math.floor(Math.random() * 3);
    this.posY = yvals[yindex];

    var xvals = [10, 111, 212, 313, 414, 515];
    var xindex = Math.floor(Math.random() * 6);
    this.posX =  xvals[xindex];

};

// Render Gems on screem
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
};

// When Player collects a Gem, increment score by 2
Gem.prototype.update = function() {
    if (this.posX > player.x - 50 && this.posX < player.x + 50 &&
        this.posY > player.y - 30 && this.posY < player.y + 30 ){
        score.increment(2);
        gem = new Gem()
    }
};

/********************************************************************/

// Represents the Score in the game
var Score = function() {
    this.val = 0;
};

// Renders the score at the top of canvas
Score.prototype.render = function() {
    ctx.fillStyle = "black";
    ctx.font = "22px Impact";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + this.val, 40, 45);
};

// Increment the score by the passes in amount to the method
Score.prototype.increment = function(incamount) {
    this.val = this.val + incamount;
};

Score.prototype.getVal = function() {
    return this.val;
};

/********************************************************************/

function restart() {
    // Nulling objects on reset
    score = null;
    player = null;
    health = null;
    gem = null;

    // Instantiating objects.
    score = new Score();
    player = new Player();
    health = new Health();
    gem = new Gem();

    // Creating enemy objects
    var a = new Enemy();
    var b = new Enemy();
    var c = new Enemy();
    var d = new Enemy();
    var e = new Enemy();

    // Placing all enemy objects in an array called allEnemies
    allEnemies = [a, b, c, d, e];

};


// Set up Score in the game
var score;

// Place the player object in a variable called player
var player;

// Set up lives
var health;

var gem;

// Array representing all enemy objects
var allEnemies = null;

// Start game for first time
restart();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});
