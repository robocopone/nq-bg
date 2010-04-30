function MainAssistant() {
}

var elements = {}
var	layer = {}
var	multiplier = {}
var trail = {}
var obstacle = {}

var time = {}
var layer = {}
var global = {
	initialDate: new Date().getTime(),
	name: "",
	moveable: true,
	paused: true,
	doDot: false,
	difficulty: 'Easy',
	level: 1,
	score: 0,
	scores: [],
	multiplier: 1,

	adjLeftDistribution: 0,
	adjWidthDistribution: 0,
	prevLeft: 0,
	prevWidth: 75,
	maxWidth: 150,
	minWidth: 100,
	widthRandomizer: 25,
	leftRandomizer: 50,
	
	initialized: false,
}

var freefallCookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberFreeFallFree");
		var storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.0.0") {
			global.scores = storedData.scores.slice(0);
			global.name = storedData.name;
			global.difficulty = storedData.difficulty;
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
			difficulty: global.difficulty,
			initialized: global.initialized
		})		
	}
});

MainAssistant.prototype.initGame = function () {
	global.shipLayer = Math.floor(global.screenHeight / 20) - 10;
	elements.ship.setStyle({ top: (((global.shipLayer-2) * 20) - 1) + 'px' })

	for (var x = 1; x <= global.lastLayer; x++){
		layer[x].setStyle({ top: (20 * (x-2)) + 'px' })
		layer[x].removeClassName('hidden')
		multiplier[x].addClassName('hidden');
		trail[x].addClassName('hidden');
		obstacle[x].addClassName('hidden');
	}

	global.doDot = false;
	global.score = 0;
	global.multiplier = 1;
	global.level = 0;
	
	global.prevLeft = Math.floor(global.screenWidth / 2) - 37;
	global.prevWidth = 75;

	this.fillLayer(1, global.lastLayer);
	this.initShip();
}

