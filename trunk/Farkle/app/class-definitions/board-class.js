function board(cupHandler, dice) {
	this.rollable = true
	this.layer = 0;
	this.cupHandler = cupHandler
	this.die = dice
	this.playGrid = []
	for (var x = 1; x <=6; x++)
		this.playGrid[x] = []
	this.positionGrid = []
	for (var x = 1; x <=6; x++)
		this.positionGrid[x] = []
		
	for (var x = 0; x <= 5; x++) 
		for (var y = 0; y <= 5; y++)
			this.positionGrid[x + 1][y + 1] = new position(264 - (x * 50), (y * 50) + 14)
}

board.prototype.getCupHandler = function () { return this.cupHandler }
board.prototype.getDieHandler = function (die) { return this.die[die].getHandler() }

board.prototype.roll = function () {
	if (this.rollable) {
		this.layer++
		this.cupHandler.addClassName('shake')
		this.stopShaking = Mojo.Function.debounce(undefined, this.doStopShaking.bind(this), 1);
		this.stopShaking();
		this.setRollable(false)
	}
}

board.prototype.setRollable = function(isRollable) {
	if (isRollable) {
		this.rollable = true;
		this.cupHandler.src = 'images/FeltCupStroked.png'
	}
	else {
		this.rollable = false;
		this.cupHandler.src = 'images/FeltCup.png'
	}
}

board.prototype.doStopShaking = function() {
	this.cupHandler.removeClassName('shake')
	for (var x = 1; x <= 6; x++) {
		this.die[x].roll();
		this.die[x].show();
		this.die[x].setPosition(this.die[x].getBoardPos(), true)
	}
}

board.prototype.dieTapped = function(dieNum) {
	var move = false
	var bump = false
	var storedDie = undefined
	var tmpDie = undefined
	if (this.die[dieNum].isNotInPlay()) {
		for (var x = 1; x <= 6; x++) 
			if (!this.playGrid[this.layer][x] && !bump) {
				this.playGrid[this.layer][x] = this.die[dieNum]
				this.playGrid[this.layer][x].setPosition(this.positionGrid[this.layer][x], false)
				break;
			}
			else if (!this.playGrid[this.layer][x] && bump) {
				this.playGrid[this.layer][x] = storedDie
				this.playGrid[this.layer][x].setPosition(this.positionGrid[this.layer][x], false)
				break;
			}
			else if (this.die[dieNum].getValue() < this.playGrid[this.layer][x].getValue() && !bump) {
				storedDie = this.playGrid[this.layer][x]
				this.playGrid[this.layer][x] = this.die[dieNum]
				this.playGrid[this.layer][x].setPosition(this.positionGrid[this.layer][x], false)
				bump = true;
			}
			else if (this.playGrid[this.layer][x] && bump) {
				tmpDie = this.playGrid[this.layer][x]
				this.playGrid[this.layer][x] = storedDie
				this.playGrid[this.layer][x].setPosition(this.positionGrid[this.layer][x], false)
				storedDie = tmpDie
			}
	}
	else {
		for (var x = 1; x <= 6; x++) {
			if (this.playGrid[this.layer][x] && move) {
				this.playGrid[this.layer][x].moveLeft();
				this.playGrid[this.layer][x-1] = this.playGrid[this.layer][x]
				this.playGrid[this.layer][x] = undefined
			}
			else if (this.playGrid[this.layer][x] && this.playGrid[this.layer][x].getId() == this.die[dieNum].getId()) {
				this.die[dieNum].setPosition(this.die[dieNum].getBoardPos(), true)
				this.playGrid[this.layer][x] = undefined
				move = true;
			}
			else if (!this.playGrid[this.layer][x]) 
				move = true;
		}
	}
	this.checkPlayGrid()
}

board.prototype.checkPlayGrid = function () {
	var rollable = false;
	for (var x = 1; x <= 6; x++) {
		if (this.playGrid[this.layer][x] && (this.playGrid[this.layer][x].getValue() == 1 || this.playGrid[this.layer][x].getValue() == 5))
			rollable = true;
	}
	this.setRollable(rollable);
}
