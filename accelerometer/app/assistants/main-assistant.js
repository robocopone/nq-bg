function MainAssistant(){

}

MainAssistant.prototype.setup = function(){
	this.accelX = this.controller.get('accelX')
	this.accelY = this.controller.get('accelY')
	this.accelZ = this.controller.get('accelZ')
	this.noGravX = this.controller.get('noGravX')
	this.noGravY = this.controller.get('noGravY')
	this.noGravZ = this.controller.get('noGravZ')

	this.xMin = this.controller.get('xMin')
	this.xMax = this.controller.get('xMax')
	this.yMin = this.controller.get('yMin')
	this.yMax = this.controller.get('yMax')
	this.zMin = this.controller.get('zMin')
	this.zMax = this.controller.get('zMax')
	this.netMin = this.controller.get('netMin')
	this.netMax = this.controller.get('netMax')

	this.controller.stageController.setWindowProperties({
		fastAccelerometer: true
	});

	// Metro Start/Stop Button Widget
	this.controller.setupWidget('reset', {
		type: Mojo.Widget.defaultButton
	}, {
		buttonLabel: $L("Reset"),
		buttonClass: 'negative',
		disabled: false
	});

	this.controller.listen("rawDivider", Mojo.Event.tap, this.rawDividerTapped.bindAsEventListener(this));
	this.controller.setupWidget("rawDrawer", {
		modelProperty: 'open',
		unstyled: true
	}, {
		open: false
	});


	this.rollingX = 0;
	this.rollingY = 0;
	this.rollingZ = 0;
	this.rawData = false;
	this.reset();

	this.controller.listen('reset', Mojo.Event.tap, this.reset.bindAsEventListener(this));
	this.controller.listen(document, 'acceleration', this.accel.bindAsEventListener(this));
}
MainAssistant.prototype.cleanup = function (event) {
	this.controller.stopListening('reset', Mojo.Event.tap, this.reset.bindAsEventListener(this));
	this.controller.stopListening(document, 'acceleration', this.accel.bindAsEventListener(this));
	this.controller.stopListening("rawDivider", Mojo.Event.tap, this.rawDividerTapped.bindAsEventListener(this));
}	

MainAssistant.prototype.reset = function () {
	this.maxNoGravX = 0;	
	this.maxNoGravY = 0;	
	this.maxNoGravZ = 0;	
	this.minNoGravX = 0;	
	this.minNoGravY = 0;	
	this.minNoGravZ = 0;
	this.maxNet = 0;
}
MainAssistant.prototype.accel = function(event){
	var kFilteringFactor = .1

	this.rollingX = (event.accelX * kFilteringFactor) + (this.rollingX * (1.0 - kFilteringFactor));
	this.rollingY = (event.accelY * kFilteringFactor) + (this.rollingY * (1.0 - kFilteringFactor));
	this.rollingZ = (event.accelZ * kFilteringFactor) + (this.rollingZ * (1.0 - kFilteringFactor));

	var noGravX = event.accelX - this.rollingX
	var noGravY = event.accelY - this.rollingY
	var noGravZ = event.accelZ - this.rollingZ

	var netAccel = Math.sqrt((noGravX * noGravX) + (noGravY * noGravY) + (noGravZ * noGravZ)) 

	if (this.rawData) {
		this.accelX.update(noGravX.toFixed(4))
		this.accelY.update(noGravY.toFixed(4))
		this.accelZ.update(noGravZ.toFixed(4))
	}
	
	if (noGravX > this.maxNoGravX) {this.maxNoGravX = noGravX; this.xMax.update(this.maxNoGravX.toFixed(4))}
	if (noGravY > this.maxNoGravY) {this.maxNoGravY = noGravY; this.yMax.update(this.maxNoGravY.toFixed(4))}
	if (noGravZ > this.maxNoGravZ) {this.maxNoGravZ = noGravZ; this.zMax.update(this.maxNoGravZ.toFixed(4))}
	if (netAccel > this.maxNet) {this.maxNet = netAccel; this.netMax.update(this.maxNet.toFixed(4))}

	if (noGravX < this.minNoGravX) {this.minNoGravX = noGravX; this.xMin.update(this.minNoGravX.toFixed(4))}
	if (noGravY < this.minNoGravY) {this.minNoGravY = noGravY; this.yMin.update(this.minNoGravY.toFixed(4))}
	if (noGravZ < this.minNoGravZ) {this.minNoGravZ = noGravZ; this.zMin.update(this.minNoGravZ.toFixed(4))}
	if (noGravZ < this.minNoGravZ) {this.minNoGravZ = noGravZ; this.zMin.update(this.minNoGravZ.toFixed(4))}
	
}

MainAssistant.prototype.activate = function(event){

}	

MainAssistant.prototype.doTap = function () { 

}	

MainAssistant.prototype.deactivate = function(event){

}

MainAssistant.prototype.rawDividerTapped = function () {
	var rawDivider = this.controller.get('rawDivider');
	var rawDrawer = this.controller.get('rawDrawer');
	if (rawDivider.hasClassName('palm-arrow-closed')){
		rawDivider.removeClassName('palm-arrow-closed');
		rawDivider.addClassName('palm-arrow-expanded');
		rawDrawer.mojo.setOpenState(true);
		this.rawData = true;
	}
	else if (rawDivider.hasClassName('palm-arrow-expanded')) {
		rawDivider.removeClassName('palm-arrow-expanded');
		rawDivider.addClassName('palm-arrow-closed');
		rawDrawer.mojo.setOpenState(false);
		this.rawData = false;
	}
}


/*
 * Handles the application pulldown menu
 */
MainAssistant.prototype.handleCommand = function (event) {
	if (event.type == Mojo.Event.commandEnable &&
	   (event.command == Mojo.Menu.helpCmd)) 
	{	event.stopPropagation(); 
	}

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case Mojo.Menu.helpCmd:
				Mojo.Controller.stageController.pushAppSupportInfoScene();
				break;
		}
	}
}