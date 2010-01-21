/*
 *	gpsDashboard environment
 */
gpsDashboard = { };
gpsDashboard.hidden = true;						// Is the dashboard visable?
gpsDashboard.units = 1;							// Preferred unit of measure
gpsDashboard.backlight = 1;						// Backlight preference
gpsDashboard.maxError = 10;						// Max error in meters preference
gpsDashboard.avgSpeedPref = 2;					// Average speed calculation preference
gpsDashboard.avgSpeed = {time: 0, dist: 0};		// Average speed info
gpsDashboard.topSpeed = 0;						// Top speed info
gpsDashboard.alltimeTopSpeed = { };				// All time top speed
gpsDashboard.alltimeTopSpeed.data = {velocity: 0};
gpsDashboard.alltimeHigh = { };					// All time top elevation
gpsDashboard.alltimeHigh.data = {altitude: 0};
gpsDashboard.alltimeLow = { };					// All time low elevation
gpsDashboard.alltimeLow.data = {altitude: 15000};
gpsDashboard.tripometer = {time: 0, dist: 0};	// Distance traveled data
gpsDashboard.lifeDist = 0;						// Lifetime distance traveled
gpsDashboard.initialLoc = undefined;			// Inital Location
gpsDashboard.prevLoc = undefined;				// Previous location
gpsDashboard.addressSwitch = "normal";			// Allows the address returned by
												// reverse location to be stored in
												// the correct spot

/*
 * Stores and recalls data stored between sessions
 */
gpsDashboard.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberGPSDashboardData");
		storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.3.0"){
			gpsDashboard.units = storedData.units;
			gpsDashboard.backlight = storedData.backlight;
			gpsDashboard.avgSpeedPref = storedData.avgSpeedPref;
			gpsDashboard.lifeDist = storedData.lifeDist;
			gpsDashboard.maxError = storedData.maxError;
			gpsDashboard.alltimeTopSpeed = storedData.alltimeTopSpeed;
			gpsDashboard.alltimeHigh = storedData.alltimeHigh;
			gpsDashboard.alltimeLow = storedData.alltimeLow;
		}
		else if (storedData) {
			gpsDashboard.units = storedData.units;
			gpsDashboard.backlight = storedData.backlight;
			gpsDashboard.avgSpeedPref = storedData.avgSpeedPref;
			gpsDashboard.lifeDist = storedData.lifeDist;
			gpsDashboard.maxError = storedData.maxError;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.3.0",
			units: gpsDashboard.units,                                                
			backlight: gpsDashboard.backlight,
			lifeDist: gpsDashboard.lifeDist,
			avgSpeedPref: gpsDashboard.avgSpeedPref,
			maxError: gpsDashboard.maxError,
			alltimeTopSpeed: gpsDashboard.alltimeTopSpeed,
			alltimeHigh: gpsDashboard.alltimeHigh,
			alltimeLow: gpsDashboard.alltimeLow
		});		
	}
});

function MainAssistant() {
}

/*
 * 	Main Scene Setup
 */
