/*
 *	gpsDashboard environment
 */
gpsDashboard = { };
gpsDashboard.units = 1;
gpsDashboard.backlight = 1;

gpsDashboard.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberGPSDashboardPrefs");
		storedPrefs = this.cookieData.get();
		if (storedPrefs){
			gpsDashboard.units = storedPrefs.units;
			gpsDashboard.backlight = storedPrefs.backlight;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			units: gpsDashboard.units,                                                
			backlight: gpsDashboard.backlight,
		});		
	}
});

/*
 * 	Main Scene
 */
function MainAssistant() {
}

MainAssistant.prototype.setup = function() {
	gpsDashboard.cookie.initialize();
	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("free");
	}	

	this.controller.setupWidget("spinner", 
								this.spinnerAttr = { spinnerSize: 'large'},
								this.model = { spinning: true } 
								);
	this.scrim = Mojo.View.createScrim(this.controller.document, {scrimClass:'palm-scrim'});
	this.controller.get('scrim').appendChild(this.scrim).appendChild($('spinner'));
}

MainAssistant.prototype.activate = function(event) {
	if (gpsDashboard.backlight == 1)
		this.controller.stageController.setWindowProperties({blockScreenTimeout: true});

	// GPS Information gathering
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

MainAssistant.prototype.handleServiceResponse = function(event) {
	this.controller.get('announce').update("");	
	this.scrim.hide();
	if (event.errorCode == 0) 
	{	if ( (event.heading >= 348.75 && event.heading <= 360) ||
			 (event.heading >=0 && event.heading < 11.25) )
			this.controller.get('heading').update("Heading: North");
		if (event.heading >= 11.25 && event.heading < 33.75)
			this.controller.get('heading').update("Heading: North-northeast");
		if (event.heading >= 33.75 && event.heading < 56.25)
			this.controller.get('heading').update("Heading: Northeast");
		if (event.heading >= 56.25 && event.heading < 78.75)
			this.controller.get('heading').update("Heading: East-northeast");
		if (event.heading >= 78.75 && event.heading < 101.25)
			this.controller.get('heading').update("Heading: East");
		if (event.heading >= 101.25 && event.heading < 123.75)
			this.controller.get('heading').update("Heading: East-southeast");
		if (event.heading >= 123.75 && event.heading < 146.25)
			this.controller.get('heading').update("Heading: Southeast");
		if (event.heading >= 146.25 && event.heading < 168.75)
			this.controller.get('heading').update("Heading: South-southeast");
		if (event.heading >= 168.75 && event.heading < 191.25)
			this.controller.get('heading').update("Heading: South");
		if (event.heading >= 191.25 && event.heading < 213.75)
			this.controller.get('heading').update("Heading: South-southwest");
		if (event.heading >= 213.75 && event.heading < 236.25)
			this.controller.get('heading').update("Heading: Southwest");
		if (event.heading >= 236.25 && event.heading < 258.75)
			this.controller.get('heading').update("Heading: West-southwest");
		if (event.heading >= 258.75 && event.heading < 281.25)
			this.controller.get('heading').update("Heading: West");
		if (event.heading >= 281.25 && event.heading < 303.75)
			this.controller.get('heading').update("Heading: West-northwest");
		if (event.heading >= 303.75 && event.heading < 326.25)
			this.controller.get('heading').update("Heading: Northwest");
		if (event.heading >= 326.25 && event.heading < 348.75)
			this.controller.get('heading').update("Heading: North-northwest");

		if (event.velocity == 0) {
			this.controller.get('speed').update("speed: -");
			this.controller.get('heading').update("Heading: -");
		}
		else if (gpsDashboard.units == 1)
			this.controller.get('speed').update("Speed: " + (event.velocity * 2.23693629).toFixed(1) + " mph");
		else if (gpsDashboard.units == 2)
			this.controller.get('speed').update("Speed: " + (event.velocity * 3.6).toFixed(1) + " kph");
			
		if (event.vertAccuracy == 0)
			this.controller.get('altitude').update("Altitude: -");
		else if (gpsDashboard.units == 1)
			this.controller.get('altitude').update("Altitude: " + (event.altitude * 3.2808399).toFixed(1) + " feet");
		else if (gpsDashboard.units == 2)
			this.controller.get('altitude').update("Altitude: " + event.altitude.toFixed(1) + " meters");

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

MainAssistant.prototype.deactivate = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.trackingHandle.cancel(); 
}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.trackingHandle.cancel(); 
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
				Mojo.Controller.stageController.pushAppSupportInfoScene();
				break;
			case Mojo.Menu.prefsCmd:
				Mojo.Controller.stageController.pushScene('preferences');
				break;
		}
	}
}
