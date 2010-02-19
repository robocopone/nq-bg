function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function(){

	this.controller.setupWidget("dashAvgSpeed", attributes = {
	}, model = {
		value: gpsDashboard.dashAvgSpeed,
		disabled: false
	});

	this.controller.setupWidget("dashTopSpeed", attributes = {
	}, model = {
		value: gpsDashboard.dashTopSpeed,
		disabled: false
	});

	this.controller.setupWidget("dashDistTraveled", attributes = {
	}, model = {
		value: gpsDashboard.dashDistTraveled,
		disabled: false
	});

	this.controller.setupWidget("dashDistFromInit", attributes = {
	}, model = {
		value: gpsDashboard.dashDistFromInit,
		disabled: false
	});

	this.controller.setupWidget("dashLifeDist", attributes = {
	}, model = {
		value: gpsDashboard.dashLifeDist,
		disabled: false
	});

	this.controller.setupWidget("dashTripDuration", attributes = {
	}, model = {
		value: gpsDashboard.dashTripDuration,
		disabled: false
	});
	this.controller.listen("dashAvgSpeed", Mojo.Event.propertyChange, this.dashAvgSpeed.bindAsEventListener(this));
	this.controller.listen("dashTopSpeed", Mojo.Event.propertyChange, this.dashTopSpeed.bindAsEventListener(this));
	this.controller.listen("dashDistTraveled", Mojo.Event.propertyChange, this.dashDistTraveled.bindAsEventListener(this));
	this.controller.listen("dashDistFromInit", Mojo.Event.propertyChange, this.dashDistFromInit.bindAsEventListener(this));
	this.controller.listen("dashLifeDist", Mojo.Event.propertyChange, this.dashLifeDist.bindAsEventListener(this));
	this.controller.listen("dashTripDuration", Mojo.Event.propertyChange, this.dashTripDuration.bindAsEventListener(this));

	//On startup pref
	this.controller.setupWidget("startupPref", attr = {
		label: "On Startup",
		choices: [{
			label: "Always Reset Trip Information",
			value: 'always'
		}, {
			label: "Never Reset Trip Information",
			value: 'never'
		}, {
			label: "Ask Each Time",
			value: 'ask'
		}, ],
	}, model = {
		value: gpsDashboard.startupPref,
		disabled: false
	});

	//Theme Selector Widget
	this.controller.setupWidget("themeSelector", attr = {
		label: "Theme",
		choices: [{
			label: "Light",
			value: 'light'
		}, {
			label: "Dark",
			value: 'dark'
		}, ],
	}, model = {
		value: gpsDashboard.theme,
		disabled: false
	});
	
	//Units Selector Widget
	this.controller.setupWidget("unitsSelector", attr = {
		label: "Units",
		choices: [{
			label: "Miles/Feet",
			value: 1
		}, {
			label: "Kilometers/Meters",
			value: 2
		}, ],
	}, model = {
		value: gpsDashboard.units,
		disabled: false
	});

	
	//Backlight Selector Widget
	this.controller.setupWidget("backlightSelector", attr = {
		label: "Backlight",
		choices: [{
			label: "Always On",
			value: 1
		}, {
			label: "Device Settings",
			value: 2
		}, ],
	}, model = {
		value: gpsDashboard.backlight,
		disabled: false
	});

	//Avg Speed Widget
	this.controller.setupWidget("avgSpeedPref", attr = {
		label: "Avg. Speed",
		choices: [{
			label: "Use Dist. from Initial",
			value: 1
		}, {
			label: "Use Dist Traveled",
			value: 2
		}, ],
	}, model = {
		value: gpsDashboard.avgSpeedPref,
		disabled: false
	});
	
	//headingPref Widget
	this.controller.setupWidget("headingPref", attr = {
		label: "Heading",
		choices: [{
			label: "N/S/E/W",
			value: 1
		}, {
			label: "Degrees",
			value: 2
		}, ],
	}, model = {
		value: gpsDashboard.headingPref,
		disabled: false
	});

	//Shake pref widget
	this.controller.setupWidget("shakePref", attr = {
		label: "When Shook",
		choices: [{
			label: "Reset All",
			value: 'all'
		}, {
			label: "Reset None",
			value: 'none'
		}, {
			label: "Reset Top Speed",
			value: 'topSpeed'
		}, {
			label: "Reset Average Speed",
			value: 'avgSpeed'
		}, {
			label: "Reset Distance Traveled",
			value: 'distTraveled'
		}, {
			label: "Reset Initial Position",
			value: 'initPosition'
		}, ],
	}, model = {
		value: gpsDashboard.shakePref,
		disabled: false
	});

	//coloredSpeedPref Selector Widget
	this.controller.setupWidget("coloredSpeedPref", attr = {
		label: "Colored Speed",
		choices: [{
			label: "Based on Avg Speed",
			value: 'true'
		}, {
			label: "Off",
			value: 'false'
		},],
	}, model = {
		value: gpsDashboard.coloredSpeedPref,
		disabled: false
	});

	//Max Error Selector Widget
	this.controller.setupWidget("maxErrorPrefSelector", attr = {
		label: "Max Error",
		choices: [{
			label: "5 meters",
			value: 5
		}, {
			label: "10 meters",
			value: 10
		}, {
			label: "15 meters",
			value: 15
		}, {
			label: "20 meters",
			value: 20
		}, {
			label: "30 meters",
			value: 30
		},],
	}, model = {
		value: gpsDashboard.maxError,
		disabled: false
	});

	this.controller.listen("headingPref", Mojo.Event.propertyChange, this.headingPref.bindAsEventListener(this));
	this.controller.listen("startupPref", Mojo.Event.propertyChange, this.startupPref.bindAsEventListener(this));
	this.controller.listen("themeSelector", Mojo.Event.propertyChange, this.changeThemeSelector.bindAsEventListener(this));
	this.controller.listen("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelector.bindAsEventListener(this));
	this.controller.listen("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelector.bindAsEventListener(this));
	this.controller.listen("avgSpeedPref", Mojo.Event.propertyChange, this.changeAvgSpeed.bindAsEventListener(this));
	this.controller.listen("shakePref", Mojo.Event.propertyChange, this.shakePref.bindAsEventListener(this));
	this.controller.listen("coloredSpeedPref", Mojo.Event.propertyChange, this.coloredSpeedPref.bindAsEventListener(this));
	this.controller.listen("maxErrorPrefSelector", Mojo.Event.propertyChange, this.maxErrorSelector.bindAsEventListener(this));
}

PreferencesAssistant.prototype.headingPref = function (event) {
	gpsDashboard.headingPref = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.dashAvgSpeed = function (event) {
	gpsDashboard.dashAvgSpeed = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.dashTopSpeed = function (event) {
	gpsDashboard.dashTopSpeed = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.dashDistTraveled = function (event) {
	gpsDashboard.dashDistTraveled = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.dashDistFromInit = function (event) {
	gpsDashboard.dashDistFromInit = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.dashLifeDist = function (event) {
	gpsDashboard.dashLifeDist = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.dashTripDuration = function (event) {
	gpsDashboard.dashTripDuration = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.startupPref = function (event) {
	gpsDashboard.startupPref = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.changeThemeSelector = function (event) {
	gpsDashboard.theme = event.value;
	gpsDashboard.cookie.storeCookie();
	if (gpsDashboard.theme == 'dark') {
		$$('body')[0].addClassName('palm-dark');
		$$('body')[0].removeClassName('palm-default');
		this.controller.get('speedImgDark').removeClassName('hidden');
		this.controller.get('speedImgLight').addClassName('hidden');
	}
	if (gpsDashboard.theme == 'light') {
		$$('body')[0].removeClassName('palm-dark');
		$$('body')[0].addClassName('palm-default');
		this.controller.get('speedImgDark').addClassName('hidden');
		this.controller.get('speedImgLight').removeClassName('hidden');
	}
}
PreferencesAssistant.prototype.coloredSpeedPref = function (event) {
	gpsDashboard.coloredSpeedPref = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.shakePref = function (event) {
	gpsDashboard.shakePref = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.maxErrorSelector = function (event) {
	gpsDashboard.maxError = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.changeAvgSpeed = function (event) {
	gpsDashboard.avgSpeedPref = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.changeUnitsSelector = function(event) {
	gpsDashboard.units = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.changeBacklightSelector = function(event){
	gpsDashboard.backlight = event.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.activate = function(event) {
}

PreferencesAssistant.prototype.deactivate = function(event) {
}
PreferencesAssistant.prototype.cleanup = function(event){
	this.controller.stopListening("startupPref", Mojo.Event.propertyChange, this.startupPref.bindAsEventListener(this));
	this.controller.stopListening("themeSelector", Mojo.Event.propertyChange, this.changeThemeSelector.bindAsEventListener(this));
	this.controller.stopListening("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelector.bindAsEventListener(this));
	this.controller.stopListening("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelector.bindAsEventListener(this));
	this.controller.stopListening("avgSpeedPref", Mojo.Event.propertyChange, this.changeAvgSpeed.bindAsEventListener(this));
	this.controller.stopListening("shakePref", Mojo.Event.propertyChange, this.shakePref.bindAsEventListener(this));
	this.controller.stopListening("coloredSpeedPref", Mojo.Event.propertyChange, this.coloredSpeedPref.bindAsEventListener(this));
	this.controller.stopListening("maxErrorPrefSelector", Mojo.Event.propertyChange, this.maxErrorSelector.bindAsEventListener(this));

	this.controller.stopListening("headingPref", Mojo.Event.propertyChange, this.headingPref.bindAsEventListener(this));
	this.controller.stopListening("dashAvgSpeed", Mojo.Event.propertyChange, this.dashAvgSpeed.bindAsEventListener(this));
	this.controller.stopListening("dashTopSpeed", Mojo.Event.propertyChange, this.dashTopSpeed.bindAsEventListener(this));
	this.controller.stopListening("dashDistTraveled", Mojo.Event.propertyChange, this.dashDistTraveled.bindAsEventListener(this));
	this.controller.stopListening("dashDistFromInit", Mojo.Event.propertyChange, this.dashDistFromInit.bindAsEventListener(this));
	this.controller.stopListening("dashLifeDist", Mojo.Event.propertyChange, this.dashLifeDist.bindAsEventListener(this));
	this.controller.stopListening("dashTripDuration", Mojo.Event.propertyChange, this.dashTripDuration.bindAsEventListener(this));
}