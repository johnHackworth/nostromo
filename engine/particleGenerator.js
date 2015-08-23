window.pixEngine = window.pixEngine || {};
var pixengineTextures = {
    pixel: PIXI.Texture.fromImage('engine/assets/pixel.png'),
    circle: PIXI.Texture.fromImage('engine/assets/pixelCircle.png'),
    round: PIXI.Texture.fromImage('engine/assets/pixelRound.png')
};
pixEngine.ParticleGenerator = function(options) {
    this.textures = pixengineTextures;
    this.options = options;
    this.stage = options.stage;
    this.container = options.container;
    this.lineFactor = options.lineFactor || 5;
    this.origin = options.origin;
    this.speed = typeof (options.speed) != "undefined" ? options.speed : 10;
    this.randomSpeed = options.randomSpeed || 0;
    this.colors = options.colors;
    this.amount = options.amount || 20;
    this.randomAmount = options.randomAmount || 0;
    this.size = options.size || 10;
    this.opacity = options.opacity || 1;
    this.randomOpacity = options.randomOpacity || 0;
    this.randomSize = options.randomSize || 0;
    this.duration = options.duration || 100;
    this.randomDuration = options.randomDuration || 0;
    this.gravity = options.gravity || 10;
    this.fadding = options.fadding;
    this.fadeInFadeOut = options.fadeInFadeOut;
    this.brittle = options.brittle;
    this.particleRotation = options.particleRotation;
    this.delay = options.delay || 0;
    this.delayRandom = options.delayRandom || 0;
    this.direction = typeof options.direction == 'undefined' ? 0 : options.direction;
    this.spread = options.spread || 2 * Math.PI;
    this.topY = options.topY;
    this.bottomY = options.bottomY;
    this.stickWhenBottom = options.stickWhenBottom;
    this.after = options.after;
    this.before = options.before;
    this.tint = options.tint;
    this.randomOrigin = options.randomOrigin || {
            x: 0,
            y: 0
        };
    this.type = options.type || 'pixel';
    this.init();
};
pixEngine.ParticleGenerator.prototype = {
    init: function() {
        this.initParticles();
    },
    initParticles: function() {
        this.view = [];
        var randomAmount = 1 * Math.randInt(this.randomAmount);
        this.createParticle();
        this.liveParticles = this.amount + this.randomAmount;
        for (var n = this.amount + randomAmount; n; n--) {
            setTimeout(this.createParticle.bind(this), this.delay + Math.randInt(this.delayRandom));
        }
        if (this.container) {
            this.stage.addNotVisualEntity(this);
        } else {
            if (this.after) {
                this.stage.addEntityAfter(this, this.after);
            } else if (this.before) {
                this.stage.addEntityBefore(this, this.before);
            } else {
                this.stage.addEntity(this);
            }
        }
    },
    getRandomColor: function() {
        var n = Math.randInt(this.colors.length);
        return this.colors[n];
    },
    getRandomOrigin: function() {
        var x = Math.floor(this.randomOrigin.x / 2) - Math.randInt(this.randomOrigin.x);
        var y = Math.floor(this.randomOrigin.y / 2) - Math.randInt(this.randomOrigin.y);
        return {
            x: x,
            y: y
        };
    },
    createPixelParticle: function() {
        var particle = this.getPixel();
        var size = this.size + (1 * Math.randInt(this.randomSize));

        var randomOrigin = this.getRandomOrigin();
        particle.x = Math.floor(this.origin.x + randomOrigin.x - size / 2);
        particle.y = Math.floor(this.origin.y + randomOrigin.y - size / 2);

        var speed = this.speed + (1 * Math.randInt(this.randomSpeed));

        particle.direction = (this.direction + this.spread / 2) - this.spread * Math.random();

        particle.velocity = {
            x: Math.cos(particle.direction) * speed,
            y: Math.sin(particle.direction) * speed
        };
        particle.duration = this.duration + (1 * Math.randInt(this.randomDuration));
        if (this.fadeInFadeOut) {
            particle.alphaReached = false;
            particle.alpha = 0;
            particle.alphaGoal = this.opacity + (Math.random() * this.randomOpacity);
            particle.fadding = particle.alphaGoal / particle.duration * 2;
        } else {
            particle.alpha = this.opacity + (Math.random() * this.randomOpacity);
            particle.fadding = this.fadding ? particle.alpha / particle.duration : 0;
        }

        particle.viewType = 'particle';
        if (this.container) {
            this.container.addChild(particle);
        } else {
            if (this.after) {
                this.stage.addViewAfter(particle, this.after);
            } else if (this.before) {
                this.stage.addViewBefore(particle, this.before);
            } else {
                this.stage.addVisualEntity(particle);
            }
        }

        if (this.tint) {
            particle.tint = this.tint;
        } else {
            particle.tint = this.getRandomColor();
        }
        this.view.push(particle);
    },
    getPixel: function() {
        var particle = null;
        var size = this.size + (1 * Math.randInt(this.randomSize));
        if (this.type === 'pixel' ||
            this.type === 'pixelLine') {
            particle = new PIXI.Sprite(this.textures.pixel);
            particle.width = size;
            particle.height = size;
            if (this.type === 'pixelLine') {
                particle.height = Math.ceil(size / this.lineFactor);
                if (this.particleRotation) {
                    particle.rotation = this.particleRotation;
                }
            }
        } else if (this.type === 'pixelRound') {
            particle = new PIXI.Sprite(this.textures.round);
            particle.width = size;
            particle.height = size;
        } else if (this.type === 'pixelCircle') {
            particle = new PIXI.Sprite(this.textures.circle);
            particle.width = size;
            particle.height = size;
        } else {
            particle = new PIXI.Sprite(this.textures.pixel);
            particle.width = size;
            particle.height = size;
        }
        particle.anchor = {
            x: 0.5,
            y: 0
        };
        return particle;
    },
    createParticle: function() {
        if (!this.view) {
            return;
        }
        if (this.type && this.type.indexOf('pixel') >= 0) {
            return this.createPixelParticle();
        } else {
            return this.createGraphicsParticle();
        }
    },
    createGraphicsParticle: function() {
        if (this.options.debug) {
            debugger;
        }
        if (this.view) {

            var particle = new PIXI.Graphics();
            particle.clear();
            particle.beginFill(this.getRandomColor());
            var size = this.size + (1 * Math.randInt(this.randomSize));
            var randomOrigin = this.getRandomOrigin();
            var center = {
                x: Math.floor(this.origin.x + randomOrigin.x - size / 2),
                y: Math.floor(this.origin.y + randomOrigin.y - size / 2)
            };
            var speed = this.speed + (1 * Math.randInt(this.randomSpeed));

            particle.direction = (this.direction + this.spread / 2) - this.spread * Math.random();

            particle.velocity = {
                x: Math.cos(particle.direction) * speed,
                y: Math.sin(particle.direction) * speed
            };
            particle.duration = this.duration + (1 * Math.randInt(this.randomDuration));
            if (this.type == 'hexagon') {
                this.createHexagonParticle(particle, {
                    x: 0,
                    y: 0
                }, size);
            } else if (this.type == 'trapezoid') {
                this.createTrapezoidParticle(particle, {
                    x: 0,
                    y: 0
                }, size);
            } else if (this.type == 'thinLine') {
                this.createThinLineParticle(particle, {
                    x: 0,
                    y: 0
                }, size);
            } else if (this.type == 'line') {
                this.createLineParticle(particle, {
                    x: 0,
                    y: 0
                }, size);
            } else if (this.type == 'square') {
                this.createSquareParticle(particle, {
                    x: 0,
                    y: 0
                }, size);
            } else if (this.type == 'round') {
                this.createRoundParticle(particle, {
                    x: 0,
                    y: 0
                }, size);
            } else {
                this.createHexagonParticle(particle, {
                    x: 0,
                    y: 0
                }, size);
            }
            particle.endFill();

            if (this.fadeInFadeOut) {
                particle.alphaReached = false;
                particle.alpha = 0;
                particle.alphaGoal = this.opacity + (Math.random() * this.randomOpacity);
                particle.fadding = particle.alphaGoal / particle.duration * 2;
            } else {
                particle.alpha = this.opacity + (Math.random() * this.randomOpacity);
                particle.fadding = this.fadding ? particle.alpha / particle.duration : 0;
            }

            particle.viewType = 'particle';
            if (this.container) {
                this.container.addChild(particle);
            } else {
                if (this.after) {
                    this.stage.addViewAfter(particle, this.after);
                } else if (this.before) {
                    this.stage.addViewBefore(particle, this.before);
                } else {
                    this.stage.addVisualEntity(particle);
                }
            }
            particle.x = center.x;
            particle.y = center.y;

            if (this.tint) {
                particle.tint = this.tint;
            }
            this.view.push(particle);
        }
    },
    createRoundParticle: function(particle, center, size) {
        particle.drawCircle(center.x, center.y, size);
    },
    createSquareParticle: function(particle, center, size) {
        particle.moveTo(center.x, center.y);
        particle.lineTo(center.x + size, center.y);
        particle.lineTo(center.x + size, center.y + size);
        particle.lineTo(center.x, center.y + size);
        particle.lineTo(center.x, center.y);
    },
    createHexagonParticle: function(particle, center, size) {
        var cut = size / 4;
        particle.moveTo(center.x, center.y);
        particle.lineTo(center.x + size / 2 - cut, center.y);
        particle.lineTo(center.x + size / 2, center.y + size / 2);
        particle.lineTo(center.x + size / 2 - cut, center.y + size);
        particle.lineTo(center.x - size / 2 + cut, center.y + size);
        particle.lineTo(center.x - size / 2, center.y + size / 2);
        particle.lineTo(center.x - size / 2 + cut, center.y);
        particle.lineTo(center.x, center.y);
    },
    createTrapezoidParticle: function(particle, center, size) {
        var cut = size / 4;
        particle.moveTo(center.x, center.y);
        particle.lineTo(center.x + size / 2 - cut, center.y);
        particle.lineTo(center.x + size / 2, center.y + size / 2);
        particle.lineTo(center.x - size / 2, center.y + size / 2);
        particle.lineTo(center.x - size / 2 + cut, center.y);
        particle.lineTo(center.x, center.y);
    },
    createLineParticle: function(particle, center, size) {
        var cut = 1; //size / 4;
        var linewidth = Math.ceil(size / 10);
        particle.moveTo(center.x, center.y);
        particle.lineTo(center.x + size / 2 - cut, center.y);
        particle.lineTo(center.x + size / 2, center.y + linewidth);
        particle.lineTo(center.x - size / 2, center.y + linewidth);
        particle.lineTo(center.x - size / 2 + cut, center.y);
        particle.lineTo(center.x, center.y);
    },
    createThinLineParticle: function(particle, center, size) {
        var cut = 1; //size / 4;
        var linewidth = Math.ceil(size / 30);
        particle.moveTo(center.x, center.y);
        particle.lineTo(center.x + size / 2 - cut, center.y);
        particle.lineTo(center.x + size / 2, center.y + linewidth);
        particle.lineTo(center.x - size / 2, center.y + linewidth);
        particle.lineTo(center.x - size / 2 + cut, center.y);
        particle.lineTo(center.x, center.y);
    },
    tick: function(counter) {
        if (this.options.debug) {
            debugger;
        }
        var removables = [];
        for (var i in this.view) {
            this.view[i].x += this.view[i].velocity.x;
            this.view[i].y += this.view[i].velocity.y;

            if (this.bottomY && this.view[i].y > this.bottomY) {
                this.view[i].y = this.bottomY;
                if (this.stickWhenBottom) {
                    this.view[i].x -= this.view[i].velocity.x;
                }
            }
            // if (this.options.debug) console.log(this.view[i].y, this.topY);
            if (this.topY && this.view[i].y < this.topY) {
                //if (this.options.debug) console.log(this.view[i].y, this.topY);
                this.view[i].y = this.topY;
            }
            this.view[i].velocity.y += this.gravity / 600;
            if (this.fadeInFadeOut) {
                if (this.view[i].alphaReached) {
                    this.view[i].alpha -= this.view[i].fadding;
                } else {
                    this.view[i].alpha += this.view[i].fadding;
                }
                if (this.view[i].alpha >= this.view[i].alphaGoal) {
                    this.view[i].alphaReached = true;
                }
            } else {
                this.view[i].alpha -= this.view[i].fadding;
            }
            if (this.brittle) {
                if (Math.random() > this.brittle) {
                    this.view[i].alpha = Math.random() * this.opacity + (Math.random() * this.randomOpacity);
                }
                if (Math.random() > this.brittle) {
                    this.view[i].x += 1 - Math.randInt(3);
                }
                if (Math.random() > this.brittle) {
                    this.view[i].y += 1 - Math.randInt(3);
                }
                if (Math.random() > this.brittle) {
                    this.view[i].rotation = (1 - Math.randInt(3)) * 0.01;
                }

            }
            this.view[i].duration--;
            if (!this.view[i].duration || this.view[i].duration <= 0) {
                removables.push(this.view[i]);
            }
        }
        this.removeDeprecated(removables);
    },
    removeDeprecated: function(removables) {
        while (removables.length) {
            var particle = removables.pop();

            if (this.container) {
                this.container.removeChild(particle);
            } else {
                this.stage.removeView(particle);
            }
            this.view.removeElement(particle);
            this.liveParticles--;
        }
        if (!this.view.length && !this.view.liveParticles) {
            this.stage.removeEntity(this);
            this.view = null;
        }

    }
};