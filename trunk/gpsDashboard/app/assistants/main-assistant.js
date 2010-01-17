/*
 *	gpsDashboard environment
 */
gpsDashboard = { };
gpsDashboard.units = 1;
gpsDashboard.backlight = 1;
gpsDashboard.avgSpeed = { count: 0, value: 0 };
gpsDashboard.initialLoc = { };
gpsDashboard.prevLoc = { };
gpsDashboard.tripometer = 0;
gpsDashboard.iteration = 0;
gpsDashboard.lifeDist = 0;

gpsDashboard.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberGPSDashboardPrefs");
		storedData = this.cookieData.get();
		if (storedData){
			gpsDashboard.units = storedData.units;
			gpsDashboard.backlight = storedData.backlight;
			gpsDashboard.lifeDist = storedData.lifeDist;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			units: gpsDashboard.units,                                                
			backlight: gpsDashboard.backlight,
			lifeDist: gpsDashboard.lifeDist
		});		
	}
});

/*
 * 	Main Scene
 */
function MainAssistant() {
}

MainAssistant.prototype.setup = function(){
	gpsDashboard.cookie.initialize();
	
	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("free");
	}
	this.controller.listen(document, 'orientationchange', this.handleOrientation.bindAsEventListener(this));
	
	this.controller.get('address').addClassName('hidden');
	this.controller.get('currentInfo').addClassName('hidden');
	this.controller.get('tripInfo').addClassName('hidden');
	this.controller.get('addressButton').addClassName('hidden');
	
	this.controller.setupWidget("spinner", this.spinnerAttr = {
		spinnerSize: 'large'
	}, this.model = {
		spinning: true
	});
	this.scrim = Mojo.View.createScrim(this.controller.document, {
		scrimClass: 'palm-scrim'
	});
	this.controller.get('scrim').appendChild(this.scrim).appendChild(this.controller.get('spinner'));


	this.controller.setupWidget('addressButton', this.atts = {
		type: Mojo.Widget.activityButton
	}, this.model = {
		buttonLabel: 'Get Address',
		buttonClass: 'affirmative',
		disabled: false
	});
	this.getAddressListener = this.getAddress.bind(this);
	Mojo.Event.listen(this.controller.get('addressButton'),Mojo.Event.tap, this.getAddressListener);
	//this.controller.setupWidget('avgSpeedReset', {}, {buttonLabel: 'Reset'});	
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

MainAssistant.prototype.getAddress = function(){
	this.controller.serviceRequest('palm://com.palm.location', {
		method: "getReverseLocation",
		parameters: {
			latitude: gpsDashboard.prevLoc.latitude,
			longitude: gpsDashboard.prevLoc.longitude
		},
		onSuccess: this.handleReverseResponse.bind(this),
		onFailure: this.handleReverseResponseError.bind(this)
	});
}

MainAssistant.prototype.handleServiceResponse = function(event){
	gpsDashboard.iteration++;
	if (gpsDashboard.iteration == 1) {
		this.controller.get('announce').addClassName('hidden');
		this.scrim.hide();
		
		this.controller.get('currentInfo').removeClassName('hidden');
		this.controller.get('tripInfo').removeClassName('hidden');
		this.controller.get('addressButton').removeClassName('hidden');
		
		gpsDashboard.initialLoc = event;
	}
	
	if (event.errorCode == 0) {
		this.controller.get('heading').update(this.heading(event));
		this.controller.get('speed').update(this.speed(event));
		this.controller.get('altitude').update(this.altitude(event));
		this.controller.get('accuracy').update(this.accuracy(event));
		this.controller.get('avgSpeed').update(this.avgSpeed(event));
		this.controller.get('distTraveled').update(this.distTraveled(event));
		this.controller.get('distFromInit').update(this.distFromInit(event));
		this.controller.get('lifeDist').update(this.lifeDist(event));
		gpsDashboard.prevLoc = event;
	}
	else 
		this.controller.stageController.pushScene("gpsError", event.errorCode);

}

MainAssistant.prototype.distFromInit = function( event ) {
	if (gpsDashboard.units == 1)
		return (this.calcDist(event, gpsDashboard.initialLoc) * 0.621371192).toFixed(1) + " miles";
	if (gpsDashboard.units == 2)
		return this.calcDist(event, gpsDashboard.initialLoc).toFixed(1) + " km";
}

MainAssistant.prototype.lifeDist = function(event){
	if (gpsDashboard.iteration > 1) {
		gpsDashboard.lifeDist += this.calcDist(event, gpsDashboard.prevLoc);
		if (gpsDashboard.units == 1) 
			return (gpsDashboard.lifeDist * 0.621371192).toFixed(1) + " miles";
		if (gpsDashboard.units == 2) 
			return gpsDashboard.lifeDist.toFixed(1) + " km";
	}
	return "-";
}

