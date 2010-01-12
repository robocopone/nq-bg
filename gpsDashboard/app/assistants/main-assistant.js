function MainAssistant() {
}

MainAssistant.prototype.setup = function() {
	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("free");
	}	
}

MainAssistant.prototype.activate = function(event) {
}


MainAssistant.prototype.deactivate = function(event) {
}

MainAssistant.prototype.cleanup = function(event) {
}
