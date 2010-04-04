var tapTempo = {}

tapTempo.elements = {}

tapTempo.time = new Date().getTime() - 10000
tapTempo.duration = {};
tapTempo.resetDuration = 2;
tapTempo.currentNum = 5;

tapTempo.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberTapTempo");
		storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.1.0") {
			tapTempo.resetDuration = storedData.resetDuration;
			tapTempo.currentNum = storedData.currentNum;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.1.0",
			resetDuration: tapTempo.resetDuration,
			currentNum: tapTempo.currentNum,
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
	
	tapTempo.elements.tapTempoArea = this.controller.get('tapTempoArea')
	tapTempo.elements.pitchPipeArea = this.controller.get('pitchPipeArea')
	tapTempo.elements.metronomeArea = this.controller.get('metronomeArea')

	this.controller.setupWidget('resetDuration2', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 5,
	}, model = {
		value: tapTempo.resetDuration
	});

	this.controller.setupWidget('resetDuration', {
		label: $L(" "),
		modelProperty: 'value',
		min: 1,
		max: 5,
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

	this.controller.setupWidget('currentLock', {
		trueLabel: $L("Locked"),
		falseLabel: $L("Ready")
	}, model = {
		value: false,
	});

	this.controller.setupWidget('avgLock', {
		trueLabel: $L("Locked"),
		falseLabel: $L("Ready")
	}, model = {
		value: false,
	});

	this.controller.listen(tapTempo.elements.tapTempoArea, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.listen(tapTempo.elements.pitchPipeArea, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.listen(tapTempo.elements.metronomeArea, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.listen(this.controller.get('resetDuration'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('resetDuration2'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('currentNumPicker'),Mojo.Event.propertyChange, this.currentNumPicker.bindAsEventListener(this));
	this.controller.listen(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.listen(tapTempo.elements.tapTempoArea, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
}
MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening(tapTempo.elements.pitchPipeArea, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.stopListening(tapTempo.elements.metronomeArea, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.stopListening(tapTempo.elements.tapTempoArea, Mojo.Event.flick, this.catchFlick.bindAsEventListener(this))
	this.controller.stopListening(this.controller.get('currentNumPicker'),Mojo.Event.propertyChange, this.currentNumPicker.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('resetDuration'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('resetDuration2'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.stopListening(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.stopListening(this.controller.document, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
	tapTempo.cookie.storeCookie();
}

MainAssistant.prototype.catchFlick = function(event) {
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

	tapTempo.time = new Date().getTime();
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
