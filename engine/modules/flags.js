let initialStage = false;
let startedBody = false;

module.exports = {
	setInitialStage: function(val) {
		initialStage = val;
	},
	getInitialStage: function() {
		return initialStage;
	},
	setStartedBody: function(val) {
		startedBody = val;
	},
	getStartedBody: function() {
		return startedBody;
	}
};