MainAssistant.prototype.setup = function(){
	gpsDashboard.cookie.initialize();
	
	if (this.controller.stageController.setWindowOrientation &&
		Mojo.Environment.DeviceInfo.screenHeight >= 480 ) 
		this.controller.stageController.setWindowOrientation("free");
	this.controller.listen(document, 'orientationchange', this.handleOrientation.bindAsEventListener(this));
	
	// Hides the dashboard
	this.controller.get('address').addClassName('hidden');
	this.controller.get('currentInfo').addClassName('hidden');
	this.controller.get('tripInfo').addClassName('hidden');
	this.controller.get('addressInfo').addClassName('hidden');
	
	// Scrim and activity spinner
	this.controller.setupWidget("spinner", this.spinnerAttr = {
		spinnerSize: 'large'
	}, this.model = {
		spinning: true
	});
	this.scrim = Mojo.View.createScrim(this.controller.document, {
		scrimClass: 'palm-scrim'
	});
	this.controller.get('scrim').appendChild(this.scrim).appendChild(this.controller.get('spinner'));
	
	// Address button widget
	this.controller.setupWidget('addressButton', this.atts = {
		type: Mojo.Widget.activityButton
	}, this.model = {
		buttonLabel: 'Get Address',
		buttonClass: 'affirmative',
		disabled: false
	});
	this.controller.listen(this.controller.get('addressButton'), Mojo.Event.tap, this.getAddress.bindAsEventListener(this));
	this.controller.listen(this.controller.get('currentInfo'),Mojo.Event.tap, this.resets.bindAsEventListener(this));
	this.controller.listen(this.controller.get('tripInfo'),Mojo.Event.tap, this.resets.bindAsEventListener(this));
	this.controller.listen(this.controller.get('appHeader'),Mojo.Event.tap, this.nav.bindAsEventListener(this));
}
MainAssistant.prototype.nav = function () {
	this.controller.popupSubmenu({
		onChoose: this.navHandler,
		placeNear: this.controller.get('appHeader'),
		items: [{
			label: 'Record Keeping',
			command: 'recordKeeping',
		}]
	});
}
MainAssistant.prototype.navHandler = function(command) {
	if (command == 'recordKeeping')
		this.controller.stageController.pushScene('records');
}
MainAssistant.prototype.activate = function(event) {
	if (gpsDashboard.backlight == 1)
		this.controller.stageController.setWindowProperties({blockScreenTimeout: true});

	// GPS Information gathering
	this.trackingHandle = this.controller.serviceRequest
	(	'palm://com.palm.location', 
		{	method : 'startTracking', 
			parameters: 
			{	subscribe: true 
			},
			onSuccess: this.handleServiceResponse.bind(this),
			onFailure: this.handleServiceResponseError.bind(this)
		}
	);
}

MainAssistant.prototype.handleServiceResponse = function(event){
	if (!gpsDashboard.initialLoc && event.horizAccuracy <= gpsDashboard.maxError) 
		gpsDashboard.initialLoc = event;
	
	if (event.horizAccuracy <= gpsDashboard.maxError && gpsDashboard.hidden) {
		gpsDashboard.hidden = false;
		this.controller.get('initialDisplay').addClassName('hidden');
		this.scrim.hide();
		
		this.controller.get('currentInfo').removeClassName('hidden');
		this.controller.get('tripInfo').removeClassName('hidden');
		this.controller.get('addressInfo').removeClassName('hidden');
	}
	else 
		if (event.horizAccuracy > gpsDashboard.maxError && !gpsDashboard.hidden) {
			gpsDashboard.hidden = true;
			this.controller.get('initialDisplay').removeClassName('hidden');
			this.scrim.show();
			
			this.controller.get('currentInfo').addClassName('hidden');
			this.controller.get('tripInfo').addClassName('hidden');
			this.controller.get('addressInfo').addClassName('hidden');
			this.controller.get('address').addClassName('hidden');
		}
	this.controller.get('accuracyNotice').update("Satellite Strength too Low");
	this.controller.get('horizAccuracy').update("Horizontal Error = " + event.horizAccuracy.toFixed(1) + "m > " + gpsDashboard.maxError + "m");

	if (event.errorCode == 0 && event.horizAccuracy <= gpsDashboard.maxError) {
		this.controller.get('speed').update(this.speed(event));
		this.controller.get('heading').update(this.heading(event));
		this.controller.get('altitude').update(this.altitude(event));
		this.controller.get('avgSpeed').update(this.avgSpeed(event));
		this.controller.get('topSpeed').update(this.topSpeed(event));
		this.controller.get('tripDuration').update(this.tripDuration());
		this.controller.get('distTraveled').update(this.distTraveled(event));
		this.controller.get('distFromInit').update(this.distFromInit(event));
		this.controller.get('lifeDist').update(this.lifeDist(event));
		this.recordCheck(event);
		gpsDashboard.prevLoc = event;
	}
	else if (event.errorCode != 0)
		this.controller.stageController.pushScene("gpsError", event.errorCode);

}

