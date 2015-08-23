window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

( function() {
    var ui = function(options) {
        this.sector = options.sector;
        this.stage = options.stage;
        this.world = options.world;
        this.shipView = options.shipView;
        this.init();
    };
    ui.prototype = {
        turnsToLeave: 30,
        init: function() {
            window.sw = this;
            this.boats = [];
            this.initSea = 100;
            this.initSeaX = 0;
            this.seaWidth = window.boot.config.width - 0;
            this.container = new PIXI.DisplayObjectContainer();
            this.weaponsContainer = new PIXI.DisplayObjectContainer();
            this.targetContainer = new PIXI.DisplayObjectContainer();
            this.hideContainer = new PIXI.DisplayObjectContainer();

            this.rainGenerator = new window.boot.models.Rain({
                stage: this.stage,
                container: this.container,
                y: 0,
                is3d: true
            });

            this.addSky();
            this.addSea();
            this.addShips();
            this.initializeCombatSimulator();
            this.initializeHideScreen();
            this.addWeaponsHud();
            this.stage.addNotVisualEntity(this);
            this.addMapButton();
            this.stage.addVisualEntity(this.container);
            this.stage.addVisualEntity(this.targetContainer);
            this.stage.addVisualEntity(this.hideContainer);
            this.stage.addVisualEntity(this.weaponsContainer);
        },
        initializeCombatSimulator: function() {
            this.combatSimulator = new window.boot.models.CombatSimulator({
                sea: this,
                peopleView: this.shipView.peopleView,
                boats: this.boats
            });
            this.targetView = new window.boot.ui.TargetView({
                stage: this.stage,
                world: this.world,
                container: this.targetContainer,
                sea: this,
                x: 200 + 50,
                y: 200
            });
        },
        addSky: function() {
            console.log(this.world);
            this.skyView = this.stage.addBackgroundToContainer(this.container, this.initSeaX, 0, this.seaWidth, 150, this.world.getSkyColor(this.sector.weather.skyColor), 1);
            this.skyView.tint = this.sector.weather.tint;
            this.addSkyLights();
        },
        addSkyLights: function() {
            this.skyLights = new boot.ui.SkyLights({
                container: this.container,
                x: 100,
                y: 0,
                sea: this,
                sector: this.sector,
                stage: this.stage,
                world: this.world
            });
        },
        addSea: function() {
            this.seaView = this.stage.addBackgroundToContainer(this.container, this.initSeaX, 100, this.seaWidth, 150, 0x006699, 1);
            this.seaView.tint = this.sector.weather.tint;
        },
        addShips: function() {
            for (var i in this.sector.vehicles) {
                if (this.sector.vehicles[i].type !== 'boat') {
                    this.addBoat(this.sector.vehicles[i], this.sector);
                }
            }
        },
        addLifeboat: function(origin) {
            var lifeBoat = new boot.dataModels.Boat({
                speed: 1,
                type: 'LifeBoat',
                world: this.stage.world,
                sector: this.sector,
                country: origin.model.country
            });
            lifeBoat.sector = this.sector;
            var boat = this.addBoat(lifeBoat, this.sector);
            boat.distance = origin.distance;
            boat.view.x = origin.view.x + Math.randInt(origin.view.width);
            boat.view.y = origin.view.y + origin.view.height - boat.view.height;
        },
        addBoat: function(boatData, sector) {
            // debugger;
            var boat = new boot.models[boatData.type]({
                stage: this.stage,
                model: boatData,
                world: this.world
            });

            boat.sector = sector;
            this.boats.push(boat);
            boat.ai.setEnemy(this.stage.playerBoat);
            boat.enemy = this.stage.playerBoat;
            this.stage.addNotVisualEntity(boat);
            this.container.addChild(boat.view);
            // this.stage.addViewAfter(boat.view, this.seaView, this.seaView);
            boat.container = this.container;
            boat.stage = this.stage;
            boat.sea = this;
            boat.view.x = this.initSeaX + 200 + Math.randInt(this.seaWidth - 500);
            boat.view.y = 80;
            boat.distance = 1000 + Math.randInt(3000);
            boat.view.tint = this.sector.weather.tint;
            boat.renderPosition(15000, 100, 100);
            boat.view.interactive = true;
            boat.view.click = this.selectBoat.bind(this, boat);
            boat.view.tap = this.selectBoat.bind(this, boat);
            return boat;
        },
        addWeaponsHud: function() {
            this.weaponsHud = new window.boot.ui.WeaponsLayout({
                stage: this.stage,
                container: this.weaponsContainer,
                sea: this
            });
        },
        selectBoat: function(boat) {
            if (this.selected) {
                this.selected.unselect();
            }
            boat.select();
            this.weaponsHud.selectBoat();
            this.targetView.changeTarget(boat);
            this.selected = boat;
        },
        createTorpedo: function(options) {
            var torpedo = new window.boot.models.Torpedo({
                target: this.selected,
                origin: this.stage.playerBoat,
                sea: this,
                container: this.container,
                stage: this.stage
            });
        },
        createOwnProjectile: function(options) {
            this.stage.playerBoat.trigger('projectileFired');
            var torpedo = new window.boot.models.PlayerProjectile({
                target: this.selected,
                origin: this.stage.playerBoat,
                sea: this,
                container: this.container,
                stage: this.stage
            });
        },
        createProjectile: function(options) {
            var projectile = new window.boot.models.Projectile({
                target: options.target,
                origin: options.origin,
                sea: this,
                container: this.container,
                weapon: options.weapon,
                stage: this.stage,
                shipView: this.shipView
            });
        },
        tick: function(counter, active) {
            if (!active) return;
            if (counter % 30 === 0) {
                this.combatSimulator.boatManiovres();
                this.combatSimulator.setPositions();
                this.combatSimulator.isPlayerBoatVisibleFromBoats();
            }

            if (!this.isHidden && this.stage.playerBoat.deep > 40) {
                this.hide();
            } else if (this.isHidden && this.stage.playerBoat.deep <= 40) {
                this.show();
            }

            if (counter % 10 === 0 && Math.randInt() < 10) {
                this.reflects();
            }

            if (this.combatSimulator.isPlayerAlone()) {
                this.turnsToLeave = 0;
            } else {
                var nFighters = this.combatSimulator.canPlayerLeave();
                if (!nFighters) {
                    this.turnsToLeave = this.turnsToLeave > 0 ? this.turnsToLeave - 1 : 0;
                } else {
                    this.turnsToLeave = 3000;
                }
            }
            if (this.mapViewButton && counter % 30 === 0) {
                this.mapViewButton.paintProgress((3000 - this.turnsToLeave) / 3000);
            }
            if (this.raining) {
                this.rainGenerator.makeRain(this.raining);
            }
        },
        reflects: function() {
            var y = 100 + Math.randInt(150);
            var size = Math.floor(15 * y / 250);
            var reflect = new pixEngine.ParticleGenerator({
                stage: this.stage,
                container: this.container,
                type: 'pixelLine',
                origin: {
                    x: Math.randInt(this.seaWidth) + this.initSeaX,
                    y: y
                },
                randomOrigin: {
                    x: 40,
                    y: 20
                },
                colors: [0xFFFFFF, 0x0077BB, 0x0099AA],
                size: size,
                randomSize: size,
                speed: (1 - Math.randInt(3)) * 0.1,
                duration: 450,
                direction: Math.PI, // Math.PI + Math.random() * Math.PI,
                spread: Math.PI / 50,
                delayRandom: 20,
                amount: 1,
                randomAmount: 2,
                randomDuration: 550,
                brittle: 0.97,
                gravity: 0.0011,
                opacity: 0.2,
                randomOpacity: 0.2
            });
        },
        initializeHideScreen: function() {
            this.hideScreen = this.stage.addBackgroundToContainer(this.hideContainer, 0, 0, this.seaWidth, 250, 0x444444, 1);
            this.hydrophoneScreen = new window.boot.ui.HydrophoneScreen({
                stage: this.stage,
                container: this.hideContainer,
                sea: this,
                x: 0,
                y: 0
            });
            this.hideContainer.visible = false;
        },
        hide: function() {
            this.isHidden = true;
            if (this.hideScreen) {
                this.hideContainer.visible = true;
                // this.targetView.hide();
            }
        },
        show: function() {
            this.isHidden = false;
            if (this.hideScreen) {
                this.hideContainer.visible = false;
            }
        },
        addMapButton: function() {
            this.mapViewButton = new boot.ui.MapViewButton({
                stage: this.stage,
                progressContainer: this,
                progressAttribute: 'turnsToLeave',
                progressTop: 3000,
                x: Math.floor(boot.config.width / 2 - 50),
                y: boot.config.height - 42,
                world: this.world
            });
            this.mapViewButton.on('exit', this.returnToMap.bind(this));
        },
        returnToMap: function() {
            var results = this.combatSimulator.getCombatResult();
            if (results.influence > 0) {
                // combat
                if (this.combatSimulator.isPlayerAlone()
                // victory
                ) {
                    this.world.history.addCombatVictory(results);
                } else {
                    // flee
                    this.world.history.addCombatRun(results);
                }
            }

            boot.mainDirector.startSectors();
        },
        createDeepCharge: function(options) {
            this.shipView.createDeepCharge(options);
        }
    };
    window.boot.ui.SeaView = ui;
} )();