MainAssistant.prototype.setup = function(){
	freefallCookie.initialize();
	if (!global.initialized) {
		global.scores[1] = {}
		global.scores[1].name = "bleh"
		global.scores[1].score = 1
		global.scores[1].date = new Date()
		global.initialized = true;
	}
	freefallCookie.storeCookie();
	freefallCookie.initialize();

	var local = {}
	
	global.screenWidth = Mojo.Environment.DeviceInfo.screenHeight;
	global.screenHeight = Mojo.Environment.DeviceInfo.screenWidth;
	global.lastLayer = Math.floor(global.screenHeight / 20) + 2;
	
	/*
	 * Handler & Element setup
	 */
	elements.clock = this.controller.get('clock');
	elements.ship = this.controller.get('ship');
	elements.level = this.controller.get('level');
	elements.score = this.controller.get('score');
	elements.multiplier = this.controller.get('multiplier');
	elements.pause = this.controller.get('pause');
	elements.goButton = this.controller.get('goButton')
	elements.difficultyButton = this.controller.get('difficultyButton')
	elements.highScoresButton = this.controller.get('highScoresButton')
	elements.supportButton = this.controller.get('supportButton')
	elements.hideButton = this.controller.get('hideButton')
	elements.appHeader = this.controller.get('appHeader')
	elements.display = this.controller.get('display')
	elements.lowerDisplay = this.controller.get('lowerDisplay')
	elements.buyButton = this.controller.get('buyButton')
	
	for (var x = 1; x <= global.lastLayer; x++) {
		layer[x] = this.controller.get('layer' + x);
		multiplier[x] = this.controller.get('multi' + x);
		trail[x] = this.controller.get('trail' + x);
		obstacle[x] = this.controller.get('obstacle' + x);
	}
	elements.level.setStyle({ width: global.screenWidth * (3 / 10) + 'px' })
	elements.score.setStyle({ width: global.screenWidth * (4 / 10) + 'px' })
	elements.multiplier.setStyle({ width: global.screenWidth * (3 / 10) + 'px' })
	
	elements.display.setStyle({
		height: global.screenHeight * .65 + 'px',
		width: global.screenWidth * .8 + 'px',
		top: global.screenHeight * .2 + 'px',
		left: (global.screenWidth * .1) - 10 + 'px'
	})
	
	elements.goButton.setStyle({
		top: (global.screenHeight * .75) + 'px',
		left: (global.screenWidth / 2) - 150 + 'px'
	})
	elements.highScoresButton.setStyle({
		top: (global.screenHeight * .75) + 'px',
		left: (global.screenWidth / 2) + 0 + 'px'
	})

	// Hide Button Widget
	global.hideButtonModel = {
		buttonLabel: 'Hide',
		buttonClass: 'affirmative',
		disabled: false
	}
	this.controller.setupWidget('hideButton', atts = {
		type: Mojo.Widget.defaultButton
	}, global.hideButtonModel);

	// Difficulty Button Widget
	if (global.difficulty == 'Easy')
		local.difficultyButtonClass = 'affirmative'
	if (global.difficulty == 'Hard')
		local.difficultyButtonClass = 'negative'
	global.difficultyButtonModel = {
		buttonLabel: global.difficulty,
		buttonClass: local.difficultyButtonClass,
		disabled: false
	}
	this.controller.setupWidget('difficultyButton', atts = {
		type: Mojo.Widget.defaultButton
	}, global.difficultyButtonModel);

	// High Score Button Widget
	local.highScoreButtonModel = {
		buttonLabel: 'High Scores',
		buttonClass: 'affirmative',
		disabled: false
	}
	this.controller.setupWidget('highScoresButton', atts = {
		type: Mojo.Widget.defaultButton
	}, local.highScoreButtonModel);

	// Support Button Widget
	local.supportButtonModel = {
		buttonLabel: 'Support',
		buttonClass: 'affirmative',
		disabled: false
	}
	this.controller.setupWidget('supportButton', atts = {
		type: Mojo.Widget.defaultButton
	}, local.supportButtonModel);

	// Go Button Widget
	local.goButtonModel = {
		buttonLabel: 'Go!',
		buttonClass: 'affirmative',
		disabled: false
	}
	this.controller.setupWidget('goButton', atts = {
		type: Mojo.Widget.defaultButton
	}, local.goButtonModel);
	
	// Go Button Widget
	local.buyButtonModel = {
		buttonLabel: 'Buy FreeFall!',
		buttonClass: 'affirmative',
		disabled: false
	}
	this.controller.setupWidget('buyButton', atts = {
		type: Mojo.Widget.defaultButton
	}, local.buyButtonModel);

	this.goEasy = Mojo.Function.debounce(undefined, this.doGo.bind(this), .5);
	this.goHard = Mojo.Function.debounce(undefined, this.doGo.bind(this), .10);

	this.controller.listen(elements.buyButton, Mojo.Event.tap, this.tapBuyButton.bindAsEventListener(this))
	this.controller.listen(elements.appHeader,Mojo.Event.tap, this.nav.bindAsEventListener(this));
	this.controller.listen(document, 'acceleration', this.checkAccel.bindAsEventListener(this));
	this.controller.listen(elements.goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
	this.controller.listen(elements.highScoresButton, Mojo.Event.tap, this.tapHighScoresButton.bindAsEventListener(this));
	this.controller.listen(elements.hideButton, Mojo.Event.tap, this.tapHideButton.bindAsEventListener(this));
	this.controller.listen(elements.difficultyButton, Mojo.Event.tap, this.tapDifficultyButton.bindAsEventListener(this));
	this.controller.listen(elements.supportButton, Mojo.Event.tap, this.tapSupportButton.bindAsEventListener(this));
	this.controller.listen(elements.pause, Mojo.Event.tap, this.pause.bindAsEventListener(this));
	

	this.initGame();
	this.timing = {}
	this.timing.start = new Date().getTime()
	this.timing.accelStart = new Date().getTime()
}

/*
 * Main Function
 */
MainAssistant.prototype.activate = function(event) {
	var local = {}	
	local.currentDate = new Date().getTime();
	this.controller.get('timeRemaining').update("Free Time Remaining: " + (14 - (local.currentDate - global.initialDate) / 1000 / 60 / 60 / 24).toFixed(0) + " days")		
	if ((local.currentDate - global.initialDate) / 1000 / 60 / 60 / 24 > 14)
		global.locked = true;
	
	if (global.locked) {
		elements.difficultyButton.addClassName('hidden')
		elements.hideButton.addClassName('hidden')
		elements.buyButton.removeClassName('hidden')
		elements.display.removeClassName('hidden')
		global.hideButtonModel.disabled = true;
		this.controller.modelChanged(global.hideButtonModel, this);
		this.controller.get('displayText').update("Free time has expired.  <BR /> Please purchase FreeFall! for $.99 <BR /> in the App Catalog")		
	}
}

/*
 * Iterative function
 */
MainAssistant.prototype.doGo = function(){
	this.timing.finish = new Date().getTime()
	Mojo.Log.error('**************************************')
	Mojo.Log.error('((Start main loop)) duration: ' + (this.timing.finish - this.timing.start))

	var start = new Date().getTime()
	this.controller.stageController.setWindowProperties({
		fastAccelerometer: false
	});
	this.controller.stageController.setWindowProperties({
		fastAccelerometer: true
	});
	
	if (!global.paused) {
		var currLastLayer = this.bumpUp();
		this.fillLayer(currLastLayer, currLastLayer)
		this.updateScore();
		if (!this.collision()) {
			if (global.difficulty == 'Easy') 
				this.goEasy();
			if (global.difficulty == 'Hard') 
				this.goHard();
		}
		else 
			this.stop('collision')
	}
	else 
		this.stop('paused');
	var finish = new Date().getTime()
	Mojo.Log.error('((End main loop)) duration: ' + (finish - start))
	Mojo.Log.error('**************************************')
	this.timing.start = new Date().getTime()
}

/*
 * Accelerometer function
 */
MainAssistant.prototype.checkAccel = function(event){
	this.timing.accelFinish = new Date().getTime()
	global.accelTimingFinish = new Date().getTime();
	var deltaT = global.accelTimingFinish - global.accelTimingStart
	if (deltaT > 10 && deltaT < 500) {
	Mojo.Log.error('.............................Accel Start - Time Outside: ' +
				(this.timing.accelFinish - this.timing.accelStart))
		elements.clock.update(Mojo.Format.formatDate( new Date(), { time: 'medium' } ) );
		if (!global.moveable) 
			return;
		if (event.accelY > .05) 
			this.moveShip('left', Math.pow(event.accelY * 10, 2))
		if (event.accelY < -.05) 
			this.moveShip('right', Math.pow(event.accelY * 10, 2))
		global.accelTimingStart = new Date().getTime();
	}
	else if (deltaT >= 500) {
		global.paused = true;
	}
	this.timing.accelStart = new Date().getTime()
}

MainAssistant.prototype.moveShip = function (direction, magnitude) {
	if (global.lock)
		return;
	global.moving = true;
	var local = {}
	local.position = this.getShipPosition();
	local.leftBound = this.getLayerLeft(global.shipLayer);
	local.rightBound = local.leftBound + this.getLayerWidth(global.shipLayer);
	for (var x= 0; x < magnitude && (x == 0 || !(local.position == local.leftBound + 1 || local.position == local.rightBound - 14)); x++) {
		if (direction == 'left' && local.position - 13 > local.leftBound)
			local.position -= 2;
		else if (direction == 'left')
			local.position = local.leftBound + 1;
		else if (direction == 'right' && local.position + 13 + 13 < local.rightBound)
			local.position += 2;
		else if (direction == 'right')
			local.position = local.rightBound - 14;
		this.checkMulti(global.shipLayer, local.position - local.leftBound);
		this.checkObstacleCollision(global.shipLayer, local.position - local.leftBound);
	}
	elements.ship.setStyle({ left: local.position + 'px' })
	global.moving = false;
}

MainAssistant.prototype.updateScore = function () {
	elements.level.update('Level: ' + global.level++);
	if (global.difficulty == 'Easy')
		global.score = global.score + (25 * global.multiplier);
	else if (global.difficulty == 'Hard')
		global.score = global.score + (50 * global.multiplier);
		
	if (global.score < 100000000)
		elements.score.update('Score: ' + Mojo.Format.formatNumber(global.score));
	else
		elements.score.update('Score:' + Mojo.Format.formatNumber(global.score));
	elements.multiplier.update('Multiplier: ' + global.multiplier)
}
MainAssistant.prototype.checkMulti = function(layer, position) {
	if (!multiplier[layer].hasClassName('hidden')) {
		var multiPosition = this.getMultiPosition(layer);
		if (position > multiPosition - 8 && position < multiPosition + 5) {
			global.multiplier++;
			multiplier[layer].addClassName('hidden');
		}
	}
}
MainAssistant.prototype.checkObstacleCollision = function(layer, position) {
	if (!obstacle[layer].hasClassName('hidden')) {
		var obstaclePosition = this.getObstaclePosition(layer);
		if (position > obstaclePosition - 8 && position < obstaclePosition + 5) {
			global.multiplier = 1;
			obstacle[layer].addClassName('hit');
		}
	}
}
MainAssistant.prototype.collision = function () {
	var local = {}
	local.left = this.getLayerLeft(global.shipLayer);
	local.width = this.getLayerWidth(global.shipLayer);
	local.position = this.getShipPosition();

	this.checkMulti(global.shipLayer, local.position - local.left);
	this.checkObstacleCollision(global.shipLayer, local.position - local.left)
			
	if (local.left <= local.position && (local.width+local.left) >= local.position + 13) 
		return false;

	return true;
}

MainAssistant.prototype.shipLayerLookBehind = function () {
	if (global.shipLayer - 1 == 0)
		return global.lastLayer;
	return global.shipLayer - 1;
}

MainAssistant.prototype.fillLayer = function (start, finish){
	var local = {}
	for (var x = start; x <= finish; x++) {
		local.randWidth = Math.floor(Math.random()* global.widthRandomizer)
		local.randLeft = Math.floor(Math.random()* global.leftRandomizer)
		if (local.randLeft % 20 < (10 + global.adjLeftDistribution))
			local.randLeft *= -1;
		if (local.randWidth % 20 < (10 + global.adjWidthDistribution))
			local.randWidth *= -1;

		global.prevWidth = this.checkWidth(global.prevWidth + local.randWidth);
		global.prevLeft = this.checkLeft(global.prevLeft + local.randLeft, global.prevWidth);
		layer[x].setStyle({
			width: global.prevWidth + 'px',
			left: global.prevLeft + 'px'
		});

		local.randMulti = Math.floor(Math.random() * 100);
		if (local.randMulti <= 10) {
			local.position = Math.floor(local.randMulti * .1 * global.prevWidth)
			if (local.position < 50)
				local.position = 50;
			if (local.position > global.prevWidth - 50)
				local.position = global.prevWidth - 50;
			multiplier[x].setStyle({ left: local.position + 'px' });
			multiplier[x].removeClassName('hidden');
		}
		else if (local.randMulti > 10 && local.randMulti <= 20) {
			local.position = Math.floor(local.randMulti * .05 * global.prevWidth)
			if (local.position < 50)
				local.position = 50;
			if (local.position > global.prevWidth - 50)
				local.position = global.prevWidth - 50;
			obstacle[x].setStyle({ left: local.position + 'px' });
			obstacle[x].removeClassName('hidden');
		}
	}
}

MainAssistant.prototype.bumpUp = function () {
	var local = {}
	for (var x = 1; x <= global.lastLayer; x++){
		local.top = this.getTop(layer[x]);
		if (local.top == -20) {
			layer[x].addClassName('hidden');
			layer[x].setStyle({ top: (global.lastLayer - 2) * 20 + 'px' })
			trail[x].addClassName('hidden')
			obstacle[x].addClassName('hidden');
			obstacle[x].removeClassName('hit');
			multiplier[x].addClassName('hidden');
			local.currLastLayer = x;
		}
		else if (local.top == (global.lastLayer - 2) * 20) {
			layer[x].removeClassName('hidden');
			layer[x].setStyle({ top: (local.top - 20) + 'px' })
		}
		else
			layer[x].setStyle({ top: (local.top - 20) + 'px' })
		if (x == this.shipLayerLookBehind() && global.doDot)
			trail[this.shipLayerLookBehind()].removeClassName('hidden')
	}

	while (global.moving);
	global.lock = true;
	local.position = this.getShipPosition() - this.getLayerLeft(global.shipLayer) + 4;
	trail[global.shipLayer].setStyle({ left: local.position + 'px' })
	global.doDot = true;
	global.shipLayer++;
	if (global.shipLayer > global.lastLayer)
		global.shipLayer = 1;
	global.lock = false;
	return local.currLastLayer;
}

MainAssistant.prototype.getTop = function (layer) {
	return parseInt(layer.getStyle('top'));
}

MainAssistant.prototype.checkWidth = function (num) {
	if (num > global.maxWidth) {
		global.adjWidthDistribution++;
		return global.maxWidth;
	}
	if (num < global.minWidth) {
		global.adjWidthDistribution--;
		return global.minWidth;
	}
	return num;
}

MainAssistant.prototype.checkLeft = function (num, inWidth) {
	if (num + inWidth >= global.screenWidth) {
		global.adjLeftDistribution++;
		return global.screenWidth - inWidth;
	}
	if (num <= 0) {
		global.adjLeftDistribution--;
		return 0;
	}
	return num;
}

MainAssistant.prototype.deactivate = function(event){
	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: false,
		fastAccelerometer: false
	});
}

