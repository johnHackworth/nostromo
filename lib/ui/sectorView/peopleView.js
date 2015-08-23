window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

( function() {
    var peopleView = function(options) {
        this.stage = options.stage;
        this.container = options.container;
        this.outsideContainer = options.outsideContainer;
        this.talkContainer = options.talkContainer;
        pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
        this.init();
    };
    peopleView.prototype = {
        peopleViews: [],
        people: [],
        init: function() {
            this.peopleViews = [];
            this.people = [];
            this.addPeople();
        },
        addPeople: function() {
            var people = this.stage.world.playerBoat.people;
            for (var i = 0, l = people.length; i < l; i++) {
                this.addPerson(people[i]);
            }
        },
        addPerson: function(person) {
            person.initView(this.talkContainer);
            this.peopleViews.push(person.view);
            this.people.push(person);
            this.container.addChild(person.view);
        }
    };
    window.boot.ui.PeopleView = peopleView;
} )();