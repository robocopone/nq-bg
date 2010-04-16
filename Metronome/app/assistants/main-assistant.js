tapTempo = {}
tapTempo.metroTempo = 100;
tapTempo.metroMeasure = 4;
tapTempo.metroIsRunning = false;
tapTempo.metroAlertVisable = true;
tapTempo.metroAlertAudible = false;
tapTempo.metroAlertVibration = false;
tapTempo.metroInitialAudioAttempt = true;
tapTempo.metroBeatSetup = []
tapTempo.metroBeatSetup[1] = 'affirmative'
tapTempo.metroBeatSetup[2] = 'primary'
tapTempo.metroBeatSetup[3] = 'primary'
tapTempo.metroBeatSetup[4] = 'primary'
tapTempo.metroBeatSetup[5] = 'primary'
tapTempo.metroBeatSetup[6] = 'primary'
tapTempo.metroBeatSetup[7] = 'primary'
tapTempo.metroBeatSetup[8] = 'primary'
tapTempo.metroBeatSetup[9] = 'primary'
tapTempo.metroBeatSetup[10] = 'primary'
tapTempo.metroBeatSetup[11] = 'primary'
tapTempo.metroBeatSetup[12] = 'primary'
tapTempo.metroBeatSetup[13] = 'primary'
tapTempo.initialized = false;
tapTempo.initialRun = true;


tapTempo.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberTapTempo");
		storedData = this.cookieData.get();
		if (storedData && storedData.version >= "1.0.0") {
			tapTempo.metroTempo = storedData.metroTempo
			tapTempo.metroAlertVisable = storedData.metroAlertVisable
			tapTempo.metroAlertAudible = storedData.metroAlertAudible
			tapTempo.metroAlertVibration = storedData.metroAlertVibration
			tapTempo.metroMeasure = storedData.metroMeasure
			tapTempo.metroInitialAudioAttempt = storedData.metroInitialAudioAttempt
			tapTempo.metroBeatSetup = storedData.metroBeatSetup.slice(0);
			tapTempo.initialized = storedData.initialized
		}
		if (storedData && storedData.version == "1.0.2") {
			tapTempo.initialRun = storedData.initialRun
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.0.2",
			metroTempo: tapTempo.metroTempo,
			metroAlertVisable: tapTempo.metroAlertVisable,
			metroAlertAudible: tapTempo.metroAlertAudible,
			metroAlertVibration: tapTempo.metroAlertVibration,
			metroMeasure: tapTempo.metroMeasure,
			metroInitialAudioAttempt: tapTempo.metroInitialAudioAttempt,
			metroBeatSetup: tapTempo.metroBeatSetup.slice(0),
			initialized: tapTempo.initialized,
			initialRun: tapTempo.initialRun,
		});		
	}
});

function MainAssistant() {
}