/*
 * Checks to see if records have been broken
 * and updates if they have
 */
MainAssistant.prototype.recordCheck = function (event) {
	if (event.velocity > gpsDashboard.alltimeTopSpeed.data.velocity) {
		gpsDashboard.alltimeTopSpeed.data = event;
		gpsDashboard.alltimeTopSpeed.date =
			Mojo.Format.formatDate(new Date(), { date: 'medium' });
	}
	if (event.altitude > gpsDashboard.alltimeHigh.data.altitude) {
		gpsDashboard.alltimeHigh.data = event;
		gpsDashboard.alltimeHigh.date =
			Mojo.Format.formatDate(new Date(), { date: 'medium' });
	}
	if (event.altitude < gpsDashboard.alltimeLow.data.altitude) {
		gpsDashboard.alltimeLow.data = event;
		gpsDashboard.alltimeLow.date =
			Mojo.Format.formatDate(new Date(), { date: 'medium'});
	}
}

MainAssistant.prototype.handleServiceResponseError = function(event) {
	this.controller.stageController.pushScene("gpsError", event.errorCode);
}

/*
 * Current speed display
 */
MainAssistant.prototype.speed = function(event) {
	if (event.velocity == 0)
		return "&nbsp;";
	if (gpsDashboard.units == 1)
		return (event.velocity * 2.23693629).toFixed(1) + " mph";
	if (gpsDashboard.units == 2)
		return (event.velocity * 3.6).toFixed(1) + " kph";
}

/*
 * Top speed display
 */

MainAssistant.prototype.topSpeed = function (event) {
	if (event.velocity > gpsDashboard.topSpeed)
		gpsDashboard.topSpeed = event.velocity;
	if (gpsDashboard.topSpeed == 0)
		return "&nbsp;";
	if (gpsDashboard.units == 1)
		return (gpsDashboard.topSpeed * 2.23693629).toFixed(1) + " mph";
	if (gpsDashboard.units == 2)
		return (gpsDashboard.topSpeed * 3.6).toFixed(1) + " kph";
}


/*
 * Converts degrees to N/S/E/W
 */
