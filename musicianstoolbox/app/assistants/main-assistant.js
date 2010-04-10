var tapTempo = {}

tapTempo.elements = {}

tapTempo.time = new Date().getTime() - 10000
tapTempo.duration = {};
tapTempo.resetDuration = 2;
tapTempo.currentNum = 5;
tapTempo.currentLock = false
tapTempo.avgLock = false

tapTempo.metroTempo = 100;
tapTempo.metroMeasure = 4;
tapTempo.metroIsRunning = false;
tapTempo.metroAlertVisable = true;
tapTempo.metroAlertAudible = false;
tapTempo.metroAlertVibration = false;
tapTempo.metroInitialAudioAttempt = true;

tapTempo.pitchKey = 'A'
tapTempo.pitchOctave = 4;
tapTempo.pitchDuration = 5;

tapTempo.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberTapTempo");
		storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.1.0") {
			tapTempo.resetDuration = storedData.resetDuration;
			tapTempo.currentNum = storedData.currentNum;
			tapTempo.metroTempo = storedData.metroTempo
			tapTempo.metroAlertVisable = storedData.metroAlertVisable
			tapTempo.metroAlertAudible = storedData.metroAlertAudible
			tapTempo.metroAlertVibration = storedData.metroAlertVibration
			tapTempo.metroMeasure = storedData.metroMeasure
			tapTempo.metroInitialAudioAttempt = storedData.metroInitialAudioAttempt
			tapTempo.pitchKey = storedData.pitchKey
			tapTempo.pitchOctave = storedData.pitchOctave
			tapTempo.pitchDuration = storedData.pitchDuration
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.1.0",
			resetDuration: tapTempo.resetDuration,
			currentNum: tapTempo.currentNum,
			metroTempo: tapTempo.metroTempo,
			metroAlertVisable: tapTempo.metroAlertVisable,
			metroAlertAudible: tapTempo.metroAlertAudible,
			metroAlertVibration: tapTempo.metroAlertVibration,
			metroMeasure: tapTempo.metroMeasure,
			metroInitialAudioAttempt: tapTempo.metroInitialAudioAttempt,
			pitchKey: tapTempo.pitchKey,
			pitchOctave: tapTempo.pitchOctave,
			pitchDuration: tapTempo.pitchDuration,
		});		
	}
});


