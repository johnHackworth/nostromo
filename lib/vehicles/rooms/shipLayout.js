window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var shipLayout = function(options) {
        pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
        this.boat = options.boat;
        this.init(options.layout);
    };
    shipLayout.prototype = {
        roomTypes: {
            'empty': window.boot.models.Room,
            'stairs': window.boot.models.StairsRoom
        },
        rooms: [],
        maxWidth: 10,
        maxHeight: 10,
        assets: {},
        init: function(layout) {
            this.rooms = [];
            window.ship = this;
            this.layoutMap = layout;
            this.initLayout();
            this.createRooms();
            this.initPaths();
        },
        initLayout: function() {
            for (var i = 0; i < this.maxHeight; i++) {
                this.rooms[i] = [];
                for (var j = 0; j < this.maxWidth; j++) {
                    this.rooms[i][j] = null;
                }
            }
        },

        hasSameLevelPath: function(origin, target) {
            var order1 = origin.order;
            var order2 = target.order;
            var path = true;
            if (order1 > order2) {
                while (order1 > order2) {
                    if (!this.rooms[origin.level][order1]) {
                        path = false;
                    }
                    order1--;
                }
            }
            if (order1 < order2) {
                while (order1 < order2) {
                    if (!this.rooms[origin.level][order1]) {
                        path = false;
                    }
                    order1++;
                }
            }
            return path;
        },

        getLevelStairs: function(originalRoom, direction) {
            var stairs;
            this.rooms[originalRoom.level].forEach(function(room) {
                if (room && room.hasStairs) {
                    if (this.rooms[room.level + direction] &&
                        this.rooms[room.level + direction][room.order] &&
                        this.rooms[room.level + direction][room.order].hasStairs &&
                        this.hasSameLevelPath(originalRoom, this.rooms[room.level + direction][room.order])) {
                        stairs = room;
                    }
                }
            }.bind(this))
            return stairs;
        },

        getNextStep: function(currentRoom, destinationRoom) {
            if (currentRoom.level < destinationRoom.level) {
                var stairsDown = this.getLevelStairs(currentRoom, 1);

                if (stairsDown != currentRoom) {
                    return this.getNextStep(currentRoom, stairsDown);
                }
                return this.rooms[currentRoom.level + 1][currentRoom.order];
            }

            if (currentRoom.level > destinationRoom.level) {
                var stairsUp = this.getLevelStairs(currentRoom, -1);

                if (stairsUp != currentRoom) {
                    return this.getNextStep(currentRoom, stairsUp);
                }
                return this.rooms[currentRoom.level - 1][currentRoom.order];
            }

            if (currentRoom.order < destinationRoom.order &&
                this.hasSameLevelPath(currentRoom, destinationRoom)) {
                return this.rooms[currentRoom.level][currentRoom.order + 1];
            }

            if (currentRoom.order > destinationRoom.order &&
                this.hasSameLevelPath(currentRoom, destinationRoom)) {
                return this.rooms[currentRoom.level][currentRoom.order - 1];
            }

            return;
        },

        createRooms: function() {
            // [{rooms: [ {type: 'motors', 'doors': ['left', 'right', 'up'], open: true}], }, {rooms: {}} ...]
            for (var i = 0, l = this.layoutMap.length; i < l; i++) {
                for (var n = 0, ll = this.layoutMap[i].rooms.length; n < ll; n++) {
                    if (this.layoutMap[i].rooms[n]) {
                        var roomData = this.layoutMap[i].rooms[n];
                        this.rooms[i][n] = new this.roomTypes[roomData.type]({
                            params: roomData,
                            layout: this,
                            boat: this.boat,
                            level: i,
                            order: n
                        });
                        if (roomData.type === 'control') {
                            this.boat.controlRoom = this.rooms[i][n];
                        }
                        if (roomData.type === 'comms') {
                            this.boat.commsRoom = this.rooms[i][n];
                        }
                        if (roomData.type === 'engine') {
                            this.boat.engineRoom = this.rooms[i][n];
                        }
                        if (roomData.type === 'deckGun') {
                            this.boat.deckGunRoom = this.rooms[i][n];
                        }
                        if (roomData.type === 'deck') {
                            this.boat.deckRooms = this.boat.deckRooms || [];
                            this.boat.deckRooms.push(this.rooms[i][n]);
                        }
                        this.rooms[i][n].viewX = 10 + this.boat.leftRoom + n * (this.roomWidth + 5);
                        this.rooms[i][n].viewY = 300 + this.boat.topRoom + i * (this.roomHeight + 5);
                    }
                }
            }
        },
        getNearestRoom: function(position) {
            var nearestRoom = null;
            var minDistance = 100000000;
            this.rooms.forEach(function(row) {
                row.forEach(function(room) {
                    if (room) {
                        var distance = Math.sqrt(Math.pow(room.viewX - position.x, 2) + Math.pow(room.viewY - position.y, 2));
                        if (distance < minDistance) {
                            nearestRoom = room;
                            minDistance = distance;
                        }
                    }
                });
            });
            return nearestRoom;
        },
        getStairsWell: function(level) {
            for (var l = this.rooms[level].length; l; l--) {
                if (this.rooms[level][l - 1] && this.rooms[level][l - 1].hasStairs) {
                    return this.rooms[level][l - 1];
                }
            }
        },
        getPath: function(origin, target, path) {
            if (!path) {
                path = [origin];
            }

            return this.getPrecalculatedPath(origin, target, path);
        },
        getPrecalculatedPath: function(origin, target, path) {
            var originCode = origin.level + '_' + origin.order;
            var targetCode = target.level + '_' + target.order;
            var encodedPath = this.precalculatedPaths[originCode][targetCode];
            encodedPath = encodedPath || [];
            for (var i = 0, l = encodedPath.length; i < l; i++) {
                var y = encodedPath[i].split('_')[0];
                var x = encodedPath[i].split('_')[1];
                path.push(this.rooms[y][x]);
            }
            return path;
        },
        getSameLevelPath: function(origin, target, path) {
            if (origin == target) {
                return path;
            }
            if (origin.order < target.order) {
                for (var i = origin.order + 1; i <= target.order; i++) {
                    path.push(this.rooms[origin.level][i]);
                }
            } else {
                for (var j = origin.order - 1; j >= target.order; j--) {
                    path.push(this.rooms[origin.level][j]);
                }
            }
            return path;
        },
        initPaths: function() {
            var i;
            var j;
            var k;
            var m = 0;
            var stairs0 = 3;
            var stairs1 = 3;
            this.precalculatedPaths = {};
            for (i = 0; i <= 10; i++) {
                for (j = 0; j <= 10; j++) {
                    for (k = 0; k <= 10; k++) {
                        if (i != j) {
                            this.precalculatedPaths[k + '_' + i] = this.precalculatedPaths[k + '_' + i] || {};
                            this.precalculatedPaths[k + '_' + i][k + '_' + j] = this.getInterPath(i, j, k);
                        }
                    }
                }
            }
            for (i = 0; i <= 10; i++) {
                for (j = 0; j <= 10; j++) {
                    for (k = 0; k <= 10; k++) {
                        for (m = 0; m <= 10; m++) {
                            if (k != m) {
                                this.precalculatedPaths[k + '_' + i] = this.precalculatedPaths[k + '_' + i] || {};

                                var arr1 = this.getInterPath(i, this.getStairPosition(i, k), k);
                                var arr2 = this.getInterPath(this.getStairPosition(i, k), j, m);
                                this.precalculatedPaths[k + '_' + i][m + '_' + j] = arr1.concat(arr2);
                            }
                        }
                    }

                }
            }

        },
        getStairPosition: function(xPos, level) {
            return 3;
        },
        getInterPath: function(x, y, level) {
            var pre = level + '_';
            var path = [];
            if (x > y) {
                while (x >= y) {
                    path.push(pre + x);
                    x--;
                }
            } else {

                while (x <= y) {
                    path.push(pre + x);
                    x++;
                }
            }
            return path;
        },
        getDifferentLevelPath: function(origin, target, path) {
            var stairsOriginLevel = this.getStairsWell(origin.level);
            path = this.getPath(origin, stairsOriginLevel, path);
            var stairsTargetLevel = this.getStairsWell(target.level);
            path.push(stairsTargetLevel);
            path.push(stairsTargetLevel);
            path = this.getPath(stairsTargetLevel, target, path);
            return path;
        }
    };

    window.boot.models.ShipLayout = shipLayout;
} )();