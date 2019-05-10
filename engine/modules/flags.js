let initialStage = false;

module.exports = {
	setInitialStage: function(val) {
		initialStage = val;
	},
	getInitialStage: function() {
		return initialStage;
	}
};