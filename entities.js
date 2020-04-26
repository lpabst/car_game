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
                this.reachedDestination = this.hasReachedDestination();
            }
        }

        // checks if the car is touching its destination pad even a little bit
        this.hasReachedDestination = function() {
            var carLeft = this.x;
            var carRight = this.x + this.w;
            var carTop = this.y;
            var carBottom = this.y + this.h;
            var destinationLeft = this.destination.x;
            var destinationRight = this.destination.x + this.destination.w;
            var destinationTop = this.destination.y;
            var  destinationBottom = this.destination.y + this.destination.h;

            // check if top left corner of car is touching destination
            if (carLeft >= destinationLeft && carLeft <= destinationRight && carTop >= destinationTop && carTop <= destinationBottom){
                return true;
            }

            // top right corner
            if (carRight >= destinationLeft && carRight <= destinationRight && carTop >= destinationTop && carTop <= destinationBottom){
                return true;
            }

            // bottom left corner
            if (carLeft >= destinationLeft && carLeft <= destinationRight && carBottom >= destinationTop && carBottom <= destinationBottom){
                return true;
            }

            // bottom right corner
            if (carRight >= destinationLeft && carRight <= destinationRight && carBottom >= destinationTop && carBottom <= destinationBottom){
                return true;
            }

            return false;
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
