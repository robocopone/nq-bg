function DashboardSceneAssistant(inStage) {
	this.parentStage = inStage;
}

DashboardSceneAssistant.prototype.setup = function() {
	this.controller.listen(this.controller.get('dashboard'), Mojo.Event.tap, this.dashTap.bindAsEventListener(this));
}

DashboardSceneAssistant.prototype.dashTap = function () {
	Mojo.Controller.getAppController().launch('net.bradleygraber.gpsdashboardplus', {}, {}, {});
}

DashboardSceneAssistant.prototype.activate = function(event){}

DashboardSceneAssistant.prototype.deactivate = function(event) {}

DashboardSceneAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening(this.controller.get('dashboard'), Mojo.Event.tap, this.dashTap.bindAsEventListener(this));
}
