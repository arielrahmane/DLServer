const FLAG = require('./flags');
const DBstorage = require('../../DL_modules/DBstorage');

let activeNodes = [];
let currentID = 0;
let currentNodeData = {
	nodeID: 0,
	temp: 0.0,
	humid: 0.0,
	alcohol: 0
};

function setCurrentNodeData(param, value) {
	switch (param) {
		case "nodeID":
			currentNodeData.nodeID = value;
			break;
		case "temp":
			currentNodeData.temp = value;
			break;
		case "humid":
			currentNodeData.humid = value;
			break;
		case "alcohol":
			currentNodeData.alcohol = value;
			break;
		default:
			console.log("Error: there is no parameter in currentNodeData.");
	}
}

function getCurrentNodeData() {
	return currentNodeData;
}

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
		currentID = val;
	},
	getCurrentID: function() {
		return currentID;
	},
	updateCurrentID: function(oldID) {
		var index = this.getActiveNodes().indexOf(oldID) + 1;
		if (index >= this.getActiveNodes().length) index = 0;
		this.setCurrentID(this.getActiveNodes()[index]);
	},
	setCurrentNodeData,
	getCurrentNodeData
};