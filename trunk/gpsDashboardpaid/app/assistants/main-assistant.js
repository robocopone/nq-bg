//myElems["myTitleDiv"] = this.controller.get("domElement")

/*
 *	gpsDashboard environment
 */
gpsDashboard = { };
gpsDashboard.hidden = true;						// Is the trip info visable?
gpsDashboard.dashHidden = true;					// Is the dashboard visable?
gpsDashboard.units = 1;							// Preferred unit of measure
gpsDashboard.backlight = 1;						// Backlight preference
gpsDashboard.maxError = 10;						// Max error in meters preference
gpsDashboard.shakePref = 'none';				// Shake preference
gpsDashboard.coloredSpeedPref = 'true';			// Colored speed preference
gpsDashboard.startupPref = 'ask';				// Startup reset preference
gpsDashboard.avgSpeedPref = 2;					// Average speed calculation preference
gpsDashboard.headingPref = 1;					// Heading preference
gpsDashboard.avgSpeed = {time: 0, dist: 0};		// Average speed info
gpsDashboard.tripometer = {time: 0, dist: 0};	// Distance traveled data
gpsDashboard.topSpeed = 0;						// Top speed info
gpsDashboard.alltimeTopSpeed = { };				// All time top speed
gpsDashboard.alltimeTopSpeed.data = {velocity: 0};
gpsDashboard.alltimeHigh = { };					// All time top elevation
gpsDashboard.alltimeHigh.data = {altitude: 0};
gpsDashboard.alltimeLow = { };					// All time low elevation
gpsDashboard.alltimeLow.data = {altitude: 15000};
gpsDashboard.lifeDist = 0;						// Lifetime distance traveled
gpsDashboard.initialLoc = undefined;			// Inital Location
gpsDashboard.prevLoc = undefined;				// Previous location
gpsDashboard.prevRotation = 'r-30';				// Preveious rotation of the needle
gpsDashboard.speedLimit = 55;
gpsDashboard.processSpeedometer = true;


gpsDashboard.dashAvgSpeed = true;
gpsDashboard.dashTopSpeed = false;
gpsDashboard.dashDistTraveled = true;
gpsDashboard.dashDistFromInit = false;
gpsDashboard.dashLifeDist = false;
gpsDashboard.dashTripDuration = true;
gpsDashboard.theme = 'light';

/*
 * Stores and recalls data stored between sessions
 */
gpsDashboard.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberGPSDashboardData");
		storedData = this.cookieData.get();
		if (storedData){
			gpsDashboard.units = storedData.units;
			gpsDashboard.backlight = storedData.backlight;
			gpsDashboard.avgSpeedPref = storedData.avgSpeedPref;
			gpsDashboard.lifeDist = storedData.lifeDist;
			gpsDashboard.maxError = storedData.maxError;
		}
		if (storedData && storedData.version >= "1.3.0") {
			gpsDashboard.alltimeTopSpeed = storedData.alltimeTopSpeed;
			gpsDashboard.alltimeHigh = storedData.alltimeHigh;
			gpsDashboard.alltimeLow = storedData.alltimeLow;
			gpsDashboard.shakePref = storedData.shakePref;
			gpsDashboard.coloredSpeedPref = storedData.coloredSpeedPref;
			gpsDashboard.tripometer = storedData.tripometer;
			gpsDashboard.avgSpeed = storedData.avgSpeed;
			gpsDashboard.initialLoc = storedData.initalLoc;
			gpsDashboard.startupPref = storedData.startupPref;
		}
		if (storedData && storedData.version >= "1.3.5") {
			gpsDashboard.speedLimit = storedData.speedLimit
		}
		if (storedData && storedData.version >= "1.3.6") {
			gpsDashboard.dashAvgSpeed = storedData.dashAvgSpeed;
			gpsDashboard.dashTopSpeed = storedData.dashTopSpeed;
			gpsDashboard.dashDistTraveled = storedData.dashDistTraveled;
			gpsDashboard.dashDistFromInit = storedData.dashDistFromInit;
			gpsDashboard.dashLifeDist = storedData.dashLifeDist;
			gpsDashboard.dashTripDuration = storedData.dashTripDuration;
			gpsDashboard.theme = storedData.theme;
		}
		if (storedData && storedData.version == "1.3.7") {
			gpsDashboard.headingPref = storedData.headingPref;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.3.7",
			headingPref: gpsDashboard.headingPref,
			units: gpsDashboard.units,                                                
			backlight: gpsDashboard.backlight,
			lifeDist: gpsDashboard.lifeDist,
			avgSpeedPref: gpsDashboard.avgSpeedPref,
			maxError: gpsDashboard.maxError,
			alltimeTopSpeed: gpsDashboard.alltimeTopSpeed,
			alltimeHigh: gpsDashboard.alltimeHigh,
			alltimeLow: gpsDashboard.alltimeLow,
			shakePref: gpsDashboard.shakePref,
			coloredSpeedPref: gpsDashboard.coloredSpeedPref,
			initalLoc: gpsDashboard.initialLoc,
			tripometer: gpsDashboard.tripometer,
			avgSpeed: gpsDashboard.avgSpeed,
			startupPref: gpsDashboard.startupPref,
			speedLimit: gpsDashboard.speedLimit,
			dashAvgSpeed: gpsDashboard.dashAvgSpeed,
			dashTopSpeed: gpsDashboard.dashTopSpeed,
			dashDistTraveled: gpsDashboard.dashDistTraveled,
			dashDistFromInit: gpsDashboard.dashDistFromInit,
			dashLifeDist: gpsDashboard.dashLifeDist,
			dashTripDuration: gpsDashboard.dashTripDuration,
			theme: gpsDashboard.theme
		})		
	}
});

