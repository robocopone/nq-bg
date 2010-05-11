function PreferencesAssistant() {
}

PreferencesAssistant.prototype.dashTapped = function () {
	dashDivider = this.controller.get('dashDivider');
	dashDrawer = this.controller.get('dashDrawer');
	
	if (dashDivider.hasClassName('palm-arrow-closed')){
		dashDivider.removeClassName('palm-arrow-closed');
		dashDivider.addClassName('palm-arrow-expanded');
		dashDrawer.mojo.setOpenState(true);
	}
	else if (dashDivider.hasClassName('palm-arrow-expanded')) {
		dashDivider.removeClassName('palm-arrow-expanded');
		dashDivider.addClassName('palm-arrow-closed');
		dashDrawer.mojo.setOpenState(false);
	}
}

PreferencesAssistant.prototype.dispTapped = function () {
	dispDivider = this.controller.get('dispDivider');
	dispDrawer = this.controller.get('dispDrawer');
	
	if (dispDivider.hasClassName('palm-arrow-closed')){
		dispDivider.removeClassName('palm-arrow-closed');
		dispDivider.addClassName('palm-arrow-expanded');
		dispDrawer.mojo.setOpenState(true);
	}
	else if (dispDivider.hasClassName('palm-arrow-expanded')) {
		dispDivider.removeClassName('palm-arrow-expanded');
		dispDivider.addClassName('palm-arrow-closed');
		dispDrawer.mojo.setOpenState(false);
	}
}

PreferencesAssistant.prototype.prefTapped = function () {
	prefDivider = this.controller.get('prefDivider');
	prefDrawer = this.controller.get('prefDrawer');
	
	if (prefDivider.hasClassName('palm-arrow-closed')){
		prefDivider.removeClassName('palm-arrow-closed');
		prefDivider.addClassName('palm-arrow-expanded');
		prefDrawer.mojo.setOpenState(true);
	}
	else if (prefDivider.hasClassName('palm-arrow-expanded')) {
		prefDivider.removeClassName('palm-arrow-expanded');
		prefDivider.addClassName('palm-arrow-closed');
		prefDrawer.mojo.setOpenState(false);
	}
}

