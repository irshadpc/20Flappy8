//Contains main game functionality code

var stage;
var gamePaused;
var bird;
var ground;
var pipes = new Array(4);    //There are only ever 4 pipe segments on the scene at one time, so
                            //we have 4 seperate shape objects that reappear on the other side of the
                            //screen with random sizes, rather than generating new ones every time

var birdForce;              //JEDI BIRDS!!!  Or physical force exerted on the bird.  Whatever.
var pipeSpeed = 10;              //How fast the pipes move
var KEYCODE_UP = 38;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;
var KEYCODE_P = 80;

//Page ready function
function init() {
    birdForce = 0;
    gamePaused = true;

    //create the stage and draw the inital elements
    stage = new createjs.Stage("gameCanvas");
    stage.addChild(new createjs.Shape()).graphics.s("black").r(0, 0, stage.canvas.width, stage.canvas.height);
   
    bird = new createjs.Shape();
    bird.graphics.beginFill("red").drawCircle(0, 0, 25);
    bird.x = (stage.canvas.width / 2) - 25;
    bird.y = (stage.canvas.height / 2) - 25;
    stage.addChild(bird);

    ground = new createjs.Shape();
    ground.graphics.f("green").r(1, stage.canvas.height - 74, stage.canvas.width - 2, stage.canvas.height - 1);
    stage.addChild(ground);

    //generate pipe segments at initial positions
    for (i = 0; i < pipes.length; i++) {
        pipes[i] = new createjs.Shape();
        pipes[i].graphics.f("blue").r(0, 0, 85, 200);
        stage.addChild(pipes[i]);
    }
    pipes[0].x = 480;
    pipes[0].y = 0;
    pipes[1].x = 480;
    pipes[1].y = 465;
    pipes[2].x = 805;
    pipes[2].y = 0;
    pipes[3].x = 805;
    pipes[3].y = 465;

    //NOTE: This needs to happen every time the scene changes
    stage.update();

    //Event listeners
    createjs.Ticker.on("tick", tickHandler);
    document.onkeydown = keyDownHandler;
}

//handler for every "tick" of the canvas
function tickHandler(event) {
    var birdPoint;

    if (gamePaused == false) {
        //apply physics to the bird
        birdForce += 4;
        var birdTween = createjs.Tween.get(bird).to({ x: bird.x, y: bird.y + birdForce });

        //Move the pipes
        for (i = 0; i < pipes.length; i++) {
            if (pipes[i].x >= -85) {
                var pipeTween = createjs.Tween.get(pipes[i]).to({ x: pipes[i].x - pipeSpeed, y: pipes[i].y });
            }
            else {
                pipes[i].x = 480;
            }
        }
    }

    //hitcheck the bird with the ground and obstacles
    birdPoint = bird.localToLocal(0, 0, ground);
    if (ground.hitTest(birdPoint.x, birdPoint.y)) {
        gameLose();
    }
    for (i = 0; i < pipes.length; i++) {
        birdPoint = bird.localToLocal(0, 0, pipes[i])
        if (pipes[i].hitTest(birdPoint.x, birdPoint.y)) {
            gameLose();
        }
    }

    stage.update();
}

//handler for any key pressed down
function keyDownHandler(e) {
    if (!e) { var e = window.event; }
    switch (e.keyCode) {
        case KEYCODE_DOWN:
        case KEYCODE_LEFT:
        case KEYCODE_RIGHT:
        case KEYCODE_UP:
            if (gamePaused == true) {
                gamePaused = false;
            }
            birdForce = -30;
            break;
        case KEYCODE_P:
            gamePaused = !gamePaused;
    }
}

//Fires when the game is lost by any means
function gameLose() {
    gamePaused = true;
    birdForce = 0;
    pipes[0].x = 480;
    pipes[0].y = 0;
    pipes[1].x = 480;
    pipes[1].y = 465;
    pipes[2].x = 805;
    pipes[2].y = 0;
    pipes[3].x = 805;
    pipes[3].y = 465;
    bird.x = (stage.canvas.width / 2) - 25;
    bird.y = (stage.canvas.height / 2) - 25;
    stage.update();
}