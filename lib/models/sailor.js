window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

( function() {
    var ranks = [
        'Seaman',
        'Specialist',
        'Sergeant',
        'Officer'
    ];
    var person = function(options) {
        pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
        this.init(options);
    };
    person.prototype = {
        hairColors: [0x333333, 0x763333, 0x553333, 0x444444, 0xDDBB55, 0xCDAA55, 0xEEDD88, 0xEE9D88, 0x555533, 0x995555, 0x958533, 0xCCCC33, 0xCC5522],
        culture: 'germanic',
        name: 'name placeholder',
        rank: 'Seaman',
        rankLevel: 0,
        country: 'germany',
        gender: 'm',
        health: 100,
        morale: 100,
        loyalty: 60,
        ethics: 100,
        currentLevel: 0,
        npc: false,
        assets: boot.assets.person,
        speed: 1.5,
        facialIncompatibilities: {
            "0": [0, 1, 4, 5, 6],
            "1": [0, 1, 4, 5, 6],
            "2": [2, 3],
            "3": [2, 3],
            "4": [0, 1, 4, 5, 6],
            "5": [0, 1, 4, 5, 6],
            "6": [0, 1, 4, 5, 6],
            "7": [7, 8, 11],
            "8": [7, 8, 11],
            "9": [],
            "10": [],
            "11": [7, 8, 11]
        },
        init: function(options) {
            options = options || {};
            this.country = options.country || this.country;
            this.npc = options.npc || this.npc;
            this.name = pixEngine.nameGenerator(this.culture, 0);
            this.attributes = new window.boot.models.PersonAttributes();
            this.workHability = new window.boot.models.WorkHability({
                attributes: this.attributes
            });
            this.randomizeLook();
        },
        promote: function() {
            this.rankLevel++;
            this.rank = ranks[this.rankLevel];
            this.attributes.updateLevel();
        },
        getInfluenceForRecruit: function() {
            var influenceRequired = [10, 30, 100, 300];
            return influenceRequired[this.rankLevel];
        },
        randomizeLook: function() {
            this.headType = Math.randInt(this.assets.textures.head.length);
            this.hairType = Math.randInt(this.assets.textures.hair.length);
            this.hairColor = this.hairColors.getRandom();
            this.numberOfFacialFeatures = 0;
            var numberOfFacialFeatures = 0;
            this.facialFeatures = [];
            var currentFeats = [];
        },
        add: function(attr, value) {
            this[attr] += value;
            if (this[attr] >= 100) {
                this[attr] = 100;
            }
            if (this[attr] <= 0) {
                this[attr] = 0;
            }
        },
        die: function() {}
    };

    window.boot.dataModels.Person = person;
} )();