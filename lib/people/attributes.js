window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var personAttributes = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init();
  };
  personAttributes.prototype = {
    level: 0,
    physicalAttributes: ['strength', 'stamina', 'dexterity',
      'intelligence', 'perception', 'mathematics', 'seaKnowledge',
      'weaponKnowledge', 'engineering', 'fighting'
    ],
    mentalAttributes: ['pacifist', 'leftist', 'seafaring', 'brave', 'kinsey'],
    possiblePerks: ['paramedic', 'snipper', 'repairman', 'fighter', 'robust', 'negociator', 'heroic', 'attractive', 'funny'],
    possibleDeffects: ['rude', 'homophobic', 'racist', 'paranoid', 'claustrophobic', 'alcoholic', 'creepy', 'unhealthy'],
    torpedoManagement: 0,
    init: function() {
      this.initPhysicalAttributes();
      this.initMentalAttributes();
      this.initPerks();
      this.initDeffects();
    },
    initPhysicalAttributes: function() {
      for (var i in this.physicalAttributes) {
        var name = this.physicalAttributes[i];
        this[name] = 5 + Math.randInt(50);
      }
    },
    updateLevel: function() {
      this.level++;
      for (var i = 0; i < 3; i++) {
        var attr = Math.randInt(this.physicalAttributes.length);
        var name = this.physicalAttributes[attr];
        this[name] += 10;
        if (this[name] > 99) {
          this[name] = 99;
        }
      }
    },
    initMentalAttributes: function() {
      for (var i in this.mentalAttributes) {
        var name = this.mentalAttributes[i];
        this[name] = 0 + Math.randInt(100);
      }
    },
    getPerk: function() {
      var perk = this.possiblePerks.getRandom();
      if (this.perks.indexOf(perk) === -1) {
        this.perks.push(perk);
      }
      return perk;
    },
    getDeffect: function() {
      var deffect = this.possibleDeffects.getRandom();
      if (this.deffects.indexOf(deffect) === -1) {
        this.deffects.push(deffect);
      }
      return deffect;
    },
    initPerks: function() {
      this.perks = [];
      var possiblePerk = Math.randInt();
      while (possiblePerk > 60) {
        this.getPerk();
        possiblePerk = Math.randInt();
      }
    },
    initDeffects: function() {
      this.deffects = [];
      var possiblePerk = Math.randInt();
      while (possiblePerk > 60) {
        this.getDeffect();
        possiblePerk = Math.randInt();
      }
    }
  };

  window.boot.models.PersonAttributes = personAttributes;
})();