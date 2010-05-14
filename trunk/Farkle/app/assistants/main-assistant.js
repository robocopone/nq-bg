var global = {
	initialDate: new Date().getTime(),
	name: "",
	scores: [],
	initialized: false,
}

var farkleCookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberFreeFallFree");
		var storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.0.0") {
			global.scores = storedData.scores.slice(0);
			global.name = storedData.name;
			global.initialDate = storedData.initialDate;
			global.initialized = storedData.initialized;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		var tmpScores = global.scores.slice(0)
		this.cookieData.put({
			version: "1.0.0",
			initialDate: global.initialDate,
			scores: tmpScores,
			name: global.name,
			initialized: global.initialized
		})		
	}
});

function MainAssistant(){
}

MainAssistant.prototype.setup = function(){
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn('****************Started Setup Function****************')
    
	farkleCookie.initialize();
	if (!global.initialized) {
		global.scores[1] = {}
		global.scores[1].name = "bleh"
		global.scores[1].score = 1
		global.scores[1].date = new Date()
		global.initialized = true;
	}
	farkleCookie.storeCookie();
	farkleCookie.initialize();

    this.initialize();
    
    this.controller.listen(this.playArea.getCupHandler(), Mojo.Event.tap, this.cupTapped.bindAsEventListener(this))
    this.controller.listen(this.playArea.getCurrentScoreHandler(), Mojo.Event.tap, this.currentScoreTapped.bindAsEventListener(this))
    for (var x = 1; x <= 6; x++) 
        this.controller.listen(this.playArea.getDieHandler(x), Mojo.Event.tap, this.dieTapped.bindAsEventListener(this))
    this.controller.listen(document, 'shakestart', this.handleShake.bindAsEventListener(this));
};

MainAssistant.prototype.cleanup = function(event){
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn('***************Started Cleanup Function***************')
    
    this.controller.stopListening(this.playArea.getCupHandler(), Mojo.Event.tap, this.cupTapped.bindAsEventListener(this))
    this.controller.stopListening(this.playArea.getCurrentScoreHandler(), Mojo.Event.tap, this.currentScoreTapped.bindAsEventListener(this))
    for (var x = 1; x <= 6; x++) 
        this.controller.stopListening(this.playArea.getDieHandler(x), Mojo.Event.tap, this.dieTapped.bindAsEventListener(this))
    this.controller.stopListening(document, 'shakestart', this.handleShake.bindAsEventListener(this));
	farkleCookie.storeCookie();
};

MainAssistant.prototype.handleShake = function(){
    this.playArea.roll()
}
MainAssistant.prototype.cupTapped = function(){
    this.playArea.roll()
}

MainAssistant.prototype.currentScoreTapped = function(){
    this.playArea.currentScoreTapped();
}

MainAssistant.prototype.dieTapped = function(event){
    this.playArea.dieTapped(parseInt(event.srcElement.id.substring(3)))
}

MainAssistant.prototype.initialize = function(){
    var dice = []
    for (var x = 1; x <= 6; x++) 
        dice[x] = new die(x, this.controller.get('die' + x))
    
    this.playArea = new board(this.controller.get('cup'), dice, this.controller.get('currentScore'), this.controller.get('totalScore'), this.controller.get('round'), this.controller.get('farkle'), this.controller);
}

/*
 */
MainAssistant.prototype.activate = function(event){
};
MainAssistant.prototype.deactivate = function(event){
};

/*
MainAssistant.prototype.die1Tapped = function(event){
	for (var prop in event.srcElement) {
		Mojo.Log.info("PROPERTY: " + prop);
		Mojo.Log.info("==> " + event.srcElement[prop]);
	}
}
*/
