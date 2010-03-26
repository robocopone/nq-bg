function GpsErrorAssistant(errorCode) {
	this.errCode = errorCode;
}

GpsErrorAssistant.prototype.setup = function() {
	if (this.errCode == 1)
		this.controller.get('message').update($L("Error: GPS Timed Out.<br />Please reset your phone."));
	if (this.errCode == 2)
		this.controller.get('message').update($L("Error: Position Unavailable.<br />Please reset your phone."));
	if (this.errCode == 3)
		this.controller.get('message').update($L("Unknown Error.<br />Please reset your phone."));
	if (this.errCode == 4)
		this.controller.get('message').update($L("Check Location Services to ensure that GPS Fixes are turned on.<br />Location Services are on the third page of the launcher."));
	if (this.errCode == 5)
		this.controller.get('message').update($L("Error: Location Services are Off.<br />Check Location Services on the third page of the launcher."));
	if (this.errCode == 6)
		this.controller.get('message').update($L("Error: You have not accepted Location Services terms of service.<br />Check Location Services on the third page of the launcher."));
	if (this.errCode == 7)
		this.controller.get('message').update($L("Error: Application has a pending message.<br />Please reset your phone."));
	if (this.errCode == 8)
		this.controller.get('message').update($L("Error: Application is temporarily blacklisted.<br />Please reset your phone."));
}

GpsErrorAssistant.prototype.activate = function(event) {
}

GpsErrorAssistant.prototype.deactivate = function(event) {
}

GpsErrorAssistant.prototype.cleanup = function(event) {
}
