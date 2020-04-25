var Game = {
    init: function() {
        // get canvas and make sure height/width attributes match what we set in CSS
        var canvas = document.getElementById('canvas');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        // init data
        var context = canvas.getContext('2d');
        var animationFrame = 0;
        var gameOver = false;
        var gameRunning = true;
        var level = 1;
        var car = new entities.Car(100, 100, 2, 'red');
        var mouseIsDown = false;
        var data = { canvas, context, animationFrame, gameOver, gameRunning, level, car, mouseIsDown };

        // Add event listeners
        Game.handleMouseDownListener = function(event) {
            return Game.mouseDownListener(event, data);
        }
        Game.handleMouseUpListener = function(event) {
            return Game.mouseUpListener(event, data);
        }
        Game.handleMouseMoveListener = function(event) {
            return Game.mouseMoveListener(event, data);
        }
        window.addEventListener('mousedown', Game.handleMouseDownListener);
        window.addEventListener('mousemove', Game.handleMouseMoveListener);
        window.addEventListener('mouseup', Game.handleMouseUpListener);

        // start game loop
        Game.run(data);
    },

    run: function(data)  {
        function loop() {
            if (data.gameOver) {
                Game.gameOver(data);
            } else {
                if (data.gameRunning){
                    Game.update(data);
                    Game.render(data);
                    data.animationFrame++;
                }

                window.requestAnimationFrame(loop);
            }
        }

        loop();
    },

    update: function(data) {
        var car = data.car;    
        
        // car.x += car.speed;
        // car.y += car.speed;
    },

    render: function(data)  {
        var canvas = data.canvas;
        var context = data.context;
        var level = data.level;
        var car = data.car;

        // display level
        document.getElementById('level').innerText = 'Level: ' + level;

        // black background for canvas
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // draw car
        context.fillStyle = car.color;
        context.fillRect(car.x, car.y, 20, 20);
    },
    
    gameOver: function(data) {
        var context = data.context;

        Game.render(data);

        // game over text
        context.fillStyle = 'white';
        context.font = '42px Arial';
        context.fillText('Game Over', 200, 300);

        // remove event listeners
        window.removeEventListener('mousedown', Game.handleMouseDownListener);
        window.removeEventListener('mousemove', Game.handleMouseMoveListener);
        window.removeEventListener('mouseup', Game.handleMouseUpListener);
    },

    mouseDownListener: function(e, data) {
        console.log('mouse down');
        data.mouseIsDown = true;
    },

    mouseMoveListener: function(e, data) {
        if (!data.mouseIsDown) return;
        console.log('mouse move');
    },

    mouseUpListener: function(e, data) {
        console.log('mouse up');
        data.mouseIsDown = false;
    }
}

Game.init();