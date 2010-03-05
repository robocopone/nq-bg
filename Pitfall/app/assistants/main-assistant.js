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

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.controller.stopListening(document, 'acceleration', this.doMoveShip.bindAsEventListener(this));
	this.controller.stopListening(goButton, Mojo.Event.tap, this.tapGoButton.bindAsEventListener(this));
}

MainAssistant.prototype.tapGoButton = function() {
	this.go();
	goButton.addClassName('hidden');
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
	magnitude = magnitude * 13;
	position = this.getShipPosition();
	if(direction == 'left' && position - magnitude > this.getLeftBound(layer4))
		ship.setStyle({
			left: (position - magnitude) + 'px'
		})
	if(direction == 'right' && position + magnitude + 13 < this.getRightBound(layer4))
		ship.setStyle({
			left: (position + magnitude) + 'px'
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
		this.controller.get('layer' + x).setStyle({
			borderLeftWidth: borderLeft + 'px',
			borderRightWidth: borderRight + 'px'
		});
	}
}

MainAssistant.prototype.bumpUp = function () {
/*
	for (x = 1; x < lastSlot; x++){
		currElement = this.controller.get('layer' + x);
		nextElement = this.controller.get('layer' + (x + 1));
		currElement.setStyle({
			borderLeftWidth: nextElement.getStyle('borderLeftWidth'),
			borderRightWidth: nextElement.getStyle('borderRightWidth')
		})		
	}
*/
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