MainAssistant.prototype.getLayerLeft = function (inLayer) {
	return parseInt(layer[inLayer].getStyle('left'))
}

MainAssistant.prototype.getLayerWidth = function (inLayer) {
	return parseInt(layer[inLayer].getStyle('width'))
}

MainAssistant.prototype.getMultiPosition = function (inLayer) {
	return parseInt(multiplier[inLayer].getStyle('left'))
}
MainAssistant.prototype.getObstaclePosition = function (inLayer) {
	return parseInt(obstacle[inLayer].getStyle('left'))
}

MainAssistant.prototype.getShipPosition = function () {
	return parseInt(elements.ship.getStyle('left'));
}
MainAssistant.prototype.initShip = function () {
	var currWidth = this.getLayerWidth(global.shipLayer)
	var currPosition = this.getLayerLeft(global.shipLayer) + Math.floor(currWidth / 2);
	elements.ship.setStyle({ left: (currPosition-6) + 'px' })
}

MainAssistant.prototype.tapBuyButton = function() { 
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
		method: "open",
		parameters: {
			id: 'com.palm.app.browser',
			params: {
				target: "http://developer.palm.com/appredirect/?packageid=net.bradleygraber.freefall&applicationid=2445"
			}
		}
	});
}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: false,
		fastAccelerometer: false
	});

	this.controller.stopListening(elements.buyButton, Mojo.Event.tap, this.tapBuyButton.bindAsEventListener(this))
	this.controller.stopListening(elements.difficultyButton, Mojo.Event.tap, this.tapDifficultyButton.bindAsEventListener(this));
	this.controller.stopListening(elements.hideButton, Mojo.Event.tap, this.tapHideButton.bindAsEventListener(this));
	this.controller.stopListening(elements.supportButton, Mojo.Event.tap, this.tapSupportButton.bindAsEventListener(this));
	this.controller.stopListening(elements.appHeader,Mojo.Event.tap, this.nav.bindAsEventListener(this));
	this.controller.stopListening(document, 'acceleration', this.checkAccel.bindAsEventListener(this));
	this.controller.stopListening(elements.goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
	this.controller.stopListening(elements.pause, Mojo.Event.tap, this.pause.bindAsEventListener(this));
	this.controller.stopListening(elements.highScoresButton, Mojo.Event.tap, this.tapHighScoresButton.bindAsEventListener(this));
	freefallCookie.storeCookie();
}

