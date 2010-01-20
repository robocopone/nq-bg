function RecordsAssistant() {
}

RecordsAssistant.prototype.setup = function() {
	if (gpsDashboard.units == 1)
		this.controller.get('alltimeTopSpeed').update(
			(gpsDashboard.alltimeTopSpeed.data.velocity * 2.23693629).toFixed(1) + $L(" mph"));
	if (gpsDashboard.units == 2)
		this.controller.get('alltimeTopSpeed').update(
			(gpsDashboard.alltimeTopSpeed.data.velocity * 3.6).toFixed(1) + $L(" kph"));
	if (gpsDashboard.units == 1) {
		this.controller.get('alltimeHigh').update(
			(gpsDashboard.alltimeHigh.data.altitude * 3.2808399).toFixed(1) + $L(" feet"));
		this.controller.get('alltimeLow').update(
			(gpsDashboard.alltimeLow.data.altitude * 3.2808399).toFixed(1) + $L(" feet"));
	}
	if (gpsDashboard.units == 2) {
		this.controller.get('alltimeHigh').update(gpsDashboard.alltimeHigh.data.altitude + $L(" meters"));
		this.controller.get('alltimeLow').update(gpsDashboard.alltimeLow.data.altitude + $L("meters"));
	}
}

RecordsAssistant.prototype.activate = function(event) {
}


RecordsAssistant.prototype.deactivate = function(event) {
}

RecordsAssistant.prototype.cleanup = function(event) {
}
