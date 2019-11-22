const CONFIG = require('../engine/config');
const DB = require('../src/database');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

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
		amountOfNodes: 0,
		sensorSamplingFreq: 0.0
	});
}

function createSystemOnce() {
	console.log('CREATING SYSTEM ROW!');
	DB.System.create({
		deviceConfigured: false,
		ltSubdomain: "opendl"
	});
}

function updateSettings(values) {
	return new Promise(function(resolve, reject) {
		if (values.amountOfNodes > 0
			&& values.sensorSamplingFreq > 0
			&& typeof(values.amountOfNodes) === 'number'
			&& typeof(values.sensorSamplingFreq) === 'number') {
			DB.Settings.update({
				amountOfNodes: values.amountOfNodes, 
				sensorSamplingFreq: values.sensorSamplingFreq}, {where: {id: 1}})
			.then(result => {
				var response = {response: result, message: 'Configuración actualizada.'};
				resolve(response);
			})
			.catch(error => {
				var response = {response: error, message: 'Error de actualización'};
				reject(response);
			});
		}
		else {
			var response = {response: 'Entrada inválida', message: 'Entrada inválida'};
			reject(response);
		}
	});
}

function updateSystem(paramName, paramValue) {
	if (paramName === "deviceConfigured") {
		DB.System.update({deviceConfigured: paramValue}, {where: {id: 1}});
	} else if (paramName === "ltSubdomain") {
		DB.System.update({ltSubdomain: paramValue}, {where: {id: 1}});
	} else return;
}

function getSettings() {
	return new Promise(function(resolve, reject){
		DB.Settings.findOne({ where: {id: 1} }).then(settings => {
			resolve(settings.dataValues);
		});
	});
}

function getSystem() {
	return new Promise(function(resolve, reject){
		DB.System.findOne({ where: {id: 1} }).then(system => {
			resolve(system.dataValues);
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

function addNodeHourAv(hourAv) {
	DB.NodesHourAv.create ({
		nodeID: hourAv.nodeID,
		tempA: hourAv.tempA,
		tempB: hourAv.tempB,
		tempC: hourAv.tempC,
		humidA: hourAv.humidA,
		humidB: hourAv.humidB,
		humidC: hourAv.humidC,
		alcohol: hourAv.alcohol,
		date: hourAv.date
	});
}

function getNodeHourAv(node, fromDate, toDate) {
	return new Promise(function(resolve, reject) {
		DB.NodesHourAv.findAll({ 
			where: {
				nodeID: node,
				date: {
					[Op.between]: [fromDate, toDate]
				  }
			}
		})
		.then(dataSet => {
			resolve(dataSet);
		});
	});
	
}

function addNodeDailyAv(dailyAv) {
	DB.NodesDailyAv.create ({
		nodeID: dailyAv.nodeID,
		tempA: dailyAv.tempA,
		tempB: dailyAv.tempB,
		tempC: dailyAv.tempC,
		humidA: dailyAv.humidA,
		humidB: dailyAv.humidB,
		humidC: dailyAv.humidC,
		alcohol: dailyAv.alcohol,
		date: dailyAv.date
	});
}

function getNodeDailyAv(node, fromDate, toDate) {
	return new Promise(function(resolve, reject) {
		DB.NodesDailyAv.findAll({ 
			where: {
				nodeID: node,
				date: {
					[Op.between]: [fromDate, toDate]
				  }
			}
		})
		.then(dataSet => {
			resolve(dataSet);
		});
	});
	
}

function addNodeMonthlyAv(monthlyAv) {
	DB.NodesMonthlyAv.create ({
		nodeID: monthlyAv.nodeID,
		tempA: monthlyAv.tempA,
		tempB: monthlyAv.tempB,
		tempC: monthlyAv.tempC,
		humidA: monthlyAv.humidA,
		humidB: monthlyAv.humidB,
		humidC: monthlyAv.humidC,
		alcohol: monthlyAv.alcohol,
		date: monthlyAv.date
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
		case 'System': 
			DB.System.destroy({
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
			case 'System': 
				DB.System.count().then(count => {
					tableCount = count;
					console.log("There are " + tableCount + " System!");
					resolve(count);
				});
				break;
			default:
				console.log('Error: Table does not exist', tableName);
				reject('The table does not exist');
		}
	});
	
}


function getNodesDataSpan(node, fromDate, toDate) {
	return new Promise(function(resolve, reject) {
		DB.NodesData.findAll({
			where: {
				nodeID: node,
				createdAt: {
					[Op.between]: [fromDate, toDate]
				  }
			}
		}).then(data => {
			resolve(data);
		})
	});
}

module.exports = {
	createNodeStatus,
	updateNodeStatus,
	addNodeData,
	updateSettings,
	createSettingsOnce,
	getTableCount,
	getSettings,
	createSystemOnce,
	updateSystem,
	getSystem,
	addNodeHourAv,
	addNodeDailyAv,
	addNodeMonthlyAv,
	getNodesDataSpan,
	getNodeHourAv
}