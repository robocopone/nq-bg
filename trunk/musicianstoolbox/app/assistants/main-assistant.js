var tapTempo = {}

tapTempo.elements = {}

tapTempo.time = new Date().getTime() - 100000
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

tapTempo.pitchKey = 'A'
tapTempo.pitchOctave = 4;
tapTempo.pitchDuration = 5;
tapTempo.pitchInitialAudioAttempt = true;

tapTempo.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberTapTempo");
		storedData = this.cookieData.get();
		if (storedData && storedData.version >= "1.1.0") {
			tapTempo.resetDuration = storedData.resetDuration;
			tapTempo.currentNum = storedData.currentNum;
			tapTempo.metroTempo = storedData.metroTempo
			tapTempo.metroAlertVisable = storedData.metroAlertVisable
			tapTempo.metroAlertAudible = storedData.metroAlertAudible
			tapTempo.metroAlertVibration = storedData.metroAlertVibration
			tapTempo.metroMeasure = storedData.metroMeasure
			tapTempo.metroInitialAudioAttempt = storedData.metroInitialAudioAttempt
			tapTempo.metroBeatSetup = storedData.metroBeatSetup.slice(0);
			tapTempo.initialized = storedData.initialized
			tapTempo.pitchKey = storedData.pitchKey
			tapTempo.pitchOctave = storedData.pitchOctave
			tapTempo.pitchDuration = storedData.pitchDuration
		}
		if (storedData && storedData.version == "1.1.1") {
			tapTempo.pitchInitialAudioAttempt = storedData.pitchInitialAudioAttempt
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.1.1",
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
			metroBeatSetup: tapTempo.metroBeatSetup.slice(0),
			initialized: tapTempo.initialized,
			pitchInitialAudioAttempt: tapTempo.pitchInitialAudioAttempt,
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

	// Load the MediaExtension library
	try{ this.libs = MojoLoader.require({ name: "mediaextension", version: "1.0"}); }
	catch(e){ Mojo.Log.error("Cannot load mediaextension library: "+e.message); }	

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
	
	tapTempo.elements.pitchTitle = this.controller.get('pitchTitle')

	this.controller.setupWidget('resetDuration2', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 15,
	}, {
		value: tapTempo.resetDuration
	});

	this.controller.setupWidget('resetDuration', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 15,
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

	// Metro Beat setup Button Widget
	this.controller.setupWidget('metroBeatSetupButton', {
		type: Mojo.Widget.defaultButton
	}, {
		buttonLabel: $L("Setup"),
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
	}, this.pitchDurationSelectorModel = {
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
//	this.replay = Mojo.Function.debounce(undefined, this.doReplay.bind(this), .25);

	this.controller.listen("metroBeatSetupOkButton", Mojo.Event.tap, this.metroBeatSetupOkButton.bindAsEventListener(this))
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
	this.controller.listen("pitchStart", Mojo.Event.tap, this.pitchStart.bindAsEventListener(this))	
	this.controller.listen("pitchDurationSelector", Mojo.Event.propertyChange, this.pitchDurationSelector.bindAsEventListener(this));
	this.controller.listen("pitchKeySelector", Mojo.Event.propertyChange, this.pitchKeySelector.bindAsEventListener(this));
	this.controller.listen("pitchOctaveSelector",Mojo.Event.propertyChange, this.pitchOctaveSelector.bindAsEventListener(this));
	this.controller.listen(tapTempo.elements.avgLock,Mojo.Event.propertyChange,this.lockAvg.bindAsEventListener(this));
	this.controller.listen(tapTempo.elements.currentLock,Mojo.Event.propertyChange,this.lockCurrent.bindAsEventListener(this));
	this.controller.listen(this.controller.document, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.listen(this.controller.get("metroAlertVisable"), Mojo.Event.propertyChange, this.metroAlertVisableChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get("metroAlertAudible"), Mojo.Event.propertyChange, this.metroAlertAudibleChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get("metroAlertVibration"), Mojo.Event.propertyChange, this.metroAlertVibrationChanged.bindAsEventListener(this));
	this.controller.listen(tapTempo.elements.metroStartStop, Mojo.Event.tap, this.metroStartStop.bindAsEventListener(this))	
	this.controller.listen(tapTempo.elements.metroAvgGroup, Mojo.Event.tap, this.tapMetroAvgTempo.bindAsEventListener(this))	
	this.controller.listen(tapTempo.elements.metroCurrentGroup, Mojo.Event.tap, this.tapMetroCurrentTempo.bindAsEventListener(this))	
	this.controller.listen(this.controller.get('setMetroMeasure'),Mojo.Event.propertyChange, this.setMetroMeasureChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get('setMetroTempo'),Mojo.Event.propertyChange, this.setMetroTempoChanged.bindAsEventListener(this));
	this.controller.listen(this.controller.get('resetDuration'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('resetDuration2'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('currentNumPicker'),Mojo.Event.propertyChange, this.currentNumPicker.bindAsEventListener(this));
	this.controller.listen(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.listen(tapTempo.elements.tapTempoArea, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))

//	this.pitchAudio = this.controller.get('pitchAudio');
//	this.pitchExtAudio = this.libs.mediaextension.MediaExtension.getInstance(this.pitchAudio);
//	this.pitchExtAudio.audioClass = 'media';
//	this.pitchAudio.play();
//	this.audioSetup();
}
MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening("pitchStart", Mojo.Event.tap, this.pitchStart.bindAsEventListener(this))	
	this.controller.stopListening("pitchKeySelector", Mojo.Event.propertyChange, this.pitchKeySelector.bindAsEventListener(this));
	this.controller.stopListening("pitchOctaveSelector",Mojo.Event.propertyChange, this.pitchOctaveSelector.bindAsEventListener(this));
	this.controller.stopListening("pitchDurationSelector", Mojo.Event.propertyChange, this.pitchDurationSelector.bindAsEventListener(this));
	this.controller.stopListening("metroBeatSetupOkButton", Mojo.Event.tap, this.metroBeatSetupOkButton.bindAsEventListener(this))
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


/*
MainAssistant.prototype.audioSetup = function() {
	this.pitchAudio.addEventListener('play', this.handleAudioEvent.bindAsEventListener(this), false);
	this.pitchAudio.addEventListener('ended', this.handleAudioEvent.bindAsEventListener(this), false); 
	this.pitchAudio.addEventListener('pause', this.handleAudioEvent.bindAsEventListener(this), false);
	this.pitchAudio.addEventListener('error', this.handleAudioEvent.bindAsEventListener(this), false);
	this.pitchAudio.addEventListener('canplay', this.handleAudioEvent.bindAsEventListener(this), false);

	this.pitchAudio.src = Mojo.appPath + "/audio/C0.wav";
}
MainAssistant.prototype.handleAudioEvent = function (event) {
	try{
		Mojo.Log.info("PlayAudioAssistant::eventHandlerMedia for event: ", event.type);
		switch(event.type){
			case 'canplay':
				Mojo.Log.error("Can Play event received")
				if (!event.target.paused)
					Mojo.Log.error("Should only be getting canplay if the state is paused");
				break;
			case 'ended':
				this.pitchAudio.currentTime = 0.0
				Mojo.Log.error("Ended event received")
				break;
			case 'error':
				Mojo.Log.error("Error occured on the media element: ", event.target.error);
				break;
			case 'pause':
				Mojo.Log.error("State went to pause.  presumably there was a call or some other such high priority interrupt");
				break;
			case 'play':
				Mojo.Log.error("Play event received")
				break;
			case 'stop':
				Mojo.Log.error("Stop event received")
				break;
			default:
				Mojo.Log.error("PlayAudioAssistant::eventHandlerMedia: Need a handler for ", event.type);
				break;
		}
	}
	catch(e){
		Mojo.Log.error("PlayAudioAssistant::eventHandlerMedia threw: ", Object.toJSON(e));
	}
}
MainAssistant.prototype.doReplay = function () {
	this.pitchAudio.currentTime = 0.0
}
*/

MainAssistant.prototype.pitchStart = function () {
	if (tapTempo.pitchInitialAudioAttempt)
		this.controller.showAlertDialog({
			onChoose: this.pitchInitialAudioAttempt,
			title: $L("Audio Alert"),
			message: $L('The volume buttons on the side will only control the volume of the tone while the tone is playing.  This is another audio issue that is out of my control'),
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

	var local = {}
	local.key = tapTempo.pitchKey + tapTempo.pitchOctave
	
	local.audio = new Audio()
	local.audio.src = Mojo.appPath + "/audio/" + local.key + ".mp3"
	local.audio.play()
}
MainAssistant.prototype.pitchInitialAudioAttempt = function(choice) {
	if (choice == 'no') {
		tapTempo.pitchInitialAudioAttempt = false;
	}
	tapTempo.cookie.storeCookie();
}

MainAssistant.prototype.pitchDurationSelector = function(event){
//	tapTempo.pitchDuration = event.value
//	tapTempo.cookie.storeCookie();
	this.controller.showAlertDialog({
		onChoose: this.metroInitialAudioAttempt,
		title: $L("Audio Disclaimer"),
		message: $L('I apologize, but until I can find a satisfactory way of looping audio with no pauses on the Pre I cannot support variable length tones.  If you\'re aware of an app that does, please let me know & I will look into it.'),
		choices: [{
			label: $L('Ok'),
			value: 'ok',
			type: 'affirmative'
		}, ]
	});
	this.pitchDurationSelectorModel.value = 5;
	this.controller.modelChanged(this.pitchDurationSelectorModel, this);
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
	if (tapTempo.currentBPM < 100000){
		tapTempo.elements.metroCurrentTempo.update(tapTempo.currentBPM + " bpm")
		tapTempo.metroCurrentBPM = tapTempo.currentBPM
	}
}
MainAssistant.prototype.lockAvg = function (event) {
	tapTempo.flickLock = true;
	tapTempo.avgLock = event.value;
	this.unlockFlick();
	if (tapTempo.avgBPM < 100000) {
		tapTempo.elements.metroAvgTempo.update(tapTempo.avgBPM + " bpm")
		tapTempo.metroAvgBPM = tapTempo.avgBPM
	}
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
