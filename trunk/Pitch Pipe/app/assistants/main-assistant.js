tapTempo = {}
tapTempo.pitchKey = 'A'
tapTempo.pitchOctave = 4;
tapTempo.pitchDuration = 5;
tapTempo.pitchInitialAudioAttempt = true;
tapTempo.initialRun = true;

tapTempo.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberPitchPipe");
		storedData = this.cookieData.get();
		if (storedData && storedData.version >= "1.0.0") {
			tapTempo.pitchKey = storedData.pitchKey
			tapTempo.pitchOctave = storedData.pitchOctave
			tapTempo.pitchDuration = storedData.pitchDuration
			tapTempo.pitchInitialAudioAttempt = storedData.pitchInitialAudioAttempt
			tapTempo.initialRun = storedData.initialRun
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.0.0",
			pitchKey: tapTempo.pitchKey,
			pitchOctave: tapTempo.pitchOctave,
			pitchDuration: tapTempo.pitchDuration,
			pitchInitialAudioAttempt: tapTempo.pitchInitialAudioAttempt,
			initialRun: tapTempo.initialRun,
		});		
	}
});


function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	tapTempo.cookie.initialize()
	
	var local = {}
	
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
	}, {
		buttonLabel: $L("Go"),
		buttonClass: 'affirmative',
		disabled: false
	});
	this.controller.listen("pitchStart", Mojo.Event.tap, this.pitchStart.bindAsEventListener(this))	
	this.controller.listen("pitchDurationSelector", Mojo.Event.propertyChange, this.pitchDurationSelector.bindAsEventListener(this));
	this.controller.listen("pitchKeySelector", Mojo.Event.propertyChange, this.pitchKeySelector.bindAsEventListener(this));
	this.controller.listen("pitchOctaveSelector", Mojo.Event.propertyChange, this.pitchOctaveSelector.bindAsEventListener(this));
	if (tapTempo.initialRun)
		this.initialPrompt();
}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening("pitchStart", Mojo.Event.tap, this.pitchStart.bindAsEventListener(this))	
	this.controller.stopListening("pitchKeySelector", Mojo.Event.propertyChange, this.pitchKeySelector.bindAsEventListener(this));
	this.controller.stopListening("pitchOctaveSelector",Mojo.Event.propertyChange, this.pitchOctaveSelector.bindAsEventListener(this));
	this.controller.stopListening("pitchDurationSelector", Mojo.Event.propertyChange, this.pitchDurationSelector.bindAsEventListener(this));
}


MainAssistant.prototype.activate = function(event) {

}

MainAssistant.prototype.deactivate = function(event) {

}

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

/*
 * Initial Run Prompt
 */
MainAssistant.prototype.initialPrompt = function () {
	this.controller.showAlertDialog({
		onChoose: this.doInitialChoice,
		title: $L("Extended Capabilities Available"),
		message: $L("Want more than just a Pitch Pipe?  Musician's Toolbox has this app, plus a metronome and a way to measure any song's tempo by tapping along!  Would you like to check out Musician's Toolbox?"),
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