function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	// Load the MediaExtension library
	this.libs = MojoLoader.require({ name: "mediaextension", version: "1.0"});
	
	var local = {}
	
	tapTempo.cookie.initialize();
	tapTempo.elements.avgTempo = this.controller.get('avgTempo')
	tapTempo.elements.currentTempo = this.controller.get('currentTempo')
	
	tapTempo.elements.tapTempoArea = this.controller.get('tapTempoArea')
	tapTempo.elements.pitchPipeArea = this.controller.get('pitchPipeArea')
	tapTempo.elements.metronomeArea = this.controller.get('metronomeArea')

	tapTempo.elements.currentLock = this.controller.get('currentLock')
	tapTempo.elements.avgLock = this.controller.get('avgLock')
	
	tapTempo.elements.metroTitle = this.controller.get('metroTitle')
	tapTempo.elements.metroAvgGroup = this.controller.get('metroAvgGroup')
	tapTempo.elements.metroCurrentGroup = this.controller.get('metroCurrentGroup')
	tapTempo.elements.metroAvgTempo = this.controller.get('metroAvgTempo')
	tapTempo.elements.metroCurrentTempo = this.controller.get('metroCurrentTempo')
	tapTempo.elements.metroStartStop = this.controller.get('metroStartStop')
	tapTempo.elements.metroVisualAlert = this.controller.get('metroVisualAlert')
	tapTempo.elements.metroVisualAlertNum = this.controller.get('metroVisualAlertNum')
	
	tapTempo.elements.pitchTitle = this.controller.get('pitchTitle')

	this.controller.setupWidget('resetDuration2', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 5,
	}, {
		value: tapTempo.resetDuration
	});

	this.controller.setupWidget('resetDuration', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 5,
	}, {
		value: tapTempo.resetDuration
	});

	this.controller.setupWidget('currentNumPicker', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 20,
	}, {
		value: tapTempo.currentNum
	});

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

	this.controller.setupWidget('currentLock', {
		trueLabel: $L("Locked"),
		falseLabel: $L("Ready")
	}, this.currentLockModel = {
		value: false,
	});

	this.controller.setupWidget('avgLock', {
		trueLabel: $L("Locked"),
		falseLabel: $L("Ready")
	}, this.avgLockModel = {
		value: false,
	});

	// Metro Start/Stop Button Widget
	this.controller.setupWidget('metroStartStop', {
		type: Mojo.Widget.defaultButton
	}, this.metroStartStopModel = {
		buttonLabel: $L("Start"),
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

	//Pitch Key select
	this.controller.setupWidget("pitchKeySelector", {
		labelPlacement: Mojo.Widget.labelPlacementLeft,
		label: $L("Key"),
		choices: [{
			label: $L("A"),
			value: 'A'
		}, {
			label: $L('A#/Bb'),
			value: 'A#'
		}, {
			label: $L("B"),
			value: 'B'
		}, {
			label: $L("C"),
			value: 'C'
		}, {
			label: $L("C#/Db"),
			value: 'C#'
		}, {
			label: $L("D"),
			value: 'D'
		}, {
			label: $L("D#/Eb"),
			value: 'D#'
		}, {
			label: $L("E"),
			value: 'E'
		}, {
			label: $L("F"),
			value: 'F'
		}, {
			label: $L("F#/Gb"),
			value: 'F#'
		}, {
			label: $L("G"),
			value: 'G'
		}, {
			label: $L("G#/Ab"),
			value: 'G#'
		}, ],
	}, {
		value: tapTempo.pitchKey,
		disabled: false
	});
	//Pitch Key select
	this.controller.setupWidget("pitchOctaveSelector", {
		labelPlacement: Mojo.Widget.labelPlacementRight,
		label: $L("Octave"),
		choices: [{
			label: $L("0"),
			value: 0
		}, {
			label: $L('1'),
			value: 1
		}, {
			label: $L("2"),
			value: 2
		}, {
			label: $L("3"),
			value: 3
		}, {
			label: $L("4"),
			value: 4
		}, {
			label: $L("5"),
			value: 5
		}, {
			label: $L("6"),
			value: 6
		}, {
			label: $L("7"),
			value: 7
		}, {
			label: $L("8"),
			value: 8
		}, ],
	}, {
		value: tapTempo.pitchOctave,
		disabled: false
	});

	this.controller.setupWidget('pitchDurationSelector', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 20,
	}, {
		value: tapTempo.pitchDuration
	});

	// Pitch Start Button Widget
	this.controller.setupWidget('pitchStart', {
		type: Mojo.Widget.defaultButton
	}, this.metroStartStopModel = {
		buttonLabel: $L("Go"),
		buttonClass: 'affirmative',
		disabled: false
	});

	this.unlockFlick = Mojo.Function.debounce(undefined, this.doUnlockFlick.bind(this), .1);
	this.lock = Mojo.Function.debounce(undefined, this.doLock.bind(this), tapTempo.resetDuration);
	this.runMetronome = Mojo.Function.debounce(undefined, this.doRunMetronome.bind(this), .01);
	this.loopAudio = Mojo.Function.debounce(undefined, this.doLoopAudio.bind(this), .25);

	this.controller.listen("pitchStart", Mojo.Event.tap, this.pitchStart.bindAsEventListener(this))	
	this.controller.listen("pitchDurationSelector", Mojo.Event.propertyChange, this.pitchDurationSelector.bindAsEventListener(this));
	this.controller.listen("pitchKeySelector", Mojo.Event.propertyChange, this.pitchKeySelector.bindAsEventListener(this));
	this.controller.listen("pitchOctaveSelector",Mojo.Event.propertyChange, this.pitchOctaveSelector.bindAsEventListener(this));
	this.controller.listen(this.controller.get("metroAlertVisable"), Mojo.Event.propertyChange, this.metroAlertVisableChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get("metroAlertAudible"), Mojo.Event.propertyChange, this.metroAlertAudibleChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get("metroAlertVibration"), Mojo.Event.propertyChange, this.metroAlertVibrationChanged.bindAsEventListener(this));
	this.controller.listen(tapTempo.elements.metroStartStop, Mojo.Event.tap, this.metroStartStop.bindAsEventListener(this))	
	this.controller.listen(tapTempo.elements.metroAvgGroup, Mojo.Event.tap, this.tapMetroAvgTempo.bindAsEventListener(this))	
	this.controller.listen(tapTempo.elements.metroCurrentGroup, Mojo.Event.tap, this.tapMetroCurrentTempo.bindAsEventListener(this))	
	this.controller.listen(tapTempo.elements.avgLock,Mojo.Event.propertyChange,this.lockAvg.bindAsEventListener(this));
	this.controller.listen(tapTempo.elements.currentLock,Mojo.Event.propertyChange,this.lockCurrent.bindAsEventListener(this));
	this.controller.listen(this.controller.document, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.listen(this.controller.get('setMetroMeasure'),Mojo.Event.propertyChange, this.setMetroMeasureChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get('setMetroTempo'),Mojo.Event.propertyChange, this.setMetroTempoChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get('resetDuration'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('resetDuration2'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('currentNumPicker'),Mojo.Event.propertyChange, this.currentNumPicker.bindAsEventListener(this));
	this.controller.listen(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.listen(tapTempo.elements.tapTempoArea, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
}
MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening("pitchStart", Mojo.Event.tap, this.pitchStart.bindAsEventListener(this))	
	this.controller.stopListening("pitchKeySelector", Mojo.Event.propertyChange, this.pitchKeySelector.bindAsEventListener(this));
	this.controller.stopListening("pitchOctaveSelector",Mojo.Event.propertyChange, this.pitchOctaveSelector.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('setMetroMeasure'),Mojo.Event.propertyChange, this.setMetroMeasureChanged.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('setMetroTempo'),Mojo.Event.propertyChange, this.setMetroTempoChanged.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get("metroAlertVisable"), Mojo.Event.propertyChange, this.metroAlertVisableChanged.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get("metroAlertAudible"), Mojo.Event.propertyChange, this.metroAlertAudibleChanged.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get("metroAlertVibration"), Mojo.Event.propertyChange, this.metroAlertVibrationChanged.bindAsEventListener(this));
	this.controller.stopListening(tapTempo.elements.metroStartStop, Mojo.Event.tap, this.metroStartStop.bindAsEventListener(this))	
	this.controller.stopListening(tapTempo.elements.metroAvgGroup, Mojo.Event.tap, this.tapMetroAvgTempo.bindAsEventListener(this))	
	this.controller.stopListening(tapTempo.elements.metroCurrentGroup, Mojo.Event.tap, this.tapMetroCurrentTempo.bindAsEventListener(this))	
	this.controller.stopListening(tapTempo.elements.avgLock,Mojo.Event.propertyChange,this.lockAvg.bindAsEventListener(this));
	this.controller.stopListening(tapTempo.elements.currentLock,Mojo.Event.propertyChange,this.lockCurrent.bindAsEventListener(this));
	this.controller.stopListening(this.controller.document, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.stopListening(this.controller.get('currentNumPicker'),Mojo.Event.propertyChange, this.currentNumPicker.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('resetDuration'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('resetDuration2'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.stopListening(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.stopListening(tapTempo.elements.tapTempoArea, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.pitchStart = function () {
	var local = {}
	local.key = tapTempo.pitchKey + tapTempo.pitchOctave
	
//	tapTempo.extAudio = this.libs.mediaextension.MediaExtension.getInstance(tapTempo.audio);
//	tapTempo.extAudio.audioClass = "media";
	this.mediaFile = new Audio();
	this.mediaFile.src = Mojo.appPath + "/audio/" + local.key + ".wav"

	this.mediaFile.currentTime = 0.0
	this.mediaFile.play()

	tapTempo.pitchLoopDurationLeft = tapTempo.pitchDuration * 2
	this.loopAudio()
}
MainAssistant.prototype.doLoopAudio = function () {
//	Mojo.Log.error(tapTempo.pitchLoopDurationLeft)
//	tapTempo.audio.currentTime = 0.0
//	tapTempo.pitchLoopDurationLeft--
//	if (tapTempo.pitchLoopDurationLeft > 1)
//		this.loopAudio()
}
MainAssistant.prototype.pitchDurationSelector = function (event) {
	tapTempo.pitchDuration = event.value
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.pitchKeySelector = function (event) {
	tapTempo.pitchKey = event.value
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.pitchOctaveSelector = function (event) {
	tapTempo.pitchOctave = event.value
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
			tapTempo.elements.metroVisualAlertNum.addClassName('down')
		}
		if (tapTempo.metroAlertAudible) {
			this.playDownClick();
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
			if (tapTempo.currentBeat == 1) 
				tapTempo.elements.metroVisualAlertNum.addClassName('down')
			else 
				tapTempo.elements.metroVisualAlertNum.removeClassName('down')
			tapTempo.elements.metroVisualAlertNum.update(tapTempo.currentBeat)
		}
		if (tapTempo.metroAlertVibration) {
			Mojo.Controller.getAppController().playSoundNotification("vibrate", "");
		}
		if (tapTempo.metroAlertAudible) {
			if (tapTempo.currentBeat == 1)
				this.playDownClick();
			else
				this.playClick();
		}
	}
	if (tapTempo.metroIsRunning)
		this.runMetronome();
}
MainAssistant.prototype.playDownClick = function(){
	this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
		method: "playFeedback",
		parameters: {
			name: "dtmf_1"
		},
		onSuccess: {},
		onFailure: {}
	})
}

MainAssistant.prototype.playClick = function(){
	this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
		method: "playFeedback",
		parameters: {
			name: "dtmf_2"
		},
		onSuccess: {},
		onFailure: {}
	})
}

MainAssistant.prototype.lagFighter = function () {
	this.controller.stageController.setWindowProperties({
		"blockScreenTimeout": true,
		"fastAccelerometer": false,
	});
	this.controller.stageController.setWindowProperties({
		"fastAccelerometer": true,
	});
}
MainAssistant.prototype.tapMetroAvgTempo = function () {
	if (tapTempo.metroAvgBPM) {
		tapTempo.metroTempo = this.setMetroTempoModel.value = parseFloat(tapTempo.metroAvgBPM).toFixed();
		this.controller.modelChanged(this.setMetroTempoModel, this);
	}
	tapTempo.cookie.storeCookie()
}

MainAssistant.prototype.tapMetroCurrentTempo = function () {
	if (tapTempo.metroCurrentBPM) {
		tapTempo.metroTempo = this.setMetroTempoModel.value = parseFloat(tapTempo.metroCurrentBPM).toFixed();
		this.controller.modelChanged(this.setMetroTempoModel, this);
	}
	tapTempo.cookie.storeCookie()
}

MainAssistant.prototype.doUnlockFlick = function () {
	tapTempo.flickLock = false;
}

MainAssistant.prototype.lockCurrent = function(event) {
	tapTempo.flickLock = true;
	tapTempo.currentLock = event.value;
	this.unlockFlick();
}
MainAssistant.prototype.lockAvg = function (event) {
	tapTempo.flickLock = true;
	tapTempo.avgLock = event.value;
	this.unlockFlick();
}
MainAssistant.prototype.catchFlick = function(event) {
	if (tapTempo.flickLock)
		return;
	var local = {}
	local.pitchPipeAreaLeft = parseInt(tapTempo.elements.pitchPipeArea.getStyle('left'))
	local.tapTempoAreaLeft = parseInt(tapTempo.elements.tapTempoArea.getStyle('left'))
	local.metronomeAreaLeft = parseInt(tapTempo.elements.metronomeArea.getStyle('left'))
	
	//Move Left
	if (event.velocity.x > 0 && local.pitchPipeAreaLeft != 0) {
		tapTempo.elements.pitchPipeArea.setStyle({ left: local.pitchPipeAreaLeft + 320 + 'px'})
		tapTempo.elements.tapTempoArea.setStyle({ left: local.tapTempoAreaLeft + 320 + 'px'})
		tapTempo.elements.metronomeArea.setStyle({ left: local.metronomeAreaLeft + 320 + 'px'})
	}
	//Move Right
	if (event.velocity.x < 0 && local.metronomeAreaLeft != 0) {
		tapTempo.elements.pitchPipeArea.setStyle({ left: local.pitchPipeAreaLeft - 320 + 'px'})
		tapTempo.elements.tapTempoArea.setStyle({ left: local.tapTempoAreaLeft - 320 + 'px'})
		tapTempo.elements.metronomeArea.setStyle({ left: local.metronomeAreaLeft - 320 + 'px'})
	}
}
MainAssistant.prototype.reset = function () {
	tapTempo.duration = {};
}
MainAssistant.prototype.resetDuration = function (event) {
	tapTempo.resetDuration = event.value;
	this.lock = Mojo.Function.debounce(undefined, this.doLock.bind(this), tapTempo.resetDuration);
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.currentNumPicker = function (event) {
	tapTempo.currentNum = event.value;
	tapTempo.cookie.storeCookie();
}

MainAssistant.prototype.keyPressed = function (event) {
	if ((tapTempo.currentLock && tapTempo.avgLock) || 
		parseInt(tapTempo.elements.tapTempoArea.getStyle('left')) != 0)
		return;
	var local = {}
	var x = 1;

	local.totalDuration = 0;
	local.time = new Date().getTime()
	
	local.currentTime = local.time - tapTempo.time;

	tapTempo.time = new Date().getTime();
		
	if (local.currentTime > tapTempo.resetDuration * 1000) {
		this.reset();
		local.currentTime = 0;
	}

	for (x; tapTempo.duration[x]; x++)
		local.totalDuration += tapTempo.duration[x]
		
	local.totalDuration += tapTempo.duration[x] = local.currentDuration = local.currentTime;
	
	for (var y = x-1; y > x - tapTempo.currentNum && tapTempo.duration[y]; y--)
		local.currentDuration += tapTempo.duration[y]

	if (x < tapTempo.currentNum)
		local.currentCount = x
	else
		local.currentCount = tapTempo.currentNum

	if (!tapTempo.avgLock)
		tapTempo.avgBPM = ((x / (local.totalDuration / 1000)) * 60).toFixed(1)
	if (!tapTempo.currentLock)
		tapTempo.currentBPM = ((local.currentCount / (local.currentDuration / 1000)) * 60).toFixed(1)
	
	if (!tapTempo.duration[1]) {
		if (!tapTempo.avgLock)
			tapTempo.elements.avgTempo.update("First Beat")
		if (!tapTempo.currentLock)
			tapTempo.elements.currentTempo.update("First Beat")
	}
	else {
		if (tapTempo.avgBPM && tapTempo.avgBPM < 100000)
			tapTempo.elements.avgTempo.update(tapTempo.avgBPM + " bpm")
		if (tapTempo.currentBPM && tapTempo.currentBPM < 100000)
			tapTempo.elements.currentTempo.update(tapTempo.currentBPM + " bpm")
	}

	this.lock();
}
MainAssistant.prototype.doLock = function () {
	tapTempo.avgLock = true;
	tapTempo.currentLock = true;
	this.avgLockModel.value = true;
	this.currentLockModel.value = true;
	this.controller.modelChanged(this.avgLockModel, this);
	this.controller.modelChanged(this.currentLockModel, this);
	if (tapTempo.avgBPM < 100000) {
		tapTempo.elements.metroAvgTempo.update(tapTempo.avgBPM + " bpm")
		tapTempo.metroAvgBPM = tapTempo.avgBPM
	}
	if (tapTempo.currentBPM < 100000){
		tapTempo.elements.metroCurrentTempo.update(tapTempo.currentBPM + " bpm")
		tapTempo.metroCurrentBPM = tapTempo.currentBPM
	}
}
MainAssistant.prototype.activate = function(event){

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