MainAssistant.prototype.heading = function(event){
	if (event.velocity == 0)
		return "&nbsp;";
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

/*
 * Current altitude display
 */
MainAssistant.prototype.altitude = function(event){
	if (event.vertAccuracy == 0)
		return "&nbsp;";
	if (gpsDashboard.units == 1)
		return (event.altitude * 3.2808399).toFixed(1) + " feet";
	if (gpsDashboard.units == 2)
		return event.altitude.toFixed(1) + " m";
}
/*
 * Trip duration return
 */
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
MainAssistant.prototype.tripDuration = function () {
	a = gpsDashboard.tripometer.time;
	var days = Math.floor(a / 86400);
	var hours=Math.floor(a / 3600) - (days * 24); 
	var minutes=Math.floor(a / 60) - (days * 1440) - (hours * 60); 
	var seconds=Math.floor(a % 60); 

	if (days > 0)
		return pad(days, 2) + ":" + pad(hours, 2) + ":" + pad(minutes,2)+ ":" + pad(seconds, 2);
	return pad(hours, 2) + ":" + pad(minutes,2) + ":" + pad(seconds, 2);
}
/*
 * Trip average speed display
 */
MainAssistant.prototype.avgSpeed = function(event){
	if (gpsDashboard.prevLoc) {
		gpsDashboard.avgSpeed.dist += this.calcDist(gpsDashboard.prevLoc, event);
		gpsDashboard.avgSpeed.time += this.calcTime(gpsDashboard.prevLoc, event);
	}
	if (gpsDashboard.avgSpeedPref == 1 && gpsDashboard.initialLoc) {
		if (this.calcTime(gpsDashboard.initialLoc, event) == 0)
			return "&nbsp;";
		if (gpsDashboard.units == 1) 
			return (this.calcDist(gpsDashboard.initialLoc, event) /
			this.calcTime(gpsDashboard.initialLoc, event) *
			60 * 60 * .621371192).toFixed(1) + " mph";
		if (gpsDashboard.units == 2) 
			return (this.calcDist(gpsDashboard.initialLoc, event) /
			this.calcTime(gpsDashboard.initialLoc, event) *
			60 * 60).toFixed(1) + " kph";
	}
	else if (gpsDashboard.avgSpeedPref == 1 && !gpsDashboard.initialLoc)
		return "&nbsp;";

	if (gpsDashboard.avgSpeedPref == 2 && gpsDashboard.avgSpeed.time != 0) {
		if (gpsDashboard.units == 1)
			return (gpsDashboard.avgSpeed.dist /
			gpsDashboard.avgSpeed.time *
			60 * 60 * .621371192).toFixed(1) + " mph";
		if (gpsDashboard.units == 2)
			return (gpsDashboard.avgSpeed.dist /
			gpsDashboard.avgSpeed.time *
			60 * 60).toFixed(1) + " kph";
	}
	else
		return "&nbsp;";
}

/*
 * Trip distance display
 */
MainAssistant.prototype.distTraveled = function( event ) {
	if (gpsDashboard.prevLoc) {
		gpsDashboard.tripometer.dist += this.calcDist(gpsDashboard.prevLoc, event);
		gpsDashboard.tripometer.time += this.calcTime(gpsDashboard.prevLoc, event);
		if (gpsDashboard.units == 1) 
			return (gpsDashboard.tripometer.dist * 0.621371192).toFixed(1) + " miles";
		if (gpsDashboard.units == 2) 
			return gpsDashboard.tripometer.dist.toFixed(1) + " km";
	}
	return "&nbsp;";
}

/*
 * Displays the current distance from the 
 * the initial position
 */
MainAssistant.prototype.distFromInit = function( event ) {
	if (gpsDashboard.initialLoc) {
		if (gpsDashboard.units == 1) 
			return (this.calcDist(event, gpsDashboard.initialLoc) * 0.621371192).toFixed(1) + " miles";
		if (gpsDashboard.units == 2) 
			return this.calcDist(event, gpsDashboard.initialLoc).toFixed(1) + " km";
	}
	return "&nbsp;";
}

/*
 * Displays the lifetime distance traveled
 */
MainAssistant.prototype.lifeDist = function(event){
	if (gpsDashboard.prevLoc)
		gpsDashboard.lifeDist += this.calcDist(event, gpsDashboard.prevLoc);
	if (gpsDashboard.units == 1)
		return (gpsDashboard.lifeDist * 0.621371192).toFixed(1) + " miles";
	if (gpsDashboard.units == 2)
		return gpsDashboard.lifeDist.toFixed(1) + " km";
}

/*
 * Returns elapsed time between event2 and event1
 * in seconds
 */
MainAssistant.prototype.calcTime = function( event1, event2 ) {
	return (event2.timestamp - event1.timestamp) / 1000;
}

/*
 * Returns the distance between point1 and point2
 * in kilometers
 */
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

/*
 * Calculates the speed based on the current and
 * last fix (Not currently used)
 */
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

/*
 * Clean up the listeners, special window options,
 * and the gps tracking fixes.
 * Also stores the cookie
 */
MainAssistant.prototype.cleanup = function(event){
	this.controller.stopListening(this.controller.get('addressButton'), Mojo.Event.tap, this.getAddress.bindAsEventListener(this));
	this.controller.stopListening(document, 'orientationchange', this.handleOrientation.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('tripInfo'),Mojo.Event.tap, this.resets.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('currentInfo'),Mojo.Event.tap, this.resets.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('appHeader'),Mojo.Event.tap, this.nav.bindAsEventListener(this));


	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: false
	});
	this.trackingHandle.cancel();
	gpsDashboard.cookie.storeCookie();
}

