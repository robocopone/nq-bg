function ScoringAssistant() {
}
var scoringElements = {}
ScoringAssistant.prototype.setup = function() {
	scoringElements.name = {}
	scoringElements.score = {}
	scoringElements.date = {}
	for (var x = 1; x <= 10; x++){
		scoringElements.name[x] = this.controller.get('name' + x);
		scoringElements.score[x] = this.controller.get('score' + x);
		scoringElements.date[x] = this.controller.get('date' + x);
	}
}

ScoringAssistant.prototype.activate = function(event) {
	for (var x = 1; x <= 10; x++) {
		if (global.scores[x]) {
			scoringElements.name[x].update('#' + x + ' - ' + global.scores[x].name)
			scoringElements.score[x].update(Mojo.Format.formatNumber(global.scores[x].score))
			scoringElements.date[x].update(global.scores[x].date)
		}
	}
}


ScoringAssistant.prototype.deactivate = function(event) {
}

ScoringAssistant.prototype.cleanup = function(event) {
}
