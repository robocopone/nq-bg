function board(cupHandler, dice, currScoreHandler, totalScoreHandler, roundHandler, farkleHandler, controller){
	this.controller = controller
    this.farkleHandler = farkleHandler
    this.roundHandler = roundHandler
    this.currentScoreHandler = currScoreHandler
    this.totalScoreHandler = totalScoreHandler
    this.currentScore = 0
    this.totalScore = 0
    this.round = 10
    this.currentScoreHandler.update(this.currentScore)
    this.totalScoreHandler.update(this.totalScore)
    this.roundHandler.update(this.round)
    this.rollable = true
    this.layer = 0;
    this.cupHandler = cupHandler
    this.die = dice
    this.positionGrid = []
    for (var x = 1; x <= 6; x++) 
        this.positionGrid[x] = []
    
    for (var x = 0; x <= 5; x++) 
        for (var y = 0; y <= 5; y++) 
            this.positionGrid[x + 1][y + 1] = new position(264 - (x * 50), (y * 50) + 14)
    this.resetPlayGrid();
}

board.prototype.getCupHandler = function(){
    return this.cupHandler
}
board.prototype.getDieHandler = function(die){
    return this.die[die].getHandler()
}
board.prototype.getCurrentScoreHandler = function(){
    return this.currentScoreHandler
}

board.prototype.currentScoreTapped = function(farkle){
    var tmpScore = this.tallyScore('playGrid')
    if (farkle) {
        this.set('currentScore', 0)
        this.set('round', this.round += 1)
        this.currentScoreHandler.removeClassName('highlighted')
        this.resetDice();
        this.setRollable(true);
    }
    else 
        if (tmpScore >= 300) {
            this.set('currentScore', 0)
            this.set('totalScore', this.totalScore += tmpScore)
            this.set('round', this.round += 1)
            this.currentScoreHandler.removeClassName('highlighted')
            this.resetDice();
        }
    
    if (this.round > 10) {
		global.savedScore = this.totalScore
        this.checkHighScores()
        this.set('currentScore', 0)
        this.set('totalScore', 0)
        this.set('round', 1)
        this.resetDice();
    }
}

board.prototype.set = function(property, value){
    this[property] = value
    this[property + 'Handler'].update(value)
}

board.prototype.resetPlayGrid = function(){
    this.playGrid = []
    for (var x = 1; x <= 6; x++) 
        this.playGrid[x] = []
}

board.prototype.tallyScore = function(choice){
    var numGrid = this.buildNumGrid(choice)
    var tmpScore = this.currentScore;
    
    var singles = 0;
    var doubles = 0;
    for (var x = 1; x <= 6; x++) {
        if (numGrid[x] == 1) 
            singles++
        if (numGrid[x] == 2) 
            doubles++
    }
    
    if (singles == 6) 
        tmpScore += 1500
    else 
        if (doubles == 3) 
            tmpScore += 750
        else {
            for (var x = 1; x <= 6; x++) {
                //			Mojo.Log.warn('x=' + x + ' tmpScore=' + tmpScore + ' numGrid[x]=' + numGrid[x])
                if (x == 1) {
                    if (numGrid[x] < 3) 
                        tmpScore += 100 * numGrid[x]
                    else 
                        tmpScore += 1000 + ((numGrid[x] - 3) * 1000)
                }
                else 
                    if (x == 5) {
                        if (numGrid[x] < 3) 
                            tmpScore += 50 * numGrid[x]
                        else 
                            tmpScore += 500 + ((numGrid[x] - 3) * 500)
                    }
                    else 
                        if (numGrid[x] >= 3) {
                            tmpScore += (x * 100) + ((numGrid[x] - 3) * (x * 100))
                        }
            }
        }
    return tmpScore;
}

board.prototype.doStopShaking = function(){
    this.cupHandler.removeClassName('shake')
    for (var x = 1; x <= 6; x++) 
        this.die[x].roll();
    if ((this.tallyScore('board') - this.currentScore) == 0) 
        this.farkle();
}

board.prototype.setRollable = function(isRollable){
    this.rollable = isRollable;
    if (isRollable) 
        this.cupHandler.src = 'images/FeltCupStroked.png'
    else 
        this.cupHandler.src = 'images/FeltCup.png'
}

