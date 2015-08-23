window.boot = window.boot || {};
window.boot.assets = window.boot.assets || {};

window.boot.assets.xeno = {
    initTextures: function() {
        this.textures = {};
        this.texturesHighRes = {};
        this.initBodyTextures();
    },
    initBodyTextures: function() {
        this.bodySpriteSheet = PIXI.Texture.fromImage('assets/people/xeno.png');

        this.textures.body = {};
        var i = 0;
        var h = 100;
        var w = 140 * 100 / 100;
        this.textures.body.standing = [];
        for (i = 0; i < 2; i++) {
            this.textures.body.standing.push(this.getTexture(this.bodySpriteSheet, w, h, h * 0, i));
        }
        this.textures.body.standingLeft = [];
        for (i = 2; i < 4; i++) {
            this.textures.body.standingLeft.push(this.getTexture(this.bodySpriteSheet, w, h, h * 0, i));
        }
        this.textures.body.running = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.running.push(this.getTexture(this.bodySpriteSheet, w, h, h, i));
        }
        this.textures.body.runningLeft = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.runningLeft.push(this.getTexture(this.bodySpriteSheet, w, h, h * 2, i));
        }
        this.textures.body.climbing = [];
        for (i = 0; i < 3; i++) {
            this.textures.body.climbing.push(this.getTexture(this.bodySpriteSheet, w, h, h * 3, i));
        }

        this.textures.body.standingColor = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.standingColor.push(this.getTexture(this.bodySpriteSheet, w, h, h * 6, i));
        }

        this.textures.body.death = [];
        for (i = 0; i < 3; i++) {
            this.textures.body.death.push(this.getTexture(this.bodySpriteSheet, w, h, h * 8, i));
        }

        this.textures.body.attack = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.attack.push(this.getTexture(this.bodySpriteSheet, w, h, h * 9, i));
        }
        this.textures.body.attackLeft = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.attackLeft.push(this.getTexture(this.bodySpriteSheet, w, h, h * 10, i));
        }

        this.textures.body.attack2 = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.attack2.push(this.getTexture(this.bodySpriteSheet, w, h, h * 7, i));
        }
        this.textures.body.attack2Left = [];
        for (i = 0; i < 4; i++) {
            this.textures.body.attack2Left.push(this.getTexture(this.bodySpriteSheet, w, h, h * 8, i));
        }

    },
    getTexture: function(spriteSheet, width, height, offsetY, i) {
        var sheetHeight = 100 * 10;
        return new PIXI.Texture(spriteSheet, new PIXI.Rectangle(width * i, sheetHeight - offsetY, width, height));
    }
};
window.boot.assets.xeno.initTextures();