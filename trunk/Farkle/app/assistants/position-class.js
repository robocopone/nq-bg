function position(top, left) {
	this.top = top
	this.left = left
}

position.prototype.equals = function (pos2) {
	if (pos2.getTop() == this.top && pos2.getLeft() == this.left)
		return true;
	return false
}
position.prototype.getTop = function () { return this.top; }
position.prototype.getLeft = function () { return this.left; }

position.prototype.increment = function() { this.left += 50; return this}
position.prototype.decrement = function() { this.left -= 50; return this}
