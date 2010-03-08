function MainAssistant() {
}

MainAssistant.prototype.setup = function(){
	goButton = this.controller.get('goButton');
	ship = this.controller.get('ship');
	clock = this.controller.get('clock');
	elements = {}
	elements.level = this.controller.get('level');
	elements.score = this.controller.get('score');
	elements.multiplier = this.controller.get('multiplier');
	 
	/*
	 * Variable setup
	 */
	screenWidth = Mojo.Environment.DeviceInfo.screenHeight;
	screenHeight = Mojo.Environment.DeviceInfo.screenWidth;
	shipLayer = Math.floor(screenHeight / 20) - 11;
	lastLayer = Math.floor(screenHeight / 20) + 3;
	moveable = true;
	level = 1;
	score = 0;
	multiplier = 0;

	goButton.setStyle({
		top: (screenHeight * .7) + 'px',
		left: ((screenWidth / 2) - 50) + 'px' 
	})
	
	layer = {}
	for (x = 1; x <= lastLayer; x++){
		layer[x] = this.controller.get('layer' + x);
		layer[x].setStyle({ top: (20 * (x-2)) + 'px' })
	}
	elements.level.setStyle({ width: screenWidth / 3 + 'px'})
	elements.score.setStyle({ width: screenWidth / 3 + 'px'})
	elements.multiplier.setStyle({ width: screenWidth / 3 + 'px'})
	
		
	// Go Button Widget
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
	/*
	 * Constraints
	 */
	adjLeftDistribution = 0;
	adjWidthDistribution = 0;
	prevWidth = 75;
	prevLeft = Math.floor(screenWidth / 2) - 37;
	maxWidth = 150;
	minWidth = 100;
	widthRandomizer = 25;
	leftRandomizer = 50;
	
	this.fillLayer(1, lastLayer);
	this.initShip();
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
	clock.update(Mojo.Format.formatDate(new Date(), { time: 'medium' }));
	if (!moveable)
		return;
	if (event.accelY > .6)
		this.moveShip('left', 3);
	else if (event.accelY > .4)
		this.moveShip('left', 2);
	else if (event.accelY > .2)
		this.moveShip('left', 1);

	if (event.accelY < -.6)
		this.moveShip('right', 3);
	else if (event.accelY < -.4)
		this.moveShip('right', 2);
	else if (event.accelY < -.2)
		this.moveShip('right', 1);
}

MainAssistant.prototype.moveShip = function (direction, magnitude) {
	position = this.getShipPosition();
	leftBound = this.getLeft(layer[shipLayer]);
	rightBound = leftBound + this.getWidth(layer[shipLayer]);
	for (x = 0; x < magnitude; x++) {
		if (direction == 'left' && position - 13 > leftBound)
			position -= 13;
		else if (direction == 'left')
			position = leftBound + 1;
		else if (direction == 'right' && position + 13 + 13 < rightBound)
			position += 13;
		else if (direction == 'right')
			position = rightBound - 14;
	}
	ship.setStyle({
		left: position + 'px'
	})
}

MainAssistant.prototype.updateScore = function () {
	elements.level.update('Level: ' + level++);
	elements.score.update('Score: ' + (level * 250));
	elements.multiplier.update('Multiplier: ' + 0)
}

MainAssistant.prototype.collision = function () {
	position = this.getShipPosition();
	left = this.getLeft(layer[this.shipLayerLookAhead()]);
	width = this.getWidth(layer[this.shipLayerLookAhead()]);
	if (left <= position && (width+left) >= position + 13)
		return false;
	return true;
}

MainAssistant.prototype.shipLayerLookAhead = function () {
	if (shipLayer + 1 > lastLayer)
		return 1;
	return shipLayer;
}

MainAssistant.prototype.fillLayer = function (start, finish){
	for (x = start; x <= finish; x++) {
		randWidth = Math.floor(Math.random()* widthRandomizer)
		randLeft = Math.floor(Math.random()* leftRandomizer)
		if (randLeft % 20 < (10 + adjLeftDistribution))
			randLeft *= -1;
		if (randWidth % 20 < (10 + adjWidthDistribution))
			randWidth *= -1;

		prevWidth = this.checkWidth(prevWidth + randWidth);
		prevLeft = this.checkLeft(prevLeft + randLeft, prevWidth);
		layer[x].setStyle({
			width: prevWidth + 'px',
			left: prevLeft + 'px'
		});

		obstical = '';
		randObstical = Math.floor(Math.random() * 100);
		if (randObstical >= 90 && randObstical <= 100)
			for (y = 2; y < Math.floor((((100 - randObstical) * .1) * prevWidth)/13); y++)
				obstical += 'M'
		layer[x].update(obstical);
	}
}

MainAssistant.prototype.bumpUp = function () {
	for (x = 1; x <= lastLayer; x++){
		topp = this.getTop(layer[x]);
		if (topp == -20) {
			layer[x].addClassName('hidden');
			layer[x].setStyle({ top: (lastLayer - 2) * 20 + 'px' })
			currLastLayer = x;
		}
		else if (topp == (lastLayer - 2) * 20) {
			layer[x].removeClassName('hidden');
			layer[x].setStyle({ top: (topp - 20) + 'px' })
		}
		else
			layer[x].setStyle({ top: (topp - 20) + 'px' })
	}
	shipLayer++;
	if (shipLayer > lastLayer)
		shipLayer = 1;
	return currLastLayer;
}

MainAssistant.prototype.getTop = function (layer) {
	return parseInt(layer.getStyle('top'));
}

MainAssistant.prototype.checkWidth = function (num) {
	if (num > maxWidth) {
		adjWidthDistribution++;
		return maxWidth;
	}
	if (num < minWidth) {
		adjWidthDistribution--;
		return minWidth;
	}
	return num;
}

MainAssistant.prototype.checkLeft = function (num, inWidth) {
	if (num + inWidth >= screenWidth) {
		adjLeftDistribution++;
		return screenWidth - inWidth;
	}
	if (num <= 0) {
		adjLeftDistribution--;
		return 0;
	}
	return num;
}

MainAssistant.prototype.deactivate = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
}

MainAssistant.prototype.getLeft = function (layer) {
	return parseInt(layer.getStyle('left'))
}

MainAssistant.prototype.getWidth = function (layer) {
	return parseInt(layer.getStyle('width'))
}

MainAssistant.prototype.getShipPosition = function () {
	return parseInt(ship.getStyle('left'));
}

MainAssistant.prototype.initShip = function () {
	currWidth = this.getWidth(layer[shipLayer])
	currPosition = this.getLeft(layer[shipLayer]) + Math.floor(currWidth / 2);
	ship.setStyle({ left: (currPosition-6) + 'px' })
}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.controller.stopListening(document, 'acceleration', this.doMoveShip.bindAsEventListener(this));
	this.controller.stopListening(goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
}

MainAssistant.prototype.tapGoButton = function() {
	moveable = true;
	this.controller.stageController.setWindowProperties({blockScreenTimeout: true});
	goButton.addClassName('hidden');
	this.go();
}

MainAssistant.prototype.stop = function () {
	moveable = false;
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	goButton.removeClassName('hidden');
}
