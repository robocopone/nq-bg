//next commit... audio finished, help scene added, scoring/play help added
var global = {
	initialDate: new Date().getTime(),
	name: "",
	scores: [],
	initialized: false,
	audio: true,
	highRoll: 0,
}

var farkleCookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberFreeFallFree");
		var storedData = this.cookieData.get();
		if (storedData && storedData.version >= "1.0.0") {
			global.scores = storedData.scores.slice(0);
			global.name = storedData.name;
			global.initialDate = storedData.initialDate;
			global.initialized = storedData.initialized;
		}
		if (storedData && storedData.version >= "1.0.1") {
			global.audio = storedData.audio
		}
		if (storedData && storedData.version == "1.0.2") {
			global.highRoll = storedData.highRoll
		}
		this.storeCookie();
	},
	storeCookie: function() {
		var tmpScores = global.scores.slice(0)
		this.cookieData.put({
			version: "1.0.2",
			initialDate: global.initialDate,
			scores: tmpScores,
			name: global.name,
			initialized: global.initialized,
			audio: global.audio,
			highRoll: global.highRoll,
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

	// Ok Button Widget
	this.controller.setupWidget('scoringOkButton', atts = {
		type: Mojo.Widget.defaultButton
	}, {
		buttonLabel: 'Ok',
		buttonClass: 'affirmative',
		disabled: false
	});

	this.appMenuModel = {
		items: [{
			label: "New Game",
			command: 'newGame',
			shortcut: 'n'
		}, {
			label: "High Scores",
			command: 'highScores',
			shortcut: 'h'
		}, {
			label: "Scoring Help",
			command: 'scoringHelp',
			shortcut: 's'
		}, {
			label: "Help",
			command: 'help',
		}]
	}
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel); 


	this.cupTappedListener = this.cupTapped.bindAsEventListener(this)
	this.currentScoreTappedListener = this.currentScoreTapped.bindAsEventListener(this)
	this.handleShakeListener = this.handleShake.bindAsEventListener(this)
	this.scoringOkButtonListener = this.scoringOkButton.bindAsEventListener(this)
	this.audioListener = this.audio.bindAsEventListener(this)
	this.dieTappedListener = this.dieTapped.bindAsEventListener(this)
	this.draggingListener = this.dragging.bindAsEventListener(this)
	
	this.controller.listen('audio', Mojo.Event.tap, this.audioListener)
    this.controller.listen('scoringOkButton', Mojo.Event.tap, this.scoringOkButtonListener)
    this.controller.listen(document, 'shakestart', this.handleShakeListener);
    this.controller.listen(this.playArea.getCupHandler(), Mojo.Event.tap, this.cupTappedListener)
    this.controller.listen(this.playArea.getCurrentScoreHandler(), Mojo.Event.tap, this.currentScoreTappedListener)

    for (var x = 1; x <= 6; x++) {
		this.controller.listen(this.playArea.getDieHandler(x), Mojo.Event.tap, this.dieTappedListener)
		this.controller.listen(this.playArea.getDieHandler(x), Mojo.Event.dragStart, this.dieTappedListener)
		this.controller.listen(this.playArea.getDieHandler(x), Mojo.Event.dragging, this.draggingListener)
	}
	this.testOutput = this.controller.get('test')
};
MainAssistant.prototype.cleanup = function(event){
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn('***************Started Cleanup Function***************')
    
	this.controller.stopListening('audio', Mojo.Event.tap, this.audioListener)
    this.controller.stopListening('scoringOkButton', Mojo.Event.tap, this.scoringOkButtonListener)
    this.controller.stopListening(this.playArea.getCupHandler(), Mojo.Event.tap, this.cupTappedListener)
    this.controller.stopListening(this.playArea.getCurrentScoreHandler(), Mojo.Event.tap, this.currentScoreTappedListener)
    for (var x = 1; x <= 6; x++) {
		this.controller.stopListening(this.playArea.getDieHandler(x), Mojo.Event.tap, this.dieTappedListener)
		this.controller.stopListening(this.playArea.getDieHandler(x), Mojo.Event.dragStart, this.dieTappedListener)
		this.controller.stopListening(this.playArea.getDieHandler(x), Mojo.Event.dragging, this.draggingListener)
	}
    this.controller.stopListening(document, 'shakestart', this.handleShakeListener);
	farkleCookie.storeCookie();
};

MainAssistant.prototype.dragging = function (event) {
	if (this.lastId != event.move.toElement.id)
	    this.playArea.dieTapped(parseInt(event.move.toElement.id.substring(3)))
	this.lastId = event.move.toElement.id
}

MainAssistant.prototype.dieTapped = function(event){
	this.lastId = event.srcElement.id
    this.playArea.dieTapped(parseInt(event.srcElement.id.substring(3)))
}

MainAssistant.prototype.audio = function () {
	global.audio = !global.audio
	this.playArea.setAudio(global.audio)
}

MainAssistant.prototype.scoringOkButton = function () {
	this.controller.get('scoring').addClassName('hidden')
	this.controller.get('help').addClassName('hidden')
}

MainAssistant.prototype.handleShake = function(){
    this.playArea.roll()
}
MainAssistant.prototype.cupTapped = function(){
    this.playArea.roll()
}

MainAssistant.prototype.currentScoreTapped = function(){
    this.playArea.currentScoreTapped();
}


MainAssistant.prototype.initialize = function(){
    this.playArea = new board(this.controller, global.audio);
}

/*
 */
MainAssistant.prototype.activate = function(event){
};
MainAssistant.prototype.deactivate = function(event){
};

/*
 * Handles the application pulldown menu
 */
MainAssistant.prototype.handleCommand = function (event) {
	if (event.type == Mojo.Event.commandEnable &&
	(event.command == Mojo.Menu.helpCmd)) {
		event.stopPropagation();
	}

/*
	if (event.type == Mojo.Event.commandEnable &&
	(event.command == Mojo.Menu.prefsCmd)) {
		event.stopPropagation();
	}
*/
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'help':
				Mojo.Controller.stageController.pushAppSupportInfoScene();
				break;
			case 'highScores':
				Mojo.Controller.stageController.pushScene('scoring')
				break;
			case 'newGame':
				this.playArea.newGame()
				break;
			case 'scoringHelp':
				this.controller.get('scoring').removeClassName('hidden')
				this.controller.get('help').removeClassName('hidden')
				break;
		}
	}
}

/*
MainAssistant.prototype.die1Tapped = function(event){
	for (var prop in event.srcElement) {
		Mojo.Log.info("PROPERTY: " + prop);
		Mojo.Log.info("==> " + event.srcElement[prop]);
	}
}
*/
