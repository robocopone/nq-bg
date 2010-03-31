var tapTempo = {}

tapTempo.elements = {}

tapTempo.time = new Date().getTime()
tapTempo.count = 0;
tapTempo.duration = 0;

function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	tapTempo.elements.tempo = this.controller.get('tempo')
	tapTempo.elements.accel = this.controller.get('accel')
	this.controller.listen(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.listen(this.controller.document, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
}

MainAssistant.prototype.keyPressed = function (event) {
	var local = {}
	local.time = new Date().getTime()
	
	currentDuration = local.time - tapTempo.time;
	if (tapTempo.count != 0 && currentDuration < 2000)
		tapTempo.duration += currentDuration;
	else if (currentDuration > 2000 ) {
		tapTempo.count = 0;
		tapTempo.duration = 0;
	}
	tapTempo.count++;
	tapTempo.time = new Date().getTime();
	
	if (tapTempo.duration == 0)
		tapTempo.elements.tempo.update("First Beat")
	else
		tapTempo.elements.tempo.update((((tapTempo.count - 1) / (tapTempo.duration / 1000)) * 60).toFixed(1) + " bpm")
}

MainAssistant.prototype.activate = function(event) {

}

MainAssistant.prototype.deactivate = function(event) {

}

MainAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressed.bindAsEventListener(this))
	this.controller.stopListening(this.controller.document, Mojo.Event.tap, this.keyPressed.bindAsEventListener(this))
}
