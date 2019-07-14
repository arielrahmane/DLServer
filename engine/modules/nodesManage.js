const FLAG = require('./flags');
const DBstorage = require('../../DL_modules/DBstorage');

let activeNodes = [];
let currentID = 0;
let currentNodeData = {
	nodeID: 0,
	tempA: 0.0,
	tempB: 0.0,
	tempC: 0.0,
	humidA: 0.0,
	humidB: 0.0,
	humidC: 0.0,
	alcohol: 0
};

function setCurrentNodeData(param, value) {
	switch (param) {
		case "nodeID":
			currentNodeData.nodeID = value;
			break;
		case "dht":
			currentNodeData.tempA = value.tempA;
			currentNodeData.tempB = value.tempB;
			currentNodeData.tempC = value.tempC;
			currentNodeData.humidA = value.humidA;
			currentNodeData.humidB = value.humidB;
			currentNodeData.humidC = value.humidC;
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