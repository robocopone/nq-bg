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
	name: "",
	moveable: true,
	paused: true,
	doDot: false,
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
}

var freefallCookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberFreeFall");
		var storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.0.0") {
			global.scores = storedData.scores.slice(0);
			global.name = storedData.name;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		var tmpScores = global.scores.slice(0)
		this.cookieData.put({  
			version: "1.0.0",
			scores: tmpScores,
			name: global.name
		})		
	}
});

MainAssistant.prototype.initGame = function () {
	var local = {}	
	global.shipLayer = Math.floor(global.screenHeight / 20) - 10;

	for (var x = 1; x <= global.lastLayer; x++){
		layer[x].setStyle({ top: (20 * (x-2)) + 'px' })
		layer[x].removeClassName('hidden')
		multiplier[x].addClassName('hidden');
		trail[x].addClassName('hidden');
		obstacle[x].addClassName('hidden');
	}

	doDot = false;
	global.score = 0;
	global.multiplier = 1;
	global.level = 0;
	
	global.prevLeft = Math.floor(global.screenWidth / 2) - 37;
	global.prevWidth = 75;
	elements.ship.setStyle({ top: (((global.shipLayer-2) * 20) - 1) + 'px' })

	this.fillLayer(1, global.lastLayer);
	this.initShip();
}

MainAssistant.prototype.setup = function(){
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
	elements.appHeader = this.controller.get('appHeader')
	
	for (var x= 1; x <= global.lastLayer; x++){
		layer[x] = this.controller.get('layer' + x);
		multiplier[x] = this.controller.get('multi' + x);
		trail[x] = this.controller.get('trail' + x);
		obstacle[x] = this.controller.get('obstacle' + x);
	}
	elements.level.setStyle({ width: global.screenWidth * (3/10) + 'px'})
	elements.score.setStyle({ width: global.screenWidth * (4/10) + 'px'})
	elements.multiplier.setStyle({ width: global.screenWidth * (3/10) + 'px'})
	

	elements.goButton.setStyle({
		top: (global.screenHeight * .7) + 'px',
		left: ((global.screenWidth / 2) - 50) + 'px' 
	})
	// Go Button Widget
	local.goButtonModel = {
		buttonLabel: 'Go!',
		buttonClass: 'affirmative',
		disabled: false
	}
	this.controller.setupWidget('goButton', atts = {
		type: Mojo.Widget.defaultButton
	}, local.goButtonModel);
	
	this.go = Mojo.Function.debounce(undefined, this.doGo.bind(this), .25);

	this.controller.listen(elements.appHeader,Mojo.Event.tap, this.nav.bindAsEventListener(this));
	this.controller.listen(document, 'acceleration', this.checkAccel.bindAsEventListener(this));
	this.controller.listen(elements.goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
	this.controller.listen(elements.pause, Mojo.Event.tap, this.pause.bindAsEventListener(this));
}

/*
 * Main Function
 */
MainAssistant.prototype.activate = function(event) {
	this.initGame();
}

/*
 * Iterative function
 */
MainAssistant.prototype.doGo = function(){
	if (!global.paused) {
		var currLastLayer = this.bumpUp();
		this.fillLayer(currLastLayer, currLastLayer)
		this.updateScore();
		if (!this.collision()) 
			this.go();
		else 
			this.stop('collision')
	}
	else 
		this.stop('paused');
}

/*
 * Accelerometer function
 */
MainAssistant.prototype.checkAccel = function(event){
	global.accelTimingFinish = new Date().getTime();
	var deltaT = global.accelTimingFinish - global.accelTimingStart
	if (deltaT > 100 && deltaT < 1000) {
		elements.clock.update(Mojo.Format.formatDate( new Date(), { time: 'medium' } ) );
		if (!global.moveable) 
			return;
		if (event.accelY > .1) 
			this.moveShip('left', Math.pow(event.accelY * 10, 2))
		if (event.accelY < -.1) 
			this.moveShip('right', Math.pow(event.accelY * 10, 2))
		global.accelTimingStart = new Date().getTime();
	}
	else if (deltaT >= 250) {
		global.paused = true;
	}
	
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
	global.score = global.score + (250 * global.multiplier);
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

MainAssistant.prototype.cleanup = function(event) {
	freefallCookie.storeCookie();
	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: false,
		fastAccelerometer: false
	});
	this.controller.stopListening(elements.appHeader,Mojo.Event.tap, this.nav.bindAsEventListener(this));
	this.controller.stopListening(document, 'acceleration', this.checkAccel.bindAsEventListener(this));
	this.controller.stopListening(elements.goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
	this.controller.stopListening(elements.pause, Mojo.Event.tap, this.pause.bindAsEventListener(this));
}

MainAssistant.prototype.tapGoButton = function() {
	global.accelTimingStart = new Date().getTime();
	global.moveable = true;
	global.paused = false;
	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: true,
		fastAccelerometer: true
	});
	elements.goButton.addClassName('hidden');
	this.go();
}

MainAssistant.prototype.pause = function () {
	global.paused = true;
}

MainAssistant.prototype.stop = function (state) {
	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: false,
		fastAccelerometer: true
	});
	elements.goButton.removeClassName('hidden');
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
	}
}

/*
 * Popup menu for record keeping
 */
MainAssistant.prototype.nav = function () {
	this.controller.popupSubmenu({
		onChoose: this.navHandler,
		placeNear: elements.appHeader,
		items: [{
			label: 'Top Scores',
			command: 'topScores'
		}]
	});
}
MainAssistant.prototype.navHandler = function(command) {
	if (command == 'topScores')
		this.controller.stageController.pushScene({
			name: "scoring",
			transition: Mojo.Transition.crossFade
		})
	if (command == 'toggle') {
		if (elements.speedometer.hasClassName('hidden')) {
			elements.currentInfo.addClassName('hidden');
			elements.tripInfo.addClassName('hidden');
			elements.addressInfo.addClassName('hidden');
			elements.speedometer.removeClassName('hidden');
		}
		else {
			elements.currentInfo.removeClassName('hidden');
			elements.tripInfo.removeClassName('hidden');
			elements.addressInfo.removeClassName('hidden');
			elements.speedometer.addClassName('hidden');
		}
	}
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
		this.controller.setupWidget("username", {} ,this.name);		

		this.controller.get('dialogOkButton').addEventListener(Mojo.Event.tap, this.okPressed.bindAsEventListener(this));
		this.controller.get('dialogCancelButton').addEventListener(Mojo.Event.tap, this.cancelPressed.bindAsEventListener(this));
	},
	
	okPressed: function() {
		global.name = this.name.value;
		global.scores[global.scoreSlot] = {}
		global.scores[global.scoreSlot].name = this.name.value;
		global.scores[global.scoreSlot].score = global.savedScore; 
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
