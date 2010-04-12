tapTempo = {}
tapTempo.metroTempo = 100;
tapTempo.metroMeasure = 4;
tapTempo.metroIsRunning = false;
tapTempo.metroAlertVisable = true;
tapTempo.metroAlertAudible = false;
tapTempo.metroAlertVibration = false;
tapTempo.metroInitialAudioAttempt = true;

tapTempo.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberTapTempo");
		storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.0.0") {
			tapTempo.metroTempo = storedData.metroTempo
			tapTempo.metroAlertVisable = storedData.metroAlertVisable
			tapTempo.metroAlertAudible = storedData.metroAlertAudible
			tapTempo.metroAlertVibration = storedData.metroAlertVibration
			tapTempo.metroMeasure = storedData.metroMeasure
			tapTempo.metroInitialAudioAttempt = storedData.metroInitialAudioAttempt
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.0.0",
			metroTempo: tapTempo.metroTempo,
			metroAlertVisable: tapTempo.metroAlertVisable,
			metroAlertAudible: tapTempo.metroAlertAudible,
			metroAlertVibration: tapTempo.metroAlertVibration,
			metroMeasure: tapTempo.metroMeasure,
			metroInitialAudioAttempt: tapTempo.metroInitialAudioAttempt,
		});		
	}
});

function MainAssistant() {
}

MainAssistant.prototype.setup = function() {
	tapTempo.cookie.initialize();
	tapTempo.elements = {}
	
	tapTempo.elements.metroTitle = this.controller.get('metroTitle')
	tapTempo.elements.metroAvgGroup = this.controller.get('metroAvgGroup')
	tapTempo.elements.metroCurrentGroup = this.controller.get('metroCurrentGroup')
	tapTempo.elements.metroAvgTempo = this.controller.get('metroAvgTempo')
	tapTempo.elements.metroCurrentTempo = this.controller.get('metroCurrentTempo')
	tapTempo.elements.metroStartStop = this.controller.get('metroStartStop')
	tapTempo.elements.metroVisualAlert = this.controller.get('metroVisualAlert')
	tapTempo.elements.metroVisualAlertNum = this.controller.get('metroVisualAlertNum')

	this.controller.setupWidget('setMetroTempo', {
		label: $L(" "),
		modelProperty: 'value',
		min: 30,
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

	this.controller.listen(this.controller.get("metroAlertVisable"), Mojo.Event.propertyChange, this.metroAlertVisableChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get("metroAlertAudible"), Mojo.Event.propertyChange, this.metroAlertAudibleChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get("metroAlertVibration"), Mojo.Event.propertyChange, this.metroAlertVibrationChanged.bindAsEventListener(this));
	this.controller.listen(tapTempo.elements.metroStartStop, Mojo.Event.tap, this.metroStartStop.bindAsEventListener(this))	
	this.controller.listen(this.controller.get('setMetroMeasure'),Mojo.Event.propertyChange, this.setMetroMeasureChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get('setMetroTempo'),Mojo.Event.propertyChange, this.setMetroTempoChanged.bindAsEventListener(this));
}
MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening(this.controller.get("metroAlertVisable"), Mojo.Event.propertyChange, this.metroAlertVisableChanged.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get("metroAlertAudible"), Mojo.Event.propertyChange, this.metroAlertAudibleChanged.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get("metroAlertVibration"), Mojo.Event.propertyChange, this.metroAlertVibrationChanged.bindAsEventListener(this));
	this.controller.stopListening(tapTempo.elements.metroStartStop, Mojo.Event.tap, this.metroStartStop.bindAsEventListener(this))	
	this.controller.stopListening(this.controller.get('setMetroMeasure'),Mojo.Event.propertyChange, this.setMetroMeasureChanged.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('setMetroTempo'),Mojo.Event.propertyChange, this.setMetroTempoChanged.bindAsEventListener(this));
	tapTempo.cookie.storeCookie();
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
			title: $L("Audio Alert"),
			message: $L('The only way to play audio on the Pre within the timing constraints of a metronome is to use the onboard system sounds.  If you cannot hear anything you need to go into "Sounds & Ringtones" on the third page of the launcher and turn up the volume on System Sounds.  This also forced me to use the dial-pad tones.'),
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
		if (tapTempo.metroAlertVibration) {
			Mojo.Controller.getAppController().playSoundNotification("vibrate","");
		}
		if (tapTempo.metroAlertVisable) {
			tapTempo.elements.metroVisualAlert.removeClassName('hidden')
			tapTempo.elements.metroVisualAlertNum.update(tapTempo.currentBeat)
			tapTempo.elements.metroVisualAlert.addClassName('down')
		}
		if (tapTempo.metroAlertAudible) {
			this.playAccentClick();
		}
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

		if (tapTempo.metroAlertVisable) {
			tapTempo.elements.metroVisualAlert.removeClassName('hidden')
			if (tapTempo.currentBeat == 1) 
				tapTempo.elements.metroVisualAlert.addClassName('down')
			else 
				tapTempo.elements.metroVisualAlert.removeClassName('down')
			tapTempo.elements.metroVisualAlertNum.update(tapTempo.currentBeat)
		} else
			tapTempo.elements.metroVisualAlert.addClassName('hidden')
		
		if (tapTempo.metroAlertVibration) {
			Mojo.Controller.getAppController().playSoundNotification("vibrate", "");
		}
		if (tapTempo.metroAlertAudible) {
			if (tapTempo.currentBeat == 1)
				this.playAccentClick();
			else
				this.playClick();
		}
	}
	if (tapTempo.metroIsRunning)
		this.runMetronome();
}
MainAssistant.prototype.playAccentClick = function(){
	this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
		method: "playFeedback",
		parameters: {
			name: "dtmf_1"
		},
		onSuccess: this.successfulClick.bind(this),
		onFailure: this.failedClick.bind(this)
	})
}

MainAssistant.prototype.playClick = function(){
	this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
		method: "playFeedback",
		parameters: {
			name: "dtmf_2"
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