MainAssistant.prototype.tapDifficultyButton = function(){
	if (global.difficulty == 'Easy') {
		global.difficulty = 'Hard';
		global.difficultyButtonModel.buttonLabel = 'Hard';
		global.difficultyButtonModel.buttonClass = 'negative';
		this.controller.modelChanged(global.difficultyButtonModel, this);
	}
	else if (global.difficulty == 'Hard') {
		global.difficulty = 'Easy';
		global.difficultyButtonModel.buttonLabel = 'Easy';
		global.difficultyButtonModel.buttonClass = 'affirmative';
		this.controller.modelChanged(global.difficultyButtonModel, this);
	}
}

MainAssistant.prototype.tapHideButton = function(){
	display.addClassName('hidden')
}

MainAssistant.prototype.tapSupportButton = function(){
	Mojo.Controller.stageController.pushAppSupportInfoScene();
}
MainAssistant.prototype.tapHighScoresButton = function(){
	this.controller.stageController.pushScene({
		name: "scoring",
		transition: Mojo.Transition.crossFade
	})
}

MainAssistant.prototype.tapGoButton = function() {
	global.accelTimingStart = new Date().getTime();
	global.moveable = true;
	global.paused = false;
	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: true,
		fastAccelerometer: true
	});
	elements.display.addClassName('hidden');
	elements.lowerDisplay.addClassName('hidden');
	if (global.difficulty == 'Easy') 
		this.goEasy();
	if (global.difficulty == 'Hard') 
		this.goHard();
}

