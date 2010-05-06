function die(id, handler) {
	this.handler = handler
	this.id = id

	this.cupPos = new position(320,230)
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

die.prototype.setPosition = function(inPosition){
	this.currentPosition = inPosition
	this.delay = Mojo.Function.debounce(undefined, this.doSetPosition.bind(this), .01);
	var savedPosition = new position(inPosition.getTop(),inPosition.getLeft())
	this.delay(savedPosition)
}
die.prototype.doSetPosition = function(position) {
	this.handler.setStyle({
		top: position.getTop() + 'px',
		left: position.getLeft() + 'px'
	})
}

die.prototype.tapped = function(position) {
	if (this.currentPosition.equals(this.boardPos)) {
		this.setPosition(position)
		position.increment()
	}
	else {
		this.setPosition(this.boardPos)
		position.decrement()
	}
	return position
}

die.prototype.moveLeft = function() {
	if (!this.currentPosition.equals(this.boardPos))
		this.setPosition(this.currentPosition.decrement())
}

die.prototype.hide = function() { this.handler.addClassName('hidden') }
die.prototype.show = function() { this.handler.removeClassName('hidden') }

die.prototype.getBoardPos = function() { return this.boardPos }
die.prototype.getCupPos = function() { return this.cupPos }
die.prototype.getHandler = function() { return this.handler }
