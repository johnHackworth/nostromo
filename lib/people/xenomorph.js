window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var Xeno = function(options) {
        pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
        pixEngine.utils.extend.call(this, window.boot.animations.xeno);
        this.model = options.model;
        this.stage = options.stage;
        if (!this.model.npc && this.stage) {
            this.boat = this.stage.playerBoat;
        }
        this.init(options);
    };
    Xeno.prototype = {
        counter: 0,
        lastHit: 0,
        recoveryTime: 10,
        xeno: true,
        air: 100,
        assets: boot.assets.xeno,
        viewHeight: 60,
        viewWidth: 45,
        room: null,
        x: 0,
        y: 0,
        init: function(options) {
            window.x = this;
            this.view = [];
            this.x = options.x || this.x;
            this.y = options.y || this.y;
            this.pos = {
                x: this.x,
                y: this.y
            };
            this.randomSeed = Math.randInt(10);
        },
        getPosition: function() {
            return this.room.getPosition(this, this.nextDestinations);
        },
        getLevel: function() {
            return this.room ? this.room.level : 0;
        },
        initView: function(extContainer) {
            this.view = new PIXI.DisplayObjectContainer();
            this.extContainer = extContainer || this.view;

            this.bodyview = new PIXI.Sprite(this.assets.textures.body.standing[0]);
            this.bodyview.width = 140 * 60 / 100;
            this.bodyview.height = 60;

            this.pos = {
                x: this.getPosition().x,
                y: this.getPosition().y
            };
            this.currentLevel = this.getLevel();

            this.view.x = this.pos.x;
            this.view.y = this.pos.y;

            this.view.addChild(this.bodyview);
            this.changeDestination(this.getPosition(this, this.nextDestinations));
            this.stage.addNotVisualEntity(this);
            this.healthBar = new pixEngine.components.HealthBar({
                x: this.bodyview.x + this.view.width / 2 - 10,
                y: this.bodyview.y - 15,
                width: 20,
                height: 3,
                alwaysVisible: true,
                attribute: 'health',
                origin: this.model,
                container: this.view,
                stage: this.stage
            });

        },

        moveView: function(x, y) {
            this.view.x = x || this.pos.x; // - Math.floor(this.bodyview.width / 4);
            this.view.y = y || this.pos.y;

        },

        changeDestination: function() {},

        tick: function(counter, active) {
            if (!active) return;
            this.counter++;

            if (this.status === 'dead') {
                if (this.counter % 10 === 0 && this.alphaStep) {
                    this.view.alpha = this.alphaStep / 10;
                    this.alphaStep--;
                }

                return;
            }
            this.destination = {
                x: this.pos.x,
                y: this.pos.y
            }


            if (this.hiding) {
                if (this.view.alpha > 0.4 && this.counter % 5 === 0) {
                    this.view.alpha -= 0.1;
                }
            } else {
                this.view.alpha = 1;
            }

            if (this.attacking) {
                this.status = 'attack';
                this.checkAttackSuccess();
            } else {
                this.status = null;
                if (this.attackCooldown) {
                    this.attackCooldown--;
                }
            }

            this.isMoving = false;

            if (this.healthBar) {
                this.healthBar.updateHealthBar(this.pos.x, this.pos.y);
            }

            this.hiding = false;

            if (!this.isClimbing && this.stage.keyManager.isPressed(this.stage.keyManager.LEFT_CONTROL)) {
                this.hideInShadows();
            } else if (this.stage.keyManager.isPressed(this.stage.keyManager.UP_CURSOR) && this.canClimb()) {
                if (this.canGoUp()) {
                    this.isClimbing = true;
                    this.destination.y -= 220;
                }
            } else if (this.stage.keyManager.isPressed(this.stage.keyManager.DOWN_CURSOR) && this.canClimb()) {
                if (this.canGoDown()) {
                    this.isClimbing = true;
                    this.destination.y += 220;
                }
            } else {
                this.isClimbing = false;
                if (!this.attackCooldown && !this.attacking &&
                    (this.stage.keyManager.isPressed(this.stage.keyManager.ENTER) ||
                    this.stage.keyManager.isPressed(this.stage.keyManager.SPACE))
                ) {
                    this.status = 'attack'
                    this.attacking = 3;
                    this.attackCooldown = 20;
                    var attacks = ['attack', 'attack', 'attack', 'attack2'];
                    this.attackType = attacks.getRandom();
                }

                if (this.stage.keyManager.isPressed(this.stage.keyManager.RIGHT_CURSOR) && this.canMove()) {
                    if (this.canGoRight()) {
                        this.destination.x += this.status === 'attack' ? 80 : 40;
                    }

                } else if (this.stage.keyManager.isPressed(this.stage.keyManager.LEFT_CURSOR) && this.canMove()) {
                    if (this.canGoLeft()) {
                        this.destination.x -= this.status === 'attack' ? 80 : 40;
                    }
                }
            }

            if (!this.hasArrivedDestination()) {
                this.moveTowardsDestination();
                this.isMoving = true;
            }


            if (!this.isClimbing) {
                var yDiff = (this.room.getPosition(this).y - this.pos.y);
                if (Math.abs(yDiff) > 3) {
                    this.pos.y += 4 * Math.abs(yDiff) / yDiff;
                    this.moveView(this.pos.x, this.pos.y);
                } else if (Math.abs(yDiff) > 1) {
                    this.pos.y += 2 * Math.abs(yDiff) / yDiff;
                    this.moveView(this.pos.x, this.pos.y);
                } else if (Math.abs(yDiff) > 0) {
                    this.pos.y = this.room.getPosition(this).y;
                    this.moveView(this.pos.x, this.pos.y);
                }

            }


            this.animate();
        },
        moveTowardsDestination: function() {
            var moveTo = [this.pos.x, this.pos.y];
            var diffX = this.destination.x - this.pos.x;
            if (Math.abs(diffX) > 3) {
                this.isClimbing = false;
                if (diffX < 0) {
                    this.isMovingLeft = true;
                } else {
                    this.isMovingLeft = false;
                }
                this.pos.x += this.model.speed * diffX / Math.abs(diffX);
                moveTo[0] = 1 * this.pos.x;
            } else {
                var diffY = this.destination.y - this.pos.y;
                if (diffY) {
                    this.isClimbing = true;
                    this.pos.y += this.model.speed / 2 * diffY / Math.abs(diffY);
                    moveTo[1] = 1 * this.pos.y;
                }
            }
            this.moveView(moveTo[0], moveTo[1]);
            this.checkRoomChange();
        },
        checkRoomChange: function() {
            var closestRoom = this.stage.playerBoat.getNearestRoom(this.pos);
            if (closestRoom != this.room) {
                this.changeRoom(closestRoom);
            }
        },
        changeRoom: function(room) {
            if (this.room && this.room.type) {
                this.room.removePerson(this);
            }
            room.addPerson(this);
            this.room = room;
            this.stage.playerBoat.hideAllButLevel(room.level);
        },
        hasArrivedDestination: function() {
            if (!this.destination) {
                return true;
            }
            // console.log(this.destination, this.pos)
            return Math.abs(this.destination.x - this.pos.x) < 4 && Math.abs(this.destination.y - this.pos.y) < 4;
        },
        isOnDestination: function() {
            return this.hasArrivedDestination();
        },

        checkAttackSuccess: function() {
            var range = Math.floor(this.view.width * 0.5);
            if (this.isMovingLeft) {
                range = 0;
            }
            var person = this.stage.playerBoat.getPersonAt(this.pos.x + range, this.pos.y, this.isMoving ? 30 : 20);
            if (person) {
                var damage = Math.randInt(this.model.damage);
                person.attackedByXeno(damage, this.pos);
            }
        },

        canMove: function() {
            var pos = this.room.getPosition(this);
            return pos.y - this.pos.y > -5 && pos.y - this.pos.y < 5;
        },

        canClimb: function() {
            if (!this.room.hasStairs) {
                return;
            }
            var x = this;
            var roomPos = x.room.viewX + Math.floor(x.room.view.width / 2);
            var mePos = x.pos.x + Math.floor(x.view.width / 2);

            return Math.abs(roomPos - mePos) < 15;
        },

        canGoUp: function() {
            if (this.stage.playerBoat.layout.rooms[this.room.level - 1] &&
                this.stage.playerBoat.layout.rooms[this.room.level - 1][this.room.order] &&
                this.stage.playerBoat.layout.rooms[this.room.level - 1][this.room.order].hasStairs) {
                return true;
            }
            return this.view.y > this.room.getPosition(this).y;
        },

        canGoDown: function() {
            if (this.stage.playerBoat.layout.rooms[this.room.level + 1] &&
                this.stage.playerBoat.layout.rooms[this.room.level + 1][this.room.order] &&
                this.stage.playerBoat.layout.rooms[this.room.level + 1][this.room.order].hasStairs) {
                return true;
            }

            return this.view.y < this.room.getPosition(this).y;
        },

        canGoLeft: function() {
            if (this.stage.playerBoat.layout.rooms[this.room.level][this.room.order - 1]) {
                return true;
            }
            return this.view.x > this.room.view.x;
        },

        canGoRight: function() {
            if (this.stage.playerBoat.layout.rooms[this.room.level][this.room.order + 1]) {
                return true;
            }
            return this.view.x + this.view.width < this.room.view.x + this.room.view.width;
        },

        hitByMachineGun: function(damage, origin) {
            if (damage && this.counter - this.lastHit > this.recoveryTime) {
                this.lastHit = this.counter;
                this.model.health -= damage / this.model.damageResitance;
                this.bleed();
                this.stage.hudLayout.playerView.shakingFull = true;
                if (this.model.health <= 0) {
                    this.die()
                    this.stage.hudLayout.playerView.shakingFullLong = true;
                    this.status = 'dead';
                    this.alphaStep = 10;
                }
            }
            if (origin.x > this.pos.x && this.canGoLeft()) {
                this.pos.x -= 5;
            }
            if (origin.x < this.pos.x && this.canGoRight()) {
                this.pos.x += 5;
            }
            this.moveView();
        },
        hideInShadows: function() {
            this.hiding = true;
        }

    };

    window.boot.models.Xenomorph = Xeno;
} )();