function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function(){
	//Units Selector Widget
	this.controller.setupWidget("unitsSelector", attr = {
		label: $L("Units"),
		choices: [{
			label: $L("Miles/Feet"),
			value: 1
		}, {
			label: $L("Kilometers/Meters"),
			value: 2
		}, ],
	}, model = {
		value: gpsDashboard.units,
		disabled: false
	});
	
	//Backlight Selector Widget
	this.controller.setupWidget("backlightSelector", attr = {
		label: $L("Backlight"),
		choices: [{
			label: $L("Always On"),
			value: 1
		}, {
			label: $L("Device Settings"),
			value: 2
		}, ],
	}, model = {
		value: gpsDashboard.backlight,
		disabled: false
	});

	//Avg Speed Widget
	this.controller.setupWidget("avgSpeedPref", attr = {
		label: $L("Avg. Speed"),
		choices: [{
			label: $L("Use Dist. from Initial"),
			value: 1
		}, {
			label: $L("Use Dist Traveled"),
			value: 2
		}, ],
	}, model = {
		value: gpsDashboard.avgSpeedPref,
		disabled: false
	});

	//Max Error Selector Widget
	this.controller.setupWidget("maxErrorPrefSelector", attr = {
		label: $L("Max Error"),
		choices: [{
			label: $L("5 m"),
			value: 5
		}, {
			label: $L("10 m"),
			value: 10
		}, {
			label: $L("15 m"),
			value: 15
		}, {
			label: $L("20 m"),
			value: 20
		}, {
			label: $L("30 m"),
			value: 30
		},],
	}, model = {
		value: gpsDashboard.maxError,
		disabled: false
	});

	//headingPref Selector Widget
	this.controller.setupWidget("headingPref", attr = {
		label: $L("Heading"),
		choices: [{
			label: $L("N/S/E/W"),
			value: 1
		}, {
			label: $L("Degrees"),
			value: 2
		},],
	}, model = {
		value: gpsDashboard.heading,
		disabled: false
	});
	this.controller.get('prefHead').update($L("Preferences"))
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
