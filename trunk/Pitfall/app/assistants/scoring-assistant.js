function ScoringAssistant() {
}

ScoringAssistant.prototype.setup = function() {
}

ScoringAssistant.prototype.activate = function(event) {
	for (var x = 1; x <= 10; x++) {
		if (global.scores[x]) {
			this.controller.get('num').update(x);
			this.controller.get('name' + x).update(global.scores[x].name)
			this.controller.get('score' + x).update(global.scores[x].score)
		}
	}
}


ScoringAssistant.prototype.deactivate = function(event) {
}

ScoringAssistant.prototype.cleanup = function(event) {
}
