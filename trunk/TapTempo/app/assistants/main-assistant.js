var tapTempo = {}

tapTempo.elements = {}

tapTempo.time = new Date().getTime() - 10000
tapTempo.duration = {};
tapTempo.resetDuration = 2;
tapTempo.currentNum = 5;
tapTempo.initialRun = true;

tapTempo.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberTapTempo");
		storedData = this.cookieData.get();
		if (storedData && storedData.version >= "1.1.0") {
			tapTempo.resetDuration = storedData.resetDuration;
			tapTempo.currentNum = storedData.currentNum;
		}
		if (storedData && storedData.version == "1.1.3") {
			tapTempo.initialRun = storedData.initialRun
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.1.3",
			resetDuration: tapTempo.resetDuration,
			currentNum: tapTempo.currentNum,
			initialRun: tapTempo.initialRun,
		});		
	}
});


function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	var local = {}
	
	tapTempo.cookie.initialize();
	tapTempo.elements.avgTempo = this.controller.get('avgTempo')
	tapTempo.elements.currentTempo = this.controller.get('currentTempo')

	this.controller.setupWidget('resetDuration2', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 15,
	}, model = {
		value: tapTempo.resetDuration
	});

	this.controller.setupWidget('resetDuration', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 15,
	}, model = {
		value: tapTempo.resetDuration
	});

	this.controller.setupWidget('currentNumPicker', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 20,
	}, model = {
		value: tapTempo.currentNum
	});

	this.controller.listen(this.controller.get('resetDuration'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('resetDuration2'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('currentNumPicker'),Mojo.Event.propertyChange, this.currentNumPicker.bindAsEventListener(this));
	this.controller.listen(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.listen(this.controller.document, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
	if (tapTempo.initialRun)
		this.initialPrompt();
}

MainAssistant.prototype.reset = function () {
	tapTempo.duration = {};
}
MainAssistant.prototype.resetDuration = function (event) {
	tapTempo.resetDuration = event.value;
	tapTempo.cookie.storeCookie();
}
MainAssistant.prototype.currentNumPicker = function (event) {
	tapTempo.currentNum = event.value;
	tapTempo.cookie.storeCookie();
}

MainAssistant.prototype.keyPressed = function (event) {
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
	
	local.avgBPM = ((x / (local.totalDuration / 1000)) * 60).toFixed(1)
	local.currentBPM = ((local.currentCount / (local.currentDuration / 1000)) * 60).toFixed(1)
	
	if (!tapTempo.duration[1]) {
		tapTempo.elements.avgTempo.update("First Beat")
		tapTempo.elements.currentTempo.update("First Beat")
	}
	else {
		tapTempo.elements.avgTempo.update(local.avgBPM + " bpm")
		tapTempo.elements.currentTempo.update(local.currentBPM + " bpm")
	}
}

MainAssistant.prototype.activate = function(event) {

}

MainAssistant.prototype.deactivate = function(event) {

}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening(this.controller.get('currentNumPicker'),Mojo.Event.propertyChange, this.currentNumPicker.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('resetDuration'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('resetDuration2'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.stopListening(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.stopListening(this.controller.document, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
	tapTempo.cookie.storeCookie();
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

/*
 * Initial Run Prompt
 */
MainAssistant.prototype.initialPrompt = function () {
	this.controller.showAlertDialog({
		onChoose: this.doInitialChoice,
		title: $L("Extended Capabilities Available"),
		message: $L("Do you wish you had the ability to replay the tempo with a metronome?  Check out the Musician's Toolbox!"),
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

