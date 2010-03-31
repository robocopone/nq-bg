function StageAssistant() {
}

StageAssistant.prototype.setup = function(){
	this.controller.setWindowOrientation('left');
	this.controller.setWindowProperties({
		fastAccelerometer: true
	});
	this.controller.pushScene({
		name: "main",
		transition: Mojo.Transition.crossFade,
		disableSceneScroller: true
	});
}
