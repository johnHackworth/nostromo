window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

( function() {
    var personView = function(options) {
        this.stage = options.stage;
        this.people = options.people;
        this.x = window.boot.config.width - 420;
        this.y = window.boot.config.height - 90;
        this.width = 410;
        this.height = 80;
        this.container = options.container;
        this.init();
    };
    personView.prototype = {
        assets: {
            background: 'assets/buttons/paper.png',
            close: 'assets/buttons/close.png',
            maximize: 'assets/buttons/maximize.png',
            minimize: 'assets/buttons/minimize.png',
            fixInactive: 'assets/buttons/fixInactive.png',
            fixActive: 'assets/buttons/fixActive.png',
            fightInactive: 'assets/buttons/fightInactive.png',
            fightActive: 'assets/buttons/fightActive.png',
            attrPath: 'assets/people/attrs/'
        },
        init: function() {
            this.addPannel();
        },
        changeTarget: function(person) {
            var self = this;
            this.person = person;
            this.clear();
            this.backPannel.visible = true;
            this.showName();
            this.showFace();
            this.showHealthAndMorale();
            this.showWindowButtons();
            this.showPerkAndDeffects(90);
            this.showAttributes('physicalAttributes', 145);
            this.showAttributes('mentalAttributes', 235);
            this.showPersonOptionsButtons();
            if (this.maximized) {
                this.maximizeWindow();
            }
        },
        addPannel: function() {
            this.backPannel = new PIXI.Sprite.fromImage(this.assets.background);
            this.backPannel.position.x = this.x;
            this.backPannel.position.y = this.y;
            this.backPannel.height = this.height;
            this.backPannel.width = this.width;
            this.backPannel.tint = 0x333344;
            this.container.addChild(this.backPannel);
            this.backPannel.visible = false;
        },
        clear: function() {
            clearInterval(this.interval);
            for (var i in this.views) {
                this.container.removeChild(this.views[i]);
            }
            this.views = [];
            this.backPannel.position.y = this.y;
            this.backPannel.height = this.height;
            this.backPannel.visible = false;
        },
        showName: function() {
            var view = this.stage.addTextToContainer(this.container, this.person.model.rank + ' ' + this.person.model.name, {
                x: this.x + 70,
                y: this.y + 3,
                fontSize: '12px',
                fontName: 'specialElite',
                color: '#EFEFEF'
            }, this.destroyables);
            this.views.push(view);
        },
        showFace: function() {
            var view = this.person.getFace();
            view.position.x = this.x - 20;
            view.position.y = this.y - 30;
            this.views.push(view);
            this.container.addChild(view);
        },
        showWindowButtons: function() {
            var view = new PIXI.Sprite.fromImage(this.assets.close);
            view.width = 20;
            view.height = 20;
            view.position.x = this.x + this.width - 23;
            view.position.y = this.y + 3;
            view.interactive = true;
            view.click = this.unselectPerson.bind(this);
            this.views.push(view);
            this.container.addChild(view);

            view = new PIXI.Sprite.fromImage(this.assets.maximize);
            view.width = 20;
            view.height = 20;
            view.position.x = this.x + this.width - 46;
            view.position.y = this.y + 3;
            view.interactive = true;
            view.click = this.maximizeWindow.bind(this);
            this.maximizeButton = view;
            this.views.push(view);
            this.container.addChild(view);

            view = new PIXI.Sprite.fromImage(this.assets.minimize);
            view.width = 20;
            view.height = 20;
            view.position.x = this.x + this.width - 46;
            view.position.y = this.y + 3;
            view.interactive = true;
            view.click = this.minimizeWindow.bind(this);
            this.minimizeButton = view;
            view.visible = false;
            this.views.push(view);
            this.container.addChild(view);
        },
        showPersonOptionsButtons: function() {
            var view = new PIXI.Sprite.fromImage(this.assets.fixActive);
            view.width = 20;
            view.height = 20;
            view.position.x = this.x + this.width - 23;
            view.position.y = this.y + this.height - 23;
            view.interactive = true;
            view.click = this.setFix.bind(this, false);
            this.fixActive = view;
            this.views.push(view);
            this.container.addChild(view);

            view = new PIXI.Sprite.fromImage(this.assets.fixInactive);
            view.width = 20;
            view.height = 20;
            view.position.x = this.x + this.width - 23;
            view.position.y = this.y + this.height - 23;
            view.interactive = true;
            view.click = this.setFix.bind(this, true);
            this.fixInactive = view;
            view.visible = false;
            this.views.push(view);
            this.container.addChild(view);
            this.setFix(this.person.isFixer);

            view = new PIXI.Sprite.fromImage(this.assets.fightActive);
            view.width = 20;
            view.height = 20;
            view.position.x = this.x + this.width - 46;
            view.position.y = this.y + this.height - 23;
            view.interactive = true;
            view.click = this.setFighter.bind(this, false);
            this.fightActive = view;
            this.views.push(view);
            this.container.addChild(view);

            view = new PIXI.Sprite.fromImage(this.assets.fightInactive);
            view.width = 20;
            view.height = 20;
            view.position.x = this.x + this.width - 46;
            view.position.y = this.y + this.height - 23;
            view.interactive = true;
            view.click = this.setFighter.bind(this, true);
            this.fightInactive = view;
            view.visible = false;
            this.views.push(view);
            this.container.addChild(view);
            this.setFighter(this.person.isFighter);
        },
        showHealthAndMorale: function() {},
        setFix: function(value) {
            this.person.isFixer = value;
            this.fixActive.visible = this.person.isFixer;
            this.fixInactive.visible = !this.person.isFixer;
        },
        setFighter: function(value) {
            this.person.isFighter = value;
            if (this.person.isFighter) {
                this.person.status = 'attack';
            } else {
                this.person.status = 'idle';
            }
            this.fightActive.visible = this.person.isFighter;
            this.fightInactive.visible = !this.person.isFighter;
        },
        showAttributes: function(attrs, initY) {
            var x = 0;
            var y = 0;
            for (var i in this.person.model.attributes[attrs]) {
                var view = new PIXI.Sprite.fromImage(this.assets.attrPath + this.person.model.attributes[attrs][i] + '.png');
                view.width = 40;
                view.height = 40;
                view.position.x = 10 + this.x + 75 * x;
                view.position.y = this.y + initY + y * 45;
                this.views.push(view);
                this.container.addChild(view);
                var value = this.person.model.attributes[this.person.model.attributes[attrs][i]];
                var text = this.stage.addTextToContainer(this.container, value, {
                    x: 10 + this.x + 75 * x + 45,
                    y: this.y + initY + 5 + y * 45 + 10,
                    fontSize: '14px',
                    fontName: 'specialElite',
                    color: '#EFEFEF'
                }, this.destroyables);
                this.views.push(text);
                x++;
                // console.log(10 + 10 * x, this.width - 100);
                if ((10 + 75 * x) > (this.width - 100)) {
                    x = 0;
                    y++;
                }
                // console.log(x, y);
            }
        },
        showPerkAndDeffects: function(initY) {
            var x = 0;
            var y = 0;
            var view = null;
            for (var i in this.person.model.attributes.perks) {
                view = new PIXI.Sprite.fromImage(this.assets.attrPath + 'perks/' + this.person.model.attributes.perks[i] + '.png');
                view.width = 40;
                view.height = 40;
                view.position.x = 10 + this.x + 50 * x;
                view.position.y = this.y + initY;
                this.views.push(view);
                this.container.addChild(view);
                x++;
            }
            for (i in this.person.model.attributes.deffects) {
                view = new PIXI.Sprite.fromImage(this.assets.attrPath + 'deffects/' + this.person.model.attributes.deffects[i] + '.png');
                view.width = 40;
                view.height = 40;
                view.position.x = 10 + this.x + 50 * x;
                view.position.y = this.y + initY;
                this.views.push(view);
                this.container.addChild(view);
                x++;
            }
        },
        unselectPerson: function() {
            this.people.unselectPerson();
            this.maximized = false;
            this.clear();
        },
        hide: function() {
            this.clear();
        },
        show: function() {
            if (this.objetive) {
                this.changeTarget(this.objetive);
            }
        },
        maximizeWindow: function() {
            this.backPannel.y -= 200;
            this.backPannel.height += 200;
            this.minimizeButton.visible = true;
            this.maximizeButton.visible = false;
            for (var l = this.views.length; l; l--) {
                this.views[l - 1].y -= 200;
            }
            this.maximized = true;
        },
        minimizeWindow: function() {
            this.backPannel.y += 200;
            this.backPannel.height -= 200;
            this.minimizeButton.visible = false;
            this.maximizeButton.visible = true;
            for (var l = this.views.length; l; l--) {
                this.views[l - 1].y += 200;
            }

            this.maximized = false;
        }
    };
    window.boot.ui.PersonView = personView;
} )();