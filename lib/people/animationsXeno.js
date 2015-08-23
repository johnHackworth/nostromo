window.boot = window.boot || {};
window.boot.animations = window.boot.animations || {};

window.boot.animations.xeno = function() {};

window.boot.animations.xeno.prototype = {
    talkingCounter: 0,
    textureType: 'textures',
    animate: function() {
        if (this.status === 'working') {
            if (this.sidework) {
                this.animateSideWork();
            } else {
                this.animateWork();
            }
        } else if (this.status === 'fixing') {
            this.animateFix();
        } else if (this.status === 'yawning') {
            this.animateYawning();
        } else if (this.status === 'talking') {
            this.animateTalking();
        } else if (this.status === 'dead') {
            this.animateDeath();
        } else if (this.status === 'attack') {
            this.animateAttack();
        } else if (this.isMoving) {
            if (this.isClimbing) {
                this.animateClimb();
            } else {
                this.animateMoving();
            }
        } else {
            this.animateStand();
        }
    },
    setFacialFeatures: function(action) {
        for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
            if (action === 'back') {
                this.facialFeaturesView[i].visible = false;
            } else {
                this.facialFeaturesView[i].visible = true;
                this.facialFeaturesView[i].setTexture(this.assets[this.textureType].facialFeatures[this.model.facialFeatures[i]][action]);

            }
        }
    },
    animateStand: function() {
        if (this.counter % 10 === 0) {
            var bodyStep = (this.counter / 10 + this.randomSeed) % this.assets[this.textureType].body.standing.length;
            if (this.bodyview) {
                if (this.isMovingLeft) {
                    this.bodyview.setTexture(this.assets[this.textureType].body.standingLeft[bodyStep]);
                } else {
                    this.bodyview.setTexture(this.assets[this.textureType].body.standing[bodyStep]);
                }
            }
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    animateSideWork: function() {
        if (this.counter % 7 === 0) {
            var bodyStep = (this.counter / 7 + this.randomSeed) % this.assets[this.textureType].body.sideWork.length;
            this.headContainer.y = -10;
            this.headContainer.x = 7;
            this.headview.setTexture(this.assets[this.textureType].head[0].side[0]);
            this.hairview.setTexture(this.assets[this.textureType].hair[0].side);
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body.sideWork[bodyStep]);
            }
            this.setFacialFeatures('side');
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    animateWork: function() {
        if (this.counter % 10 === 0) {
            var bodyStep = (this.counter / 5 + this.randomSeed) % this.assets[this.textureType].body.working.length;
            this.headContainer.y = -14;
            this.headContainer.x = 7;
            this.headview.setTexture(this.assets[this.textureType].head[0].back);
            this.hairview.setTexture(this.assets[this.textureType].hair[0].back);
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body.working[bodyStep]);
            }
            this.setFacialFeatures('back');
            this.moveView(this.pos.x, this.pos.y);
        }

    },
    animateFix: function() {
        if (this.counter % 7 === 0) {
            var bodyStep = (this.counter / 7 + this.randomSeed) % this.assets[this.textureType].body.fixing.length;
            this.headContainer.y = -14;
            this.headContainer.x = 7;
            this.headview.setTexture(this.assets[this.textureType].head[0].side[0]);
            this.hairview.setTexture(this.assets[this.textureType].hair[0].side);
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body.fixing[bodyStep]);
            }

            this.setFacialFeatures('side');
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    animateDeath: function() {
        var headPositions = [
            [11, -9],
            [11, -7],
            [11, -3],
            [11, 5],
            [11, 10],
            [3, 25]
        ];

        this.deadAnimationStep = this.deadAnimationStep || 0;
        if (this.counter % 10 === 0) {
            if (this.deadAnimationStep > 5) {

            } else {
                var bodyStep = this.deadAnimationStep;
                this.headContainer.y = headPositions[bodyStep][1];
                this.headContainer.x = headPositions[bodyStep][0];
                this.headview.setTexture(this.assets[this.textureType].head[0].standing);
                if (bodyStep > 4) {
                    this.headContainer.pivot.set(48 * bodyStep / 5, 20 * bodyStep / 5);
                    this.headContainer.rotation = -1.9 * bodyStep / 5;
                }
                this.hairview.setTexture(this.assets[this.textureType].hair[0].standing);
                if (this.bodyview) {
                    this.bodyview.setTexture(this.assets[this.textureType].body.death[bodyStep]);
                }
                this.setFacialFeatures('standing');
                this.moveView(this.pos.x, this.pos.y);
                this.deadAnimationStep++;
            }

        }
    },
    animateClimb: function() {
        if (this.counter % 3 === 0) {
            var bodyStep = (this.counter / 3 + this.randomSeed) % this.assets[this.textureType].body.climbing.length;
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body.climbing[bodyStep]);
            }
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    animateAttack: function() {
        if (!this.attackType) {
            this.attackType = 'attack';
        }
        if (this.counter % 4 === 0) {
            var bodyStep = this.attacking--;
            if (this.isMovingLeft) {
                if (this.bodyview) {
                    this.bodyview.setTexture(this.assets[this.textureType].body[this.attackType + 'Left'][bodyStep]);
                }
            } else {
                if (this.bodyview) {
                    this.bodyview.setTexture(this.assets[this.textureType].body[this.attackType][bodyStep]);
                }
            }
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    animateYawning: function() {
        if (this.counter % 12 === 0) {
            var bodyStep = 8 - this.colorStatusTime;
            this.headContainer.y = -12;
            this.headContainer.x = 7;
            this.headview.setTexture(this.assets[this.textureType].head[0].talking[0]);
            this.hairview.setTexture(this.assets[this.textureType].hair[0].standing);
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body.standingColor[bodyStep]);
            }
            this.setFacialFeatures('standing');
            this.moveView(this.pos.x, this.pos.y);
            this.colorStatusTime--;
        }
        if (!this.colorStatusTime) {
            this.status = 'idle';
        }
    },
    animateTalking: function() {
        if (Math.randInt() > 65) {
            this.talkingCounter++;
            this.headContainer.y = -12;
            this.headContainer.x = 7;
            var bodyStep = Math.randInt(4);
            this.headview.setTexture(this.assets[this.textureType].head[0].talking[bodyStep]);
            this.hairview.setTexture(this.assets[this.textureType].hair[0].standing);
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body.standing[0]);
            }
            this.setFacialFeatures('standing');
            this.moveView(this.pos.x, this.pos.y);
            this.colorStatusTime--;
        }
        if (this.talkingCounter > (40 + Math.randInt(100))) {
            this.status = 'idle';
            this.talkingCounter = 0;
        }
    },
    animateOnBoat: function() {
        var bodyStep = 5; //Math.randInt(this.assets[this.textureType].body.running.length);
        this.headContainer.y = -12;
        this.headContainer.x = 4;
        this.headview.setTexture(this.assets[this.textureType].head[0].sideLeft[0]);
        this.hairview.setTexture(this.assets[this.textureType].hair[0].sideLeft);
        if (this.bodyview) {
            this.bodyview.setTexture(this.assets[this.textureType].body.runningLeft[bodyStep]);
        }
        this.setFacialFeatures('sideLeft');
    },

    animateMoving: function(counter) {
        if (this.counter % 6 === 0) {
            var bodyStep = (this.counter / 6 + this.randomSeed) % this.assets[this.textureType].body.running.length;
            if (this.isMovingLeft) {
                if (this.bodyview) {
                    this.bodyview.setTexture(this.assets[this.textureType].body.runningLeft[bodyStep]);
                }
            } else {
                if (this.bodyview) {
                    this.bodyview.setTexture(this.assets[this.textureType].body.running[bodyStep]);
                }
            }
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    showMachineGunSparks: function() {
        var positionX = 14;
        var direction = 1;
        if (this.enemyTarget && this.enemyTarget.view.x > this.view.x) {
            direction = 0;
            positionX = 26;
        }
        var explosion = new pixEngine.ParticleGenerator({
            stage: this.stage,
            container: this.extContainer,
            origin: {
                x: this.view.x + positionX,
                y: this.view.y + this.view.height / 2 - 3
            },
            randomOrigin: {
                x: 2,
                y: 2
            },
            colors: [0x666666, 0xEDEDED, 0xFF5555, 0xFFFF222, 0xFF3333, 0xFFFF66, 0x777777],
            size: 1,
            randomSize: 3,
            speed: 0.1,
            direction: 0.0001,
            duration: 30,
            delayRandom: 400,
            // type: 'hexagon',
            amount: 30,
            randomDuration: 50,
            fadding: true,
            gravity: 5,
            opacity: 0.5,
            randomOpacity: 0.5,
            type: 'pixel'
        });
        var bullets = new pixEngine.ParticleGenerator({
            stage: this.stage,
            container: this.extContainer,
            origin: {
                x: this.view.x + positionX,
                y: this.view.y + this.view.height / 2 - 3
            },
            randomOrigin: {
                x: 2,
                y: 2
            },
            colors: [0xFFFFFF, 0xFFFF88, 0xFF8888],
            size: 1,
            randomSize: 3,
            speed: 10,
            spread: Math.PI / 8,
            direction: Math.PI * direction,
            duration: 5,
            delayRandom: 100,
            // type: 'hexagon',
            amount: 5,
            randomDuration: 10,
            fadding: true,
            gravity: 1,
            opacity: 0.5,
            randomOpacity: 0.5,
            type: 'pixel'
        });
    },
    bleed: function() {
        var direction = 0;
        var spread = 2 * Math.PI;
        if (this.isMoving) {
            direction = -1 * Math.PI;
            spread = -1 * Math.PI;
        }
        if (this.isMovingLeft) {
            direction = Math.PI;
            spread = Math.PI;
        }
        var explosion = new pixEngine.ParticleGenerator({
            stage: this.stage,
            container: this.extContainer,
            origin: {
                x: this.view.x + Math.floor(this.view.width / 2),
                y: this.view.y + Math.floor(this.view.height / 2)
            },
            randomOrigin: {
                x: 40,
                y: 20
            },
            colors: [0x00FF00, 0x009900, 0x00CC99, 0x00EE00],
            size: 1,
            spread: spread,
            randomSize: 4,
            speed: .3,
            direction: direction,
            duration: 150,
            delayRandom: 1500,
            // type: 'hexagon',
            amount: 15,
            bottomY: this.room.view.y + this.room.view.height - 5,
            randomDuration: 50,
            fadding: true,
            gravity: 9,
            opacity: 0.8,
            randomOpacity: 0.5,
            type: 'pixel'
        });
    },
    die: function() {
        var explosion = new pixEngine.ParticleGenerator({
            stage: this.stage,
            container: this.extContainer,
            origin: {
                x: this.view.x + Math.floor(this.view.width / 2),
                y: this.view.y + Math.floor(this.view.height / 2)
            },
            randomOrigin: {
                x: 40,
                y: 20
            },
            colors: [0x00FF00, 0x009900, 0x00CC99, 0x00EE00],
            size: 1,
            randomSize: 5,
            speed: 0.5,
            duration: 2550,
            stickWhenBottom: true,
            delayRandom: 3500,
            // type: 'hexagon',
            amount: 400,
            bottomY: this.room.view.y + this.room.view.height - 5,
            randomDuration: 50,
            fadding: true,
            gravity: 5,
            opacity: 0.8,
            randomOpacity: 0.5,
            type: 'pixel'
        });
        this.bodyview.tint = 0xFF0000;
    }
};