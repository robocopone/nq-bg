function MainAssistant(){
	this.account = {}
	this.account.id = 0

	this.cookie = ({
		initialize: function(){
			this.cookieData = new Mojo.Model.Cookie("netBradleyGraberPoll");
			var storedData = this.cookieData.get();
			if (storedData && storedData.version == "1.0.0") {
				this.account.id = storedData.id
			}
			this.storeCookie();
		},
		storeCookie: function(){
			this.cookieData.put({
				version: "1.0.0",
				id: this.account.id,
			})
		}
	});
}


MainAssistant.prototype.accountCreationSuccess = function (accountId) {
	
}

MainAssistant.prototype.setup = function(){
	for (var x = 1; x < 20; x++) 
		Mojo.Log.warn(' ');
	Mojo.Log.warn('**************Setup Began**************')

	this.controller.setupWidget('createButton', atts = {
		type: Mojo.Widget.defaultButton
	}, this.createButtonModel = {
		buttonLabel: 'Create Account',
		buttonClass: 'affirmative',
		disabled: true
	});

	this.controller.setupWidget('deleteButton', atts = {
		type: Mojo.Widget.defaultButton
	}, this.deleteButtonModel = {
		buttonLabel: 'Delete Account',
		buttonClass: 'negative',
		disabled: true
	});

	this.controller.listen('createButton', Mojo.Event.tap, this.createAccount.bind(this))
	this.controller.listen('deleteButton', Mojo.Event.tap, this.deleteAccount.bind(this))
	this.listAccount();
};
MainAssistant.prototype.cleanup = function(event) {
	for (var x = 1; x < 5; x++) Mojo.Log.warn(' ');
	Mojo.Log.warn('*************Cleanup Began*************')
};

MainAssistant.prototype.listAccount = function(){
	this.controller.serviceRequest('palm://com.palm.accounts/crud', {
		method: 'listAccounts',
		parameters: {},
		onSuccess: (function(list){ this.accountCheck(list.list[0]) }).bind(this),
		onFailure: (function(error){ this.error('LIST ACCOUNT', error)}).bind(this)
	});
}

MainAssistant.prototype.accountCheck = function(account) {
	if (account) {
		this.account.id = account.accountId
		this.controller.get('accountExists').update('Yes')
		this.controller.get('displayName').update(account.displayName)
		this.deleteButtonModel.disabled = false;
		this.controller.modelChanged(this.deleteButtonModel, this);
		this.createButtonModel.disabled = true;
		this.controller.modelChanged(this.createButtonModel, this);
//		for (var prop in account) {
//			Mojo.Log.warn("****** PROPERTY: " + prop);
//			Mojo.Log.warn("****** ==> " + account[prop]);
//		}
	}
	else {
		this.deleteButtonModel.disabled = true;
		this.controller.modelChanged(this.deleteButtonModel, this);
		this.createButtonModel.disabled = false;
		this.controller.modelChanged(this.createButtonModel, this);
		this.controller.get('accountExists').update('No')
		this.controller.get('displayName').update('')
	}
}

MainAssistant.prototype.createAccount = function(){
	this.controller.serviceRequest('palm://com.palm.accounts/crud', {
		method: 'createAccount',
		parameters: {
			displayName: 'Donut4000',
			dataTypes: ["CONTACTS"],
			domain: 'bradleygraber',
			icons: {},
			isDataReadOnly: false,
			username: 'pollTest'
		},
		onSuccess: (function(accountId){ this.account.id = accountId.accountId; this.listAccount(); }).bind(this),
		onFailure: (function(error){ this.error('ACCOUNT CREATION', error)}).bind(this)
	});
}
MainAssistant.prototype.deleteAccount = function () {
	this.controller.serviceRequest('palm://com.palm.accounts/crud', {
		method: 'deleteAccount',
		parameters: {
			accountId: this.account.id,
			dataTypes: ["CONTACTS", "CALENDAR"]
		},
		onSuccess: (function(dataTypesDeleted, returnValue){ this.listAccount(); }).bind(this),
		onFailure: (function(error){ this.error('ACCOUNT DELETION', error)}).bind(this)
	});
}

MainAssistant.prototype.activate = function(event){};

MainAssistant.prototype.deactivate = function(event) {};

MainAssistant.prototype.error = function(callingFunction, error){
	Mojo.Log.warn('******')
	Mojo.Log.warn('****** BEGIN ' + callingFunction + ' ERROR')
	Mojo.Log.warn('******')
	Mojo.Log.warn('****** ' + error);
	for (var prop in error) {
		Mojo.Log.warn("****** PROPERTY: " + prop);
		Mojo.Log.warn("****** ==> " + error[prop]);
	}
	Mojo.Log.warn('******')
	Mojo.Log.warn('****** END ' + callingFunction + ' ERROR')
	Mojo.Log.warn('******')
}
