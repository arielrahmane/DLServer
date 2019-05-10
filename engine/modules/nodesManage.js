const flag = require('./flags');

let activeNodes = [];
let currentID = 0;

module.exports = {
	addToActiveNodes: function(nodeResponse) {
		if (flag.getInitialStage() && nodeResponse.includes("ID" + this.getCurrentID())) {
			activeNodes.push(this.getCurrentID());
		}
	},
	getActiveNodes: function() {
		return activeNodes;
	},
	setCurrentID: function(val) {
		curerntID = val;
	},
	getCurrentID: function() {
		return curerntID;
	}
};