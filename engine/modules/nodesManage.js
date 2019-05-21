const FLAG = require('./flags');
const DBstorage = require('../../DL_modules/DBstorage');

let activeNodes = [];
let currentID = 0;

module.exports = {
	addToActiveNodes: function(nodeResponse) {
		if (nodeResponse.includes("ID" + this.getCurrentID())) {
			activeNodes.push(this.getCurrentID());
			DBstorage.updateNodeStatus(this.getCurrentID(), true);
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
	}
};