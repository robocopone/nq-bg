function GpsErrorAssistant(errorCode) {
	this.errCode = errorCode;
}

GpsErrorAssistant.prototype.setup = function() {
	if (this.errCode == 1)
		this.controller.get('message').update("Error: GPS Timed Out");
	if (this.errCode == 2)
		this.controller.get('message').update("Error: Position Unavailable");
	if (this.errCode == 3)
		this.controller.get('message').update("Unknown Error");
	if (this.errCode == 4)
		this.controller.get('message').update("GPS Permanent Error, no more GPS fixes");
	if (this.errCode == 5)
		this.controller.get('message').update("Error: Location Services is Off");
	if (this.errCode == 6)
		this.controller.get('message').update("Error: You have not accepted Location Services terms of service");
	if (this.errCode == 7)
		this.controller.get('message').update("Error: Application has a pending message");
	if (this.errCode == 8)
		this.controller.get('message').update("Error: Application is temporarily blacklisted");
}

GpsErrorAssistant.prototype.activate = function(event) {
}

GpsErrorAssistant.prototype.deactivate = function(event) {
}

GpsErrorAssistant.prototype.cleanup = function(event) {
}