MainAssistant.prototype.resets = function(){
	this.controller.popupSubmenu({
		onChoose: this.resetHandler,
		placeNear: this.controller.get('currentInfo'),
		items: [{
			label: 'Reset All',
			command: 'reset-all',
		}, {
			label: 'Reset Top Speed',
			command: 'reset-topSpeed'
		}, {
			label: 'Reset Average Speed',
			command: 'reset-avgSpeed'
		}, {
			label: 'Reset Distance Traveled',
			command: 'reset-distTraveled',
		}, {
			label: 'Reset Initial Position',
			command: 'reset-initialPosition',
		}]
	});
}

/*
 * Reset menu that pops up when trip info is tapped
 */
MainAssistant.prototype.resetHandler = function(command){
	if (command == 'reset-all') {
		gpsDashboard.tripometer = {time: 0, dist: 0};
		gpsDashboard.avgSpeed = {time: 0, dist: 0};
		gpsDashboard.initialLoc = undefined;
		gpsDashboard.topSpeed = 0;
	}
	if (command == 'reset-topSpeed')
		gpsDashboard.topSpeed = 0;
	if (command == 'reset-avgSpeed' && gpsDashboard.avgSpeedPref == 1)
		gpsDashboard.initialLoc = undefined;
	if (command == 'reset-avgSpeed' && gpsDashboard.avgSpeedPref == 2)
		gpsDashboard.avgSpeed = {time: 0, dist: 0};
	if (command == 'reset-distTraveled')
		gpsDashboard.tripometer = {time: 0, dist: 0};
	if (command == 'reset-initialPosition')
		gpsDashboard.initialLoc = undefined;
}

/*
 * Handles changes to the orientation
 */
MainAssistant.prototype.handleOrientation = function( event ) {
	if (Mojo.Environment.DeviceInfo.screenHeight < 480)
		return;

	if (event.position == 4 || event.position == 5) {
		this.controller.get('currentInfo').addClassName('landscape');
		this.controller.get('tripInfo').addClassName('landscape');
		this.controller.get('addressInfo').addClassName('landscape');
		this.controller.get('initialDisplay').addClassName('landscape');
		this.controller.get('accuracyNotice').addClassName('landscape');
	}	
	if (event.position == 2 || event.position == 3) {
		this.controller.get('currentInfo').removeClassName('landscape');
		this.controller.get('tripInfo').removeClassName('landscape');
		this.controller.get('addressInfo').removeClassName('landscape');
		this.controller.get('initialDisplay').removeClassName('landscape');
		this.controller.get('accuracyNotice').removeClassName('landscape');
	}
}

/*
 * Handles the application pulldown menu
 */
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

/*
 * Simple extention to the number class to convert 
 * degrees to radians
 */
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

/*
 * Gets reverse location when the button is pressed
 */
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

MainAssistant.prototype.handleReverseResponse = function( event ) {
	this.controller.get('addressButton').mojo.deactivate();

	add = event.address.split(";");
	this.controller.get('address').removeClassName('hidden');
	this.controller.get('address1').update(add[0]);
	this.controller.get('address2').update(add[1]);
}

MainAssistant.prototype.handleReverseResponseError = function(event){
	this.controller.get('addressButton').mojo.deactivate();
	this.controller.get('address').removeClassName('hidden');
	this.controller.get('address1').update(event.errorCode);
	if (event.errorCode == 6)
		this.controller.get('address1').update("Error: Permission Denied - You have not accepted the terms of use for GPS Services");
	if (event.errorCode == 7)
		this.controller.get('address1').update("Error: The application already has a pending message");
	if (event.errorCode == 8)
		this.controller.get('address1').update("Error: The application has been temporarily blacklisted");
}