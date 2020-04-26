var entities = {
    Car: function(x, y, w, h, speed, color, destinationX, destinationY) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.color = color;
        this.path = [ 
            { x: x, y: y } 
        ];
        this.currentPathIndex = 0;

        // destination location
        this.destinationX = destinationX;
        this.destinationY = destinationY;

        // colors of destination and path
        this.destinationColorMap = {
            red: '#f88',
            blue: '#88f',
            green: '#8f8',
        }
        this.pathColorMap = {
            red: '#f88',
            blue: '#88f',
            green: '#8f8',
        }
        this.destinationColor = this.destinationColorMap[this.color];
        this.pathColor = this.pathColorMap[this.color];

        // location update function moves car along its path
        this.update = function() {
            if (this.currentPathIndex < this.path.length - 1) {
                this.currentPathIndex++;
            }
            var newLocation = this.path[this.currentPathIndex];
            this.x = newLocation.x;
            this.y = newLocation.y;
        }
    },
}
