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

	// Ok Button Widget
	this.controller.setupWidget('resetHighScores', atts = {
		type: Mojo.Widget.defaultButton
	}, {
		buttonLabel: 'Reset Scores',
		buttonClass: 'negative',
		disabled: false
	});

	this.resetHighScoresHandler = this.resetHighScores.bindAsEventListener(this)
	
	this.controller.listen('resetHighScores', Mojo.Event.tap, this.resetHighScoresHandler)
}

ScoringAssistant.prototype.resetHighScores = function () {
	this.controller.showAlertDialog({
		onChoose: this.doResets,
		title: $L("Reset!"),
		message: $L("Are you sure?"),
		choices: [{
			label: $L("Yes"),
			value: 'yes',
			type: 'affirmative'
		}, {
			label: $L("No"),
			value: 'no',
			type: 'negative'
		}, ]
	});
}
ScoringAssistant.prototype.doResets = function(choice){
	if (choice == 'yes') {
		global.scores = []
		for (var x = 1; x <= 10; x++) {
			scoringElements.name[x].update('')
			scoringElements.score[x].update('')
			scoringElements.date[x].update('')
		}
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
	this.controller.stopListening('resetHighScores', Mojo.Event.tap, this.resetHighScoresHandler)
}
