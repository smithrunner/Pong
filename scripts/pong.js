//Hello! This is my version of the classic Pong game. I wrote this program following
// the help of an article from https://robots.thoughtbot.com . I tried to make the code
// my own but I must give credit to their tutorial for walking me through it. If you're reading This
// and end up playing the game and can actually score against this stupid computer, kudos to you. I can't
// beat this thing to save my life but my pride wont let me make the computer move slower.

/////////////////////////////////////////////////////////////////////////////////////////
////// LET"S DEFINE THE BASIC COMPONENTS ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

var tableWidth = window.innerWidth - 20;
var tableHeight = window.innerHeight - 20;
var tableCenterW = tableWidth / 2;
var tableCenterH = tableHeight / 2;
var ballRadius = tableWidth / 80;
var paddleLength = tableWidth / 8;


// A Paddle
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

// One paddle for the human
function Player() {
  this.paddle = new Paddle((tableWidth/2) - (paddleLength/2), tableHeight - 20, paddleLength, 10);
}

// One paddle for Skynet
function Computer() {
  this.paddle = new Paddle((tableWidth/2) - (paddleLength/2), 10, paddleLength, 10);
}

// One Ball to play with
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = ballRadius;
}


/////////////////////////////////////////////////////////////////////////////////////////
////// LET"S CREATE THE BASIC COMPONENTS ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

// create some players and a ball
var player = new Player();
var computer = new Computer();
var ball = new Ball(tableCenterW, tableCenterH);

// Create our "table" using a canvas
var canvas = document.createElement('canvas');
var width = tableWidth;
var height = tableHeight;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');


/////////////////////////////////////////////////////////////////////////////////////////
////// LET"S DRAW THE SCORE ON THE BOARD ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

// start the scores at 0
var computerScore = 0;
var humanScore = 0;

// displayes the score
function drawScore() {
  context.font = "50px Monospace";
  context.fillstyle = "#0095DD";
  context.fillText(humanScore, tableCenterW - ballRadius, tableHeight - (paddleLength*2));
  context.fillText(computerScore, tableCenterW - ballRadius, (paddleLength*2));
}

/////////////////////////////////////////////////////////////////////////////////////////
////// LET"S DEFINE THE RENDER AND UPDATE FUNCTIONS FOR EACH COMPONENT //////////////////
////////////////////////////////////////////////////////////////////////////////////////

var step = function() {
  update();
  render();
  animate(step);
  drawScore();
};

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

// Adds players and a ball
var render = function() {
  context.fillStyle = "#1D4F36";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

/////////////////////////////////////////////////////////////////////////////////////////
////// OUR RENDER FUNCTIONS ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

Paddle.prototype.render = function() {
  context.fillStyle = "#FFFFFF";
  context.fillRect(this.x, this.y, this.width, this.height);
};

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#8EB2A1";
  context.fill();
};

/////////////////////////////////////////////////////////////////////////////////////////
////// OUR UPDATE FUNCTIONS ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - ballRadius;
  var top_y = this.y - ballRadius;
  var bottom_x = this.x + ballRadius;
  var bottom_y = this.y + ballRadius;

  if (this.x - 5 < 0) {
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > tableWidth) {
    this.x = tableWidth - ballRadius;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0) {
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = tableCenterW;
    this.y = tableCenterH;
    humanScore++;
  } else if(this.y > tableHeight) {
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = tableCenterW;
    this.y = tableCenterH;
    computerScore++;
  }

  if(top_y > tableCenterH) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) {
      this.paddle.move(-4,0);
    } else if (value == 39) {
      this.paddle.move(4,0);
    } else {
      this.paddle.move(0,0);
    }
  }
};

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if (diff < 0 && diff < -4) {
    diff = -5;
  } else if(diff > 0 && diff > 4) {
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > tableWidth) {
    this.paddle.x = tableWidth - this.paddle.width;
  }
};


/////////////////////////////////////////////////////////////////////////////////////////
////// OUR PADDLE MOVE FUNCTIONS ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


Paddle.prototype.move = function(x,y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) {
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > tableWidth) {
    this.x = tableWidth - this.width;
    this.x_speed = 0;
  }
}


/////////////////////////////////////////////////////////////////////////////////////////
////// A LISTENER EVENT FOR WHEN THE ARROW KEYS ARE PRESSED /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

//Create an object and listeners for when the human presses the arrow keys
// to move the paddle
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});


/////////////////////////////////////////////////////////////////////////////////////////
////// LETS MAKE IT ALL HAPPEN BABY /////////////////////// /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

// Loads our canvas
window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

// I am using requestAnimationFrame to perform a callback request at 60fps
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60)} ;
