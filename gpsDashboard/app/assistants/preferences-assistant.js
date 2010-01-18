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
	this.changeUnitsSelectorHandler = this.changeUnitsSelector.bindAsEventListener(this);
	this.controller.listen("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelectorHandler);
	
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
	this.changeBacklightSelectorHandler = this.changeBacklightSelector.bindAsEventListener(this);
	this.controller.listen("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelectorHandler);

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
	this.changeAvgSpeedHandler = this.changeAvgSpeed.bindAsEventListener(this);
	this.controller.listen("avgSpeedPref", Mojo.Event.propertyChange, this.changeAvgSpeedHandler);

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
	this.maxErrorSelectorHandler = this.maxErrorSelector.bindAsEventListener(this);
	this.controller.listen("maxErrorPrefSelector", Mojo.Event.propertyChange, this.maxErrorSelectorHandler);

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
	this.controller.stopListening("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelectorHandler);
	this.controller.stopListening("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelectorHandler);
}
