function MainAssistant(){
}

MainAssistant.prototype.setup = function(){
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn('****************Started Setup Function****************')
    
    this.initialize();
    
    this.controller.listen(this.playArea.getCupHandler(), Mojo.Event.tap, this.cupTapped.bindAsEventListener(this))
    this.controller.listen(this.playArea.getCurrentScoreHandler(), Mojo.Event.tap, this.currentScoreTapped.bindAsEventListener(this))
    for (var x = 1; x <= 6; x++) 
        this.controller.listen(this.playArea.getDieHandler(x), Mojo.Event.tap, this.dieTapped.bindAsEventListener(this))
    this.controller.listen(document, 'shakestart', this.handleShake.bindAsEventListener(this));
};

MainAssistant.prototype.cleanup = function(event){
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn(' ');
    Mojo.Log.warn('***************Started Cleanup Function***************')
    
    this.controller.stopListening(this.playArea.getCupHandler(), Mojo.Event.tap, this.cupTapped.bindAsEventListener(this))
    this.controller.stopListening(this.playArea.getCurrentScoreHandler(), Mojo.Event.tap, this.currentScoreTapped.bindAsEventListener(this))
    for (var x = 1; x <= 6; x++) 
        this.controller.stopListening(this.playArea.getDieHandler(x), Mojo.Event.tap, this.dieTapped.bindAsEventListener(this))
    this.controller.stopListening(document, 'shakestart', this.handleShake.bindAsEventListener(this));
};

MainAssistant.prototype.handleShake = function(){
    this.playArea.roll()
}
MainAssistant.prototype.cupTapped = function(){
    this.playArea.roll()
}

MainAssistant.prototype.currentScoreTapped = function(){
    this.playArea.currentScoreTapped();
}

MainAssistant.prototype.dieTapped = function(event){
    this.playArea.dieTapped(parseInt(event.srcElement.id.substring(3)))
}

MainAssistant.prototype.initialize = function(){
    var dice = []
    for (var x = 1; x <= 6; x++) 
        dice[x] = new die(x, this.controller.get('die' + x))
    
    this.playArea = new board(this.controller.get('cup'), dice, this.controller.get('currentScore'), this.controller.get('totalScore'), this.controller.get('round'), this.controller.get('farkle'));
}

/*
 var doDialog = Class.create({
 initialize: function(sceneAssistant) {
 this.sceneAssistant = sceneAssistant;
 this.controller = sceneAssistant.controller;
 },
 
 setup : function(widget) {
 this.widget = widget;
 this.name = {
 value: global.name
 };
 this.controller.get('newHighScore').update(global.savedScore)
 this.controller.setupWidget("username", {} ,this.name);
 this.controller.get('dialogOkButton').addEventListener(Mojo.Event.tap, this.okPressed.bindAsEventListener(this));
 this.controller.get('dialogCancelButton').addEventListener(Mojo.Event.tap, this.cancelPressed.bindAsEventListener(this));
 },
 
 okPressed: function() {
 global.name = this.name.value;
 global.scores[global.scoreSlot] = {}
 global.scores[global.scoreSlot].name = this.name.value;
 global.scores[global.scoreSlot].score = global.savedScore;
 global.scores[global.scoreSlot].date = Mojo.Format.formatDate( new Date(), { date: 'medium' } );
 this.controller.stageController.pushScene({
 name: "scoring",
 transition: Mojo.Transition.crossFade
 })
 this.widget.mojo.close();
 },
 cancelPressed: function() {
 this.widget.mojo.close();
 }
 });
 */
MainAssistant.prototype.activate = function(event){
};
MainAssistant.prototype.deactivate = function(event){
};

/*

 MainAssistant.prototype.die1Tapped = function(event){

 for (var prop in event.srcElement) {

 Mojo.Log.info("PROPERTY: " + prop);

 Mojo.Log.info("==> " + event.srcElement[prop]);

 }

 this.dieTapped(1)

 }

 */

