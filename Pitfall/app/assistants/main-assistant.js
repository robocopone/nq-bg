function MainAssistant() {
}

MainAssistant.prototype.setup = function(){
	goButton = this.controller.get('goButton');
	layer4 = this.controller.get('layer4');
	ship = this.controller.get('ship');
	
	
	screenWidth = Mojo.Environment.DeviceInfo.screenHeight;
	screenHeight = Mojo.Environment.DeviceInfo.screenWidth;
	lastSlot = Math.floor(screenHeight / 20);

	goButton.setStyle({
		top: (screenHeight * .7) + 'px',
		left: ((screenWidth / 2) - 50) + 'px' 
	})
	layer = {}
	for (x = 1; x <= 16; x++){
		layer[x] = this.controller.get('layer' + x);
		layer[x].setStyle({
			top: (20 * (x-1)) + 'px',
		})
	}
		
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
	this.controller.stageController.setWindowProperties({blockScreenTimeout: true});
	/*
	 * Constraints
	 */
	adjCenterDistribution = 0;
	adjWidthDistribution = 0;
	prevWidth = 75;
	prevCenter = Math.floor(screenWidth / 2);
	maxWidth = 100;
	minWidth = 50;
	widthRandomizer = 25;
	centerRandomizer = 50;

	
	this.fillSlot(1, lastSlot);
	this.initShip();
}

MainAssistant.prototype.doMoveShip = function(event) {
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
	leftBound = this.getLeftBound(layer[4]);
	rightBound = this.getRightBound(layer[4]);
	for (x = 0; x < magnitude; x++) {
		if (direction == 'left' && position - 13 > leftBound)
			position -= 13;
		else if (direction == 'right' && position + 13 + 13 < rightBound)
			position += 13;
	}
	ship.setStyle({
		left: (position) + 'px'
	})
}

/*
 * Iterative function
 */
MainAssistant.prototype.doGo = function() {
	this.bumpUp();
	this.fillSlot(lastSlot, lastSlot)
	this.go();
}

MainAssistant.prototype.fillSlot = function (start, finish){
	for (x = start; x <= finish; x++) {
		randWidth = Math.floor(Math.random()* widthRandomizer)
		randCenter = Math.floor(Math.random()* centerRandomizer)
		if (randCenter % 20 < (10 + adjCenterDistribution))
			randCenter *= -1;
		if (randWidth % 20 < (10 + adjWidthDistribution))
			randWidth *= -1;

		prevWidth = this.checkWidth(prevWidth + randWidth);
		prevCenter = this.checkCenter(prevCenter + randCenter, prevWidth);
		borderLeft = prevCenter - prevWidth;
		borderRight = screenWidth - (prevCenter + prevWidth);
		layer[x].setStyle({
			borderLeftWidth: borderLeft + 'px',
			borderRightWidth: borderRight + 'px',
			width: (prevWidth * 2) + 'px'
		});
	}
}

MainAssistant.prototype.bumpUp = function () {
	for (x = 1; x <= lastSlot; x++){
		topp = this.getTop(layer[x]);
		if (topp == 0) {
			layer[x].setStyle({
				top: (lastSlot - 1) * 20 + 'px'
			})
		}
		else {
			layer[x].setStyle({
				top: (topp - 20) + 'px'
			})
		}
	}
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
MainAssistant.prototype.checkCenter = function (num, inWidth) {
	if (num + inWidth >= screenWidth) {
		adjCenterDistribution++;
		return screenWidth - inWidth;
	}
	if (num - inWidth <= 0) {
		adjCenterDistribution--;
		return inWidth;
	}
	return num;
}

MainAssistant.prototype.deactivate = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
}

MainAssistant.prototype.getLeftBound = function (layer) {
	return parseInt(layer.getStyle('border-left-width'))
}
MainAssistant.prototype.getRightBound = function (layer) {
	return screenWidth - parseInt(layer.getStyle('border-right-width'))
}
MainAssistant.prototype.getShipPosition = function () {
	return parseInt(ship.getStyle('left'));
}
MainAssistant.prototype.initShip = function () {
	currWidth = this.getRightBound(layer4) - this.getLeftBound(layer4);
	currPosition = this.getLeftBound(layer4) + Math.floor(currWidth / 2);
	ship.setStyle({
		left: (currPosition-6) + 'px'
	})
}
MainAssistant.prototype.cleanup = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.controller.stopListening(document, 'acceleration', this.doMoveShip.bindAsEventListener(this));
	this.controller.stopListening(goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
}

MainAssistant.prototype.tapGoButton = function() {
	this.go();
	goButton.addClassName('hidden');
}
