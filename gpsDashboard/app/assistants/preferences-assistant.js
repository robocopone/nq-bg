function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function() {
	//Units Selector Widget
	this.controller.setupWidget(
		"unitsSelector",
		this.unitsSelectorAttributes = {
			label: "Units",
			choices: [
				{label: "Miles/Feet", value: 1},
				{label: "Kilometers/Meters", value: 2},
			],
		},
		this.unitsSelectorModel = {
			value: gpsDashboard.units,
			disabled: false
		}
	);
	//Units Selector Handler
	this.changeUnitsSelectorHandler = this.changeUnitsSelector.bindAsEventListener(this);
	this.controller.listen(
		"unitsSelector",
		Mojo.Event.propertyChange,
		this.changeUnitsSelectorHandler
	);
	
	//Backlight Selector Widget
	this.controller.setupWidget(
		"backlightSelector",
		this.backlightSelectorAttributes = {
			label: "Backlight",
			choices: [
				{label: "Always On", value: 1},
				{label: "Device Settings", value: 2},
			],
		},
		this.backlightSelectorModel = {
			value: gpsDashboard.backlight,
			disabled: false
		}
	);
	//Backlight Selector Handler
	this.changeBacklightSelectorHandler = this.changeBacklightSelector.bindAsEventListener(this);
	this.controller.listen(
		"backlightSelector", 
		Mojo.Event.propertyChange,
		this.changeBacklightSelectorHandler
	);

}
PreferencesAssistant.prototype.changeUnitsSelector = function(event) {
	gpsDashboard.units = this.unitsSelectorModel.value;
}

PreferencesAssistant.prototype.changeBacklightSelector = function(event){
	gpsDashboard.backlight = this.backlightSelectorModel.value;
}

PreferencesAssistant.prototype.activate = function(event) {
}


PreferencesAssistant.prototype.deactivate = function(event) {
}

PreferencesAssistant.prototype.cleanup = function(event) {
}
