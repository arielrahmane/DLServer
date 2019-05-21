const FLAG = require('./flags');

var numberOfNodes = 16;
let activeNodes = [];
let currentID = 0;

module.exports = {
	addToActiveNodes: function(nodeResponse) {
		if (nodeResponse.includes("ID" + this.getCurrentID())) {
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
	},
	updateCurrentID: function(oldID) {
		var index = this.getActiveNodes().indexOf(oldID) + 1;
		if (index >= this.getActiveNodes().length) index = 0;
		this.setCurrentID(this.getActiveNodes()[index]);
	},
	getNumberOfNodes: function() {
		return numberOfNodes;
	}
};