//draw canvas and start game when the "start game" button is clicked
document.getElementById("birdListener").addEventListener("click", main);


var gamePieces = [];
var paddle;

/*** MAIN METHOD ***/
function main() 
{
    gameArea.start();
    spawnComponents();
}
 
/************************************************   GAME AREA  ***************************************************/
//create canvas object
var gameArea = 
{
    canvas : document.createElement("canvas"),
    start : function() 
    {
        //set canvas size
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");

        //add canvas before middle container
        const div = document.getElementById("dice-container-middle");
        document.body.insertBefore(this.canvas, div);

        //style canvas
        this.canvas.style.border = `1px solid #000000`;
        this.canvas.style.background = "white";
        this.canvas.id="canvas";

        //obviously this listen for keyboard input
        document.addEventListener('keydown', (event) => 
        {
            gameArea.keyDown = event.key;
            event.preventDefault()
        }, false);

    },
    //this function clears the previous ball location
    clearBall : function() 
    {
        this.context.clearRect(20, 0, this.canvas.width, this.canvas.height);
    },

    //this function clears the previous paddle location
    clearPaddle : function() 
    {
        this.context.clearRect(0, 0, 20, this.canvas.height);
    }
}

/************************************************   BALL  ***************************************************/
//function component(width, height, color, x, y) { //this is for a sqaure
function BallComponent(radius, color, x, y) 
{ 
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.speedX = 5;
    this.speedY = 5;
    this.color = color;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    //variables for the ball's trail
    var motionTrailLength = 10;
    var positions = [];

    //this function gets called ever 20ms for each ball
    this.updateBallLocation = function()
    {
        gameArea.clearBall();           //clears previous location of ball
        gamePieces[0].makeTrail();      //makes ball's trail
        gamePieces[0].setPosition();    //sets new position of ball
        gamePieces[0].hitEdge();        //check to see if ball hit canvas side
        gamePieces[0].drawGamePiece();  //draws new ball
        storeLastPosition(gamePieces[0].x, gamePieces[0].y); //stores last poition of the ball in array for ball's trail
    }

    //makes ball's trail
    this.makeTrail = function()
    {
        //for every "ball location" in array, print it out with a faded color
        for (var i = 0; i < positions.length; i++) 
        {
            var ratio = (i + 1) / positions.length;
            ctx.beginPath();
            ctx.arc(positions[i].x, positions[i].y, radius, 0, 2 * Math.PI); //x,y,radius,startAngle,endAngle
            ctx.fillStyle = "rgba(204, 102, 153, " + ratio / 2 + ")";
            ctx.fill();
        }
    }

    //sets new position of ball
    this.setPosition = function()
    {
        gamePieces[0].x += this.speedX;
        gamePieces[0].y += this.speedY;
    }

    //check to see if ball hit canvas side
    this.hitEdge = function()
    {
        //check for bottom of canvas
        var bottom = gameArea.canvas.height - (this.radius); 
        if(this.y > bottom)         
            this.speedY *= -1;
        //check for top of canvas
        var top = (this.radius);                             
        if(this.y < top)
            this.speedY *= -1;
        //check for right of canvas
        var right = gameArea.canvas.width - (this.radius);                             
            if(this.x > right)
                this.speedX *= -1;
        //check for left of canvas
        var left = (this.radius);                             
            if(this.x < left)
                alert("you lose");
    }

    //method to draw ball in new location
    this.drawGamePiece = function()
    {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius,0,2*Math.PI); //x,y,radius,startAngle,endAngle
        ctx.fill();
    }  
    
    //stores last poition of the ball in array for ball's trail
    function storeLastPosition(xPos, yPos) 
    {
        //push an item
        positions.push(
            {
                x: xPos,
                y: yPos
            });
    
        //get rid of first item
        if (positions.length > motionTrailLength)
        {
            positions.shift();
        }
    }
}


/************************************************   PADDLE  ***************************************************/
function PaddleComponent(width, height, color) 
{ 
    this.height = height;
    this.width = width;
    this.x = 5;
    this.y = gameArea.canvas.height / 2 - this.height / 2; //so paddle spawn centered
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    //this function gets called ever 20ms
    this.updatePaddleLocation = function()
    {
        gameArea.clearPaddle();             //clears previous location of paddle
        paddle.hitPaddle(gamePieces[0]);    //checks if the ball hit the paddle
        paddle.setPaddlePosition();         //sets new position of paddle
        paddle.drawPaddle();                //draws new paddle  
    }

    //checks if the ball hit the paddle, if so it redirects it at calculated angle
    this.hitPaddle = function(ball)
    {
        //paddle variables
        var paddleHitX = this.x + (this.width);
        var paddleTop = this.y;
        var paddleBottom = this.y + (this.height);
        //ball variables
        var ballHitX = ball.x;
        var ballHitY = ball.y + (ball.radius);

        //if hitPaddle, then redirect ball with higher angle furthure from paddle middle
        if(paddleHitX == ballHitX  && (ballHitY > paddleTop - 15 && ballHitY < paddleBottom + 15)) 
        {
            ball.speedX *= -1;
            var relativeYIntersect = (paddle.y + (paddle.height/2)) - ballHitY;
            ball.speedY = relativeYIntersect / 3 * -1;
        }
    }

    //sets new position of paddle based on keyboard input
    this.setPaddlePosition = function()
    {
            if(gameArea.keyDown === "ArrowUp")
            {
                var top = 0                               
                if(this.y > top)
                    this.y -= 20; 
                gameArea.keyDown=null;
            }
            if(gameArea.keyDown === "ArrowDown")
            {
                var bottom = gameArea.canvas.height
                if(this.y < gameArea.canvas.height - paddle.height)  
                    this.y += 20;       
                gameArea.keyDown=null;
            }
    }

    //draws new paddle
    this.drawPaddle = function()
    {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

/************************************************   SPAWNING  ***************************************************/
//This function is where all the balls will be spawned
function spawnComponents()
{
    //This code will clear all intervals so that each time the "Start Game" button is pressed the balls sppeed doesn't exponentially grow
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < 200; i++) 
    {
        window.clearInterval(i);
    }

    //creates new ball(s) 
    gamePieces[0] = new BallComponent(5, "black", 50, 50); 
    gamePieces[0].interval = setInterval(gamePieces[0].updateBallLocation, 20); 

    //creates paddle
    paddle = new PaddleComponent(15, 75, "#66BFBF");
    paddle.interval = setInterval(paddle.updatePaddleLocation, 20);
}