board.prototype.dieTapped = function(dieNum){
    var move = false
    var bump = false
    var storedDie = undefined
    var tmpDie = undefined
    if (this.die[dieNum].isNotInPlay() && this.playGrid[this.layer]) {
        for (var x = 1; x <= 6; x++) 
            if (!this.playGrid[this.layer][x] && !bump) {
                this.playGrid[this.layer][x] = this.die[dieNum]
                this.playGrid[this.layer][x].setPosition(this.positionGrid[this.layer][x], false)
                break;
            }
            else 
                if (!this.playGrid[this.layer][x] && bump) {
                    this.playGrid[this.layer][x] = storedDie
                    this.playGrid[this.layer][x].setPosition(this.positionGrid[this.layer][x], false)
                    break;
                }
                else 
                    if (this.die[dieNum].getValue() < this.playGrid[this.layer][x].getValue() && !bump) {
                        storedDie = this.playGrid[this.layer][x]
                        this.playGrid[this.layer][x] = this.die[dieNum]
                        this.playGrid[this.layer][x].setPosition(this.positionGrid[this.layer][x], false)
                        bump = true;
                    }
                    else 
                        if (this.playGrid[this.layer][x] && bump) {
                            tmpDie = this.playGrid[this.layer][x]
                            this.playGrid[this.layer][x] = storedDie
                            this.playGrid[this.layer][x].setPosition(this.positionGrid[this.layer][x], false)
                            storedDie = tmpDie
                        }
    }
    else 
        if (this.playGrid[this.layer]) {
            for (var x = 1; x <= 6; x++) {
                if (this.playGrid[this.layer][x] && move) {
                    this.playGrid[this.layer][x].moveLeft();
                    this.playGrid[this.layer][x - 1] = this.playGrid[this.layer][x]
                    this.playGrid[this.layer][x] = undefined
                }
                else 
                    if (this.playGrid[this.layer][x] && this.playGrid[this.layer][x].getId() == this.die[dieNum].getId()) {
                        this.die[dieNum].setPosition(this.die[dieNum].getBoardPos(), true)
                        this.playGrid[this.layer][x] = undefined
                        move = true;
                    }
                    else 
                        if (!this.playGrid[this.layer][x]) 
                            move = true;
            }
        }
        else 
            return;
    
    this.checkPlayGrid()
    var tmpScore = this.tallyScore('playGrid')
    this.currentScoreHandler.update(tmpScore)
    if (tmpScore >= 300) 
        this.currentScoreHandler.addClassName('highlighted')
    else 
        this.currentScoreHandler.removeClassName('highlighted')
}

board.prototype.roll = function(){
    this.farkleHandler.removeClassName('hidden')
    if (this.rollable) {
        this.currentScore = this.tallyScore('playGrid')
        this.currentScoreHandler.update(this.currentScore)
        
        for (var x = 1; x <= 6; x++) 
            if (this.playGrid[this.layer] && this.playGrid[this.layer][x]) 
                this.playGrid[this.layer][x].setRollable(false)
        
        var rollableDice = false
        for (var x = 1; x <= 6; x++) 
            if (this.die[x].isRollable()) 
                rollableDice = true
        if (!rollableDice) 
            this.resetDice()
        
        this.layer++
        
        for (var x = 1; x <= 6; x++) 
            this.die[x].rollPrep();
        
        this.cupHandler.addClassName('shake')
        this.stopShaking = Mojo.Function.debounce(undefined, this.doStopShaking.bind(this), 1);
        this.stopShaking();
        this.setRollable(false)
    }
    if (this.farkleHandler.getStyle('left') == '0px') 
        this.moveFarkleRight();
}

board.prototype.farkle = function(){
    this.currentScoreTapped(true)
    this.farkleHandler.setStyle({
        '-webkit-transform': 'rotate(0deg)',
        'left': '0px',
    })
}
board.prototype.moveFarkleRight = function(){
    this.farkleHandler.setStyle({
        '-webkit-transform': 'rotate(180deg)',
        'left': '320px',
        '-webkit-transform-origin': 'right',
    })
    this.moveFarkleLeft = Mojo.Function.debounce(undefined, this.doMoveFarkleLeft.bind(this), 1);
    this.moveFarkleLeft();
}
board.prototype.doMoveFarkleLeft = function(){
    this.farkleHandler.addClassName('hidden')
    this.farkleHandler.setStyle({
        '-webkit-transform-origin': 'left',
        '-webkit-transform': 'rotate(-180deg)',
        'left': '-320px'
    })
}

