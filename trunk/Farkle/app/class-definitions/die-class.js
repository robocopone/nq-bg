function die(id, handler) {
	this.handler = handler
	this.id = id
	this.value = 2
	this.handler.src = "images/die_two.png"

	this.cupPos = new position(320,230)
	this.currentPos = new position(320, 230)
	switch (id) {
		case 1: this.boardPos = new position(25, 270); break;
		case 2: this.boardPos = new position(7, 200); break;
		case 3: this.boardPos = new position(22, 130); break;
		case 4: this.boardPos = new position(85, 250); break;
		case 5: this.boardPos = new position(75, 190); break;
		case 6: this.boardPos = new position(140, 260); break;
	} 

	this.hide();
	this.setPosition(this.cupPos)
}

die.prototype.isNotInPlay = function() {
	return this.currentPos.equals(this.boardPos)
}

die.prototype.setPosition = function(inPosition){
	this.currentPos.set(inPosition)
	this.delaySet = Mojo.Function.debounce(undefined, this.doSetPosition.bind(this), .01);
	this.delaySet(this.currentPos)
}
die.prototype.doSetPosition = function(position) {
	this.handler.setStyle({
		top: position.getTop() + 'px',
		left: position.getLeft() + 'px'
	})
}

die.prototype.moveLeft = function() {
	if (!this.currentPos.equals(this.boardPos) && this.currentPos.getLeft() != 14)
		this.setPosition(this.currentPos.decrement())
}

die.prototype.hide = function() { this.handler.addClassName('hidden') }
die.prototype.show = function() { this.handler.removeClassName('hidden') }

die.prototype.getBoardPos = function() { return this.boardPos }
die.prototype.getCupPos = function() { return this.cupPos }
die.prototype.getCurrentPos = function() { return this.currentPos}
die.prototype.getHandler = function() { return this.handler }
die.prototype.getId = function() { return this.id}
