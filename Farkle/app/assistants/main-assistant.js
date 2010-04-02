function MainAssistant() {
}


MainAssistant.prototype.setup = function() {
	this.getElements();	

	this.stopShaking = Mojo.Function.debounce(undefined, this.doStopShaking.bind(this), 2);

	this.controller.listen(this.elements.cup, Mojo.Event.tap, this.shakeCup.bindAsEventListener(this))
};

MainAssistant.prototype.shakeCup = function () {
	this.elements.cup.addClassName('shake')
	this.stopShaking();
}
MainAssistant.prototype.doStopShaking = function() {
	this.elements.cup.removeClassName('shake')
}
MainAssistant.prototype.activate = function(event) {

};

MainAssistant.prototype.deactivate = function(event) {

};

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening(this.elements.cup, Mojo.Event.tap, this.shakeCup.bindAsEventListener(this))
};

MainAssistant.prototype.elements = {};
MainAssistant.prototype.getElements = function () {
	this.elements.cup = this.controller.get('cup');
}
