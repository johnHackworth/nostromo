window.boot = window.boot || {};
window.boot.assets = window.boot.assets || {};

window.boot.assets.person = {
    initTextures: function() {
        this.textures = {};
        this.texturesHighRes = {};
        this.initBodyTextures();
        this.initHeadTextures();
        this.initHairTextures();
    },
    initBodyTextures: function() {
        this.bodySpriteSheet = PIXI.Texture.fromImage('assets/people/person.sheet.png');

        this.textures.body = {};
        var i = 0;
        var h = 100;
        var w = 70 * 100 / 100;
        this.textures.body.standing = [];
        for (i = 0; i < 8; i++) {
            this.textures.body.standing.push(this.getTexture(this.bodySpriteSheet, w, h, h * 0, i));
        }
        this.textures.body.working = [];
        for (i = 1; i < 8; i++) {
            this.textures.body.working.push(this.getTexture(this.bodySpriteSheet, w, h, h * 0, i));
        }
        this.textures.body.running = [];
        for (i = 0; i < 9; i++) {
            this.textures.body.running.push(this.getTexture(this.bodySpriteSheet, w, h, h, i));
        }
        this.textures.body.runningLeft = [];
        for (i = 0; i < 9; i++) {
            this.textures.body.runningLeft.push(this.getTexture(this.bodySpriteSheet, w, h, h * 2, i));
        }
        this.textures.body.climbing = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.climbing.push(this.getTexture(this.bodySpriteSheet, w, h, h * 3, i));
        }
        this.textures.body.fixing = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.fixing.push(this.getTexture(this.bodySpriteSheet, w, h, h * 4, i));
        }
        this.textures.body.fixing2 = [];
        for (i = 0; i < 6; i++) {
            this.textures.body.fixing2.push(this.getTexture(this.bodySpriteSheet, w, h, h * 5, i));
        }
        this.textures.body.standingColor = [];
        for (i = 0; i < 8; i++) {
            this.textures.body.standingColor.push(this.getTexture(this.bodySpriteSheet, w, h, h * 6, i));
        }
        this.textures.body.sideWork = [];
        for (i = 0; i < 1; i++) {
            this.textures.body.sideWork.push(this.getTexture(this.bodySpriteSheet, w, h, h * 7, i));
        }
        this.textures.body.death = [];
        for (i = 0; i < 6; i++) {
            this.textures.body.death.push(this.getTexture(this.bodySpriteSheet, w, h, h * 8, i));
        }

        this.textures.body.attack = [];
        for (i = 0; i < 2; i++) {
            this.textures.body.attack.push(this.getTexture(this.bodySpriteSheet, w, h, h * 9, i));
        }
        this.textures.body.attackLeft = [];
        for (i = 0; i < 2; i++) {
            this.textures.body.attackLeft.push(this.getTexture(this.bodySpriteSheet, w, h, h * 10, i));
        }
    },

    initHeadTextures: function() {
        this.headSpriteSheet = PIXI.Texture.fromImage('assets/people/head.sheet.png');
        this.textures.head = [];
        var i = 0;
        var j = 0;
        var w = 100;
        for (i = 0; i < 3; i++) {
            this.textures.head[i] = {};
            this.textures.head[i].standing = (
                new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(0, w + i * w * 2, w, w))
                );
            this.textures.head[i].back = (
                new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(w * 6, w + i * w * 2, w, w))
                );
            this.textures.head[i].blinking = (
                new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(w, w + i * w * 2, w, w))
                );
            this.textures.head[i].talking = [];
            for (j = 0; j < 4; j++) {
                this.textures.head[i].talking.push(
                    new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(w * 2 + w * j, w + i * w * 2, w, w))
                );
            }
            this.textures.head[i].side = [];
            for (j = 0; j < 2; j++) {
                this.textures.head[i].side.push(
                    new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(w * j, i * w * 2, w, w))
                );
            }
            this.textures.head[i].sideLeft = [];
            for (j = 0; j < 2; j++) {
                this.textures.head[i].sideLeft.push(
                    new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(2 * w + w * j, i * w * 2, w, w))
                );
            }

            this.textures.head[i].background = [];
            this.textures.head[i].background.push(new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(400, 400, 100, 100)));
            this.textures.head[i].background.push(new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(500, 400, 100, 100)));
            this.textures.head[i].background.push(new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(600, 400, 100, 100)));
        }
    },
    initHairTextures: function() {
        this.hairSpriteSheet = PIXI.Texture.fromImage('assets/people/hair.sheet.png');
        this.textures.hair = [];
        var i = 0;
        var j = 0;
        var w = 100;
        for (i = 0; i < 7; i++) {
            this.textures.hair[i] = {};
            this.textures.hair[i].standing = (
                new PIXI.Texture(this.hairSpriteSheet, new PIXI.Rectangle(0, w * i, w, w))
                );

            this.textures.hair[i].back = (
                new PIXI.Texture(this.hairSpriteSheet, new PIXI.Rectangle(2 * w, w * i, w, w))
                );

            this.textures.hair[i].side = (
                new PIXI.Texture(this.hairSpriteSheet, new PIXI.Rectangle(w, w * i, w, w))
                );

            this.textures.hair[i].sideLeft = (
                new PIXI.Texture(this.hairSpriteSheet, new PIXI.Rectangle(3 * w, w * i, w, w))
                );

        }
    },
    getTexture: function(spriteSheet, width, height, offsetY, i) {
        var sheetHeight = 100 * 10;
        return new PIXI.Texture(spriteSheet, new PIXI.Rectangle(width * i, sheetHeight - offsetY, width, height));
    }
};
window.boot.assets.person.initTextures();