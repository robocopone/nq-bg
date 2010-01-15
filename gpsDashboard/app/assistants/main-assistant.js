/*
 *	gpsDashboard environment
 */
gpsDashboard = { };
gpsDashboard.units = 1;
gpsDashboard.backlight = 1;
gpsDashboard.avgSpeed = { count: 0, value: 0 };
gpsDashboard.initialLoc = { };
gpsDashboard.tripometer = 0;
gpsDashboard.iteration = 0;
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
MainAssistant.prototype.handleOrientation = function( event ) {
	if (event.position == 4 || event.position == 5) {
		this.controller.get('heading').style.width = "42.5%";
		this.controller.get('heading').style.float = "left";
		this.controller.get('speed').style.width = "42.5%";
		this.controller.get('speed').style.float = "left";
		this.controller.get('altitude').style.width = "42.5%";
		this.controller.get('altitude').style.float = "left";
		this.controller.get('accuracy').style.width = "42.5%";
		this.controller.get('accuracy').style.float = "left";
		this.controller.get('calcSpeed').style.width = "42.5%";
		this.controller.get('calcSpeed').style.float = "left";
		this.controller.get('address').style.width = "42.5%";
		this.controller.get('address').style.float = "right";
	}
	if (event.position == 2 || event.position == 3) {
		this.controller.get('heading').style.width = "85%";
		this.controller.get('speed').style.width = "85%";
		this.controller.get('altitude').style.width = "85%";
		this.controller.get('accuracy').style.width = "85%";
		this.controller.get('calcSpeed').style.width = "85%";		
		this.controller.get('address').style.width = "85%";
	}
}
MainAssistant.prototype.setup = function() {
	gpsDashboard.cookie.initialize();
	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("free");
	}	
	this.controller.listen(document, 'orientationchange', this.handleOrientation.bindAsEventListener(this));


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
MainAssistant.prototype.handleReverseResponse = function( event ) {
	add = event.address.split(";");
	this.controller.get('address1').update(add[0]);
	this.controller.get('address2').update(add[1]);
}
MainAssistant.prototype.handleReverseResponseError = function(event){
	this.controller.get('address1').update(event.errorCode);
}

MainAssistant.prototype.handleServiceResponse = function( event ) {
    gpsDashboard.iteration++;
	if (gpsDashboard.iteration == 1) {
		this.controller.get('announce').update("");	
		this.scrim.hide();
		gpsDashboard.initialLoc = event;
	}
	if (gpsDashboard.iteration % 10 == 1)
		this.controller.serviceRequest('palm://com.palm.location', {
			method: "getReverseLocation",
			parameters: { latitude: event.latitude, longitude: event.longitude},
			onSuccess: this.handleReverseResponse.bind(this),
			onFailure: this.handleReverseResponseError.bind(this)
		});
	if (event.errorCode == 0) 
	{	this.controller.get('heading').update(this.heading(event));
		this.controller.get('speed').update(this.speed(event));
		this.controller.get('altitude').update(this.altitude(event));
		this.controller.get('accuracy').update(this.accuracy(event));
		this.controller.get('calcSpeed').update(this.calcSpeed(event));
		gpsDashboard.prevLoc = event;
	}
	else
		this.controller.stageController.pushScene("gpsError", event.errorCode);
}

