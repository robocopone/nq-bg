function MainAssistant() {
	
}

var farkleCookie = ({
	initialize: function() {
		this.cookieData = new Mojo.Model.Cookie("netBradleyGraberFreeFallFree");
		var storedData = this.cookieData.get();
		if (storedData && storedData.version == "1.0.0") {
			global.scores = storedData.scores.slice(0);
			global.name = storedData.name;
			global.initialDate = storedData.initialDate;
			global.initialized = storedData.initialized;
		}
		this.storeCookie();
	},
	storeCookie: function() {
		var tmpScores = global.scores.slice(0)
		this.cookieData.put({
			version: "1.0.0",
			initialDate: global.initialDate,
			scores: tmpScores,
			name: global.name,
			initialized: global.initialized
		})		
	}
});


MainAssistant.prototype.setup = function() {
	for (var x = 1; x < 20; x++) Mojo.Log.warn(' ');
	Mojo.Log.warn('**************Setup Began**************')
};

MainAssistant.prototype.cleanup = function(event) {
	for (var x = 1; x < 5; x++) Mojo.Log.warn(' ');
	Mojo.Log.warn('*************Cleanup Began*************')
};

MainAssistant.prototype.activate = function(event){
	this.controller.serviceRequest('palm://com.palm.accounts/crud', {
		method: 'listAccounts',
		parameters: {},
		onSuccess: function(list){
			for (var prop in list) {
				Mojo.Log.warn("PROPERTY: " + prop);
				Mojo.Log.warn("==> " + list[prop]);
			}
		},
		onFailure: function(error){
		}
	});
};

MainAssistant.prototype.deactivate = function(event) {};

