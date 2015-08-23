window.boot = window.boot || {};
window.boot.directors = window.boot.directors || {};

window.boot.directors.main = function() {
    this.init();
};

window.boot.directors.main.prototype = {

    init: function(stage) {
        window.boot.width = boot.config.width;
        // if (window.boot.width < 1050) {
        //   window.boot.width = 1050;
        // }

        document.getElementById('loader').remove();

    },
    initializeWorld: function() {
        if (this.world) {
            return;
        }
        this.world = window.world = {};
        this.world.player = new boot.dataModels.Player({
            world: this.world
        });
        this.initializePersons();
    },
    initializePersons: function() {
        for (var i = 0; i < 8; i++) {
            var person = new window.boot.dataModels.Person({});

            this.world.player.addPerson(person);
        }
        var xeno = new window.boot.dataModels.Xenomorph();
        this.world.player.addXenomorph(xeno);
    },
    startScreen: function() {
        this.stage = new window.boot.stages.startStage();
        this.stage.init({});
        boot.currentStage.engine.running = true;
    },
    startBoatView: function(options) {
        options = options || {};
        this.stage = new window.boot.stages.bootStage();
        this.stage.init({});

        this.initializeWorld();
        this.world.playerBoat = new window.boot.models.EarlyUboat({
            world: this.world,
            player: this.world.player
        });
        for (var i in this.world.player.people) {
            var person = new window.boot.models.Person({
                stage: boot.currentStage,
                model: this.world.player.people[i]
            });
            this.world.playerBoat.addPerson(person);
        }

        var xeno = new boot.models.Xenomorph({
            stage: boot.currentStage,
            model: this.world.player.xeno
        });

        this.world.playerBoat.addXeno(xeno);

        window.boot.currentStage.initHud({
            world: this.world,
            assault: options.assault
        });
        // this.initEncounters(options);
        boot.currentStage.engine.running = true;
    }

};
window.boot.mainDirector = new boot.directors.main();
window.boot.mainDirector.startScreen();
