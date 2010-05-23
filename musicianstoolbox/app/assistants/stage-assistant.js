function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	window.document.addEventListener (Mojo.Event.deactivate, this.onBlurHandler.bind(this));
	window.document.addEventListener (Mojo.Event.activate, this.onFocusHandler.bind(this));
	this.foregroundVolumeMarker = this.markAppForeground();

	if (Mojo.Environment.DeviceInfo.screenHeight < 480)
		var enabled = false;
	else
		var enabled = true;

	this.controller.pushScene({
		name: "main",
		transition: Mojo.Transition.crossFade,
		disableSceneScroller: enabled
	});
};

StageAssistant.prototype.onBlurHandler = function(){
	this.lostFocus = true;

	if (this.foregroundVolumeMarker){
		this.foregroundVolumeMarker.cancel();
		this.foregroundVolumeMarker = null;
	}
		
}

StageAssistant.prototype.onFocusHandler = function(){
	this.lostFocus = false; 

	if (this.pendingRefresh){
		this.forceRefreshActiveScene();
		this.pendingRefresh = false;
	}
	
	if (!this.foregroundVolumeMarker)
		this.foregroundVolumeMarker = this.markAppForeground();

	if (this.musicPlayer && this.musicPlayer.isSuspended()){
		this.musicPlayer.unsuspend();
	}
}

StageAssistant.prototype.markAppForeground = function(callback){
	var parameters = {};
	parameters.subscribe = true;
	parameters.foregroundApp = true;

	return new Mojo.Service.Request("palm://com.palm.audio/media", {
		method: 'lockVolumeKeys',
		onSuccess: callback,
		parameters: parameters
	});
}
