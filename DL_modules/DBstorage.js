const CONFIG = require('../engine/config');
const DB = require('../src/database');

function createNodeStatus() {
	deleteTable();
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

function deleteTable() {
	DB.NodeStatus.destroy({
		where: {},
		truncate: true
	});
}
module.exports = {
	createNodeStatus,
	updateNodeStatus
}