MainAssistant.prototype.calcSpeed = function( event ){
	if (!gpsDashboard.prevLoc)
		return "Calculated Speed: -";
	if (gpsDashboard.units = 1)
		return "Calculated Speed: " +
			(this.calcDist(gpsDashboard.prevLoc, event) / 
			 this.calcTime(gpsDashboard.prevLoc, event) * 3600 * .621371192).toFixed(1) + " mph";
	if (gpsDashboard.units = 2)
		return "Calculated Speed: " +
			(this.calcDist(gpsDashboard.prevLoc, event) / 
		 	 this.calcTime(gpsDashboard.prevLoc, event) * 3600).toFixed(1) + " kph";
}
MainAssistant.prototype.calcTime = function( event1, event2 ) {
	return (event2.timestamp - event1.timestamp) / 1000;
}
MainAssistant.prototype.calcDist = function( point1, point2 ) {
	dLat = point2.latitude - point1.latitude;
	dLon = point2.longitude - point1.longitude;
	mLat = ((point2.latitude + point1.latitude) / 2).toRad();
	K1 = 111.13209 - 
		 (0.56605 * Math.cos(2 * mLat)) + 
		 (0.00120 * Math.cos(4 * mLat));
	K2 = (111.41513 * Math.cos(mLat)) - 
		 (0.09455 * Math.cos(3 * mLat)) + 
		 (0.00012 * Math.cos(5 * mLat));
	dist = Math.sqrt( Math.pow((K1 * dLat), 2) + Math.pow((K2 * dLon), 2));
	return dist;
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
MainAssistant.prototype.heading = function(event){
	if (event.velocity == 0)
		return "Heading: -";
	if ((event.heading >= 348.75 && event.heading <= 360) ||
		(event.heading >= 0 && event.heading < 11.25)		) 
		return "Heading: North";
	if (event.heading >= 11.25 && event.heading < 33.75) 
		return "Heading: North-northeast";
	if (event.heading >= 33.75 && event.heading < 56.25) 
		return "Heading: Northeast";
	if (event.heading >= 56.25 && event.heading < 78.75) 
		return "Heading: East-northeast";
	if (event.heading >= 78.75 && event.heading < 101.25) 
		return "Heading: East";
	if (event.heading >= 101.25 && event.heading < 123.75) 
		return "Heading: East-southeast";
	if (event.heading >= 123.75 && event.heading < 146.25) 
		return "Heading: Southeast";
	if (event.heading >= 146.25 && event.heading < 168.75) 
		return "Heading: South-southeast";
	if (event.heading >= 168.75 && event.heading < 191.25) 
		return "Heading: South";
	if (event.heading >= 191.25 && event.heading < 213.75) 
		return "Heading: South-southwest";
	if (event.heading >= 213.75 && event.heading < 236.25) 
		return "Heading: Southwest";
	if (event.heading >= 236.25 && event.heading < 258.75) 
		return "Heading: West-southwest";
	if (event.heading >= 258.75 && event.heading < 281.25) 
		return "Heading: West";
	if (event.heading >= 281.25 && event.heading < 303.75) 
		return "Heading: West-northwest";
	if (event.heading >= 303.75 && event.heading < 326.25) 
		return "Heading: Northwest";
	if (event.heading >= 326.25 && event.heading < 348.75) 
		return "Heading: North-northwest";
}
MainAssistant.prototype.speed = function(event) {
	if (event.velocity == 0)
		return "Speed: -";
	if (gpsDashboard.units == 1)
		return "Speed: " + (event.velocity * 2.23693629).toFixed(1) + " mph";
	if (gpsDashboard.units == 2)
		return "Speed: " + (event.velocity * 3.6).toFixed(1) + " kph";
}
MainAssistant.prototype.altitude = function(event){
	if (event.vertAccuracy == 0)
		return "Altitude: -";
	if (gpsDashboard.units == 1)
		return "Altitude: " + (event.altitude * 3.2808399).toFixed(1) + " feet";
	if (gpsDashboard.units == 2)
		return "Altitude: " + event.altitude.toFixed(1) + " meters";
}
MainAssistant.prototype.accuracy = function(event){
	if (event.horizAccuracy > 999) 
		return "Accuracy:  Poor";
	if (event.horizAccuracy > 99) 
		return "Accuracy:  Medium";
	if (event.horizAccuracy > 9) 
		return "Accuracy:  Good";
	return "Accuracy: Excellent";
}
Number.prototype.toRad = function() {  // convert degrees to radians
  return this * Math.PI / 180;
}