MainAssistant.prototype.setup = function() {
	tapTempo.cookie.initialize();
	if (!tapTempo.initialized) {
		Mojo.Log.error('Initializing')
		tapTempo.metroBeatSetup[1] = 'affirmative'
		tapTempo.initialized = true;
		tapTempo.cookie.storeCookie();
		tapTempo.cookie.initialize();
		tapTempo.metroBeatSetup[1] = 'affirmative'
		tapTempo.cookie.storeCookie();
		tapTempo.cookie.initialize();
	}
	tapTempo.elements = {}
	
	tapTempo.elements.metroTitle = this.controller.get('metroTitle')
	tapTempo.elements.metroAvgGroup = this.controller.get('metroAvgGroup')
	tapTempo.elements.metroCurrentGroup = this.controller.get('metroCurrentGroup')
	tapTempo.elements.metroAvgTempo = this.controller.get('metroAvgTempo')
	tapTempo.elements.metroCurrentTempo = this.controller.get('metroCurrentTempo')
	tapTempo.elements.metroStartStop = this.controller.get('metroStartStop')
	tapTempo.elements.metroVisualAlert = this.controller.get('metroVisualAlert')
	tapTempo.elements.metroVisualAlertNum = this.controller.get('metroVisualAlertNum')
	
	tapTempo.elements.metroBeatSetupButton = []
	this.metroBeatSetupButtonModel = []
	var element;
	for (var x = 1; x <= 12; x++) {
		element = 'metroBeatSetupMeasure' + x
		tapTempo.elements.metroBeatSetupButton[x] = this.controller.get(element);
		this.controller.setupWidget(element, {
			type: Mojo.Widget.defaultButton
		}, this.metroBeatSetupButtonModel[x] = {
			buttonLabel: $L('' + x),
			buttonClass: tapTempo.metroBeatSetup[x],
			disabled: false
		});
	}

	this.controller.setupWidget('setMetroTempo', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 300,
	}, this.setMetroTempoModel = {
		value: tapTempo.metroTempo
	});

	this.controller.setupWidget('setMetroMeasure', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 12,
	}, this.setMetroMeasureModel = {
		value: tapTempo.metroMeasure
	});

	// Metro Start/Stop Button Widget
	this.controller.setupWidget('metroStartStop', {
		type: Mojo.Widget.defaultButton
	}, this.metroStartStopModel = {
		buttonLabel: $L("Start"),
		buttonClass: 'affirmative',
		disabled: false
	});

	// Metro Beat setup Button Widget
	this.controller.setupWidget('metroBeatSetupButton', {
		type: Mojo.Widget.defaultButton
	}, {
		buttonLabel: $L("Beat Setup"),
		buttonClass: 'normal',
		disabled: false
	});

	// Metro Beat setup OK Button Widget
	this.controller.setupWidget('metroBeatSetupOkButton', {
		type: Mojo.Widget.defaultButton
	}, {
		buttonLabel: $L("OK"),
		buttonClass: 'affirmative',
		disabled: false
	});

	// Tempo Markings Button Widget
	this.controller.setupWidget('metroTempoMarkingsButton', {
		type: Mojo.Widget.defaultButton
	}, {
		buttonLabel: $L("Tempo Markings"),
		buttonClass: 'normal',
		disabled: false
	});

	// Tempo Markings OK Button Widget
	this.controller.setupWidget('metroTempoMarkingsOkButton', {
		type: Mojo.Widget.defaultButton
	}, {
		buttonLabel: $L("OK"),
		buttonClass: 'affirmative',
		disabled: false
	});

	// Types of alerts checkboxes
	this.controller.setupWidget("metroAlertVisable", {
	}, {
		value: tapTempo.metroAlertVisable,
		disabled: false
	});
	this.controller.setupWidget("metroAlertAudible", {
	}, {
		value: tapTempo.metroAlertAudible,
		disabled: false
	});
	this.controller.setupWidget("metroAlertVibration", {
	}, {
		value: tapTempo.metroAlertVibration,
		disabled: false
	});

	this.runMetronome = Mojo.Function.debounce(undefined, this.doRunMetronome.bind(this), .01);

	this.controller.listen("metroTempoMarkingsButton", Mojo.Event.tap, this.metroTempoMarkingsButton.bindAsEventListener(this))
	this.controller.listen("metroTempoMarkingsOkButton", Mojo.Event.tap, this.metroTempoMarkingsOkButton.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure1", Mojo.Event.tap, this.metroBeatSetupMeasure1.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure2", Mojo.Event.tap, this.metroBeatSetupMeasure2.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure3", Mojo.Event.tap, this.metroBeatSetupMeasure3.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure4", Mojo.Event.tap, this.metroBeatSetupMeasure4.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure5", Mojo.Event.tap, this.metroBeatSetupMeasure5.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure6", Mojo.Event.tap, this.metroBeatSetupMeasure6.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure7", Mojo.Event.tap, this.metroBeatSetupMeasure7.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure8", Mojo.Event.tap, this.metroBeatSetupMeasure8.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure9", Mojo.Event.tap, this.metroBeatSetupMeasure9.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure10", Mojo.Event.tap, this.metroBeatSetupMeasure10.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure11", Mojo.Event.tap, this.metroBeatSetupMeasure11.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupMeasure12", Mojo.Event.tap, this.metroBeatSetupMeasure12.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupButton", Mojo.Event.tap, this.metroBeatSetupButton.bindAsEventListener(this))
	this.controller.listen("metroBeatSetupOkButton", Mojo.Event.tap, this.metroBeatSetupOkButton.bindAsEventListener(this))
	this.controller.listen("metroAlertVisable", Mojo.Event.propertyChange, this.metroAlertVisableChanged.bindAsEventListener(this));
	this.controller.listen("metroAlertAudible", Mojo.Event.propertyChange, this.metroAlertAudibleChanged.bindAsEventListener(this));
	this.controller.listen("metroAlertVibration", Mojo.Event.propertyChange, this.metroAlertVibrationChanged.bindAsEventListener(this));
	this.controller.listen(tapTempo.elements.metroStartStop, Mojo.Event.tap, this.metroStartStop.bindAsEventListener(this))	
	this.controller.listen("setMetroMeasure",Mojo.Event.propertyChange, this.setMetroMeasureChanged.bindAsEventListener(this));
	this.controller.listen("setMetroTempo",Mojo.Event.propertyChange, this.setMetroTempoChanged.bindAsEventListener(this));
	if (tapTempo.initialRun)
		this.initialPrompt();
}
MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening("metroTempoMarkingsButton", Mojo.Event.tap, this.metroTempoMarkingsButton.bindAsEventListener(this))
	this.controller.stopListening("metroTempoMarkingsOkButton", Mojo.Event.tap, this.metroTempoMarkingsOkButton.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure1", Mojo.Event.tap, this.metroBeatSetupMeasure1.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure2", Mojo.Event.tap, this.metroBeatSetupMeasure2.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure3", Mojo.Event.tap, this.metroBeatSetupMeasure3.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure4", Mojo.Event.tap, this.metroBeatSetupMeasure4.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure5", Mojo.Event.tap, this.metroBeatSetupMeasure5.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure6", Mojo.Event.tap, this.metroBeatSetupMeasure6.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure7", Mojo.Event.tap, this.metroBeatSetupMeasure7.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure8", Mojo.Event.tap, this.metroBeatSetupMeasure8.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure9", Mojo.Event.tap, this.metroBeatSetupMeasure9.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure10", Mojo.Event.tap, this.metroBeatSetupMeasure10.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure11", Mojo.Event.tap, this.metroBeatSetupMeasure11.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupMeasure12", Mojo.Event.tap, this.metroBeatSetupMeasure12.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupButton", Mojo.Event.tap, this.metroBeatSetupButton.bindAsEventListener(this))
	this.controller.stopListening("metroBeatSetupOkButton", Mojo.Event.tap, this.metroBeatSetupOkButton.bindAsEventListener(this))
	this.controller.stopListening("metroAlertVisable", Mojo.Event.propertyChange, this.metroAlertVisableChanged.bindAsEventListener(this));
	this.controller.stopListening("metroAlertAudible", Mojo.Event.propertyChange, this.metroAlertAudibleChanged.bindAsEventListener(this));
	this.controller.stopListening("metroAlertVibration", Mojo.Event.propertyChange, this.metroAlertVibrationChanged.bindAsEventListener(this));
	this.controller.stopListening(tapTempo.elements.metroStartStop, Mojo.Event.tap, this.metroStartStop.bindAsEventListener(this))	
	this.controller.stopListening("setMetroMeasure",Mojo.Event.propertyChange, this.setMetroMeasureChanged.bindAsEventListener(this));
	this.controller.stopListening("setMetroTempo",Mojo.Event.propertyChange, this.setMetroTempoChanged.bindAsEventListener(this));
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroTempoMarkingsButton = function () {
	this.controller.get("metroTempoMarkingsWindow").removeClassName('hidden')
}
MainAssistant.prototype.metroTempoMarkingsOkButton = function () {
	this.controller.get("metroTempoMarkingsWindow").addClassName('hidden')
}

MainAssistant.prototype.metroBeatSetupButton = function () {
	for (var x = 1; x <= tapTempo.metroMeasure; x++) {
		tapTempo.elements.metroBeatSetupButton[x].removeClassName('hidden')
	}
	this.controller.get("metroBeatSetupWindow").removeClassName('hidden')
}
MainAssistant.prototype.metroBeatSetupOkButton = function () {
	this.controller.get("metroBeatSetupWindow").addClassName('hidden')
	for (var x = 1; x <= 12; x++) {
		tapTempo.elements.metroBeatSetupButton[x].addClassName('hidden')
	}
}
MainAssistant.prototype.setMetroMeasureChanged = function (event) {
	tapTempo.metroMeasure = event.value;
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.setMetroTempoChanged = function (event) {
	tapTempo.metroTempo = event.value;
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroAlertVisableChanged = function (event) {
	tapTempo.metroAlertVisable = event.value;
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroAlertAudibleChanged = function (event) {
	if (tapTempo.metroInitialAudioAttempt && event.value) {
		this.controller.showAlertDialog({
			onChoose: this.metroInitialAudioAttempt,
			title: $L("Audio Disclaimer"),
			message: $L('The only way to play audio on the Pre within the timing constraints of a metronome is to use the onboard system sounds.  If you cannot hear anything you need to go into "Sounds & Ringtones" on the third page of the launcher and turn up the volume on System Sounds.  This also forced me to use the dial-pad tones.  I apologize for the ghetto sound but blame Palm, not me.'),
			choices: [{
				label: $L('Ok'),
				value: 'ok',
				type: 'affirmative'
			}, {
				label: $L('Don\'t tell me again'),
				value: 'no',
				type: 'negative'
			}, ]
		});
	}
	tapTempo.metroAlertAudible = event.value;
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroInitialAudioAttempt = function(choice) {
	if (choice == 'no') {
		tapTempo.metroInitialAudioAttempt = false;
	}
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroAlertVibrationChanged = function (event) {
	tapTempo.metroAlertVibration = event.value;
	tapTempo.cookie.storeCookie();
}

MainAssistant.prototype.metroStartStop = function () {
	this.start = new Date().getTime();
	if (tapTempo.metroIsRunning) {
		tapTempo.metroIsRunning = false;
		this.metroStartStopModel.buttonLabel = 'Start';
		this.metroStartStopModel.buttonClass = 'affirmative';
		this.controller.modelChanged(this.metroStartStopModel, this);
		tapTempo.elements.metroVisualAlert.addClassName('hidden')
	}
	else {
		tapTempo.metroIsRunning = true;
		this.metroStartStopModel.buttonLabel = 'Stop';
		this.metroStartStopModel.buttonClass = 'negative';
		this.controller.modelChanged(this.metroStartStopModel, this);
		tapTempo.metroDelay = (1 / (tapTempo.metroTempo / 60)) * 1000
		tapTempo.metroTotalBeats = 1;
		tapTempo.currentBeat = 1;
		if (tapTempo.metroAlertVisable)
			this.playVisableAlert();
		if (tapTempo.metroAlertVibration)
			Mojo.Controller.getAppController().playSoundNotification("vibrate","");
		if (tapTempo.metroAlertAudible)
			this.playAudibleAlert();
		this.runMetronome();
	}
}

MainAssistant.prototype.doRunMetronome = function () {
	this.finish = new Date().getTime()
	var deltaT = this.finish - this.start
	if (deltaT > tapTempo.metroDelay * tapTempo.metroTotalBeats) {
		this.lagFighter();
		tapTempo.metroTotalBeats++
		tapTempo.currentBeat++
		if (tapTempo.currentBeat > tapTempo.metroMeasure) 
			tapTempo.currentBeat = 1

		// Visable Alert
		if (tapTempo.metroAlertVisable)
			this.playVisableAlert();
		else
			tapTempo.elements.metroVisualAlert.addClassName('hidden')
		// Vibration Alert
		if (tapTempo.metroAlertVibration)
			Mojo.Controller.getAppController().playSoundNotification("vibrate", "");
		// Audible Alert
		if (tapTempo.metroAlertAudible)
			this.playAudibleAlert();
	}
	if (tapTempo.metroIsRunning)
		this.runMetronome();
}

MainAssistant.prototype.playVisableAlert = function () {
	tapTempo.elements.metroVisualAlert.removeClassName('hidden')
	tapTempo.elements.metroVisualAlertNum.update(tapTempo.currentBeat)
	if (tapTempo.metroBeatSetup[tapTempo.currentBeat] == 'affirmative' &&
		tapTempo.currentBeat == 1) {
		tapTempo.elements.metroVisualAlert.addClassName('down')
		tapTempo.elements.metroVisualAlert.removeClassName('accent')
	}
	else if (tapTempo.metroBeatSetup[tapTempo.currentBeat] == 'affirmative')
		tapTempo.elements.metroVisualAlert.addClassName('accent')

	if (tapTempo.metroBeatSetup[tapTempo.currentBeat] == 'primary') {
		tapTempo.elements.metroVisualAlert.removeClassName('down')
		tapTempo.elements.metroVisualAlert.removeClassName('accent')
	}
	if (tapTempo.metroBeatSetup[tapTempo.currentBeat] == 'secondary') {
		tapTempo.elements.metroVisualAlert.removeClassName('down')
		tapTempo.elements.metroVisualAlert.removeClassName('accent')
//		tapTempo.elements.metroVisualAlertNum.update('&nbsp;')
	}
}
MainAssistant.prototype.playAudibleAlert = function () {
	if (tapTempo.metroBeatSetup[tapTempo.currentBeat] == 'affirmative' &&
		tapTempo.currentBeat == 1)
		this.playDownClick();
	else if (tapTempo.metroBeatSetup[tapTempo.currentBeat] == 'affirmative')
		this.playAccentClick();
	if (tapTempo.metroBeatSetup[tapTempo.currentBeat] == 'primary')
		this.playClick();
	if (tapTempo.metroBeatSetup[tapTempo.currentBeat] == 'secondary') {
	}
}
MainAssistant.prototype.playDownClick = function(){
	this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
		method: "playFeedback",
		parameters: {
			name: "dtmf_9"
		},
		onSuccess: this.successfulClick.bind(this),
		onFailure: this.failedClick.bind(this)
	})
}
MainAssistant.prototype.playAccentClick = function(){
	this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
		method: "playFeedback",
		parameters: {
			name: "dtmf_5"
		},
		onSuccess: this.successfulClick.bind(this),
		onFailure: this.failedClick.bind(this)
	})
}
MainAssistant.prototype.playClick = function(){
	this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
		method: "playFeedback",
		parameters: {
			name: "dtmf_1"
		},
		onSuccess: this.successfulClick.bind(this),
		onFailure: this.failedClick.bind(this)
	})
}
MainAssistant.prototype.successfulClick = function () {}
MainAssistant.prototype.failedClick = function () {}

