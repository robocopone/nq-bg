function MainAssistant() {}

MainAssistant.prototype.setup = function() {
	Mojo.Log.warn(' ');Mojo.Log.warn(' ');Mojo.Log.warn(' ');Mojo.Log.warn(' ');
	Mojo.Log.warn('****************Started Setup Function****************')

	this.initialize();	

	this.controller.listen(this.playArea.getCupHandler(), Mojo.Event.tap, this.cupTapped.bindAsEventListener(this))
	for (var x = 1; x <= 6; x++)
		this.controller.listen(this.playArea.getDieHandler(x), Mojo.Event.tap, this.dieTapped.bindAsEventListener(this))
};

MainAssistant.prototype.cleanup = function(event) {
	Mojo.Log.warn(' ');Mojo.Log.warn(' ');Mojo.Log.warn(' ');Mojo.Log.warn(' ');
	Mojo.Log.warn('***************Started Cleanup Function***************')

	this.controller.stopListening(this.playArea.getCupHandler(), Mojo.Event.tap, this.cupTapped.bindAsEventListener(this))
	for (var x = 1; x <= 6; x++)
		this.controller.stopListening(this.playArea.getDieHandler(x), Mojo.Event.tap, this.dieTapped.bindAsEventListener(this))
};

MainAssistant.prototype.cupTapped = function () { 
	this.playArea.roll()
}

MainAssistant.prototype.dieTapped = function(event) {
	this.playArea.dieTapped(parseInt(event.srcElement.id.substring(3)))
}

MainAssistant.prototype.initialize = function () {
	var dice = []
	for (var x = 1; x <= 6; x++)
		dice[x] = new die(x, this.controller.get('die' + x))

	this.playArea = new board(this.controller.get('cup'), dice);
}

MainAssistant.prototype.activate = function(event) {};
MainAssistant.prototype.deactivate = function(event) {};

/*
MainAssistant.prototype.die1Tapped = function(event){
	for (var prop in event.srcElement) {
		Mojo.Log.info("PROPERTY: " + prop);
		Mojo.Log.info("==> " + event.srcElement[prop]);
	}
	this.dieTapped(1)
}
*/