MainAssistant.prototype.pause = function () {
	global.paused = true;
}

MainAssistant.prototype.stop = function (state) {
	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: false,
		fastAccelerometer: true
	});
	elements.lowerDisplay.removeClassName('hidden');
	global.moveable = false;
	if (state == 'paused') {
	}
	if (state == 'collision') {
		global.savedScore = global.score;
		for (var x = 1; x <= 10; x++) {
			if (global.scores[x] && global.score > global.scores[x].score) {
				this.bumpScores(x);
				global.scoreSlot = x;
				this.controller.showDialog({
					template: 'nameDialog/nameDialog-scene',
					assistant: new doDialog(this)
				});
				break;
			}
			else if (!global.scores[x]) {
				global.scoreSlot = x;
				this.controller.showDialog({
					template: 'nameDialog/nameDialog-scene',
					assistant: new doDialog(this)
				});
				break;
			}
		}
		this.initGame();
		freefallCookie.storeCookie();
	}
}

/*
 * Popup menu for record keeping
 */
MainAssistant.prototype.nav = function () {
	if (global.locked)
		return;
	global.paused = true;
	if (elements.display.hasClassName('hidden'))
		elements.display.removeClassName('hidden')
	else
		elements.display.addClassName('hidden')
	elements.lowerDisplay.removeClassName('hidden')
}

