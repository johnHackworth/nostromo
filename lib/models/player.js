window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

( function() {
    var player = function(options) {
        pixEngine.utils.extend.call(this, boot.dataModels.Boat, true, options);
        pixEngine.utils.extend.call(this, window.boot.dataModels.User, true, options);

        for (var i in world.nations) {
            if (world.nations[i].name === 'Germany') {
                this.country = world.nations[i];
            }
        }

        this.options = options;
        this.type = options.type;
        this.init();
    };
    player.prototype = {
        init: function() {
            this.name = this.options.name;
            this.path = [];
            this.people = [];
        },
        getPathTo: function(sector, append) {
            var origin = this.sector;
            if (!append) {
                this.path = [];
            }
            if (this.path.length > 0) {
                origin = this.path[this.path.length - 1];
            }
            var path = this.world.getPathAsSectors(origin, sector);
            for (var i in path) {
                this.path.push(path[i]);
            }
        },
        addPerson: function(person) {
            this.people.push(person);
        },
        addXenomorph: function(xeno) {
            this.xeno = xeno;
        },

        die: function() {},
        getBiggestRankSailor: function() {
            var biggest = this.people[0];
            for (var i in this.people) {
                if (this.people[i].rankLevel > biggest.rankLevel) {
                    biggest = this.people[i];
                }
            }
            return biggest;
        }

    };

    window.boot.dataModels.Player = player;
} )();