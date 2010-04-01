var tapTempo = {}

tapTempo.elements = {}

tapTempo.time = new Date().getTime()
tapTempo.count = 0;
tapTempo.duration = 0;
tapTempo.prevDuration = 0;
tapTempo.resetDuration = 2;

tapTempo.cookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberTapTempo");
		this.storeCookie();
		storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.1.0") {
			tapTempo.resetDuration = storedData.resetDuration;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		this.cookieData.put({  
			version: "1.1.0",
			resetDuration: tapTempo.resetDuration,
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


	this.controller.listen(this.controller.get('resetDuration'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.get('resetDuration2'),Mojo.Event.propertyChange, this.resetDuration.bindAsEventListener(this));
	this.controller.listen(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.listen(this.controller.document, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
}

MainAssistant.prototype.reset = function () {
	tapTempo.count = 0;
	tapTempo.duration = 0;
	tapTempo.prevDuration = 0;
	tapTempo.initialBPM = 0;
}
MainAssistant.prototype.resetDuration = function (event) {
	tapTempo.resetDuration = event.value;
	tapTempo.cookie.storeCookie();
}

MainAssistant.prototype.keyPressed = function (event) {
	var local = {}
	local.time = new Date().getTime()
	
	local.currentDuration = local.time - tapTempo.time;

	if (tapTempo.count != 0 && local.currentDuration < (tapTempo.resetDuration * 1000))
		tapTempo.duration += local.currentDuration;
	else if (local.currentDuration > (tapTempo.resetDuration * 1000) )
		this.reset();

	tapTempo.count++;
	
	local.avgBPM = (((tapTempo.count - 1) / (tapTempo.duration / 1000)) * 60).toFixed(1)
	local.currentBPM = ((2 / ((local.currentDuration + tapTempo.prevDuration) / 1000)) * 60).toFixed(1)
	
	if (tapTempo.duration == 0) 
		tapTempo.elements.avgTempo.update("First Beat")
	else {
		tapTempo.elements.avgTempo.update(local.avgBPM + " bpm")
		tapTempo.elements.currentTempo.update(local.currentBPM + " bpm")
	}

	tapTempo.time = new Date().getTime();
	tapTempo.prevDuration = local.currentDuration;
}

MainAssistant.prototype.activate = function(event) {

}

MainAssistant.prototype.deactivate = function(event) {

}

MainAssistant.prototype.cleanup = function(event) {
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

	if (event.type == Mojo.Event.commandEnable &&
	   (event.command == Mojo.Menu.prefsCmd)) 
	{	event.stopPropagation(); 
	}

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case Mojo.Menu.helpCmd:
				Mojo.Controller.stageController.pushAppSupportInfoScene();
				break;
			case Mojo.Menu.prefsCmd:
				Mojo.Controller.stageController.pushScene('preferences');
				break;
		}
	}
}
