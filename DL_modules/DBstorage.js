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

function deleteTable(tableName) {
	switch (tableName) {
		case 'NodeStatus': 
			DB.NodeStatus.destroy({
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
	updateNodeStatus
}