PreferencesAssistant.prototype.setup = function(){
	this.controller.get('prefTitle').update($L("Preferences"))
	this.controller.get('prefHead').update($L("Preferences"))
	this.controller.get('prefGroupHead').update($L("Preferences"))
	this.controller.get('dispPrefsHead').update($L("Display Prefs"))
	this.controller.get('dispPrefGroupHead').update($L("Display Prefs"))
	this.controller.get('dashPrefsHead').update($L("Dashboard Prefs"))
	this.controller.get('dashPrefGroupHead').update($L("Dashboard View (First 3 Displayed)"))

	this.controller.get('dashPrefGroupAvgSpeed').update($L("Average Speed"))
	this.controller.get('dashPrefGroupTopSpeed').update($L("Top Speed"))
	this.controller.get('dashPrefGroupDistTraveled').update($L("Distance Traveled"))
	this.controller.get('dashPrefGroupDistFromInit').update($L("Dist from Initial Position"))
	this.controller.get('dashPrefGroupLifeDist').update($L("Lifetime Distance"))
	this.controller.get('dashPrefGroupTripDuration').update($L("Trip Duration"))
	


	this.controller.listen("prefDivider", Mojo.Event.tap, this.prefTapped.bindAsEventListener(this));
	this.controller.listen("dispDivider", Mojo.Event.tap, this.dispTapped.bindAsEventListener(this));
	this.controller.listen("dashDivider", Mojo.Event.tap, this.dashTapped.bindAsEventListener(this));

	this.controller.setupWidget("prefDrawer", attrs = {
		modelProperty: 'open',
		unstyled: true
	}, model = {
		open: false
	});

	this.controller.setupWidget("dashDrawer", attrs = {
		modelProperty: 'open',
		unstyled: true
	}, model = {
		open: false
	});

	this.controller.setupWidget("dispDrawer", attrs = {
		modelProperty: 'open',
		unstyled: true
	}, model = {
		open: false
	});

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
		label: $L("On Startup"),
		choices: [{
			label: $L("Always Reset Trip Information"),
			value: 'always'
		}, {
			label: $L("Never Reset Trip Information"),
			value: 'never'
		}, {
			label: $L("Ask Each Time"),
			value: 'ask'
		}, ],
	}, model = {
		value: gpsDashboard.startupPref,
		disabled: false
	});

	//Theme Selector Widget
	this.controller.setupWidget("themeSelector", attr = {
		label: $L("Theme"),
		choices: [{
			label: $L("Light"),
			value: 'light'
		}, {
			label: $L("Dark"),
			value: 'dark'
		}, ],
	}, model = {
		value: gpsDashboard.theme,
		disabled: false
	});
	
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
	
	//headingPref Widget
	this.controller.setupWidget("headingPref", attr = {
		label: $L("Heading"),
		choices: [{
			label: $L("N/S/E/W"),
			value: 1
		}, {
			label: $L("Degrees"),
			value: 2
		}, ],
	}, model = {
		value: gpsDashboard.headingPref,
		disabled: false
	});

	//Shake pref widget
	this.controller.setupWidget("shakePref", attr = {
		label: $L("When Shook"),
		choices: [{
			label: $L("Reset All"),
			value: 'all'
		}, {
			label: $L("Reset None"),
			value: 'none'
		}, {
			label: $L("Reset Top Speed"),
			value: 'topSpeed'
		}, {
			label: $L("Reset Average Speed"),
			value: 'avgSpeed'
		}, {
			label: $L("Reset Distance Traveled"),
			value: 'distTraveled'
		}, {
			label: $L("Reset Initial Position"),
			value: 'initPosition'
		}, ],
	}, model = {
		value: gpsDashboard.shakePref,
		disabled: false
	});

	//Siren pref widget
	this.controller.setupWidget("sirenPref", {
		label: $L("Siren"),
		choices: [{
			label: $L("Off"),
			value: 'off'
		}, {
			label: $L("On in Speedometer Display"),
			value: 'speedo'
		}, {
			label: $L("Always on"),
			value: 'always'
		}, ],
	}, {
		value: gpsDashboard.sirenPref,
		disabled: false
	});

	//coloredSpeedPref Selector Widget
	this.controller.setupWidget("coloredSpeedPref", attr = {
		label: $L("Speed Color"),
		choices: [{
			label: $L("Based on Avg Speed"),
			value: 'true'
		}, {
			label: $L("Off"),
			value: 'false'
		},],
	}, model = {
		value: gpsDashboard.coloredSpeedPref,
		disabled: false
	});

	//Max Error Selector Widget
	this.controller.setupWidget("maxErrorPrefSelector", attr = {
		label: $L("Max Error"),
		choices: [{
			label: $L("5 meters"),
			value: 5
		}, {
			label: $L("10 meters"),
			value: 10
		}, {
			label: $L("15 meters"),
			value: 15
		}, {
			label: $L("20 meters"),
			value: 20
		}, {
			label: $L("30 meters"),
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
	this.controller.listen("sirenPref", Mojo.Event.propertyChange, this.sirenPref.bindAsEventListener(this));
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
		this.controller.get('border').addClassName('dark');
		this.controller.get('hideSpeedLimitLine').addClassName('dark')
		this.controller.get('speedometerSpeed').addClassName('dark');
		this.controller.get('speedImgDark').removeClassName('hidden');
		this.controller.get('speedImgLight').addClassName('hidden');
	}
	if (gpsDashboard.theme == 'light') {
		$$('body')[0].removeClassName('palm-dark');
		$$('body')[0].addClassName('palm-default');
		this.controller.get('border').removeClassName('dark');
		this.controller.get('hideSpeedLimitLine').removeClassName('dark')
		this.controller.get('speedometerSpeed').removeClassName('dark');
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
PreferencesAssistant.prototype.sirenPref = function (event) {
	gpsDashboard.sirenPref = event.value;
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
	this.controller.get('prefDrawer').removeClassName('hidden')
	this.controller.get('dispDrawer').removeClassName('hidden')
	this.controller.get('dashDrawer').removeClassName('hidden')
}

PreferencesAssistant.prototype.deactivate = function(event) {
}
PreferencesAssistant.prototype.cleanup = function(event){
	this.controller.stopListening("prefDivider", Mojo.Event.tap, this.prefTapped.bindAsEventListener(this));
	this.controller.stopListening("dashDivider", Mojo.Event.tap, this.dashTapped.bindAsEventListener(this));
	this.controller.stopListening("dispDivider", Mojo.Event.tap, this.dispTapped.bindAsEventListener(this));

	this.controller.stopListening("startupPref", Mojo.Event.propertyChange, this.startupPref.bindAsEventListener(this));
	this.controller.stopListening("themeSelector", Mojo.Event.propertyChange, this.changeThemeSelector.bindAsEventListener(this));
	this.controller.stopListening("unitsSelector", Mojo.Event.propertyChange, this.changeUnitsSelector.bindAsEventListener(this));
	this.controller.stopListening("backlightSelector", Mojo.Event.propertyChange, this.changeBacklightSelector.bindAsEventListener(this));
	this.controller.stopListening("avgSpeedPref", Mojo.Event.propertyChange, this.changeAvgSpeed.bindAsEventListener(this));
	this.controller.stopListening("shakePref", Mojo.Event.propertyChange, this.shakePref.bindAsEventListener(this));
	this.controller.stopListening("sirenPref", Mojo.Event.propertyChange, this.sirenPref.bindAsEventListener(this));
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