board.prototype.resetDice = function(){
    for (var x = 1; x <= 6; x++) {
        this.die[x].setRollable(true)
        //		this.die[x].rollPrep()
    }
    this.resetPlayGrid();
    this.layer = 0;
}
board.prototype.checkPlayGrid = function(){
    var numGrid = this.buildNumGrid('playGrid')
    
    var rollable = this.checkNumGrid(numGrid)
    
    this.setRollable(rollable);
}

board.prototype.buildNumGrid = function(choice){
    var numGrid = []
    
    for (var x = 1; x <= 6; x++) 
        numGrid[x] = 0
    
    if (choice == 'playGrid') 
        for (var x = 1; x <= 6; x++) 
            if (this.playGrid[this.layer] && this.playGrid[this.layer][x]) 
                numGrid[this.playGrid[this.layer][x].getValue()]++
    if (choice == 'board') 
        for (var x = 1; x <= 6; x++) 
            if (this.die[x].isRollable()) 
                numGrid[this.die[x].getValue()]++
    
    return numGrid
}

board.prototype.checkNumGrid = function(numGrid){
    var rollable = true;
    var zeros = 0;
    var singles = 0;
    var pairs = 0;
    
    for (var x = 1; x <= 6; x++) {
        if (numGrid[x] == 0) 
            zeros++
        if (numGrid[x] == 1) 
            singles++
        if (numGrid[x] == 2) 
            pairs++
        
        if (x != 1 && x != 5 && rollable) 
            if (numGrid[x] > 0 && numGrid[x] < 3) 
                rollable = false;
    }
    if (zeros == 6) 
        rollable = false;
    if (pairs == 3) 
        rollable = true;
    if (singles == 6) 
        rollable = true;
    
    return rollable;
}

board.prototype.checkHighScores = function(){
    for (var x = 1; x <= 10; x++) {
        if (global.scores[x] && global.savedScore > global.scores[x].score) {
            this.bumpScores(x);
            global.scoreSlot = x;
            this.controller.showDialog({
                template: 'nameDialog/nameDialog-scene',
                assistant: new doDialog(this)
            });
            break;
        }
        else 
            if (!global.scores[x]) {
                global.scoreSlot = x;
                this.controller.showDialog({
                    template: 'nameDialog/nameDialog-scene',
                    assistant: new doDialog(this)
                });
                break;
            }
    }
	farkleCookie.storeCookie();
}

board.prototype.bumpScores = function(num){
    if (global.scores[num + 1]) {
        this.bumpScores(num + 1)
        global.scores[num + 1] = global.scores[num]
    }
    else 
        global.scores[num + 1] = global.scores[num]
}

var doDialog = Class.create({
    initialize: function(sceneAssistant){
        this.sceneAssistant = sceneAssistant;
        this.controller = sceneAssistant.controller;
    },
    
    setup: function(widget){
        this.widget = widget;
        this.name = {
            value: global.name
        };
        this.controller.get('newHighScore').update(global.savedScore)
        this.controller.setupWidget("username", {}, this.name);
        this.controller.get('dialogOkButton').addEventListener(Mojo.Event.tap, this.okPressed.bindAsEventListener(this));
        this.controller.get('dialogCancelButton').addEventListener(Mojo.Event.tap, this.cancelPressed.bindAsEventListener(this));
    },
    
    okPressed: function(){
        global.name = this.name.value;
        global.scores[global.scoreSlot] = {}
        global.scores[global.scoreSlot].name = this.name.value;
        global.scores[global.scoreSlot].score = global.savedScore;
        global.scores[global.scoreSlot].date = Mojo.Format.formatDate(new Date(), {
            date: 'medium'
        });
        this.controller.stageController.pushScene({
            name: "scoring",
            transition: Mojo.Transition.crossFade
        })
        this.widget.mojo.close();
    },
    cancelPressed: function(){
        this.widget.mojo.close();
    }
});
