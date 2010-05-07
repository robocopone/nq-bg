function board() {
	this.layer = 1;
	this.die = []
	this.positionGrid = []
	for (var x = 1; x <=6; x++)
		this.positionGrid[x] = []
		
	for (var x = 0; x <= 5; x++) 
		for (var y = 0; y <= 5; y++) {
			this.positionGrid[x + 1][y + 1] = new position(264 - (x * 50), (y * 50) + 14)
		}
}

board.prototype.dieTapped = function(die) {
	var move = false
	if (die.isNotInPlay()) {
		for (var x = 1; x <= 6; x++) 
			if (!this.die[x]) {
				this.die[x] = die
				this.die[x].setPosition(this.positionGrid[this.layer][x])
				break;
			}
	}
	else {
		for (var x = 1; x <= 6; x++) {
			if (this.die[x] && move) {
				this.die[x].moveLeft();
				this.die[x-1] = this.die[x]
				this.die[x] = undefined
			}
			else if (this.die[x] && this.die[x].getId() == die.getId()) {
				die.setPosition(die.getBoardPos())
				this.die[x] = undefined
				move = true;
			}
			else if (!this.die[x]) 
				move = true;
		}
	}
}
