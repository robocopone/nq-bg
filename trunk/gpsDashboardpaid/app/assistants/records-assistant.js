function RecordsAssistant() {
}

RecordsAssistant.prototype.setup = function(){
	this.controller.get('recordsHeader').update($L("Record Keeping"))
	this.controller.get('tapAlert').update($L("Tap to Map the Location"))
	this.controller.get('recordsTopSpeedHeading').update($L("Top Speed"))
	this.controller.get('recordsHighElevationHeading').update($L("Highest Elevation"))
	this.controller.get('recordsLowElevationHeading').update($L("Lowest Elevation"))

	if (gpsDashboard.units == 1 && gpsDashboard.alltimeTopSpeed.data.velocity != 0)
		this.controller.get('alltimeTopSpeed').update((gpsDashboard.alltimeTopSpeed.data.velocity * 2.23693629).toFixed(0) + $L(" mph"));
	if (gpsDashboard.units == 2 && gpsDashboard.alltimeTopSpeed.data.velocity != 0) 
		this.controller.get('alltimeTopSpeed').update((gpsDashboard.alltimeTopSpeed.data.velocity * 3.6).toFixed(0) + $L(" km/h"));
	
	if (gpsDashboard.units == 1 && gpsDashboard.alltimeHigh.data.altitude != 0)
		this.controller.get('alltimeHigh').update((gpsDashboard.alltimeHigh.data.altitude * 3.2808399).toFixed(0) + $L(" ft"));
	if (gpsDashboard.units == 1 && gpsDashboard.alltimeLow.data.altitude != 15000)
		this.controller.get('alltimeLow').update((gpsDashboard.alltimeLow.data.altitude * 3.2808399).toFixed(0) + $L(" ft"));
	if (gpsDashboard.units == 2 && gpsDashboard.alltimeHigh.data.altitude != 0) 
		this.controller.get('alltimeHigh').update(gpsDashboard.alltimeHigh.data.altitude + $L(" m"));
	if (gpsDashboard.units == 2 && gpsDashboard.alltimeHigh.data.altitude != 15000) 
		this.controller.get('alltimeLow').update(gpsDashboard.alltimeLow.data.altitude + $L(" m"));

	if (gpsDashboard.alltimeTopSpeed.date)	
		this.controller.get('alltimeTopSpeedDate').update(gpsDashboard.alltimeTopSpeed.date);
	if (gpsDashboard.alltimeHigh.date)	
		this.controller.get('alltimeHighDate').update(gpsDashboard.alltimeHigh.date);
	if (gpsDashboard.alltimeLow.date)	
		this.controller.get('alltimeLowDate').update(gpsDashboard.alltimeLow.date);

	this.controller.listen(this.controller.get('alltimeTopGroup'), Mojo.Event.tap, this.alltimeTopGroup.bindAsEventListener(this));
	this.controller.listen(this.controller.get('alltimeHighGroup'), Mojo.Event.tap, this.alltimeHighGroup.bindAsEventListener(this));
	this.controller.listen(this.controller.get('alltimeLowGroup'), Mojo.Event.tap, this.alltimeLowGroup.bindAsEventListener(this));
	
	this.controller.setupWidget('resets', this.atts = {}, this.model = {
		buttonLabel: $L("Resets"),
		buttonClass: 'negative',
		disabled: false
	});
	this.controller.listen(this.controller.get('resets'), Mojo.Event.tap, this.resets.bindAsEventListener(this));
	
}
RecordsAssistant.prototype.resets = function(){
	this.controller.showAlertDialog({
		onChoose: this.doResets,
		title: $L("Resets"),
		message: $L("Choose one of the following options"),
		choices: [{
			label: $L("Top Speed"),
			value: 'topSpeed',
			type: 'negative'
		}, {
			label: $L("Highest Elevation"),
			value: 'alltimeHigh',
			type: 'negative'
		}, {
			label: $L("Lowest Elevation"),
			value: 'alltimeLow',
			type: 'negative'
		}, ]
	});
}
RecordsAssistant.prototype.doResets = function (choice) {
	if (choice == 'topSpeed') {
		gpsDashboard.alltimeTopSpeed.data.velocity = 0;
		gpsDashboard.alltimeTopSpeed.data.latitude = undefined;
		gpsDashboard.alltimeTopSpeed.date = undefined;
		this.controller.get('alltimeTopSpeed').update("");
		this.controller.get('alltimeTopSpeedDate').update("");
	}
	if (choice == 'alltimeHigh') {
		gpsDashboard.alltimeHigh.data.altitude = 0;
		gpsDashboard.alltimeHigh.data.latitude = undefined;
		gpsDashboard.alltimeHigh.date = undefined;
		this.controller.get('alltimeHigh').update("");
		this.controller.get('alltimeHighDate').update("");
	}
	if (choice == 'alltimeLow') {
		gpsDashboard.alltimeLow.data.altitude = 15000;
		gpsDashboard.alltimeLow.data.latitude = undefined;
		gpsDashboard.alltimeLow.date = undefined;
		this.controller.get('alltimeLow').update("");
		this.controller.get('alltimeLowDate').update("");
	}
	
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
	this.controller.stopListening(this.controller.get('resets'), Mojo.Event.tap, this.resets.bindAsEventListener(this));
}
