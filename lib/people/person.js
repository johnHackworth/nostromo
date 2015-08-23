window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var nPerson = 0;
    var person = function(options) {

        pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
        pixEngine.utils.extend.call(this, window.boot.animations.person);
        this.model = options.model;
        this.stage = options.stage;
        if (!this.model.npc && this.stage) {
            this.boat = this.stage.playerBoat;
        }
        this.init(options);
        nPerson++;
    };
    person.prototype = {
        machineGunDamage: 20,
        tintedFeatures: [0, 1, 4, 5, 6, 10],
        inspiration: 1,
        air: 100,
        randomSeed: 0,
        viewHeight: 60,
        viewWidth: 45,
        counter: 0,
        lastHit: 0,
        recoveryTime: 5,
        assets: boot.assets.person,
        room: null,
        x: 0,
        y: 0,
        init: function(options) {
            this.isFighter = Math.random() > 0.4;
            this.name = this.model.name;
            this.destination = {};
            this.nextDestinations = [];
            this.view = [];
            this.x = options.x || this.x;
            this.y = options.y || this.y;
            this.pos = {
                x: this.x,
                y: this.y
            };
            this.randomSeed = Math.randInt(10);
            this.workHability = new window.boot.models.WorkHability({
                attributes: this.model.attributes,
                person: this
            });
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
            this.headContainer = new PIXI.DisplayObjectContainer();
            this.headview = new PIXI.Sprite(this.assets.textures.head[this.model.headType].standing);
            this.hairview = new PIXI.Sprite(this.assets.textures.hair[this.model.hairType].standing);
            this.hairview.tint = this.model.hairColor;
            this.headview.width = 28;
            this.headview.height = 28;
            this.hairview.width = 29;
            this.hairview.height = 29;
            this.headContainer.addChild(this.headview);
            this.headContainer.addChild(this.hairview);

            this.facialFeaturesView = [];
            for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
                var featView = new PIXI.Sprite(this.assets.textures.facialFeatures[this.model.facialFeatures[i]].standing);
                this.facialFeaturesView.push(featView);
                featView.width = 29;
                featView.height = 29;
                if (this.tintedFeatures.indexOf(this.model.facialFeatures[i]) >= 0) {
                    featView.tint = this.model.hairColor;
                }
                this.headContainer.addChild(featView);
            }

            this.bodyview = new PIXI.Sprite(this.assets.textures.body.standing[0]);
            this.bodyview.width = 70 * 60 / 100;
            this.bodyview.height = 60;
            if (this.isFighter) {
                this.bodyTint = 0x113300;
            } else {
                this.bodyTint = 0x993333;
            }
            this.bodyview.tint = this.bodyTint;

            this.pos = {
                x: this.getPosition().x,
                y: this.getPosition().y
            };
            this.currentLevel = this.getLevel();

            this.headContainer.x = 7;
            this.headContainer.y = -12;
            this.view.x = this.pos.x;
            this.view.y = this.pos.y;

            this.view.addChild(this.bodyview);
            this.view.addChild(this.headContainer);
            // this.view.addChild(this.talkContainer);
            this.changeDestination(this.getPosition(this, this.nextDestinations));
            this.stage.addNotVisualEntity(this);
            this.makeInvisible();

            this.healthBar = new pixEngine.components.HealthBar({
                x: this.bodyview.x + this.view.width / 2 - 10,
                y: this.bodyview.y - 15,
                width: 20,
                height: 3,
                attribute: 'health',
                origin: this.model,
                container: this.view,
                stage: this.stage
            });
        },

        makeVisible: function() {
            this.view.visible = true;
            this.bodyview.tint = this.bodyTint;
            this.bodyview.alpha = 1;
            this.hairview.tint = this.model.hairColor;
            this.hairview.alpha = 1;
            this.headview.tint = 0xFFFFFF;
            this.headview.alpha = 1
            for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
                this.facialFeaturesView[i].tint = 0xFFFFFF;
                this.facialFeaturesView[i].alpha = 1;
            }
        },

        makeTemperatureVisible: function() {
            this.view.visible = true;
            this.bodyview.tint = 0xFF0000;
            this.bodyview.alpha = 0.3;
            this.hairview.tint = 0xFF0000;
            this.hairview.alpha = 0.3;
            this.headview.tint = 0xFF0000;
            this.headview.alpha = 0.3;
            for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
                this.facialFeaturesView[i].tint = 0xFF0000;
                this.facialFeaturesView[i].alpha = 0.3;
            }

        },

        makeInvisible: function() {
            this.view.visible = false;
            this.bodyview.tint = 0x99FF99;
            this.bodyview.alpha = 0.5;
            this.hairview.tint = 0x99FF99;
            this.hairview.alpha = 0.5;
            this.headview.tint = 0x99FF99;
            this.headview.alpha = 0.5;
            for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
                this.facialFeaturesView[i].tint = 0x99FF99;
                this.facialFeaturesView[i].alpha = 0.5;
            }

        },

        moveView: function(x, y) {
            this.view.x = x || this.pos.x; // - Math.floor(this.bodyview.width / 4);
            this.view.y = y || this.pos.y;

        },
        changeRoom: function(room) {
            this.destinationRoom = room;
        },
        goToSameLevelRoom: function(room) {
            this.changeDestination(room.getPosition(this));
        },
        passThroughRoom: function(room) {
            this.changeDestination(room.getPosition(this));
        },
        goToDifferentLevelRoom: function(room, notAssignPosition) {
            if (!this.room.hasStairs) {
                var stairs = this.room.getStairsWell();
                this.nextDestinations.push(stairs);
                this.nextDestinations.push(room);
            } else {
                var otherLevelStairs = room.getStairsWell();
                this.climbStairs(otherLevelStairs, true);
                this.nextDestinations.push(room);
            }
        },
        climbStairs: function(room, notAssignPosition) {
            this.changeDestination(room.getPosition(this));
        },
        tick: function(counter, active) {
            if (!active) return;
            this.counter++;

            if (this.canSeeXeno()) {
                this.reactXeno();
            } else {
                this.enemyTarget = null;
            }

            this.workHability.hasWorked = false;
            this.animate();
            if (!this.hasArrivedDestination()) {
                this.moveTowardsDestination();
                this.isMoving = true;
            } else {
                if (this.room && this.destinationRoom && this.room != this.destinationRoom) {
                    var room = this.stage.playerBoat.layout.getNextStep(this.room, this.destinationRoom);
                    if (room) {
                        this.destination = room.getPosition(this);
                    } else {
                        this.destinationRoom = null;
                    }
                } else {
                    this.isMoving = false;
                    this.isClimbing = false;
                    if (this.isFighter) {
                        this.status = 'attack';
                    }
                    if (Math.random() > 0.9985 && this.status != 'dead' && this.status != 'attack') {
                        this.chooseRandomDestination();
                    }
                }
            }

            this.adjustUI(counter);
            this.clearCounters();
            this.breadth();

            if (this.status === 'attack' && counter % 10 === 0) {
                if (this.canSeeXeno()) {
                    this.attackEnemy();
                } else {
                    this.seekEnemy();
                }
            }

            if (!this.isFighter &&
                this.status != 'dead' &&
                counter % 10 === 0 &&
                this.canSeeXeno()) {
                this.fleeFromXeno();
            }


            if ((this.status === 'idle' || !this.status) && Math.randInt(2000) > 1950) {
                this.status = 'yawning';
                this.colorStatusTime = 8;
            }

            if (counter % 12 === 0) {
                this.checkVisibility();
            }
        },

        chooseRandomDestination: function() {
            this.changeRoom(this.stage.playerBoat.getRandomRoom());
        },
        clearCounters: function() {
            if (this.statusChange && (1 * this.counter - 1 * this.statusChange > 100)) {
                this.status = 'idle';
                this.sidework = false;
            }
        },
        moveTowardsDestination: function() {
            if (this.status == 'dead') {
                return;
            }
            this.status = null;
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
                    this.pos.y += diffY / Math.abs(diffY);
                    moveTo[1] = 1 * this.pos.y;
                }
            }
            this.moveView(moveTo[0], moveTo[1]);
            this.checkRoomChange();
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
        workAt: function(type) {
            return 0;
        },
        getComment: function(workType) {
            return this.comments.getWorkComment();
        },
        fix: function(room) {
            this.status = 'fixing';
            this.statusChange = this.counter;
            var fixing = this.workHability.work('fixing');
            room.fix(fixing / 100);
        },
        attackEnemy: function() {
            this.enemyTarget = this.stage.playerBoat.getXeno();
            if (this.enemyTarget && this.enemyTarget.model.health > 0) {
                this.shootMachineGun(this.enemyTarget);
            } else {
                this.enemyTarget = null;
                this.status = 'idle';
            }
            return;
        },

        seekEnemy: function() {
            if (Math.randInt(100) > 50) {
                if (this.counter - this.stage.playerBoat.lastXenoKnownPositionTime < 1000 &&
                    this.stage.playerBoat.lastXenoKnownPosition.hasFreeSpace()
                ) {

                    this.changeRoom(this.stage.playerBoat.lastXenoKnownPosition);
                } else {
                    if (Math.randInt(100) > 90) {
                        this.chooseRandomDestination();
                    }
                }
            }
        },

        isInAdjacentRoom: function(person) {
            if (!this.room) {
                return false;
            }
            var adjacent = this.room.getAdjacentRooms();
            if (person.room === this.room || adjacent.indexOf(person.room) >= 0) {
                return true;
            }
            return false;
        },
        shootMachineGun: function(enemy) {
            var machineGunWork = this.workHability.work('machineGun');
            if (Math.randInt() < machineGunWork) {
                enemy.hitByMachineGun(this.machineGunDamage, this.pos);
            } else {
                enemy.hitByMachineGun(0, this.pos);
            }

            this.showMachineGunSparks();
        },

        addDestinationView: function() {
            this.destinationView = new PIXI.Sprite.fromImage('assets/ui/destination.png');
            // this.destinationView.width = this.view.width;
            // this.destinationView.height = this.view.height;
            // this.destinationView.alpha = 0.5;
            this.view.addChild(this.destinationView);
            this.changeDestination(this.destination);
        },
        changeDestination: function(destination) {
            this.destination = destination;
            if (this.destinationView) {
                this.destinationView.x = this.room.getPosition(this).x;
                this.destinationView.y = this.room.getPosition(this).y;
            }
        },
        hit: function(damage) {
            if (this.counter - this.lastHit > this.recoveryTime) {
                this.lastHit = this.counter;
                var multiplier = 1;
                if (this.room.isExterior) {
                    multiplier = 4;
                }
                var robustness = (this.model.attributes.strength + this.model.attributes.stamina) / 2;
                var randomSeed = (robustness + Math.randInt()) / 200;
                var personalDamage = Math.floor(damage * (1 - randomSeed));
                this.model.health -= personalDamage * multiplier;
                this.bleed();
            }

        },
        attackedByXeno: function(damage, origin) {
            this.hit(damage);
            if (!this.isClimbing && origin.x > this.pos.x && this.canGoLeft()) {
                this.pos.x -= 5;
            }
            if (!this.isClimbing && origin.x < this.pos.x && this.canGoRight()) {
                this.pos.x += 5;
            }
            this.moveView();
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
        die: function() {
            if (this.status != 'dead') {
                this.status = 'dead';
                if (this.room) {
                    this.room.removePerson(this);
                    this.room = null;
                }
                this.model.die();
                if (this.boat) {
                    this.boat.removePerson(this);
                }
            }
        },
        fleeFromXeno: function() {
            if (this.isFighter) {
                return;
            }
            var newRoom = this.stage.playerBoat.getRandomRoom();
            if (this.room && newRoom) {
                while (newRoom.level == this.room.level) {
                    newRoom = this.stage.playerBoat.getRandomRoom();
                }
                this.changeRoom(newRoom);
            }
        },
        breadth: function() {
            if (this.room && this.room.isFullOfWater()) {
                this.air -= 0.5 + 0.5 * (100 - this.model.attributes.stamina) / 100;
                if (this.air <= 0) {
                    this.air = 0;
                    this.model.health -= 0.3;
                }
            }
            if (this.model.health <= 0) {
                this.model.health = 0;
                this.die();
            }
        },
        checkVisibility: function() {
            if (this.stage.playerBoat.isXenoSameLevel(this)) {
                return this.makeVisible();
            }
            if (this.stage.playerBoat.isXenoClose(this)) {
                return this.makeTemperatureVisible();
            }
            this.makeInvisible();
        },
        canSeeXeno: function() {
            return this.stage.playerBoat.canSeeXeno(this);
        },
        checkRoomChange: function() {
            var closestRoom = this.stage.playerBoat.getNearestRoom(this.pos);
            if (closestRoom != this.room) {
                if (this.room && this.room.type) {
                    this.room.removePerson(this);
                }
                closestRoom.addPerson(this);
                this.room = closestRoom;
            }
        },
        reactXeno: function() {
            if (this.isFighter) {
                if (Math.random() > 0.6) {
                    this.warnAboutXenoPosition();
                }
                this.changeRoom(this.room);
            // this.status = 'attack';
            } else {
                this.fleeFromXeno();
            }
        },
        warnAboutXenoPosition: function() {
            this.stage.playerBoat.warnAboutXenoPosition();
            this.stage.hudLayout.playerView.setAlertLights();
        },
        adjustUI: function(counter) {
            if (this.healthBar) {
                this.healthBar.updateHealthBar(this.pos.x, this.pos.y);
            }
            if (this.status === 'dead' && this.setHealthBarVisibility) {
                this.setHealthBarVisibility(false);
            }
        },
    };

    window.boot.models.Person = person;
} )();