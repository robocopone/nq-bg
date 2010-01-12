
function MainAssistant() {
}

MainAssistant.prototype.setup = function() {
	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("free");
	}	
	this.controller.setupWidget("spinner", 
								this.spinnerAttr = { spinnerSize: 'large'},
								this.model = { spinning: true } 
								);
	this.scrim = Mojo.View.createScrim(this.controller.document, {scrimClass:'palm-scrim'});
	this.controller.get('exScrim').appendChild(this.scrim).appendChild($('spinner'));

	this.controller.get('announce').update("Getting GPS coordinates...");	
}

MainAssistant.prototype.activate = function(event) {
	this.trackingHandle = this.controller.serviceRequest
	(	'palm://com.palm.location', 
		{	method : 'startTracking', 
			parameters: 
			{	accuracy: 1, 
				subscribe: true 
			},
			onSuccess: this.handleServiceResponse.bind(this),
			onFailure: this.handleServiceResponseError.bind(this)
		}
	);
}


MainAssistant.prototype.deactivate = function(event) {
	this.trackingHandle.cancel(); 
}

MainAssistant.prototype.cleanup = function(event) {
	this.trackingHandle.cancel(); 
}

MainAssistant.prototype.handleServiceResponse = function(event) {
	this.controller.get('announce').update("");	
	this.scrim.hide();
	if (event.errorCode == 0) 
	{	this.controller.get('speed').update("Speed: " + (event.velocity * 2.23693629).toFixed(1) + " mph");
		this.controller.get('altitude').update("Altitude: " + (event.altitude * 3.2808399).toFixed(1) + " feet");
		this.controller.get('heading').update("Heading: " + event.heading + " degrees");
		if (event.horizAccuracy > 999)
			this.controller.get('accuracy').update("Accuracy:  Poor");
		else if (event.horizAccuracy > 99)
			this.controller.get('accuracy').update("Accuracy:  Medium");
		else if (event.horizAccuracy > 9) 
			this.controller.get('accuracy').update("Accuracy:  Good");
		else
			this.controller.get('accuracy').update("Accuracy: Excellent");
	}
	else
		this.controller.stageController.pushScene("gpsError", event.errorCode);
}

MainAssistant.prototype.handleServiceResponseError = function(event) {
	this.controller.stageController.pushScene("gpsError", event.errorCode);
}

MainAssistant.prototype.handleCommand = function (event) {
	if (event.type == Mojo.Event.commandEnable &&
	   (event.command == Mojo.Menu.helpCmd)) 
	{	event.stopPropagation(); 
	}

	if (event.type == Mojo.Event.commandEnable &&
	   (event.command == Mojo.Menu.prefsCmd)) 
	{	event.stopPropagation(); 
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