function MainAssistant() {}

/*
 * 	Main Scene Setup
 */
MainAssistant.prototype.setup = function(){
	// Div Elements
	elements = {};
	
	elements.document = this.controller.document;
	
	elements.strengthBarLevelOne = this.controller.get('strengthBarLevelOne');
	elements.strengthBarLevelTwo = this.controller.get('strengthBarLevelTwo');
	elements.strengthBarLevelThree = this.controller.get('strengthBarLevelThree');
	elements.strengthBarLevelFour = this.controller.get('strengthBarLevelFour');
	elements.strengthBarLevelFive = this.controller.get('strengthBarLevelFive');
	elements.clock = this.controller.get('clock');
	
	elements.scrim = this.controller.get('scrim');
	elements.spinner = this.controller.get('spinner');
	elements.initialDisplay = this.controller.get('initialDisplay');

	elements.currentInfo = this.controller.get('currentInfo');	
	elements.topSpeed = this.controller.get('topSpeed');
	elements.speed = this.controller.get('speed');
	elements.heading = this.controller.get('heading');
	elements.altHead = this.controller.get('altHead');
	elements.altitude = this.controller.get('altitude');
	
	elements.tripInfo = this.controller.get('tripInfo');
	elements.tripDuration = this.controller.get('tripDuration');
	elements.lowAccuracy = this.controller.get('lowAccuracy');
	elements.horizAccuracy = this.controller.get('horizAccuracy');
	elements.avgSpeed = this.controller.get('avgSpeed');
	elements.distTraveled = this.controller.get('distTraveled');
	elements.distFromInit = this.controller.get('distFromInit');
	elements.lifeDist = this.controller.get('lifeDist');
	
	elements.addressInfo = this.controller.get('addressInfo');
	elements.addressButton = this.controller.get('addressButton');
	elements.address = this.controller.get('address');
	elements.address1 = this.controller.get('address1');
	elements.address2 = this.controller.get('address2');
	
	elements.speedometer = this.controller.get('speedometer');
	elements.scaledSpeedometer = this.controller.get('scaledSpeedometer');
	elements.speedometerSpeed = this.controller.get('speedometerSpeed');
	elements.speedometerHeading = this.controller.get('speedometerHeading');
	
	
	
	gpsDashboard.cookie.initialize();
	
	// Allow landscape mode if screen height >= 480 (Pre only)
	if (this.controller.stageController.setWindowOrientation &&
	Mojo.Environment.DeviceInfo.screenHeight >= 480) 
		this.controller.stageController.setWindowOrientation("free");
	
	// Scrim and activity spinner
	this.controller.setupWidget("spinner", spinnerAttr = {
		spinnerSize: 'large'
	}, model = {
		spinning: true
	});

	this.scrim = Mojo.View.createScrim(elements.document, { scrimClass: 'palm-scrim' });
	elements.scrim.appendChild(this.scrim).appendChild(elements.spinner);

	// Address button widget
	this.addressButtonModel = {
		buttonLabel: 'Get Address',
		buttonClass: 'affirmative',
		disabled: true
	}
	this.addressButton = this.controller.setupWidget('addressButton', atts = {
		type: Mojo.Widget.activityButton
	}, this.addressButtonModel);

	// Heads up button.
	this.controller.setupWidget('reverse', this.atts = {
	}, this.model = {
		buttonLabel: 'Reverse (Heads-Up Mode)',
		buttonClass: 'normal',
		disabled: false
	});
	
	this.controller.setupWidget('speedLimit', {
		label: 'Speed Limit',
		modelProperty: 'value',
		min: 15,
		max: 160,
		Interval: 5
	}, this.model = {
		value: gpsDashboard.speedLimit
	});

	this.controller.listen(elements.document, 'orientationchange', this.handleOrientation.bindAsEventListener(this));
	this.controller.listen(elements.document, 'shakestart', this.handleShake.bindAsEventListener(this));

	this.controller.listen(elements.addressButton, Mojo.Event.tap, this.getAddress.bindAsEventListener(this));
	this.controller.listen(this.controller.get('reverse'), Mojo.Event.tap, this.reverse.bindAsEventListener(this));
	this.controller.listen(elements.currentInfo,Mojo.Event.tap, this.resets.bindAsEventListener(this));
	this.controller.listen(elements.tripInfo,Mojo.Event.tap, this.resets.bindAsEventListener(this));
	this.controller.listen(this.controller.get('appHeader'),Mojo.Event.tap, this.nav.bindAsEventListener(this));
	this.controller.listen(this.controller.get('speedLimit'),Mojo.Event.propertyChange, this.speedLimit.bindAsEventListener(this));
	this.controller.listen(elements.address,Mojo.Event.tap, this.copyAddress.bindAsEventListener(this));
	this.controller.listen(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.handleMinimized.bindAsEventListener(this));
	this.controller.listen(this.controller.stageController.document, Mojo.Event.stageActivate, this.handleActivated.bindAsEventListener(this));
	


	if (gpsDashboard.startupPref == 'ask')
		this.askToReset();
	if (gpsDashboard.startupPref == 'always')
		this.doReset('yes');

	if (gpsDashboard.theme == "dark") {
		$$('body')[0].addClassName('palm-dark');
		$$('body')[0].removeClassName('palm-default');
		this.controller.get('border').addClassName('dark');
		elements.speedometerSpeed.addClassName('dark');
		this.controller.get('speedImgDark').removeClassName('hidden');
		this.controller.get('speedImgLight').addClassName('hidden');
	}
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
//speed = 0;
//dir = 'up';
MainAssistant.prototype.handleServiceResponse = function(event){
//	if (speed > 70)
//		dir = 'down';
//	if (speed <= 0)
//		dir = 'up';
//	if (dir == 'up')
//		event.velocity = speed += 5;
//	else
//		event.velocity = speed -= 5;

	if (gpsDashboard.stage)
		scenes = gpsDashboard.stage.getScenes();

	elements.clock.update(Mojo.Format.formatDate(new Date(), { time: 'medium' }));

	// Remove initial display and show normal display
	if (elements.currentInfo.hasClassName('hidden') &&
		!elements.initialDisplay.hasClassName('hidden')) {
		elements.initialDisplay.addClassName('hidden');
		this.scrim.hide();
		elements.currentInfo.removeClassName('hidden');
		elements.tripInfo.removeClassName('hidden');
		elements.addressInfo.removeClassName('hidden');
	}

	if (!gpsDashboard.initialLoc && event.horizAccuracy <= gpsDashboard.maxError) 
		gpsDashboard.initialLoc = event;
	
	if  (event.horizAccuracy <= gpsDashboard.maxError && 
		(gpsDashboard.hidden || (gpsDashboard.stage && gpsDashboard.dashHidden) ) ) {
		if (gpsDashboard.hidden) {
			gpsDashboard.hidden = false;
			this.controller.get('tripInfoData').removeClassName('hidden');
			elements.lowAccuracy.addClassName('hidden');
		}
		if (gpsDashboard.stage && gpsDashboard.dashHidden){
			gpsDashboard.dashHidden = false;
			scenes[0].get('dashInfo').removeClassName('hidden');
			scenes[0].get('dashAccuracy').addClassName('hidden');
		}
	}
	else if (event.horizAccuracy > gpsDashboard.maxError && 
			(!gpsDashboard.hidden || (gpsDashboard.stage && !gpsDashboard.dashHidden) ) ) {
		if (!gpsDashboard.hidden) {
			gpsDashboard.hidden = true;
			this.controller.get('tripInfoData').addClassName('hidden');
			elements.lowAccuracy.removeClassName('hidden');
		}
		if (gpsDashboard.stage && !gpsDashboard.dashHidden) {
			gpsDashboard.dashHidden = true;
			scenes[0].get('dashInfo').addClassName('hidden');
			scenes[0].get('dashAccuracy').removeClassName('hidden');
		}
	}

	elements.horizAccuracy.update("Horizontal Error = " + event.horizAccuracy.toFixed(1) + "m > " + gpsDashboard.maxError + "m");
	this.strengthBar(event);

	if (gpsDashboard.stage) {
		scenes[0].get('dashSpeed').update(this.speed(event));
		scenes[0].get('dashHeading').update(this.heading(event));
		scenes[0].get('dashAltitude').update(this.altitude(event));
		if (gpsDashboard.dashTripDuration)
			scenes[0].get('dashTripDuration').update(this.tripDuration(event));
	}

	elements.speed.update(this.speed(event));
	elements.speedometerSpeed.update(this.speed(event));
	elements.heading.update(this.heading(event));
	elements.speedometerHeading.update(this.heading(event));
	if (gpsDashboard.processSpeedometer && !elements.speedometer.hasClassName('hidden'))
		this.setSpeedometer(event);
	elements.altitude.update(this.altitude(event));
	elements.tripDuration.update(this.tripDuration());
	if (event.errorCode == 0 && event.horizAccuracy <= gpsDashboard.maxError) {
		this.calcAvgSpeed(event);
		this.calcDistTraveled(event);
		this.calcLifeDist(event);
		elements.avgSpeed.update(this.avgSpeed(event));
		elements.topSpeed.update(this.topSpeed(event));
		elements.distTraveled.update(this.distTraveled(event));
		elements.distFromInit.update(this.distFromInit(event));
		elements.lifeDist.update(this.lifeDist(event));
		if (gpsDashboard.stage) {
			if (gpsDashboard.dashAvgSpeed)
				scenes[0].get('dashAvgSpeed').update(this.avgSpeed(event));
			if (gpsDashboard.dashTopSpeed)
				scenes[0].get('dashTopSpeed').update(this.topSpeed(event));
			if (gpsDashboard.dashDistTraveled)
				scenes[0].get('dashDistTraveled').update(this.distTraveled(event));
			if (gpsDashboard.dashDistFromInit)
				scenes[0].get('dashDistFromInit').update(this.distFromInit(event));
			if (gpsDashboard.dashLifeDist)
				scenes[0].get('dashLifeDist').update(this.lifeDist(event));
		}
		gpsDashboard.prevLoc = event;
		if (this.addressButtonModel.disabled) {
			this.addressButtonModel.disabled = false;
			this.controller.modelChanged(this.addressButtonModel, this);
		}
		this.recordCheck(event);
	}

	if (event.errorCode != 0)
		this.controller.stageController.pushScene("gpsError", event.errorCode);
}

MainAssistant.prototype.handleServiceResponseError = function(event) {
	this.controller.stageController.pushScene("gpsError", event.errorCode);
}

/*
 * Calculates the speed based on the current, last
 * and the fix before that.
 */
MainAssistant.prototype.calcSpeed = function( event ){
	if (!gpsDashboard.prevLoc)
		return this.speed(event);

	currSpeed = (this.calcDist(gpsDashboard.prevLoc, event) / 
	 	 this.calcTime(gpsDashboard.prevLoc, event) * 3600);

	if (gpsDashboard.prevSpeed)
		currSpeed = (currSpeed + gpsDashboard.prevSpeed) / 2;

	gpsDashboard.prevSpeed = currSpeed;

	if (currSpeed == 0)
		return "&nbsp;";
		
	if (gpsDashboard.units == 1)
		return (currSpeed * .621371192).toFixed(1) + " mph";
	if (gpsDashboard.units == 2)
		return currSpeed.toFixed(1) + " kph";
}

/*
 * Updates the signal strength indicator
 */
MainAssistant.prototype.strengthBar = function (event) {
	elements.strengthBarLevelOne.removeClassName('lit');
	elements.strengthBarLevelTwo.removeClassName('lit');
	elements.strengthBarLevelThree.removeClassName('lit');
	elements.strengthBarLevelFour.removeClassName('lit');
	elements.strengthBarLevelFive.removeClassName('lit');
	
	if (event.horizAccuracy <= 1500)
		elements.strengthBarLevelOne.addClassName('lit');
	if (event.horizAccuracy <= 500)
		elements.strengthBarLevelTwo.addClassName('lit');
	if (event.horizAccuracy <= 100)
		elements.strengthBarLevelThree.addClassName('lit');
	if (event.horizAccuracy <= gpsDashboard.maxError)
		elements.strengthBarLevelFour.addClassName('lit');
	if (event.horizAccuracy <= 5)
		elements.strengthBarLevelFive.addClassName('lit');
}

/*
 * Checks to see if records have been broken
 * and updates if they have
 */
MainAssistant.prototype.recordCheck = function (event) {
	if (event.velocity > gpsDashboard.alltimeTopSpeed.data.velocity &&
		event.horizAccuracy <= 5) {
		gpsDashboard.alltimeTopSpeed.data = event;
		gpsDashboard.alltimeTopSpeed.date =
			Mojo.Format.formatDate(new Date(), { date: 'long' });
	}
	if (event.altitude > gpsDashboard.alltimeHigh.data.altitude &&
		event.vertAccuracy <= 10 ) {
		gpsDashboard.alltimeHigh.data = event;
		gpsDashboard.alltimeHigh.date =
			Mojo.Format.formatDate(new Date(), { date: 'long' });
	}
	if (event.altitude < gpsDashboard.alltimeLow.data.altitude &&
		event.vertAccuracy <= 10 ) {
		gpsDashboard.alltimeLow.data = event;
		gpsDashboard.alltimeLow.date =
			Mojo.Format.formatDate(new Date(), { date: 'long'});
	}
}

/*
 * Current speed display
 */
MainAssistant.prototype.speed = function(event){
	//return "0000 mph" //remove
	if (event.velocity == 0) 
		return "&nbsp;";
	avg = gpsDashboard.avgSpeed.dist / gpsDashboard.avgSpeed.time * 1000;

	if (gpsDashboard.coloredSpeedPref == 'true') {
		if (avg < event.velocity) {
			elements.speed.removeClassName('red');
			elements.speed.addClassName('green');
		}
		if (avg >= event.velocity) {
			elements.speed.removeClassName('green');
			elements.speed.addClassName('red');
		}
	}
	else {
		elements.speed.removeClassName('red');
		elements.speed.removeClassName('green');
	}
		
	if (gpsDashboard.units == 1)
		return (event.velocity * 2.23693629).toFixed(0) + " mph";
	if (gpsDashboard.units == 2)
		return (event.velocity * 3.6).toFixed(0) + " kph";
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
		return (gpsDashboard.topSpeed * 2.23693629).toFixed(0) + " mph";
	if (gpsDashboard.units == 2)
		return (gpsDashboard.topSpeed * 3.6).toFixed(0) + " kph";
}

/*
 * Converts degrees to N/S/E/W
 */
MainAssistant.prototype.heading = function(event){
	//return '000&deg;' //remove
	if (event.velocity == 0)
		return "&nbsp;";

	if (gpsDashboard.headingPref == 2)
		return event.heading.toFixed(0) + "&deg;";
		
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
	//return "00000 feet";//remove
	if (event.vertAccuracy == 0 || event.vertAccuracy > gpsDashboard.maxError)
		return "&nbsp;";
	if (gpsDashboard.units == 1)
		return (event.altitude * 3.2808399).toFixed(0) + " feet";
	if (gpsDashboard.units == 2)
		return event.altitude.toFixed(0) + " m";
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
MainAssistant.prototype.calcAvgSpeed = function (event) {
	if (gpsDashboard.prevLoc) {
		gpsDashboard.avgSpeed.dist += this.calcDist(gpsDashboard.prevLoc, event);
		gpsDashboard.avgSpeed.time += this.calcTime(gpsDashboard.prevLoc, event);
	}
}

MainAssistant.prototype.avgSpeed = function(event){
	//return "000.0 mph" //remove
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
MainAssistant.prototype.calcDistTraveled = function (event) {
	if (gpsDashboard.prevLoc) {
		gpsDashboard.tripometer.dist += this.calcDist(gpsDashboard.prevLoc, event);
		gpsDashboard.tripometer.time += this.calcTime(gpsDashboard.prevLoc, event);
	}
}
MainAssistant.prototype.distTraveled = function( event ) {
	//return "00000.0 mi" //remove
	if (gpsDashboard.units == 1) 
		return (gpsDashboard.tripometer.dist * 0.621371192).toFixed(1) + " mi";
	if (gpsDashboard.units == 2) 
		return gpsDashboard.tripometer.dist.toFixed(1) + " km";
	return "&nbsp;";
}

/*
 * Displays the current distance from the 
 * the initial position
 */
MainAssistant.prototype.distFromInit = function( event ) {
	//return "0000.0 mi" //remove
	if (gpsDashboard.initialLoc) {
		if (gpsDashboard.units == 1) 
			return (this.calcDist(event, gpsDashboard.initialLoc) * 0.621371192).toFixed(1) + " mi";
		if (gpsDashboard.units == 2) 
			return this.calcDist(event, gpsDashboard.initialLoc).toFixed(1) + " km";
	}
	return "&nbsp;";
}

/*
 * Displays the lifetime distance traveled
 */
MainAssistant.prototype.calcLifeDist = function (event) {
	if (gpsDashboard.prevLoc)
		gpsDashboard.lifeDist += this.calcDist(event, gpsDashboard.prevLoc);
}
MainAssistant.prototype.lifeDist = function(event){
	//return "0000000 mi" //remove
	if (gpsDashboard.units == 1)
		return (gpsDashboard.lifeDist * 0.621371192).toFixed(0) + " mi";
	if (gpsDashboard.units == 2)
		return gpsDashboard.lifeDist.toFixed(0) + " km";
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
	dist = Math.sqrt( Math.pow((K1 * dLat), 2) + Math.pow((K2 * dLon), 2) );
	return dist;
}

MainAssistant.prototype.handleActivated = function(event){
	Mojo.Controller.getAppController().closeStage('dashboardStage');
	gpsDashboard.stage = undefined;
	gpsDashboard.processSpeedometer = true;
}

MainAssistant.prototype.handleMinimized = function (event) {
	gpsDashboard.processSpeedometer = false;
    var f = function(stageController){
		gpsDashboard.stage = stageController;
		gpsDashboard.dashHidden = true;		
		stageController.pushScene('dashboardScene');
	}

    Mojo.Controller.getAppController().createStageWithCallback({
		name: "dashboardStage",
	 	lightweight: true
	}, f, 'dashboard');
}

MainAssistant.prototype.deactivate = function(event) {
	this.trackingHandle.cancel(); 
	this.controller.stageController.setWindowProperties({blockScreenTimeout: false});
}

/*
 * Clean up the listeners, special window options,
 * and the gps tracking fixes.
 * Also stores the cookie
 */
MainAssistant.prototype.cleanup = function(event){
	this.controller.stageController.setWindowProperties({
		blockScreenTimeout: false
	});
	this.trackingHandle.cancel();
	gpsDashboard.cookie.storeCookie();

	this.controller.stopListening(elements.document, 'orientationchange', this.handleOrientation.bindAsEventListener(this));
	this.controller.stopListening(elements.document, 'shakestart', this.handleShake.bindAsEventListener(this));

	this.controller.stopListening(this.controller.get('reverse'), Mojo.Event.tap, this.reverse.bindAsEventListener(this));
	this.controller.stopListening(elements.addressButton, Mojo.Event.tap, this.getAddress.bindAsEventListener(this));
	this.controller.stopListening(elements.tripInfo,Mojo.Event.tap, this.resets.bindAsEventListener(this));
	this.controller.stopListening(elements.currentInfo,Mojo.Event.tap, this.resets.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('appHeader'),Mojo.Event.tap, this.nav.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('speedLimit'),Mojo.Event.propertyChange, this.speedLimit.bindAsEventListener(this));
	this.controller.stopListening(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.handleMinimized.bindAsEventListener(this));
	this.controller.stopListening(this.controller.stageController.document, Mojo.Event.stageActivate, this.handleActivated.bindAsEventListener(this));
	this.controller.stopListening(elements.address,Mojo.Event.tap, this.copyAddress.bindAsEventListener(this));
}
MainAssistant.prototype.reverse = function () {
	if (elements.scaledSpeedometer.hasClassName('reverse'))
		elements.scaledSpeedometer.removeClassName('reverse');
	else 
		elements.scaledSpeedometer.addClassName('reverse');
}

MainAssistant.prototype.resets = function(){
	this.controller.popupSubmenu({
		onChoose: this.resetHandler,
		placeNear: elements.currentInfo,
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

MainAssistant.prototype.handleShake = function (event) {
	if (gpsDashboard.shakePref == 'all') {
		gpsDashboard.tripometer = {time: 0, dist: 0};
		gpsDashboard.avgSpeed = {time: 0, dist: 0};
		gpsDashboard.initialLoc = undefined;
		gpsDashboard.topSpeed = 0;
	}
	if (gpsDashboard.shakePref == 'topSpeed')
		gpsDashboard.topSpeed = 0;
	if (gpsDashboard.shakePref == 'avgSpeed' && gpsDashboard.avgSpeedPref == 1)
		gpsDashboard.initialLoc = undefined;
	if (gpsDashboard.shakePref == 'avgSpeed' && gpsDashboard.avgSpeedPref == 2)
		gpsDashboard.avgSpeed = {time: 0, dist: 0};
	if (gpsDashboard.shakePref == 'distTraveled')
		gpsDashboard.tripometer = {time: 0, dist: 0};
	if (gpsDashboard.shakePref == 'initPosition')
		gpsDashboard.initialLoc = undefined;
}

/*
 * Handles changes to the orientation
 */
MainAssistant.prototype.handleOrientation = function( event ) {
	if (Mojo.Environment.DeviceInfo.screenHeight < 480)
		return;

	if (event.position == 4 || event.position == 5) {
		elements.currentInfo.addClassName('landscape');
		elements.tripInfo.addClassName('landscape');
		elements.addressInfo.addClassName('landscape');
		elements.initialDisplay.addClassName('landscape');
		elements.clock.removeClassName('hidden');
		elements.speedometer.addClassName('landscape');
		this.controller.get('speedLimit').addClassName('landscape');
		this.controller.get('reverse').addClassName('landscape');
		elements.altHead.update('Alt:')
		elements.altHead.addClassName('landscape');
		elements.altitude.addClassName('landscape');
	}	
	if (event.position == 2 || event.position == 3) {
		elements.currentInfo.removeClassName('landscape');
		elements.tripInfo.removeClassName('landscape');
		elements.addressInfo.removeClassName('landscape');
		elements.initialDisplay.removeClassName('landscape');
		elements.clock.addClassName('hidden');
		elements.speedometer.removeClassName('landscape');
		this.controller.get('speedLimit').removeClassName('landscape');
		this.controller.get('reverse').removeClassName('landscape');
		elements.altHead.update('Altitude:')
		elements.altHead.removeClassName('landscape');
		elements.altitude.removeClassName('landscape');
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
	elements.addressButton.mojo.deactivate();
	gpsDashboard.address = event.address;
	add = event.address.split(";");
	elements.address.removeClassName('hidden');
	elements.address1.update(add[0]);
	elements.address2.update(add[1]);
}

MainAssistant.prototype.handleReverseResponseError = function(event){
	elements.addressButton.mojo.deactivate();
	elements.address.removeClassName('hidden');
	elements.address1.update(event.errorCode);
	if (event.errorCode == 6)
		elements.address1.update("Error: Permission Denied - You have not accepted the terms of use for Google Location Services");
	if (event.errorCode == 7)
		elements.address1.update("Error: The application already has a pending message");
	if (event.errorCode == 8)
		elements.address1.update("Error: The application has been temporarily blacklisted");
}

/*
 * Prompts to reset trip information
 */
MainAssistant.prototype.askToReset = function () {
	this.controller.showAlertDialog({
		onChoose: this.doReset,
		title: $L("Reset"),
		message: $L("Reset Trip Information?"),
		choices: [{
			label: $L('Yes'),
			value: 'yes',
			type: 'affirmative'
		}, {
			label: $L('No'),
			value: 'no',
			type: 'negative'
		}, ]
	});	
}

/*
 * Resets trip information
 */
MainAssistant.prototype.doReset = function(choice) {
	if (choice == 'yes') {
		gpsDashboard.initialLoc = undefined;
		gpsDashboard.prevLoc = undefined;
		if (!this.addressButtonModel.disabled) {
			this.addressButtonModel.disabled = true;
			this.controller.modelChanged(this.addressButtonModel, this);
		}
		gpsDashboard.avgSpeed = {time: 0, dist: 0};
		gpsDashboard.tripometer = {time: 0, dist: 0};
	}
}

/*
 * Popup menu for record keeping
 */
MainAssistant.prototype.nav = function () {
	this.controller.popupSubmenu({
		onChoose: this.navHandler,
		placeNear: this.controller.get('appHeader'),
		items: [{
			label: 'Toggle Display',
			command: 'toggle'
		},{
			label: 'Record Keeping',
			command: 'recordKeeping',
		}]
	});
}
MainAssistant.prototype.navHandler = function(command) {
	if (command == 'recordKeeping')
		this.controller.stageController.pushScene('records');
	if (command == 'toggle') {
		if (elements.speedometer.hasClassName('hidden')) {
			elements.currentInfo.addClassName('hidden');
			elements.tripInfo.addClassName('hidden');
			elements.addressInfo.addClassName('hidden');
			elements.speedometer.removeClassName('hidden');
		}
		else {
			elements.currentInfo.removeClassName('hidden');
			elements.tripInfo.removeClassName('hidden');
			elements.addressInfo.removeClassName('hidden');
			elements.speedometer.addClassName('hidden');
		}
	}
}

MainAssistant.prototype.speedLimit = function (event) {
	gpsDashboard.speedLimit = event.value;
}
/*
 * Lights up the speedometer
 */
MainAssistant.prototype.setSpeedometer = function(event) {
	if (event.velocity != 0 && elements.speedometerSpeed.hasClassName('hidden'))
		elements.speedometerSpeed.removeClassName('hidden');
	if (event.velocity == 0 && !(elements.speedometerSpeed.hasClassName('hidden')))
		elements.speedometerSpeed.addClassName('hidden');

	if (gpsDashboard.theme == 'light')
		speedImg = 'speedImgLight';
	if (gpsDashboard.theme == 'dark')
		speedImg = 'speedImgDark';

	for (x = 0; x <= 160; x += 5) {
		hashElement = 'hash' + x;
		this.controller.get(hashElement).removeClassName('redBack');
		this.controller.get(hashElement).removeClassName('greenBack');
		this.controller.get(hashElement).removeClassName('yellowBack');
	}
	this.controller.get(speedImg).removeClassName('redBack');
	this.controller.get(speedImg).removeClassName('yellowBack');
	
	if (gpsDashboard.units == 1)
		bound = event.velocity * 2.23693629;
	if (gpsDashboard.units == 2)
		bound = event.velocity * 3.6;

	
	elements.speedometerSpeed.removeClassName('w10');
	elements.speedometerSpeed.removeClassName('w100');
	elements.speedometerSpeed.removeClassName('w1000');

	if (bound > 999)
		elements.speedometerSpeed.addClassName('w1000');
	else if (bound > 99)
		elements.speedometerSpeed.addClassName('w100');
	else if (bound > 9)
		elements.speedometerSpeed.addClassName('w10');
	
	degrees = ((3 * (bound - 20))/2).toFixed(0);

	if (bound > 160)
		degrees = 210;

	if (degrees % 2 != 0)
		degrees--;

	this.controller.get(speedImg).removeClassName(gpsDashboard.prevRotation);
	this.controller.get('border').removeClassName(gpsDashboard.prevRotation);

	gpsDashboard.prevRotation = 'r' + degrees;

	this.controller.get(speedImg).addClassName(gpsDashboard.prevRotation);
	this.controller.get('border').addClassName(gpsDashboard.prevRotation);

	for (x = 0; x <= bound && x <= 160; x+= 5) {
		element = 'hash' + x;
		if (bound < gpsDashboard.speedLimit - 5) {
			this.controller.get(element).addClassName('greenBack');
		}
		else if (bound <= gpsDashboard.speedLimit + 5) {
			this.controller.get(element).addClassName('yellowBack');
			this.controller.get(speedImg).addClassName('yellowBack');
		}
		else {
			this.controller.get(element).addClassName('redBack');
			this.controller.get(speedImg).addClassName('redBack');
		}
	}
}

MainAssistant.prototype.copyAddress = function () {
	this.controller.popupSubmenu({
		onChoose: this.copyHandler,
		placeNear: elements.address,
		items: [{
			label: 'Copy to Clipboard',
			command: 'copy',
		}]
	});
}

/*
 * Reset menu that pops up when trip info is tapped
 */
MainAssistant.prototype.copyHandler = function(command){
	if (command == 'copy')
		this.controller.stageController.setClipboard(gpsDashboard.address);
}