MainAssistant.prototype.lagFighter = function () {
	this.controller.stageController.setWindowProperties({
		"blockScreenTimeout": true,
		"fastAccelerometer": false,
	});
	this.controller.stageController.setWindowProperties({
		"fastAccelerometer": true,
	});
}

MainAssistant.prototype.activate = function(event) {
}


MainAssistant.prototype.deactivate = function(event) {
}

/*
 * Handles the application pulldown menu
 */
MainAssistant.prototype.handleCommand = function (event) {
	if (event.type == Mojo.Event.commandEnable &&
	   (event.command == Mojo.Menu.helpCmd)) 
	{	event.stopPropagation(); 
	}

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case Mojo.Menu.helpCmd:
				Mojo.Controller.stageController.pushAppSupportInfoScene();
				break;
		}
	}
}
MainAssistant.prototype.metroBeatSetupMeasure1 = function(){
	if (this.metroBeatSetupButtonModel[1].buttonClass == "primary") {
		this.metroBeatSetupButtonModel[1].buttonClass = "affirmative"
		tapTempo.metroBeatSetup[1] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[1].buttonClass == "affirmative") {
		this.metroBeatSetupButtonModel[1].buttonClass = "secondary"
		tapTempo.metroBeatSetup[1] = 'secondary'
	}
	else if(this.metroBeatSetupButtonModel[1].buttonClass == "secondary") {
		this.metroBeatSetupButtonModel[1].buttonClass = "primary"
		tapTempo.metroBeatSetup[1] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[1], this);
	tapTempo.cookie.storeCookie();
}

