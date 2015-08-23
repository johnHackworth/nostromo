window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var boat = function(options) {
        pixEngine.utils.extend.call(this, window.boot.models.Vehicle, true, options);
        this.model = options.model;
        this.enemy = options.enemy;
        this.init(options);
    };
    boat.prototype = {
        counter: 0,
        AIstance: 'neutral',
        stance: 'neutral',
        enemyHasBeenLocated: false,
        enemyLocated: false,
        positionalAdvantageAttack: 0,
        positionalAdvantageDefense: 0,
        hullStrength: 100,
        maniovrability: 10,
        size: 1,
        deep: 0,
        intendedDeep: 0,
        maxSeed: 30,
        baseWidth: 400,
        baseHeight: 200,
        type: 'boat',
        layoutMap: [],
        topRoom: 0,
        leftRoom: 0,
        assets: {
            layout: 'assets/vehicles/warship1.png'
        },
        init: function(options) {
            var worst = [];
            this.people = worst;
            this.stage = options.stage;
            this.layout = new window.boot.models.ShipLayout({
                boat: this,
                layout: this.layoutMap
            });
            this.initWeapons();
            this.initView();
        },
        initWeapons: function() {},
        wavesAround: function(color, tint) {
            if (!this.view) {
                return;
            }

            var waves = new pixEngine.ParticleGenerator({
                stage: this.stage,
                container: this.container,
                origin: {
                    x: this.view.x + Math.floor(this.view.width / 2),
                    y: this.view.y + this.view.height + 5
                },
                randomOrigin: {
                    x: Math.floor(this.view.width),
                    y: 0
                },
                colors: [color],
                size: 5,
                type: 'pixelLine',
                randomSize: 5,
                speed: 0.1,
                delayRandom: 500,
                duration: 150,
                direction: Math.PI + Math.PI / 2,
                spread: Math.PI / 36,
                amount: 1,
                randomDuration: 30,
                bottomY: this.view.y + this.view.height + 5,
                fadding: true,
                gravity: 2,
                opacity: 1,
                randomOpacity: 0,
                tint: tint,
                before: this.selectedHalo
            });

        },
        initView: function() {},
        tick: function(counter, active) {
            if (!active) return;
            this.counter++;
        },
        tickAi: function(counter, active) {
            this.ai.tick(counter, active);
        },
        tickResize: function() {
            if (this.npc && this.counter % 30 === 0) {
                this.renderPosition(this.distance, this.maxY, this.offset);
            }
        },
        tickRooms: function() {
            if (this.counter % 10 === 0 && this.layout) {
                for (var i in this.layout.rooms) {
                    for (var j in this.layout.rooms[i]) {
                        if (this.layout.rooms[i][j]) {
                            this.layout.rooms[i][j].tick();
                        }
                    }
                }
            }
        },

        getRandomRoom: function() {
            var level = Math.randInt(this.layout.rooms.length);
            var row = Math.randInt(this.layout.rooms[level].length);
            if (this.layout.rooms[level][row] &&
                this.layout.rooms[level][row].getPosition &&
                this.layout.rooms[level][row].hasFreeSpace &&
                this.layout.rooms[level][row].hasFreeSpace()) {
                return this.layout.rooms[level][row]
            } else {
                return this.getRandomRoom();
            }
        },

        addPerson: function(person) {
            this.people.push(person);
            var freeRoom = this.getRandomRoom();
            freeRoom.addPerson(person);
            person.pos = freeRoom.getPosition(person);
            person.boat = this;
        },
        addXeno: function(xeno) {
            this.people.push(xeno);
            var freeRoom = this.getRandomRoom();
            this.xenomorph = xeno;
            freeRoom.addPerson(xeno);
            xeno.pos = freeRoom.getPosition(xeno);
            xeno.boat = this;
            setTimeout(this.hideAllButLevel.bind(this, freeRoom.level), 200);
        },
        removePerson: function(person) {
            this.people.removeElement(person);
            this.player.people.removeElement(person.model);
        },
        addStage: function(stage) {
            if (!stage) return;
            this.stage = stage;
            if (this.ai) {
                this.ai.enemy = stage.playerBoat;
            }
        },
        getCurrentScale: function() {
            return this.view.width / this.baseWidth;
        },
        getAlphaByDistance: function(distance) {
            if (distance > 15000) {
                return 0;
            }
            var visibilityTimeWeather = this.model.getVisibility();
            var visibilityDistance = 1 - distance / 15000;
            return 0.50 * visibilityDistance + 0.50 * visibilityTimeWeather;
        },
        getSizeByDistance: function(distance) {
            if (distance > 15000) {
                return {
                    x: 0,
                    y: 0
                };
            }
            var correction = 1 - (distance / (5000));
            if (correction < 0.2) {
                correction = 0.2 * (1 - (distance - 5000) / 10000);
                if (correction < 0.01) {
                    correction = 0.01;
                }
            }
            var xSize = Math.floor(this.baseWidth * this.size * correction);
            if (xSize < 5) {
                xSize = 5;
            }
            var ySize = Math.floor(this.baseHeight * this.size * correction);
            if (ySize < 3) {
                ySize = 3;
            }
            return {
                x: xSize,
                y: ySize
            };
        },
        getViewPositionByDistance: function(distance, maxY) {
            var correction = 1 - (distance / (5000));
            if (correction < 0.2) {
                correction = 0.2 * (1 - (distance - 5000) / 10000);
            }
            return Math.floor(maxY * correction) - this.view.height;
        },
        renderPosition: function(distance, maxY, offset) {
            this.maxY = maxY;
            this.offset = offset;
            var size = this.getSizeByDistance(distance);
            this.view.width = size.x;
            this.view.height = size.y;
            this.view.alpha = this.getAlphaByDistance(distance);
            if (this.selectedHalo) {
                this.selectedHalo.width = Math.floor(this.view.width * 0.55);
                this.selectedHalo.height = Math.floor(this.view.width * 0.55);
            }
            var positionY = offset + this.getViewPositionByDistance(distance, maxY);
            this.view.y = positionY;
        },
        getFirstPersonView: function() {
            return this.people[0].view[0];
        },
        adjustUI: function() {
            if (this.selectedHalo) {
                this.selectedHalo.x = Math.floor(this.view.x + (this.view.width - this.selectedHalo.width) / 2);
                this.selectedHalo.y = Math.floor(this.view.y + (this.view.height - this.selectedHalo.height) / 2);
            }
        },
        getNearestRoom: function(position) {
            return this.layout.getNearestRoom(position);
        },
        isXenoSameLevel: function(person) {
            return Math.abs(this.xenomorph.pos.y - person.pos.y) < 40;
        },

        isXenoClose: function(person) {
            return Math.abs(this.xenomorph.pos.y - person.pos.y) < 160 && Math.abs(this.xenomorph.pos.x - person.pos.x) < 200;
        },
        getPersonAt: function(x, y, range) {
            var personAt = null;
            this.people.forEach(function(person) {
                if (!person.xeno) {
                    if (Math.abs(person.pos.y - y) < 60 &&
                        Math.abs(person.pos.x - x) < range) {
                        personAt = person;
                    }
                }
            })
            return personAt;
        },

        hideAllButLevel: function(level) {
            if (this.layout) {
                for (var i in this.layout.rooms) {
                    for (var j in this.layout.rooms[i]) {
                        if (this.layout.rooms[i][j] && this.layout.rooms[i][j].view) {
                            if (this.layout.rooms[i][j].level != level) {
                                this.layout.rooms[i][j].view.tint = 0x333333;
                                this.layout.rooms[i][j].viewLighting.visible = false;
                                this.layout.rooms[i][j].inView = false;
                            } else {
                                this.layout.rooms[i][j].view.tint = 0xFFFFFF;
                                this.layout.rooms[i][j].viewLighting.visible = true;
                                this.layout.rooms[i][j].inView = true;
                            }
                        }
                    }
                }
            }
        },

        getXeno: function() {
            return this.xenomorph;
        },

        canSeeXeno: function(person) {
            if (Math.abs(this.xenomorph.pos.y - person.pos.y) > 50) {
                return false;
            }

            if (this.xenomorph.hiding) {
                if (Math.abs(this.xenomorph.pos.x - person.pos.x) > 50) {
                    return false;
                }
                return true;
            }

            if (person.isMoving) {
                if (person.isMovingLeft) {
                    if (this.xenomorph.pos.x > person.pos.x) {
                        return false;
                    }
                } else {
                    if (this.xenomorph.pos.x < person.pos.x) {
                        return false;
                    }
                }
                if (Math.abs(this.xenomorph.pos.x - person.pos.x) > 350) {
                    return false;
                }
            } else {
                if (Math.abs(this.xenomorph.pos.x - person.pos.x) > 250) {
                    return false;
                }
            }

            return true;
        },
        warnAboutXenoPosition: function() {
            this.lastXenoKnownPosition = this.xenomorph.room;
            this.lastXenoKnownPositionTime = this.counter;
        }
    };

    window.boot.models.Boat = boat;
} )();