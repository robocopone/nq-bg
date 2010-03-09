function MainAssistant() {
}

var elements = {}
var	layer = {}
var	multiplier = {}

var time = {}
var layer = {}
var global = {
	moveable: true, 
	level: 1,
	score: 0,
	multiplier: 0,

	adjLeftDistribution: 0,
	adjWidthDistribution: 0,
	prevLeft: 0,
	prevWidth: 75,
	maxWidth: 150,
	minWidth: 100,
	widthRandomizer: 25,
	leftRandomizer: 50
	
}

MainAssistant.prototype.setup = function(){
	var local = {}

	local.screenWidth = Mojo.Environment.DeviceInfo.screenHeight;
	local.screenHeight = Mojo.Environment.DeviceInfo.screenWidth;

	layer.shipLayer = Math.floor(local.screenHeight / 20) - 11;
	layer.lastLayer = Math.floor(local.screenHeight / 20) + 2;

	/*
	 * Handler & Element setup
	 */
	elements.clock = this.controller.get('clock');
	elements.ship = this.controller.get('ship');
	elements.level = this.controller.get('level');
	elements.score = this.controller.get('score');
	elements.multiplier = this.controller.get('multiplier');
	
	for (x = 1; x <= layer.lastLayer; x++){
		layer[x] = this.controller.get('layer' + x);
		multiplier[x] = this.controller.get('multi' + x);
		layer[x].setStyle({ top: (20 * (x-2)) + 'px' })
	}
	elements.level.setStyle({ width: local.screenWidth / 3 + 'px'})
	elements.score.setStyle({ width: local.screenWidth / 3 + 'px'})
	elements.multiplier.setStyle({ width: local.screenWidth / 3 + 'px'})
	
	global.prevLeft = Math.floor(local.screenWidth / 2) - 37;

	// Go Button Widget
	goButton.setStyle({
		top: (local.screenHeight * .7) + 'px',
		left: ((local.screenWidth / 2) - 50) + 'px' 
	})
	goButtonModel = {
		buttonLabel: 'Go!',
		buttonClass: 'affirmative',
		disabled: false
	}
	this.goButton = this.controller.setupWidget('goButton', atts = {
		type: Mojo.Widget.defaultButton
	}, goButtonModel);
	
	this.go = Mojo.Function.debounce(undefined, this.doGo.bind(this), .25);

	this.controller.listen(document, 'acceleration', this.doMoveShip.bindAsEventListener(this));
	this.controller.listen(goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
}

/*
 * Main Function
 */
MainAssistant.prototype.activate = function(event) {
	this.fillLayer(1, layer.lastLayer);
	this.initShip();

/*
	time.start = new Date().getTime();	
	for (x = 1; x < 50; x++) {
		for (y = 1; y <= 16; y++) {
			this.controller.get('layer' + y).getStyle('top')
		}
	}
	time.finish = new Date().getTime();	
	this.controller.get('testOutput').update(time.finish - time.start)
*/
}

/*
 * Iterative function
 */
MainAssistant.prototype.doGo = function() {
	currLastLayer = this.bumpUp();
	this.fillLayer(currLastLayer, currLastLayer)
	this.updateScore();
	if (!this.collision()) 
		this.go();
	else 
		this.stop();
}

/*
 * Accelerometer function
 */
MainAssistant.prototype.doMoveShip = function(event) {
	elements.clock.update(Mojo.Format.formatDate(new Date(), { time: 'medium' }));
	if (!global.moveable)
		return;
	if (event.accelY > .1)
		this.moveShip('left', Math.pow(event.accelY * 10, 2))
	if (event.accelY < -.1)
		this.moveShip('right', Math.pow(event.accelY * 10, 2))  
}

MainAssistant.prototype.moveShip = function (direction, magnitude) {
	position = this.getShipPosition();
	leftBound = this.getLayerLeft(shipLayer);
	rightBound = leftBound + this.getLayerWidth(shipLayer);
	for (x = 0; x < magnitude && (x == 0 || !(position == leftBound + 1 || position == rightBound - 14)); x++) {
		if (direction == 'left' && position - 13 > leftBound)
			position -= 2;
		else if (direction == 'left')
			position = leftBound + 1;
		else if (direction == 'right' && position + 13 + 13 < rightBound)
			position += 2;
		else if (direction == 'right')
			position = rightBound - 14;
		this.checkMulti(shipLayer);
	}
	elements.ship.setStyle({ left: position + 'px' })
}

MainAssistant.prototype.updateScore = function () {
	elements.level.update('Level: ' + global.level++);
	elements.score.update('Score: ' + (global.level * 250));
	elements.multiplier.update('Multiplier: ' + global.multiplier)
}
MainAssistant.prototype.checkMulti = function(layer) {
	if (!multiplier[layer].hasClassName('hidden')) {
		multiPosition = this.getMultiPosition(layer) + left;
		if (position > multiPosition - 9 && position < multiPosition + 6) {
			multiplier++;
			multiplier[layer].addClassName('hidden');
		}
	}
}
MainAssistant.prototype.collision = function () {
	nextLayer = this.shipLayerLookAhead();
	left = this.getLayerLeft(nextLayer);
	width = this.getLayerWidth(nextLayer);

	position = this.getShipPosition();
	this.checkMulti(nextLayer);
	
	if (left <= position && (width+left) >= position + 13)
		return false;
	return true;
}

MainAssistant.prototype.shipLayerLookAhead = function () {
	if (shipLayer + 1 > layer.lastLayer)
		return 1;
	return shipLayer;
}

MainAssistant.prototype.fillLayer = function (start, finish){
	for (x = start; x <= finish; x++) {
		randWidth = Math.floor(Math.random()* global.widthRandomizer)
		randLeft = Math.floor(Math.random()* global.leftRandomizer)
		if (randLeft % 20 < (10 + global.adjLeftDistribution))
			randLeft *= -1;
		if (randWidth % 20 < (10 + global.adjWidthDistribution))
			randWidth *= -1;

		global.prevWidth = this.checkWidth(global.prevWidth + randWidth);
		global.prevLeft = this.checkLeft(global.prevLeft + randLeft, global.prevWidth);
		layer[x].setStyle({
			width: global.prevWidth + 'px',
			left: global.prevLeft + 'px'
		});

		randMulti = Math.floor(Math.random() * 100);
		if (randMulti <= 10) {
			pos = Math.floor(randMulti * .1 * global.prevWidth)
			if (pos < 30)
				pos = 30;
			if (pos > global.prevWidth - 30)
				pos = global.prevWidth - 30;
			multiplier[x].setStyle({ marginLeft: pos + 'px' });
			multiplier[x].removeClassName('hidden');
		}
	}
}

MainAssistant.prototype.bumpUp = function () {
	for (x = 1; x <= layer.lastLayer; x++){
		topp = this.getTop(layer[x]);
		if (topp == -20) {
			layer[x].addClassName('hidden');
			layer[x].setStyle({ top: (layer.lastLayer - 2) * 20 + 'px' })
			if (!multiplier[x].hasClassName('hidden'))
				multiplier[x].addClassName('hidden');
			currLastLayer = x;
		}
		else if (topp == (layer.lastLayer - 2) * 20) {
			layer[x].removeClassName('hidden');
			layer[x].setStyle({ top: (topp - 20) + 'px' })
		}
		else
			layer[x].setStyle({ top: (topp - 20) + 'px' })
	}
	shipLayer++;
	if (shipLayer > layer.lastLayer)
		shipLayer = 1;
	return currLastLayer;
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
	if (num + inWidth >= screenWidth) {
		global.adjLeftDistribution++;
		return screenWidth - inWidth;
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
	return parseInt(multiplier[inLayer].getStyle('margin-left'))
}

MainAssistant.prototype.getShipPosition = function () {
	return parseInt(elements.ship.getStyle('left'));
}
MainAssistant.prototype.initShip = function () {
	currWidth = this.getLayerWidth(shipLayer)
	currPosition = this.getLayerLeft(shipLayer) + Math.floor(currWidth / 2);
	elements.ship.setStyle({ left: (currPosition-6) + 'px' })
}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.controller.stopListening(document, 'acceleration', this.doMoveShip.bindAsEventListener(this));
	this.controller.stopListening(goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
}

MainAssistant.prototype.tapGoButton = function() {
	global.moveable = true;
	this.controller.stageController.setWindowProperties({blockScreenTimeout: true});
	goButton.addClassName('hidden');
	this.go();
}

MainAssistant.prototype.stop = function () {
	global.moveable = false;
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	goButton.removeClassName('hidden');
}
