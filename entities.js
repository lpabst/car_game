var entities = {
    Car: function(x, y, w, h, speed, color, destinationX, destinationY) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.color = color;

        // Keep track of the car's drag path
        this.startingLocation = {
            x: x,
            y: y
        }
        this.path = [ this.startingLocation ];
        this.currentPathIndex = 0;

        // figure out color for path based on color of car
        this.pathColorMap = {
            red: '#f88',
            blue: '#88f',
            green: '#8f8',
        }
        this.pathColor = this.pathColorMap[this.color];
        
        // create destination for car
        this.destination = new entities.Destination(destinationX, destinationY, this.w + 10, this.h + 10, this.color);

        // location update function moves car along its path
        this.finishedMovingAlongPath = false;
        this.reachedDestination = false;
        this.update = function() {
            if (this.currentPathIndex < this.path.length - 1) {
                this.currentPathIndex++;
                var newLocation = this.path[this.currentPathIndex];
                this.x = newLocation.x;
                this.y = newLocation.y;
            }else{
                this.finishedMovingAlongPath = true;
                this.reachedDestination = objectsAreTouching(this, this.destination);
            }
        }
    },

    Destination: function(x, y, w, h, carColor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // figure out destination color based on car color
        this.destinationColorForCarColor = {
            red: '#f88',
            blue: '#88f',
            green: '#8f8',
        }
        this.color = this.destinationColorForCarColor[carColor];
    }
}