MainAssistant.prototype.metroBeatSetupMeasure2 = function () {
	if (this.metroBeatSetupButtonModel[2].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[2].buttonClass="affirmative"
		tapTempo.metroBeatSetup[2] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[2].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[2].buttonClass="secondary"
		tapTempo.metroBeatSetup[2] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[2].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[2].buttonClass="primary"
		tapTempo.metroBeatSetup[2] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[2], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure3 = function () {
	if (this.metroBeatSetupButtonModel[3].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[3].buttonClass="affirmative"
		tapTempo.metroBeatSetup[3] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[3].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[3].buttonClass="secondary"
		tapTempo.metroBeatSetup[3] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[3].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[3].buttonClass="primary"
		tapTempo.metroBeatSetup[3] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[3], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure4 = function () {
	if (this.metroBeatSetupButtonModel[4].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[4].buttonClass="affirmative"
		tapTempo.metroBeatSetup[4] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[4].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[4].buttonClass="secondary"
		tapTempo.metroBeatSetup[4] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[4].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[4].buttonClass="primary"
		tapTempo.metroBeatSetup[4] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[4], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure5 = function () {
	if (this.metroBeatSetupButtonModel[5].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[5].buttonClass="affirmative"
		tapTempo.metroBeatSetup[5] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[5].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[5].buttonClass="secondary"
		tapTempo.metroBeatSetup[5] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[5].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[5].buttonClass="primary"
		tapTempo.metroBeatSetup[5] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[5], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure6 = function () {
	if (this.metroBeatSetupButtonModel[6].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[6].buttonClass="affirmative"
		tapTempo.metroBeatSetup[6] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[6].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[6].buttonClass="secondary"
		tapTempo.metroBeatSetup[6] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[6].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[6].buttonClass="primary"
		tapTempo.metroBeatSetup[6] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[6], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure7 = function () {
	if (this.metroBeatSetupButtonModel[7].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[7].buttonClass="affirmative"
		tapTempo.metroBeatSetup[7] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[7].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[7].buttonClass="secondary"
		tapTempo.metroBeatSetup[7] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[7].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[7].buttonClass="primary"
		tapTempo.metroBeatSetup[7] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[7], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure8 = function () {
	if (this.metroBeatSetupButtonModel[8].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[8].buttonClass="affirmative"
		tapTempo.metroBeatSetup[8] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[8].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[8].buttonClass="secondary"
		tapTempo.metroBeatSetup[8] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[8].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[8].buttonClass="primary"
		tapTempo.metroBeatSetup[8] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[8], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure9 = function () {
	if (this.metroBeatSetupButtonModel[9].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[9].buttonClass="affirmative"
		tapTempo.metroBeatSetup[9] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[9].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[9].buttonClass="secondary"
		tapTempo.metroBeatSetup[9] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[9].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[9].buttonClass="primary"
		tapTempo.metroBeatSetup[9] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[9], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure10 = function(){
	if (this.metroBeatSetupButtonModel[10].buttonClass == "primary") {
		this.metroBeatSetupButtonModel[10].buttonClass = "affirmative"
		tapTempo.metroBeatSetup[10] = 'affirmative'
	}
	else 
		if (this.metroBeatSetupButtonModel[10].buttonClass == "affirmative") {
			this.metroBeatSetupButtonModel[10].buttonClass = "secondary"
			tapTempo.metroBeatSetup[10] = 'secondary'
		}
		else 
			if (this.metroBeatSetupButtonModel[10].buttonClass == "secondary") {
				this.metroBeatSetupButtonModel[10].buttonClass = "primary"
				tapTempo.metroBeatSetup[10] = 'primary'
			}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[10], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure11 = function () {
	if (this.metroBeatSetupButtonModel[11].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[11].buttonClass="affirmative"
		tapTempo.metroBeatSetup[11] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[11].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[11].buttonClass="secondary"
		tapTempo.metroBeatSetup[11] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[11].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[11].buttonClass="primary"
		tapTempo.metroBeatSetup[11] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[11], this);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.metroBeatSetupMeasure12 = function () {
	if (this.metroBeatSetupButtonModel[12].buttonClass=="primary") {
		this.metroBeatSetupButtonModel[12].buttonClass="affirmative"
		tapTempo.metroBeatSetup[12] = 'affirmative'
	}
	else if (this.metroBeatSetupButtonModel[12].buttonClass=="affirmative") {
		this.metroBeatSetupButtonModel[12].buttonClass="secondary"
		tapTempo.metroBeatSetup[12] = 'secondary'
	}
	else if (this.metroBeatSetupButtonModel[12].buttonClass=="secondary") {
		this.metroBeatSetupButtonModel[12].buttonClass="primary"
		tapTempo.metroBeatSetup[12] = 'primary'
	}
	this.controller.modelChanged(this.metroBeatSetupButtonModel[12], this);
	tapTempo.cookie.storeCookie();
}

/*
 * Initial Run Prompt
 */
MainAssistant.prototype.initialPrompt = function () {
	this.controller.showAlertDialog({
		onChoose: this.doInitialChoice,
		title: $L("Extended Capabilities Available"),
		message: $L("Do you wish you had the ability to tap along to something to set the tempo?  Check out the Musician's Toolbox!"),
		choices: [{
			label: $L('Yes'),
			value: 'yes',
			type: 'affirmative'
		}, {
			label: $L('No'),
			value: 'no',
			type: 'negative'
		}, {
			label: $L('No, and never ask again'),
			value: 'nono',
			type: 'negative'
		}, ]
	});	
}

/*
 * 
 */
MainAssistant.prototype.doInitialChoice = function(choice) {
	if (choice == 'yes') {
		this.controller.serviceRequest("palm://com.palm.applicationManager", {
			method: "open",
			parameters: {
				id: 'com.palm.app.browser',
				params: {
					target: "http://developer.palm.com/appredirect/?packageid=net.bradleygraber.musicianstoolbox"
				}
			}
		});
	}
	if (choice == 'no') {
	}
	if (choice == 'nono') {
		tapTempo.initialRun = false;
		tapTempo.cookie.storeCookie();
	}
}