MainAssistant.prototype.avgSpeed = function(event){
	if (gpsDashboard.units == 1) 
		return (this.calcDist(gpsDashboard.initialLoc, event) /
				this.calcTime(gpsDashboard.initialLoc, event) *
				60 * 60 * .621371192).toFixed(1) + " mph";
	if (gpsDashboard.units == 2) 
		return (this.calcDist(gpsDashboard.initialLoc, event) /
				this.calcTime(gpsDashboard.initialLoc, event) *
				60 * 60).toFixed(1) + " kph";
}

MainAssistant.prototype.distTraveled = function( event ) {
	if (gpsDashboard.iteration > 1) {
		gpsDashboard.tripometer += this.calcDist(event, gpsDashboard.prevLoc);
		if (gpsDashboard.units == 1) 
			return (gpsDashboard.tripometer * 0.621371192).toFixed(1) + " miles";
		if (gpsDashboard.units == 2) 
			return gpsDashboard.tripometer.toFixed(1) + " km";
	}
	return "-";
}

MainAssistant.prototype.handleServiceResponseError = function(event) {
	this.controller.stageController.pushScene("gpsError", event.errorCode);
}

MainAssistant.prototype.handleReverseResponse = function( event ) {
	this.buttonWidget = this.controller.get('addressButton');
	this.buttonWidget.mojo.deactivate();

	add = event.address.split(";");
	this.controller.get('address').removeClassName('hidden');
	this.controller.get('address1').update(add[0]);
	this.controller.get('address2').update(add[1]);
}

MainAssistant.prototype.handleReverseResponseError = function(event){
	this.controller.get('address1').update(event.errorCode);
}

MainAssistant.prototype.calcTime = function( event1, event2 ) {
	return (event2.timestamp - event1.timestamp) / 1000;
}

MainAssistant.prototype.calcDist = function( point1, point2 ) {
	if (point1.latitude == point2.latitude && 
		point1.longitude == point2.longitude)
		return 0;

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

MainAssistant.prototype.deactivate = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.trackingHandle.cancel(); 
}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
	this.trackingHandle.cancel(); 
	gpsDashboard.cookie.storeCookie();
}

MainAssistant.prototype.handleOrientation = function( event ) {
	if (event.position == 4 || event.position == 5) {
		this.controller.get('address').addClassName('landscape');
		this.controller.get('currentInfo').addClassName('landscape');
		this.controller.get('tripInfo').addClassName('landscape');
		this.controller.get('addressButton').addClassName('landscape');
	}	
	if (event.position == 2 || event.position == 3) {
		this.controller.get('address').removeClassName('landscape');
		this.controller.get('currentInfo').removeClassName('landscape');
		this.controller.get('tripInfo').removeClassName('landscape');
		this.controller.get('addressButton').removeClassName('landscape');
	}
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
		return "WSW";
	if ((event.heading >= 348.75 && event.heading <= 360) ||
		(event.heading >= 0 && event.heading < 11.25)		) 
		return "N";
	if (event.heading >= 11.25 && event.heading < 33.75) 
		return "NNE";
	if (event.heading >= 33.75 && event.heading < 56.25) 
		return "NE";
	if (event.heading >= 56.25 && event.heading < 78.75) 
		return "ENE";
	if (event.heading >= 78.75 && event.heading < 101.25) 
		return "E";
	if (event.heading >= 101.25 && event.heading < 123.75) 
		return "ESE";
	if (event.heading >= 123.75 && event.heading < 146.25) 
		return "SE";
	if (event.heading >= 146.25 && event.heading < 168.75) 
		return "SSE";
	if (event.heading >= 168.75 && event.heading < 191.25) 
		return "S";
	if (event.heading >= 191.25 && event.heading < 213.75) 
		return "SSW";
	if (event.heading >= 213.75 && event.heading < 236.25) 
		return "SW";
	if (event.heading >= 236.25 && event.heading < 258.75) 
		return "WSW";
	if (event.heading >= 258.75 && event.heading < 281.25) 
		return "W";
	if (event.heading >= 281.25 && event.heading < 303.75) 
		return "WNW";
	if (event.heading >= 303.75 && event.heading < 326.25) 
		return "NW";
	if (event.heading >= 326.25 && event.heading < 348.75) 
		return "NNW";
}

MainAssistant.prototype.speed = function(event) {
	if (event.velocity == 0)
		return "000.0 mph";
	if (gpsDashboard.units == 1)
		return (event.velocity * 2.23693629).toFixed(1) + " mph";
	if (gpsDashboard.units == 2)
		return (event.velocity * 3.6).toFixed(1) + " kph";
}

MainAssistant.prototype.altitude = function(event){
	if (event.vertAccuracy == 0)
		return "-";
	if (gpsDashboard.units == 1)
		return (event.altitude * 3.2808399).toFixed(1) + " feet";
	if (gpsDashboard.units == 2)
		return event.altitude.toFixed(1) + " meters";
}

MainAssistant.prototype.accuracy = function(event){
	if (event.horizAccuracy > 999) 
		return "Poor";
	if (event.horizAccuracy > 99) 
		return "Medium";
	if (event.horizAccuracy > 9) 
		return "Good";
	return "Excellent";
}

Number.prototype.toRad = function() {  // convert degrees to radians
  return this * Math.PI / 180;
}