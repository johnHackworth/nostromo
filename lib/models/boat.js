window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

( function() {
    var boat = function(options) {
        options = options || {};
        this.options = options;
        this.speed = options.speed || 1;
        this.type = options.type;
        this.isWarVehicle = options.isWarVehicle;
        this.world = options.world;
        this.country = options.country;
        this.init();
    };
    boat.prototype = {
        lastKnowPosition: -10,
        speed: 1, // 1 represents "1 per turn".  0.80, for example, represent "80% of chances of moving 1 per turn"
        init: function() {
            this.path = [];
            this.name = this.options.name;
        },
        removeCurrentSector: function() {
            this.sector = null;
        },
        think: function() {
            return this.chooseDestination();
        },
        getVisibility: function() {
            return this.world.time.getVisibility(this.sector);
        },
        chooseRandomDestination: function() {
            if (Math.randInt() > 60) {
                var xVar = 1 - Math.randInt(3);
                var yVar = 1 - Math.randInt(3);
                var destX = this.sector.x + xVar;
                var destY = this.sector.y + yVar;
                if (this.world.sectors[destX] &&
                    this.world.sectors[destX][destY] &&
                    this.world.sectors[destX][destY].type === 'sea' &&
                    xVar &&
                yVar
                ) {
                    this.path.push(this.world.sectors[destX][destY]);
                }
            }
            this.chooseDestination();
        },
        chooseDestination: function() {
            if (!this.destination && this.path.length > 0) {
            // this.destination = this.path.shift();
            } else {
                if (this.sector === this.finalDestination.sector) {
                    this.arrivedToDestination();
                }
            }
        },
        arrivedToDestination: function() {
            this.arrived = true;
            this.sector.addShipToRemoved(this);
        },
        destroy: function() {
            this.destroyed = true;
        }
    };

    window.boot.dataModels.Boat = boat;
} )();