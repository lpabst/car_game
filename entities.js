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
            red: 'rgba(250, 150, 150, 0.8)',
            blue: 'rgba(150, 150, 250, 0.8)',
            green: 'rgba(150, 250, 150, 0.8)',
        }
        this.pathColor = this.pathColorMap[this.color];
        
        // create destination for car
        this.destination = new entities.Destination(destinationX, destinationY, this.color);

        // location update function moves car along its path
        this.finishedMovingAlongPath = false;
        this.reachedDestination = false;
        this.update = function() {
            // if we already reached the destination or already reached the end of the path, don't move anymore
            if (this.reachedDestination || this.finishedMovingAlongPath) return;

            // update location
            this.currentPathIndex++;
            var newLocation = this.path[this.currentPathIndex];
            this.x = newLocation.x;
            this.y = newLocation.y;

            // see if we've reached the end of the path
            if (this.currentPathIndex >= this.path.length - 1){
                this.finishedMovingAlongPath = true;
            }
            
            // see if we've reached the destination
            this.reachedDestination = objectsAreTouching(this, this.destination);
        }
    },

    Destination: function(x, y, carColor) {
        this.x = x;
        this.y = y;

        // all destinations will be a small dot
        this.w = 10;
        this.h = 10;

        // destinations should be the same color as their car
        this.color = carColor;
    }
}
