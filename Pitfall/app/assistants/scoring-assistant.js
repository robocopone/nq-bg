function ScoringAssistant() {
}

ScoringAssistant.prototype.setup = function() {
}

ScoringAssistant.prototype.activate = function(event) {
	this.controller.get('finalScore').update(global.score)
}


ScoringAssistant.prototype.deactivate = function(event) {
}

ScoringAssistant.prototype.cleanup = function(event) {
}
