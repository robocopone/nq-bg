function RecordsAssistant() {
}

RecordsAssistant.prototype.setup = function() {
	this.controller.get('alltimeHigh').update(gpsDashboard.alltimeHigh.data.altitude);
}

RecordsAssistant.prototype.activate = function(event) {
}


RecordsAssistant.prototype.deactivate = function(event) {
}

RecordsAssistant.prototype.cleanup = function(event) {
}
