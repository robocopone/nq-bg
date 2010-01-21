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
		this.controller.get('alltimeLow').update(gpsDashboard.alltimeLow.data.altitude + $L(" meters"));
	}

	this.controller.get('alltimeTopSpeedDate').update(gpsDashboard.alltimeTopSpeed.date);
	this.controller.get('alltimeHighDate').update(gpsDashboard.alltimeHigh.date);
	this.controller.get('alltimeLowDate').update(gpsDashboard.alltimeLow.date);

	this.controller.listen(this.controller.get('alltimeTopGroup'),Mojo.Event.tap, this.alltimeTopGroup.bindAsEventListener(this));
	this.controller.listen(this.controller.get('alltimeHighGroup'),Mojo.Event.tap, this.alltimeHighGroup.bindAsEventListener(this));
	this.controller.listen(this.controller.get('alltimeLowGroup'),Mojo.Event.tap, this.alltimeLowGroup.bindAsEventListener(this));
}

RecordsAssistant.prototype.alltimeTopGroup = function () {
	if (gpsDashboard.alltimeTopSpeed.data.latitude) {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
		    method: 'launch',
		    parameters: {
		        id:"com.palm.app.maps",
				params:{"query": gpsDashboard.alltimeTopSpeed.data.latitude + "," +
					gpsDashboard.alltimeTopSpeed.data.longitude}
		    }
		});
	}	
}

RecordsAssistant.prototype.alltimeHighGroup = function () {
	if (gpsDashboard.alltimeHigh.data.latitude) {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
		    method: 'launch',
		    parameters: {
		        id:"com.palm.app.maps",
				params:{"query": gpsDashboard.alltimeHigh.data.latitude + "," +
					gpsDashboard.alltimeHigh.data.longitude}
		    }
		});
	}	
}

RecordsAssistant.prototype.alltimeLowGroup = function () {
	if (gpsDashboard.alltimeLow.data.latitude) {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
		    method: 'launch',
		    parameters: {
		        id:"com.palm.app.maps",
				params:{"query": gpsDashboard.alltimeLow.data.latitude + "," +
					gpsDashboard.alltimeLow.data.longitude}
		    }
		});
	}	
}

RecordsAssistant.prototype.activate = function(event) {
}


RecordsAssistant.prototype.deactivate = function(event) {
}

RecordsAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening(this.controller.get('alltimeTopGroup'),Mojo.Event.tap, this.alltimeTopGroup.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('alltimeHighGroup'),Mojo.Event.tap, this.alltimeHighGroup.bindAsEventListener(this));
	this.controller.stopListening(this.controller.get('alltimeLowGroup'),Mojo.Event.tap, this.alltimeLowGroup.bindAsEventListener(this));
}
