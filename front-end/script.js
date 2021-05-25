import Tank from "./Tank.js";

// get the canvas and context for drawing to the screen
const canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");


// the last time stamp, used for getting the delta time between frames for updating objects
let lastTime = 0;

// mouse object for world interaction
const mouse = {
    x: null, 
    y: null
};

// make the player tank
let player1 = new Tank(100, canvas.height - 100, -45.0);

// arrays for the game
const shells = [];

// -- Event listeners
// if the window is resized change the width and height variables appropriately
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// can left click to change the angle of the tank barrel
window.addEventListener("click", function(event) {
    // update the mouse
    mouse.x = event.x;
    mouse.y = event.y;

    // get the difference in y and x for the mouse and player positions, take the atan2 of the dy and dx, then convert to degrees and floor to get a integer degree value
    player1.barrelAngle = Math.floor(Math.atan2((mouse.y - player1.position.y), (mouse.x - player1.position.x)) / Math.PI * 180);
   
});


window.addEventListener('keydown', function(event) {
    if (event.key == "a") { // press the a key to make the tank move to the left and use fuel
        player1.move("left");
    }
    else if (event.key == "d") { // press the d key to make the tank move to the right and use fuel
        player1.move("right");
    }
    else if (event.key == "ArrowLeft") { // press left arrow to make tank barrel face left
        if (player1.barrelAngle > -180) {
            player1.barrelAngle -= 1;
        }
    }
    else if (event.key == "ArrowRight") { // press right arrow to make tank barrel face right
        if (player1.barrelAngle < 0) {
            player1.barrelAngle += 1;
        }
    }
    else if (event.key == "ArrowUp") { // press arrow up to make the power increase
        if (player1.power < 100) {
            player1.power += 1;
        }
    }
    else if (event.key == "ArrowDown") { // press arrow down to make the power decrease
        if (player1.power > 0) {
            player1.power -= 1;
        }
    }
    else if (event.key == "Enter" || event.key == " ") { // press enter or space bar to shoot
        // attributes for the shell that the tank will fire
        let mass = 10;
        let shellSize = 6;
    
        // make the player's tank fire a shell and put it into the array of shells
        shells.push(player1.fireShell(mass, shellSize));
    }
    console.log(`Tank angle: ${player1.barrelAngle + 90}, Tank power: ${player1.power}, Tank fuel: ${player1.fuel}`);
});
// -- End of event listeners

// only start the game loop for now
function init() {
    gameLoop();
}

function handleShells(delta) {
    for (let i = 0; i < shells.length; i++) {
        // update the shells and draw them
        shells[i].update(delta);
        shells[i].draw(ctx);

        // if the shell is off the screen to the left or right or is past the bottom of the screen, remove it from the shells array
        const shellSize = shells[i].size;
        if (shells[i].position.x - shellSize < 0 || shells[i].position.x + shellSize > canvas.width || shells[i].position.y + shellSize > canvas.height) {
            shells.splice(i, 1);
            i--;
        }
    }
}

function handlePlayer() {
    // draw player1
    player1.draw(ctx);
}

function gameLoop(timeStamp){
    // get the delta time from the last time and the current time stamp
    let delta = timeStamp - lastTime;
    lastTime = timeStamp;

    // clear the screen
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // update and draw all the shells
    handleShells(delta);

    // update and draw the player
    handlePlayer();

    // get a new frame
    requestAnimationFrame(gameLoop);
}

// start the game
init();