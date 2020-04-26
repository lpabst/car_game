var Game = {
    init: function() {
        // get canvas and make sure height/width attributes match what we set in CSS
        var canvas = document.getElementById('canvas');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        // init data
        var data = {
            canvas: canvas,
            context: canvas.getContext('2d'),
            animationFrame: 0,
            gameOver: false,
            gameRunning: true
        }

        // get data ready for the start of level 1
        Game.initLevel(data, 2);

        // Add event listeners
        Game.addEventListeners(data);

        // start game loop
        Game.run(data);
    },

    initLevel: function(data, level) {
        data.level = level;
        data.mouseIsDown = false;
        data.selectedCar = null;
        data.moveCars = false;
    
        var carsForLevel = {
            1: [
                new entities.Car(100, 100, 20, 20, 1, 'red', 500, 500)
            ],
            2: [
                new entities.Car(100, 100, 20, 20, 1, 'red', 500, 500),
                new entities.Car(500, 100, 20, 20, 1, 'blue', 100, 500)
            ]
        }
    
        data.cars = carsForLevel[level];
    },

    addEventListeners: function(data) {
        Game.handleMouseDownListener = function(event) {
            return Game.mouseDownListener(event, data);
        }
        Game.handleMouseUpListener = function(event) {
            return Game.mouseUpListener(event, data);
        }
        Game.handleMouseMoveListener = function(event) {
            return Game.mouseMoveListener(event, data);
        }
        Game.handleKeyPress = function(event) {
            return Game.keypressListener(event, data);
        }
        window.addEventListener('mousedown', Game.handleMouseDownListener);
        window.addEventListener('mousemove', Game.handleMouseMoveListener);
        window.addEventListener('mouseup', Game.handleMouseUpListener);
        window.addEventListener('keypress', Game.handleKeyPress);
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
        var cars = data.cars;    
        
        // if cars should be moving, move them
        if (data.moveCars) {
            cars.forEach(car => car.update())
        }
    },

    render: function(data)  {
        var canvas = data.canvas;
        var context = data.context;
        var level = data.level;
        var cars = data.cars;

        // display the level
        document.getElementById('level').innerText = 'Level: ' + level;

        // black background for canvas
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        cars.forEach(car => {
            // draw car's destination
            context.fillStyle = car.destinationColor;
            context.fillRect(car.destinationX - 5, car.destinationY - 5, car.w + 10, car.h + 10);
    
            // draw car's path
            context.fillStyle = car.pathColor;
            car.path.forEach(location => {
                context.fillRect(location.x, location.y, car.w, car.h);
            })
    
            // draw car
            context.fillStyle = car.color;
            context.fillRect(car.x, car.y, car.w, car.h);
        })
    },
    
    gameOver: function(data) {
        var context = data.context;

        Game.render(data);

        // game over text
        context.fillStyle = 'white';
        context.font = '42px Arial';
        context.fillText('Game Over', 200, 300);

        // remove event listeners
        Game.removeEventListeners();
    },

    removeEventListeners: function() {
        window.removeEventListener('mousedown', Game.handleMouseDownListener);
        window.removeEventListener('mousemove', Game.handleMouseMoveListener);
        window.removeEventListener('mouseup', Game.handleMouseUpListener);
        window.removeEventListener('keypress', Game.handleKeyPress);
    },

    mouseDownListener: function(e, data) {
        var canvas = data.canvas;
        var cars = data.cars;
        
        // get mouse position
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        // see if mouse is clicing on a car
        cars.forEach(car => {
            if (mouseX >= car.x && mouseX <= car.x + car.w && mouseY >= car.y && mouseY <= car.y + car.h) {
                data.selectedCar = {
                    car: car,
                    offsetX: mouseX - car.x,
                    offsetY: mouseY - car.y
                }
            }            
        })
    },

    mouseMoveListener: function(e, data) {
        // if we are in the 'moveCars' phase, do nothing
        if (data.moveCars) return;

        // if no car is being grabbed, do nothing
        if (!data.selectedCar) return;
        
        var selectedCar = data.selectedCar;

        // get mouse coordinates to track for car's path
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        var newLocation = {
            x: mouseX - selectedCar.offsetX,
            y: mouseY - selectedCar.offsetY
        }

        // we don't want the car to return to the same place it has already been
        // if new location is within 3px of any old locations, it isn't a valid new spot to drive to
        var addToPathArray = true;
        selectedCar.car.path.forEach(location => {
            var xDistance = location.x - newLocation.x;
            var yDistance = location.y - newLocation.y;
            if(xDistance > -3 && xDistance < 3) addToPathArray = false;
            if(yDistance > -3 && yDistance < 3) addToPathArray = false;
        })
        
        // if the new location isn't too close to any old locations, add it to the path array
        if (addToPathArray) {
            selectedCar.car.path.push(newLocation)
        }
    },

    mouseUpListener: function(e, data) {
        // if we are in the 'moveCars' phase, do nothing
        if (data.moveCars) return;

        data.selectedCar = null;
    },

    keypressListener: function(e, data) {
        // if we are in the 'moveCars' phase, do nothing
        if (data.moveCars) return;

        if (e.code === 'Space'){
            data.moveCars = !data.moveCars;
        }
    }
}

Game.init();