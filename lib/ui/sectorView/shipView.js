window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

( function() {
    var shipView = function(options) {
        this.sector = options.sector;
        this.stage = options.stage;
        this.world = options.stage.world;
        this.isBeingAssaulted = options.assault;
        this.init();
    };
    shipView.prototype = {
        combinedChange: 0,
        currentScale: 1,
        scaleSpeed: 1,
        init: function() {
            this.container = new PIXI.DisplayObjectContainer();
            this.motorContainer = new PIXI.DisplayObjectContainer();
            this.UIcontainer = new PIXI.DisplayObjectContainer();
            this.zoomableContainer = new PIXI.DisplayObjectContainer();
            this.shipContainer = new PIXI.DisplayObjectContainer();
            this.talkContainer = new PIXI.DisplayObjectContainer();
            this.roomsContainer = new PIXI.DisplayObjectContainer();
            this.lightContainer = new PIXI.DisplayObjectContainer();
            this.peopleContainer = new PIXI.DisplayObjectContainer();
            this.peopleOutsideContainer = new PIXI.DisplayObjectContainer();
            this.skyContainer = new PIXI.DisplayObjectContainer();
            this.seaBackgroundContainer = new PIXI.DisplayObjectContainer();
            this.roomViews = [];
            this.addSpace();
            this.addPlayerBoat();
            this.addRooms();
            window.sv = this;
            this.peopleView = new window.boot.ui.PeopleView({
                stage: this.stage,
                container: this.peopleContainer,
                outsideContainer: this.peopleOutsideContainer,
                talkContainer: this.talkContainer
            });
            this.stage.addNotVisualEntity(this);
            this.initPersonView();
            //  this.initMask();
            this.initRoomsMask();
            this.container.addChild(this.skyContainer);
            this.container.addChild(this.seaBackgroundContainer);
            this.zoomableContainer.addChild(this.shipContainer);
            this.zoomableContainer.addChild(this.roomsContainer);
            this.zoomableContainer.addChild(this.talkContainer);
            this.roomsContainer.addChild(this.peopleContainer);
            this.zoomableContainer.addChild(this.peopleOutsideContainer);
            this.roomsContainer.addChild(this.lightContainer);
            this.container.addChild(this.zoomableContainer);
            this.stage.addVisualEntity(this.container);
            this.stage.addVisualEntity(this.UIcontainer);
            this.zoomableContainer.baseHeight = this.container.height;
            this.setScale(0.001);
            this.setTargetScale(1, 1);
            setTimeout(function() {
                this.setTargetScale(0.8, 2);
                setTimeout(function() {
                    this.setTargetScale(0.8, 3);
                    setTimeout(function() {
                        this.setTargetScale(0.8, 4);
                    }.bind(this), 200)
                }.bind(this), 200)
            }.bind(this), 200)
        },
        initMask: function() {
            var myMask = new PIXI.Graphics();
            myMask.beginFill();
            myMask.moveTo(0, 280);
            myMask.lineTo(window.boot.config.width, 280);
            myMask.lineTo(window.boot.config.width, 690);
            myMask.lineTo(0, 690);
            myMask.lineTo(0, 280);
            myMask.endFill();
            this.mask = myMask;
            this.stage.addVisualEntity(myMask);
            this.container.mask = this.mask;
        },
        initRoomsMask: function() {
            var myMask = new PIXI.Graphics();
            myMask.beginFill();
            var level0y = 1000;
            var level0height = 0;
            for (var i in this.roomViews) {
                var r = this.roomViews[i].view;
                if (r.y < level0y) {
                    level0y = r.y;
                    level0height = r.height;
                }
                myMask.moveTo(r.x, r.y);
                myMask.lineTo(r.x + r.width, r.y);
                myMask.lineTo(r.x + r.width, r.y + r.height);
                myMask.lineTo(r.x, r.y + r.height);
                myMask.lineTo(r.x, r.y);
            }
            myMask.moveTo(-1000, level0y);
            myMask.lineTo(2200, level0y);
            myMask.lineTo(2200, level0y + level0height);
            myMask.lineTo(-1000, level0y + level0height);
            myMask.lineTo(-1000, level0y);

            myMask.endFill();
            this.mask = myMask;
            this.stage.addVisualEntity(myMask);
            this.roomsContainer.mask = this.mask;
        },
        addSpace: function() {
            this.skyView = this.stage.addBackgroundToContainer(this.skyContainer, 0, 0, window.boot.config.width, window.boot.config.height, '#000000', 1);
            this.stars = new window.boot.ui.SkyLights({
                stage: this.stage,
                container: this.skyContainer
            });

        },
        addPlayerBoat: function() {
            this.shipBackground = this.stage.createImage(
                this.stage.playerBoat.assets.layout, {
                    x: -210, //     window.boot.config.width / 2 - 0,
                    y: -10,
                    width: 1620,
                    height: 700,
                    centered: false
                });

            this.motorGlow1 = this.stage.createImage(
                'assets/rooms/lighting.png', {
                    x: 400, //window.boot.config.width / 2 - 0,
                    y: -70,
                    width: 200,
                    height: 150,
                    centered: false
                });
            this.motorGlow2 = this.stage.createImage(
                'assets/rooms/lighting.png', {
                    x: 480, //window.boot.config.width / 2 - 0,
                    y: -80,
                    width: 240,
                    height: 150,
                    centered: false
                });
            this.motorGlow3 = this.stage.createImage(
                'assets/rooms/lighting.png', {
                    x: 600, //window.boot.config.width / 2 - 0,
                    y: -70,
                    width: 200,
                    height: 150,
                    centered: false
                });
            this.shipContainer.addChild(this.motorGlow1)
            this.shipContainer.addChild(this.motorGlow2)
            this.shipContainer.addChild(this.motorGlow3)
            this.shipContainer.addChild(this.shipBackground);
        },
        addRooms: function() {
            var rooms = this.stage.world.playerBoat.layout.rooms;
            for (var i = 0, l = rooms.length; i < l; i++) {
                for (var j = 0, ll = rooms[i].length; j < ll; j++) {
                    if (rooms[i][j]) {
                        this.addRoom(rooms[i][j], i, j);
                    }
                }
            }
        },
        addRoom: function(room, y, x) {
            room.initView({
                stage: this.stage,
                container: this.roomsContainer,
                lightContainer: this.lightContainer,
                level: y,
                layout: this.stage.world.playerBoat.layout
            });
            this.roomViews.push(room);
        },
        tick: function(counter, active) {
            if (!active) return;
            this.counter = counter;
            var changes = [-1, -1, 1, 1];
            if (this.shaking && counter % 3 === 0) {
                this.shakeship(counter);
            }
            if ((this.shakingFull || this.shakingFullLong) && counter % 3 === 0) {
                this.shakeFullView(counter);
            }
            this.motorChanges()
            this.adjustScale(this.scaleSpeed);
        },

        motorChanges: function() {
            var motorColors = [0xFFEEEE, 0xFFFFEE, 0xFFFFFF, 0xFFFFDD, 0xFFEECC, 0xEEFFDD];

            if (this.counter % 10 === 0) {
                this.motorGlow1.tint = motorColors.getRandom();
                this.motorGlow2.tint = motorColors.getRandom();
                this.motorGlow3.tint = motorColors.getRandom();
            }
        },

        initPersonView: function() {
            this.personView = new window.boot.ui.PersonView({
                stage: this.stage,
                container: this.UIcontainer,
                people: this.peopleView
            });
        },
        setScale: function(amount) {
            this.currentScale = amount;
            this.zoomableContainer.baseY = this.zoomableContainer.baseY || this.zoomableContainer.y;
            this.zoomableContainer.scale.set(amount, amount);
            this.roomsContainer.mask.scale.set(amount, amount);

            this.zoomableContainer.y = (-110 * (amount / 0.25)) + 440;
            this.zoomableContainer.x = Math.floor(boot.config.width / 2 - boot.config.width * amount / 2);
            this.roomsContainer.mask.x = this.zoomableContainer.x;
            this.roomsContainer.mask.y = this.zoomableContainer.y;
            // var diffHeight = Math.floor(335 - this.zoomableContainer.height);
            // this.zoomableContainer.y = diffHeight; // Math.floor(125 * (1 / amount));
            // // this.zoomableContainer.y = this.zoomableContainer.baseY - Math.floor(this.shipBackground.height * amount / 2);

            // this.container.width = Math.floor(boot.config.width * amount);
        },
        shakeship: function(counter) {
            if (!this.originShake) {
                this.originShake = counter;
            }
            this.shipBackground.originX = this.shipBackground.originX || this.shipBackground.x;
            this.shipBackground.originY = this.shipBackground.originY || this.shipBackground.y;
            var x = -2 + Math.randInt(5);
            var y = -2 + Math.randInt(5);
            this.shipBackground.y += (counter % 2 === 0) ? -4 : 4;
            this.shipBackground.x += (counter % 2 === 0) ? -4 : 4;
            this.shakeRooms(x, y);
            if (counter - this.originShake > 50) {
                this.originShake = null;
                this.shaking = false;
                this.shipBackground.y = this.shipBackground.originY;
                this.shipBackground.x = this.shipBackground.originX;
            }
        },
        shakeFullView: function(counter) {
            if (!this.originShakeFull) {
                this.originShakeFull = counter;
            }

            this.container.y += (counter % 2 === 0) ? -8 : 8;
            this.container.x += (counter % 2 === 0) ? -8 : 8;
            if (counter - this.originShakeFull > (this.shakingFullLong ? 100 : 20)) {
                this.originShakeFull = null;
                this.shakingFull = false;
                this.shakingFullLong = false;
                this.container.y = 0;
                this.container.x = 0;
            }
        },
        shakeRooms: function(x, y) {},
        deepChargeHit: function(deepCharge) {
            var amount = this.stage.playerBoat.hitByDeepCharge(deepCharge);
            if (amount === 1) {
                this.shaking = true;
            }
            if (amount === 2) {
                this.shakingFull = true;
            }
        },
        setTargetScale: function(scale, speed) {
            this.targetScale = scale;
            this.scaleSpeed = speed || 1;
        },
        adjustScale: function(speed) {
            speed = speed || 1;
            var step = 0.025;
            if (!this.targetScale || this.counter % speed !== 0) {
                return;
            }
            if (this.targetScale > this.currentScale) {
                this.currentScale = Math.ceil((this.currentScale + step) * 100) / 100;
                this.setScale(this.currentScale);
            }
            if (this.targetScale < this.currentScale) {
                this.currentScale = Math.floor((this.currentScale - step) * 100) / 100;
                this.setScale(this.currentScale);
            }
            if (Math.abs(this.targetScale - this.currentScale) <= step) {
                this.currentScale = this.targetScale;
            }
            return;
        },
        getPlayerBoat: function() {
            return this.stage.playerBoat;
        },
        setAlertLights: function() {
            if (this.alertLightsTimeout) {
                clearTimeout(this.alertLightsTimeout);
            }
            this.setTargetScale(1, 4);
            this.roomViews.forEach(function(room) {
                room.applyRedLighting()
            })
            this.alertLightsTimeout = setTimeout(function() {
                this.setNormalLights();
            }.bind(this), 5000)

        },
        setNormalLights: function() {

            this.setTargetScale(0.8, 4);
            this.roomViews.forEach(function(room) {
                room.applyWhiteLighting()
            })
        }
    };
    window.boot.ui.ShipView = shipView;
} )();