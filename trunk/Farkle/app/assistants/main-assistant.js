function MainAssistant() {
	this.elements = {}
	this.die = []
	this.currentPlayPosition = new position(264,14)
	this.oldPlayPosition = new position(264,14)
	this.playArea = new board();
}


MainAssistant.prototype.setup = function() {
	Mojo.Log.info('****************Started Setup Function****************')
	Mojo.Log.info(' ')
	this.getElements();	

	this.stopShaking = Mojo.Function.debounce(undefined, this.doStopShaking.bind(this), 1);
	this.controller.listen(this.elements.cup, Mojo.Event.tap, this.shakeCup.bindAsEventListener(this))
	this.controller.listen(this.die[1].getHandler(), Mojo.Event.tap, this.die1Tapped.bindAsEventListener(this))
	this.controller.listen(this.die[2].getHandler(), Mojo.Event.tap, this.die2Tapped.bindAsEventListener(this))
	this.controller.listen(this.die[3].getHandler(), Mojo.Event.tap, this.die3Tapped.bindAsEventListener(this))
	this.controller.listen(this.die[4].getHandler(), Mojo.Event.tap, this.die4Tapped.bindAsEventListener(this))
	this.controller.listen(this.die[5].getHandler(), Mojo.Event.tap, this.die5Tapped.bindAsEventListener(this))
	this.controller.listen(this.die[6].getHandler(), Mojo.Event.tap, this.die6Tapped.bindAsEventListener(this))
};

MainAssistant.prototype.cleanup = function(event) {
	Mojo.Log.info('***************Started Cleanup Function***************')
	Mojo.Log.info(' ')
	this.controller.stopListening(this.elements.cup, Mojo.Event.tap, this.shakeCup.bindAsEventListener(this))
	this.controller.stopListening(this.die[1].getHandler(), Mojo.Event.tap, this.die1Tapped.bindAsEventListener(this))
	this.controller.stopListening(this.die[2].getHandler(), Mojo.Event.tap, this.die2Tapped.bindAsEventListener(this))
	this.controller.stopListening(this.die[3].getHandler(), Mojo.Event.tap, this.die3Tapped.bindAsEventListener(this))
	this.controller.stopListening(this.die[4].getHandler(), Mojo.Event.tap, this.die4Tapped.bindAsEventListener(this))
	this.controller.stopListening(this.die[5].getHandler(), Mojo.Event.tap, this.die5Tapped.bindAsEventListener(this))
	this.controller.stopListening(this.die[6].getHandler(), Mojo.Event.tap, this.die6Tapped.bindAsEventListener(this))
};

MainAssistant.prototype.shakeCup = function () {
	this.elements.cup.addClassName('shake')
	this.stopShaking();
}
MainAssistant.prototype.doStopShaking = function() {
	this.elements.cup.removeClassName('shake')
	for (var x = 1; x <= 6; x++) {
		this.die[x].show();
		this.die[x].setPosition(this.die[x].getBoardPos())
	}
}

MainAssistant.prototype.dieTapped = function(die) {
	this.playArea.dieTapped(this.die[die])
/*
	this.oldPlayPosition.set(this.currentPlayPosition)
	this.currentPlayPosition.set(this.die[die].tapped(this.currentPlayPosition))
	if (this.oldPlayPosition.getLeft() > this.currentPlayPosition.getLeft())
		for (var x = 1; x <= 6; x++)
			this.die[x].moveLeft()
*/
}

MainAssistant.prototype.getElements = function () {
	this.elements.cup = this.controller.get('cup');

	for (var x = 1; x <= 6; x++)
		this.die[x] = new die(x, this.controller.get('die' + x))
}

MainAssistant.prototype.activate = function(event) {};
MainAssistant.prototype.deactivate = function(event) {};

MainAssistant.prototype.die1Tapped = function(event){ Mojo.Log.info('value =' + Object.toJSON(event.srcElement)); this.dieTapped(1) }
MainAssistant.prototype.die2Tapped = function(){ this.dieTapped(2) }
MainAssistant.prototype.die3Tapped = function(){ this.dieTapped(3) }
MainAssistant.prototype.die4Tapped = function(){ this.dieTapped(4) }
MainAssistant.prototype.die5Tapped = function(){ this.dieTapped(5) }
MainAssistant.prototype.die6Tapped = function(){ this.dieTapped(6) }