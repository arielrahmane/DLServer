const CONFIG = require('../engine/config');
const DB = require('../src/database');

function createNodeStatus() {
	deleteTable('NodeStatus');
	for (var i = 0; i<CONFIG.numberOfNodes_; i++) {
		DB.NodeStatus.create ({
			nodeID: i,
			active: false
		});
	}
}

function updateNodeStatus(node, status) {
	DB.NodeStatus.update(
		{active: status},
		{where: {nodeID: node}}
	);
}

function updateSettings(settings) {
	if (settings.deviceConfigured) DB.Settings.update({deviceConfigured: settings.deviceConfigured});
	if (settings.amountOfNodes) DB.Settings.update({amountOfNodes: settings.amountOfNodes});
	if (settings.sensorSamplingFreq) DB.Settings.update({sensorSamplingFreq: settings.sensorSamplingFreq});
}

function addNodeData(nodeData) {
	DB.NodesData.create ({
		nodeID: nodeData.nodeID,
		tempA: nodeData.tempA,
		tempB: nodeData.tempB,
		tempC: nodeData.tempC,
		humidA: nodeData.humidA,
		humidB: nodeData.humidB,
		humidC: nodeData.humidC,
		alcohol: nodeData.alcohol
	});
}

function deleteTable(tableName) {
	switch (tableName) {
		case 'NodeStatus': 
			DB.NodeStatus.destroy({
				where: {},
				truncate: true
			});
			break;
		case 'NodesData': 
			DB.NodesData.destroy({
				where: {},
				truncate: true
			});
			break;
		default:
			console.log('Error: No existe la tabla que se quiere eliminar ', tableName);
	}
}

module.exports = {
	createNodeStatus,
	updateNodeStatus,
	addNodeData,
	updateSettings
}