
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

MainAssistant.prototype.handleCommand = function (event) {
	if (event.type == Mojo.Event.commandEnable &&
	    (event.command == Mojo.Menu.helpCmd)) {
         event.stopPropagation(); 
    }
	if (event.type == Mojo.Event.commandEnable &&
	    (event.command == Mojo.Menu.prefsCmd)) {
         event.stopPropagation(); 
    }

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case Mojo.Menu.helpCmd:
				Mojo.Controller.stageController.pushScene('support');
				break;
			case Mojo.Menu.prefsCmd:
				Mojo.Controller.stageController.pushScene('preferences');
				break;
		}
	}	
}
