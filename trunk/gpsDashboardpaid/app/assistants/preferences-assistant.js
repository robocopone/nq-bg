function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function(){
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
}
