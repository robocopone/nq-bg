function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function(){
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

	//headingPref Selector Widget
	this.controller.setupWidget("headingPref", attr = {
		label: "Heading",
		choices: [{
			label: "N/S/E/W",
			value: 1
		}, {
			label: "Numeric Values",
			value: 2
		},],
	}, model = {
		value: gpsDashboard.heading,
		disabled: false
	});

	this.controller.listen("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelector.bindAsEventListener(this));
	this.controller.listen("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelector.bindAsEventListener(this));
	this.controller.listen("avgSpeedPref", Mojo.Event.propertyChange, this.changeAvgSpeed.bindAsEventListener(this));
	this.controller.listen("maxErrorPrefSelector", Mojo.Event.propertyChange, this.maxErrorSelector.bindAsEventListener(this));
	this.controller.listen("headingPref", Mojo.Event.propertyChange, this.headingPref.bindAsEventListener(this));
}

PreferencesAssistant.prototype.headingPref = function (event) {
	gpsDashboard.heading = event.value;
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
	this.controller.stopListening("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelector.bindAsEventListener(this));
	this.controller.stopListening("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelector.bindAsEventListener(this));
	this.controller.stopListening("avgSpeedPref", Mojo.Event.propertyChange, this.changeAvgSpeed.bindAsEventListener(this));
	this.controller.stopListening("maxErrorPrefSelector", Mojo.Event.propertyChange, this.maxErrorSelector.bindAsEventListener(this));
	this.controller.stopListening("headingPref", Mojo.Event.propertyChange, this.headingPref.bindAsEventListener(this));
}
