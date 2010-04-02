function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	this.controller.pushScene({
		name: "main",
		transition: Mojo.Transition.crossFade,
		disableSceneScroller: true
	});
};
