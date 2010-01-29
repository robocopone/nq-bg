Mojo.Widget._FloatPickerStrategy = function() {
};

/**
private setup
@private 
@constructor
*/
Mojo.Widget._FloatPickerStrategy.prototype.setup = function() {
	this._choose = this._choose.bind(this);
	this.Interval = this.controller.attributes.Interval || 0.5;
	Mojo.Widget._FloatPickerStrategy.prototype.Items = [];
	this.disabledProperty = this.controller.attributes.disabledProperty || Mojo.Widget.defaultDisabledProperty;
	for(i = this.controller.attributes.min ; i<this.controller.attributes.max ;i+=this.Interval)
	{
		var num = roundNumber(i,2);
		item = {label:num+'', value:num}
		Mojo.Widget._FloatPickerStrategy.prototype.Items[Mojo.Widget._FloatPickerStrategy.prototype.Items.length] = item;
	}
	//this._setDisabledState();
};


// Constants for our capsule types:
Mojo.Widget._FloatPickerStrategy.prototype.kFloatCapsuleType = 'value';

// Interface constants for use by _GenericPicker.
Mojo.Widget._FloatPickerStrategy.prototype.kDefaultLabel = $LL('Value');
Mojo.Widget._FloatPickerStrategy.prototype.kDefaultModelProperty = 'value';
Mojo.Widget._FloatPickerStrategy.prototype.kDefaultCapsuleType = Mojo.Widget._FloatPickerStrategy.prototype.kFloatCapsuleType;
Mojo.Widget._FloatPickerStrategy.prototype.kCapsuleList = ['value'];

/* @private
	Returns the label string for the current value of the given capsule type.
	Interface function for use by _GenericPicker.
*/
Mojo.Widget._FloatPickerStrategy.prototype.getValueForType = function(type) {
	var label = this.assistant.getModelProperty();
	return label;
};


/* @private
	Returns a keymatcher object for the given capsule type.
	Interface function for use by _GenericPicker.
*/
Mojo.Widget._FloatPickerStrategy.prototype.createKeyMatcherForType = function(type) {
	Mojo.Log.info("_FloatPickerStrategy.prototype.createKeyMatcherForType");
	var attrs = this.controller.attributes;
	var options;
	options = {window:this.controller.window, numeric:true};
	options.items = this.Items;
	return new Mojo.Event.KeyMatcher(this._choose, options);
};



/* @private
	Returns a PickerPopup model for the given capsule type.
	Interface function for use by _GenericPicker.
*/
Mojo.Widget._FloatPickerStrategy.prototype.createPopupModelForType = function(type) {
	Mojo.Log.info("_FloatPickerStrategy.prototype.createPopupModelForType");
	this._setDisabledState();
	var popupModel;
	if(this.disabled) return;		
	popupModel = {
			onChoose: this._choose,
			value: this.assistant.getModelProperty()//todayDate.getHours()
		};
	
	popupModel.items = this.Items;
	return popupModel;
};



function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}
/* @private 
	Choose method called by keymatcher & pickerpopup.
*/
Mojo.Widget._FloatPickerStrategy.prototype._choose = function(value) {
	var propObj;
	
	if(value === undefined) {
		return;
	}	
	value = roundNumber(parseFloat(value),2);
	
	if(value !== this.assistant.getModelProperty()) {
		this.controller.model[this.assistant.modelProperty] = value;
		this.assistant.modifiedModelProperty('value', true);
	}		
};

Mojo.Widget._FloatPickerStrategy.prototype._setDisabledState =  function() {
	Mojo.Log.info("_FloatPickerStrategy.prototype._setDisabledState" + event.value);
		var disabledVal = this.controller.model[this.disabledProperty];
		if (disabledVal !== this.disabled) {
			this.disabled = disabledVal;
			/*if (this.disabled) {
				this.toggleDiv.addClassName("disabled");
			} else {
				this.toggleDiv.removeClassName("disabled");
			}*/
		}
	};


Mojo.Widget.FloatPicker = function() {
	// Call through to _GenericPicker's constructor, passing our strategy object.
	Mojo.Widget._GenericPicker.call(this, new Mojo.Widget._FloatPickerStrategy());
};
Mojo.Widget.FloatPicker.prototype = Mojo.Widget._GenericPicker.prototype;

