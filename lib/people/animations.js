window.boot = window.boot || {};
window.boot.animations = window.boot.animations || {};

window.boot.animations.person = function() {};

window.boot.animations.person.prototype = {
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
            this.headContainer.y = -12;
            this.headContainer.x = 7;
            this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].standing);
            this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].standing);
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body.standing[0]);
            }
            this.setFacialFeatures('standing');
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    animateSideWork: function() {
        if (this.counter % 7 === 0) {
            var bodyStep = (this.counter / 7 + this.randomSeed) % this.assets[this.textureType].body.sideWork.length;
            this.headContainer.y = -10;
            this.headContainer.x = 7;
            this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].side[0]);
            this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].side);
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
            this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].back);
            this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].back);
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
            this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].side[0]);
            this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].side);
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
            [11, -8],
            [11, -5],
            [9, 2],
            [7, 10],
            [0, 22]
        ];

        this.deadAnimationStep = this.deadAnimationStep || 0;
        if (this.counter % 10 === 0) {
            if (this.deadAnimationStep > 5) {

            } else {
                var bodyStep = this.deadAnimationStep;
                this.headContainer.y = headPositions[bodyStep][1];
                this.headContainer.x = headPositions[bodyStep][0];
                this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].standing);
                if (bodyStep > 4) {
                    this.headContainer.pivot.set(48 * bodyStep / 5, 20 * bodyStep / 5);
                    this.headContainer.rotation = -1.9 * bodyStep / 5;
                }
                this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].standing);
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
        if (this.counter % 5 === 0) {
            var bodyStep = (this.counter / 5 + this.randomSeed) % this.assets[this.textureType].body.climbing.length;
            this.headContainer.y = -8;
            this.headContainer.x = 7;
            this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].back);
            this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].back);
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body.climbing[bodyStep]);
            }
            this.setFacialFeatures('back');
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    animateAttack: function() {
        if (this.counter % 7 === 0) {
            var attackDirection = 'attack';
            var headDirection = 'side';
            if (this.enemyTarget && this.enemyTarget.view.x < this.view.x) {
                attackDirection = 'attackLeft';
                headDirection = 'sideLeft';
            }
            var bodyStep = (this.counter / 7 + this.randomSeed) % this.assets[this.textureType].body[attackDirection].length;
            if (!this.enemyTarget || !this.canSeeXeno() || !this.enemyTarget.model.health) {
                bodyStep = 0;
            }

            if (this.enemyTarget && this.enemyTarget.view.x < this.view.x) {
                this.headContainer.y = -14;
                this.headContainer.x = 14;
            } else {

                this.headContainer.y = -14;
                this.headContainer.x = 5;
            }
            this.headview.setTexture(this.assets[this.textureType].head[this.model.headType][headDirection][0]);
            this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType][headDirection]);
            if (this.bodyview) {
                this.bodyview.setTexture(this.assets[this.textureType].body[attackDirection][bodyStep]);
            }

            this.setFacialFeatures('side');
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    animateYawning: function() {
        if (this.counter % 12 === 0) {
            var bodyStep = 8 - this.colorStatusTime;
            this.headContainer.y = -12;
            this.headContainer.x = 7;
            this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].talking[0]);
            this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].standing);
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
            this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].talking[bodyStep]);
            this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].standing);
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
        this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].sideLeft[0]);
        this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].sideLeft);
        if (this.bodyview) {
            this.bodyview.setTexture(this.assets[this.textureType].body.runningLeft[bodyStep]);
        }
        this.setFacialFeatures('sideLeft');
    },

    animateMoving: function(counter) {
        if (this.counter % 6 === 0) {
            var bodyStep = (this.counter / 6 + this.randomSeed) % this.assets[this.textureType].body.running.length;

            if (this.isMovingLeft) {
                this.headContainer.y = -12;
                this.headContainer.x = 4;
                this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].sideLeft[0]);
                this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].sideLeft);
                if (this.bodyview) {
                    this.bodyview.setTexture(this.assets[this.textureType].body.runningLeft[bodyStep]);
                }
                this.setFacialFeatures('sideLeft');
            } else {
                this.headContainer.y = -12;
                this.headContainer.x = 9;
                this.headview.setTexture(this.assets[this.textureType].head[this.model.headType].side[0]);
                this.hairview.setTexture(this.assets[this.textureType].hair[this.model.hairType].side);
                if (this.bodyview) {
                    this.bodyview.setTexture(this.assets[this.textureType].body.running[bodyStep]);

                }
                this.setFacialFeatures('side');
            }
            this.moveView(this.pos.x, this.pos.y);
        }
    },
    showMachineGunSparks: function() {
        var positionX = 5;
        var direction = 1;
        if (this.enemyTarget && this.enemyTarget.view.x > this.view.x) {
            direction = 0;
            positionX = 40;
        }
        var explosion = new pixEngine.ParticleGenerator({
            stage: this.stage,
            container: this.extContainer,
            origin: {
                x: this.view.x + positionX,
                y: this.view.y + this.view.height / 2 - 6
            },
            randomOrigin: {
                x: 2,
                y: 2
            },
            colors: [0x666666, 0x000000, 0x111111, 0xEDEDED, 0xFF5555, 0xFFFF222, 0xFF3333, 0xFFFF66, 0x777777],
            size: 1,
            randomSize: 3,
            speed: 0.1,
            direction: Math.PI / 2,
            duration: 30,
            delayRandom: 400,
            // type: 'hexagon',
            amount: 30,
            randomDuration: 50,
            fadding: true,
            gravity: 0.0001,
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
            spread: Math.PI / 16,
            direction: Math.PI * direction,
            duration: 15,
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
                x: 4,
                y: 4
            },
            colors: [0xFF0000, 0x990000, 0x880000, 0xEE0000],
            size: 1,
            spread: spread,
            randomSize: 4,
            speed: .5,
            bottomY: this.room.view.y + this.room.view.height - 5,
            stickWhenBottom: true,
            direction: direction,
            duration: 200,
            delayRandom: 400,
            // type: 'hexagon',
            amount: 15,
            randomDuration: 50,
            fadding: true,
            gravity: 10,
            opacity: 0.8,
            randomOpacity: 0.5,
            type: 'pixel'
        });
    }
};