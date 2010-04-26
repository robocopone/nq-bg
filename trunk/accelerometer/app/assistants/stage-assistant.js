function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	this.controller.indicateNewContent(true);
	this.controller.pushScene('main');
}
