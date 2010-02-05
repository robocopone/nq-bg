function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function(){

	this.controller.setupWidget("dashAvgSpeed", this.attributes = {
	}, this.model = {
		value: gpsDashboard.dashAvgSpeed,
		disabled: false
	});

	this.controller.setupWidget("dashTopSpeed", this.attributes = {
	}, this.model = {
		value: gpsDashboard.dashTopSpeed,
		disabled: false
	});

	this.controller.setupWidget("dashDistTraveled", this.attributes = {
	}, this.model = {
		value: gpsDashboard.dashDistTraveled,
		disabled: false
	});

	this.controller.setupWidget("dashDistFromInit", this.attributes = {
	}, this.model = {
		value: gpsDashboard.dashDistFromInit,
		disabled: false
	});

	this.controller.setupWidget("dashLifeDist", this.attributes = {
	}, this.model = {
		value: gpsDashboard.dashLifeDist,
		disabled: false
	});

	this.controller.setupWidget("dashTripDuration", this.attributes = {
	}, this.model = {
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
	this.controller.setupWidget("startupPref", this.startupPrefAttributes = {
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
	}, this.startupPrefModel = {
		value: gpsDashboard.startupPref,
		disabled: false
	});
	//On Startup Pref
	this.controller.listen("startupPref", Mojo.Event.propertyChange, this.startupPref.bindAsEventListener(this));

	//Units Selector Widget
	this.controller.setupWidget("unitsSelector", this.unitsSelectorAttributes = {
		label: "Units",
		choices: [{
			label: "Miles/Feet",
			value: 1
		}, {
			label: "Kilometers/Meters",
			value: 2
		}, ],
	}, this.unitsSelectorModel = {
		value: gpsDashboard.units,
		disabled: false
	});
	//Units Selector Handler
	this.controller.listen("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelector.bindAsEventListener(this));
	
	//Backlight Selector Widget
	this.controller.setupWidget("backlightSelector", this.backlightSelectorAttributes = {
		label: "Backlight",
		choices: [{
			label: "Always On",
			value: 1
		}, {
			label: "Device Settings",
			value: 2
		}, ],
	}, this.backlightSelectorModel = {
		value: gpsDashboard.backlight,
		disabled: false
	});
	//Backlight Selector Handler
	this.controller.listen("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelector.bindAsEventListener(this));

	//Avg Speed Widget
	this.controller.setupWidget("avgSpeedPref", this.avgSpeedAttributes = {
		label: "Avg. Speed",
		choices: [{
			label: "Use Dist. from Initial",
			value: 1
		}, {
			label: "Use Dist Traveled",
			value: 2
		}, ],
	}, this.avgSpeedModel = {
		value: gpsDashboard.avgSpeedPref,
		disabled: false
	});
	//Avg Speed Selector Handler
	this.controller.listen("avgSpeedPref", Mojo.Event.propertyChange, this.changeAvgSpeed.bindAsEventListener(this));

	//Shake pref widget
	this.controller.setupWidget("shakePref", this.shakePrefAttributes = {
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
	}, this.shakePrefModel = {
		value: gpsDashboard.shakePref,
		disabled: false
	});
	//Shake pref Handler
	this.controller.listen("shakePref", Mojo.Event.propertyChange, this.shakePref.bindAsEventListener(this));

	//coloredSpeedPref Selector Widget
	this.controller.setupWidget("coloredSpeedPref", this.coloredSpeedPrefAttributes = {
		label: "Colored Speed",
		choices: [{
			label: "Based on Avg Speed",
			value: 'true'
		}, {
			label: "Off",
			value: 'false'
		},],
	}, this.coloredSpeedPrefModel = {
		value: gpsDashboard.coloredSpeedPref,
		disabled: false
	});
	//coloredSpeedPref Selector Handler
	this.controller.listen("coloredSpeedPref", Mojo.Event.propertyChange, this.coloredSpeedPref.bindAsEventListener(this));

	//Max Error Selector Widget
	this.controller.setupWidget("maxErrorPrefSelector", this.maxErrorAttributes = {
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
	}, this.maxErrorModel = {
		value: gpsDashboard.maxError,
		disabled: false
	});
	//Max Error Selector Handler
	this.controller.listen("maxErrorPrefSelector", Mojo.Event.propertyChange, this.maxErrorSelector.bindAsEventListener(this));

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
	gpsDashboard.startupPref = this.startupPrefModel.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.coloredSpeedPref = function (event) {
	gpsDashboard.coloredSpeedPref = this.coloredSpeedPrefModel.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.shakePref = function (event) {
	gpsDashboard.shakePref = this.shakePrefModel.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.maxErrorSelector = function (event) {
	gpsDashboard.maxError = this.maxErrorModel.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.changeAvgSpeed = function (event) {
	gpsDashboard.avgSpeedPref = this.avgSpeedModel.value;
	gpsDashboard.cookie.storeCookie();
}
PreferencesAssistant.prototype.changeUnitsSelector = function(event) {
	gpsDashboard.units = this.unitsSelectorModel.value;
	gpsDashboard.cookie.storeCookie();
}

PreferencesAssistant.prototype.changeBacklightSelector = function(event){
	gpsDashboard.backlight = this.backlightSelectorModel.value;
	gpsDashboard.cookie.storeCookie();
}

PreferencesAssistant.prototype.activate = function(event) {
}

PreferencesAssistant.prototype.deactivate = function(event) {
}

PreferencesAssistant.prototype.cleanup = function(event){
	this.controller.stopListening("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelector.bindAsEventListener(this));
	this.controller.stopListening("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelector.bindAsEventListener(this));
	this.controller.stopListening("avgSpeedPref", Mojo.Event.propertyChange, this.changeAvgSpeed.bindAsEventListener(this));
	this.controller.stopListening("shakePref", Mojo.Event.propertyChange, this.shakePref.bindAsEventListener(this));
	this.controller.stopListening("maxErrorPrefSelector", Mojo.Event.propertyChange, this.maxErrorSelector.bindAsEventListener(this));
	this.controller.stopListening("coloredSpeedPref", Mojo.Event.propertyChange, this.coloredSpeedPref.bindAsEventListener(this));
	this.controller.stopListening("dashAvgSpeed", Mojo.Event.propertyChange, this.dashAvgSpeed.bindAsEventListener(this));
	this.controller.stopListening("dashTopSpeed", Mojo.Event.propertyChange, this.dashTopSpeed.bindAsEventListener(this));
	this.controller.stopListening("dashDistTraveled", Mojo.Event.propertyChange, this.dashDistTraveled.bindAsEventListener(this));
	this.controller.stopListening("dashDistFromInit", Mojo.Event.propertyChange, this.dashDistFromInit.bindAsEventListener(this));
	this.controller.stopListening("dashLifeDist", Mojo.Event.propertyChange, this.dashLifeDist.bindAsEventListener(this));
	this.controller.stopListening("dashTripDuration", Mojo.Event.propertyChange, this.dashTripDuration.bindAsEventListener(this));
	
}
