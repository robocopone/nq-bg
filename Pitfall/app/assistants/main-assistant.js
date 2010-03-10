function MainAssistant() {
}

var elements = {}
var	layer = {}
var	multiplier = {}
var trail = {}

var time = {}
var layer = {}
var global = {
	moveable: true,
	paused: false,
	level: 1,
	score: 0,
	multiplier: 0,

	adjLeftDistribution: 0,
	adjWidthDistribution: 0,
	prevLeft: 0,
	prevWidth: 75,
	maxWidth: 300,
	minWidth: 300,
	widthRandomizer: 25,
	leftRandomizer: 50
	
}

MainAssistant.prototype.setup = function(){
	var local = {}

	global.screenWidth = Mojo.Environment.DeviceInfo.screenHeight;
	local.screenHeight = Mojo.Environment.DeviceInfo.screenWidth;

	global.shipLayer = Math.floor(local.screenHeight / 20) - 10;
	global.lastLayer = Math.floor(local.screenHeight / 20) + 2;

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
	
	for (var x= 1; x <= global.lastLayer; x++){
		layer[x] = this.controller.get('layer' + x);
		multiplier[x] = this.controller.get('multi' + x);
		trail[x] = this.controller.get('trail' + x);
		layer[x].setStyle({ top: (20 * (x-2)) + 'px' })
	}
	elements.level.setStyle({ width: global.screenWidth / 3 + 'px'})
	elements.score.setStyle({ width: global.screenWidth / 3 + 'px'})
	elements.multiplier.setStyle({ width: global.screenWidth / 3 + 'px'})
	
	global.prevLeft = Math.floor(global.screenWidth / 2) - 37;
//	this.controller.get('testOutput').update((((global.shipLayer-2) * 20) - 1) + 'px')
	elements.ship.setStyle({ top: (((global.shipLayer-2) * 20) - 1) + 'px' })

	elements.goButton.setStyle({
		top: (local.screenHeight * .7) + 'px',
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
	
	this.go = Mojo.Function.debounce(undefined, this.doGo.bind(this), .15);

	this.controller.listen(document, 'acceleration', this.doMoveShip.bindAsEventListener(this));
	this.controller.listen(elements.goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
	this.controller.listen(elements.pause, Mojo.Event.tap, this.pause.bindAsEventListener(this));
}

/*
 * Main Function
 */
MainAssistant.prototype.activate = function(event) {
	this.fillLayer(1, global.lastLayer);
	this.initShip();

}

/*
 * Iterative function
 */
MainAssistant.prototype.doGo = function() {
	var currLastLayer = this.bumpUp();
	this.fillLayer(currLastLayer, currLastLayer)
	this.updateScore();
	if (!this.collision() && !global.paused) 
		this.go();
	else if (global.paused)
		this.stop('paused');
	else
		this.stop('collision')
}

/*
 * Accelerometer function
 */
var start;
var finish;
MainAssistant.prototype.doMoveShip = function(event) {
	finish = new Date().getTime();
	this.controller.get('testOutput').update(finish - start + 'ms')
	elements.clock.update(Mojo.Format.formatDate(new Date(), { time: 'medium' }));
	if (!global.moveable)
		return;
	if (event.accelY > .1)
		this.moveShip('left', Math.pow(event.accelY * 10, 2))
	if (event.accelY < -.1)
		this.moveShip('right', Math.pow(event.accelY * 10, 2))  
	start = new Date().getTime();
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
	}
	elements.ship.setStyle({ left: local.position + 'px' })
	global.moving = false;
}

MainAssistant.prototype.updateScore = function () {
	elements.level.update('Level: ' + global.level++);
	elements.score.update('Score: ' + (global.level * 250));
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
MainAssistant.prototype.collision = function () {
	var local = {}
	local.left = this.getLayerLeft(global.shipLayer);
	local.width = this.getLayerWidth(global.shipLayer);
	local.position = this.getShipPosition();

	this.checkMulti(global.shipLayer, local.position - local.left);
	
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
	}
}

MainAssistant.prototype.bumpUp = function () {
	var local = {}
	for (var x = 1; x <= global.lastLayer; x++){
		local.top = this.getTop(layer[x]);
		if (local.top == -20) {
			layer[x].addClassName('hidden');
			layer[x].setStyle({ top: (global.lastLayer - 2) * 20 + 'px' })
			if (!multiplier[x].hasClassName('hidden'))
				multiplier[x].addClassName('hidden');
			local.currLastLayer = x;
			trail[x].addClassName('hidden')
		}
		else if (local.top == (global.lastLayer - 2) * 20) {
			layer[x].removeClassName('hidden');
			layer[x].setStyle({ top: (local.top - 20) + 'px' })
		}
		else
			layer[x].setStyle({ top: (local.top - 20) + 'px' })
		if (x == this.shipLayerLookBehind())
			trail[this.shipLayerLookBehind()].removeClassName('hidden')
	}

	while (global.moving);
	global.lock = true;
	local.position = this.getShipPosition() - this.getLayerLeft(global.shipLayer) + 4;
	trail[global.shipLayer].setStyle({ left: local.position + 'px' })
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

MainAssistant.prototype.deactivate = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
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

MainAssistant.prototype.getShipPosition = function () {
	return parseInt(elements.ship.getStyle('left'));
}
MainAssistant.prototype.initShip = function () {
	var currWidth = this.getLayerWidth(global.shipLayer)
	var currPosition = this.getLayerLeft(global.shipLayer) + Math.floor(currWidth / 2);
	elements.ship.setStyle({ left: (currPosition-6) + 'px' })
}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.controller.stopListening(document, 'acceleration', this.doMoveShip.bindAsEventListener(this));
	this.controller.stopListening(elements.goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
	this.controller.stopListening(elements.pause, Mojo.Event.tap, this.pause.bindAsEventListener(this));
}

MainAssistant.prototype.tapGoButton = function() {
	global.moveable = true;
	global.paused = false;
	this.controller.stageController.setWindowProperties({blockScreenTimeout: true});
	elements.goButton.addClassName('hidden');
	this.go();
}

MainAssistant.prototype.stop = function (state) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	elements.goButton.removeClassName('hidden');
	global.moveable = false;
	if (state == 'paused') {
		
	}
	if (state == 'collision') {
	}
}

MainAssistant.prototype.pause = function () {
	global.paused = true;
}
