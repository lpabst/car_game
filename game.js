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
        Game.nameEventHandlers(data);
        Game.addEventListeners(data);

        // start game loop
        Game.run(data);
    },

    initLevel: function(data, level) {
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
            ],
            3: [
                new entities.Car(40, 300, 40, 40, 1, 'green', 450, 300),
                new entities.Car(80, 40, 20, 20, 1, 'blue', 80, 450),
                new entities.Car(400, 40, 20, 20, 1, 'red', 400, 450)
            ]
        }
        
        data.cars = carsForLevel[level];
        data.level = level;

        // if an unknown level is entered, default to level 1
        if (!data.cars) {
            data.cars = carsForLevel[1];
            data.level = 1;
        }
    },

    // Declare named event listener handlers inside of here so they have access to the data object
    nameEventHandlers: function(data) {
        // handlers to grab and move a car
        Game.handleMouseDownListener = function(event) {
            Game.mouseDownListener(event, data);
        }
        Game.handleMouseUpListener = function(event) {
            Game.mouseUpListener(event, data);
        }
        Game.handleMouseMoveListener = function(event) {
            Game.mouseMoveListener(event, data);
        }
        
        // handlers to start moving cars and reset level
        Game.handleMoveCars = function() {
            var carsHavePaths = false;
            data.cars.forEach(function(car){
                if (car.path && car.path.length > 0) carsHavePaths = true;
            })

            // if at least one car has a path to drive on, move the cars
            if (carsHavePaths) {
                data.moveCars = true;
            }
        }
        Game.handleResetLevel = function() {
            Game.initLevel(data, data.level);
        }

        // load a new level
        Game.handleLoadNewLevel = function() {
            var newLevelInput = document.getElementById('load-level-input');
            var newLevel = newLevelInput.value;
            newLevelInput.value = null;
            Game.initLevel(data, newLevel);
        }

        // keypress handler
        Game.handleKeypress = function(e) {
            Game.keypressListener(e, data);
        }
    },

    addEventListeners: function(data) {
        // helper function creates the event listener and adds it to the data.eventListeners array so we can unbind it later
        function createEventListner(target, eventType, handler) {
            target.addEventListener(eventType, handler);
            data.eventListeners.push({
                target: target,
                eventType: eventType,
                handler: handler
            })
        }
        
        data.eventListeners = [];

        // listeners to grab and move a car
        createEventListner(data.canvas, 'mousedown', Game.handleMouseDownListener);
        createEventListner(data.canvas, 'mousemove', Game.handleMouseMoveListener);
        createEventListner(data.canvas, 'mouseup', Game.handleMouseUpListener);

        // listeners to start moving cars and reset level
        var moveCarsButton = document.getElementById('move-cars-button');
        var resetLevelButton = document.getElementById('reset-level-button');
        createEventListner(moveCarsButton, 'click', Game.handleMoveCars);
        createEventListner(resetLevelButton, 'click', Game.handleResetLevel);

        // load a new level
        var loadLevelButton = document.getElementById('load-level-button');
        createEventListner(loadLevelButton, 'click', Game.handleLoadNewLevel);

        // keypress listener
        createEventListner(window, 'keypress', Game.handleKeypress);
    }, 

    // unbinds all of the event listeners saved in the data.eventListeners list
    removeEventListeners: function() {
        data.eventListeners.forEach(function(eventListener) {
            eventListener.target.removeEventListener(eventListener.eventType, eventListener.handler);
        })
        data.eventListeners = [];
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
            cars.forEach(function(car){
                car.update()
            })
        }

        // check if all cars have reached their target destination
        var allDoneMoving = true;
        var allOnTarget = true;
        cars.forEach(function(car) {
            if (!car.finishedMovingAlongPath) allDoneMoving = false;
            if (!car.reachedDestination) allOnTarget = false;
        })
        if (allOnTarget) {
            Game.initLevel(data, data.level + 1);
        } 
        if (allDoneMoving && !allOnTarget) {
            Game.messageUser('Not all cars reached their destination. Reset the board to try again!')
        }
    },

    render: function(data)  {
        var canvas = data.canvas;
        var context = data.context;
        var level = data.level;
        var cars = data.cars;

        // display the level
        document.getElementById('level').innerText = 'Current Level: ' + level;

        // black background for canvas
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        cars.forEach(function(car){
            // draw car's destination
            context.fillStyle = car.destination.color;
            context.fillRect(car.destination.x, car.destination.y, car.destination.w, car.destination.h);
    
            // draw car's path
            context.fillStyle = car.pathColor;
            car.path.forEach(function(location) {
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

    mouseDownListener: function(e, data) {
        // if we are in the 'moveCars' phase, do nothing
        if (data.moveCars) return;

        var canvas = data.canvas;
        var cars = data.cars;
        
        // get mouse position
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        // see if mouse is clicing on a car
        cars.forEach(function(car) {
            if (mouseX >= car.x && mouseX <= car.x + car.w && mouseY >= car.y && mouseY <= car.y + car.h) {
                car.path = [ car.startingLocation ];
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
        selectedCar.car.path.forEach(function(location) {
            var xDistance = location.x - newLocation.x;
            var yDistance = location.y - newLocation.y;
            if(xDistance > -3 && xDistance < 3 && yDistance > -3 && yDistance < 3) addToPathArray = false;
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
        if (e.code === 'Space'){
            if (!data.moveCars) data.moveCars = true;
            else Game.handleResetLevel();
        }
    },

    messageUser: function(message) {
        document.getElementById('message').innerText = message;
    }
}

Game.init();