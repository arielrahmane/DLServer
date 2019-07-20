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

function createSettingsOnce() {
	console.log('CREATING SETTINGS ROW!');
	DB.Settings.create({
		deviceConfigured: false,
		amountOfNodes: 0,
		sensorSamplingFreq: 0.0
	});
}

function updateSettings(setting, value) {
	if (setting) {
		DB.Settings.update({[setting]: value}, {where: {id: 1}}).then(() => {
			if (setting == 'amountOfNodes') DB.Settings.update({deviceConfigured: true}, {where: {id: 1}});
		});
	}
}

function getSettings() {
	return new Promise(function(resolve, reject){
		DB.Settings.findOne({ where: {id: 1} }).then(settings => {
			resolve(settings.dataValues);
		});
	});
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
		case 'Settings': 
			DB.Settings.destroy({
				where: {},
				truncate: true
			});
			break;
		default:
			console.log('Error: No existe la tabla que se quiere eliminar ', tableName);
	}
}

function getTableCount(tableName) {
	var tableCount = -1;
	return new Promise(function(resolve, reject){
		switch (tableName) {
			case 'NodeStatus':
				DB.NodeStatus.count().then(count => {
				  console.log("There are " + count + " NodeStatus!");
				  resolve(count);
				});
				break;
			case 'NodesData': 
				DB.NodesData.count().then(count => {
				  console.log("There are " + count + " NodesData!");
				  resolve(count);
				});
				break;
			case 'Settings': 
				DB.Settings.count().then(count => {
				  tableCount = count;
				  console.log("There are " + tableCount + " Settings!");
				  resolve(count);
				});
				break;
			default:
				console.log('Error: Table does not exist', tableName);
				reject('The table does not exist');
		}
	});
	
}

module.exports = {
	createNodeStatus,
	updateNodeStatus,
	addNodeData,
	updateSettings,
	createSettingsOnce,
	getTableCount,
	getSettings
}