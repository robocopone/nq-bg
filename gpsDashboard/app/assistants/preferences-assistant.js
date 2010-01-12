function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function() {
	this.controller.setupWidget(
		"exampleSelector1",
		this.attributes = {
			label: "One",
			choices: [
				{label: "One", value: 1},
				{label: "Two", value: 2},
				{label: "Three", value: 3}
			],
		},
		this.model = {
			value: 3,
			disabled: false
		}
	);
	this.controller.setupWidget(
		"exampleSelector2",
		this.attributes = {
			label: "Two",
			choices: [
				{label: "One", value: 1},
				{label: "Two", value: 2},
				{label: "Three", value: 3}
			],
		},
		this.model = {
			value: 3,
			disabled: false
		}
	);
}

PreferencesAssistant.prototype.activate = function(event) {
}


PreferencesAssistant.prototype.deactivate = function(event) {
}

PreferencesAssistant.prototype.cleanup = function(event) {
}
