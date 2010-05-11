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
		for (var x = 1; x <= 6; x++)
			if (this.playGrid[this.layer] && this.playGrid[this.layer][x])
				this.playGrid[this.layer][x].setRollable(false)
		this.layer++

		for (var x = 1; x <= 6; x++)
			this.die[x].rollPrep();

		this.cupHandler.addClassName('shake')
		this.stopShaking = Mojo.Function.debounce(undefined, this.doStopShaking.bind(this), 1);
		this.stopShaking();
		this.setRollable(false)
	}
}

board.prototype.doStopShaking = function() {
	this.cupHandler.removeClassName('shake')
	for (var x = 1; x <= 6; x++)
		this.die[x].roll();
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
	var numGrid = []
	for (var x = 1; x <= 6; x++)
		numGrid[x] = 0
		
	for (var x = 1; x <= 6; x++)
		if (this.playGrid[this.layer][x])
			numGrid[this.playGrid[this.layer][x].getValue()]++

	var rollable = this.checkNumGrid(numGrid)
		
	this.setRollable(rollable);
}

board.prototype.checkNumGrid = function(numGrid) {
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