MainAssistant.prototype.bumpScores = function (num) {
	if (global.scores[num + 1]) {
		this.bumpScores(num + 1)
		global.scores[num + 1] = global.scores[num]
	}
	else
		global.scores[num + 1] = global.scores[num]
}

var doDialog = Class.create({
	initialize: function(sceneAssistant) {
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;
	},
	
	setup : function(widget) {
		this.widget = widget;
		this.name = {
			value: global.name
		};
		this.controller.get('newHighScore').update(global.savedScore)
		this.controller.setupWidget("username", {} ,this.name);		

		this.controller.get('dialogOkButton').addEventListener(Mojo.Event.tap, this.okPressed.bindAsEventListener(this));
		this.controller.get('dialogCancelButton').addEventListener(Mojo.Event.tap, this.cancelPressed.bindAsEventListener(this));
	},
	
	okPressed: function() {
		global.name = this.name.value;
		global.scores[global.scoreSlot] = {}
		global.scores[global.scoreSlot].name = this.name.value;
		global.scores[global.scoreSlot].score = global.savedScore; 
		global.scores[global.scoreSlot].date = Mojo.Format.formatDate( new Date(), { date: 'medium' } ); 
		this.controller.stageController.pushScene({
			name: "scoring",
			transition: Mojo.Transition.crossFade
		})
		this.widget.mojo.close();
	},

	cancelPressed: function() {
		this.widget.mojo.close();
	}
});
