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
	addNodeData
}