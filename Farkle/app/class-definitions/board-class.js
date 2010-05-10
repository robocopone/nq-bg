function board(cupHandler, dice) {
	this.state = 'unrolled'
	this.cupHandler = cupHandler
	this.die = dice
	this.layer = 1;
	this.playGrid = []
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
	if (this.state == 'unrolled') {
		this.cupHandler.addClassName('shake')
		this.stopShaking = Mojo.Function.debounce(undefined, this.doStopShaking.bind(this), 1);
		this.stopShaking();
		this.state = 'rolled'
		this.cupHandler.src = 'images/FeltCup.png'
	}
	else if (this.state == 'rolled') {
		
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
			if (!this.playGrid[x] && !bump) {
				Mojo.Log.warn('no bump insert')
				this.playGrid[x] = this.die[dieNum]
				this.playGrid[x].setPosition(this.positionGrid[this.layer][x], false)
				break;
			}
			else if (!this.playGrid[x] && bump) {
				Mojo.Log.warn('bump insert')
				this.playGrid[x] = storedDie
				this.playGrid[x].setPosition(this.positionGrid[this.layer][x], false)
				break;
			}
			else if (this.die[dieNum].getValue() < this.playGrid[x].getValue()) {
				Mojo.Log.warn('initial bump - x=' + x)
				storedDie = this.playGrid[x]
				this.playGrid[x] = this.die[dieNum]
				this.playGrid[x].setPosition(this.positionGrid[this.layer][x], false)
				bump = true;
			}
			else if (this.playGrid[x] && bump) {
				Mojo.Log.warn(x + ' bump')
				tmpDie = this.playGrid[x]
				this.playGrid[x] = storedDie
				this.playGrid[x].setPosition(this.positionGrid[this.layer][x], false)
				storedDie = tmpDie
			}
	}
	else {
		for (var x = 1; x <= 6; x++) {
			if (this.playGrid[x] && move) {
				this.playGrid[x].moveLeft();
				this.playGrid[x-1] = this.playGrid[x]
				this.playGrid[x] = undefined
			}
			else if (this.playGrid[x] && this.playGrid[x].getId() == this.die[dieNum].getId()) {
				this.die[dieNum].setPosition(this.die[dieNum].getBoardPos(), true)
				this.playGrid[x] = undefined
				move = true;
			}
			else if (!this.playGrid[x]) 
				move = true;
		}
	}
	this.checkPlayGrid()
}

board.prototype.checkPlayGrid = function () {
	
}
