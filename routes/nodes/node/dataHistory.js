// This is the routes to get individuals nodes data history

const {NodesData, NodesHourAv, NodesDailyAv, NodesMonthlyAv} = require("../../../src/database");
const DBStorage = require("../../../DL_modules/DBstorage");
const _ = require('lodash');

function findNodeHistory(node, field, res) {
	NodesData.findAll({
		attributes: [field, 'createdAt'],
		where: {
			nodeID: node
		},
		order: [['createdAt', 'DESC']]
	})
	.then(nodeData => {
		// console.log("THIS IS THE NODE HISTORY: ", nodeData);
		res.send(nodeData);
	})
	.catch(err => {
		res.status(400).send(err);
	})
};

function getNodesDataSet(node, field, params, res) {
	if (_.isEmpty(params)) {
		findNodeHistory(node, field, res);
	} else {
		var timeSpan = params.timeSpan;
		var fromDate = params.fromDate;
		var toDate = params.toDate;

		switch (timeSpan) {
			case "minutes":
				DBStorage.getVariableSpan(NodesData, node, field, fromDate, toDate)
				.then(dataSet => {
					res.send(dataSet);
				})
				.catch(err => {
					res.status(400).send(err);
				});
				break;
			case "hours":
				DBStorage.getVariableSpan(NodesHourAv, node, field, fromDate, toDate)
				.then(dataSet => {
					res.send(dataSet);
				})
				.catch(err => {
					res.status(400).send(err);
				});
				break;
			case "days":
				DBStorage.getVariableSpan(NodesDailyAv, node, field, fromDate, toDate)
				.then(dataSet => {
					res.send(dataSet);
				})
				.catch(err => {
					res.status(400).send(err);
				});
				break;
			case "days":
				DBStorage.getVariableSpan(NodesMonthlyAv, node, field, fromDate, toDate)
				.then(dataSet => {
					res.send(dataSet);
				})
				.catch(err => {
					res.status(400).send(err);
				});
				break;
			default:
				break;
		}
	}
}

module.exports = app => {
	/* 
		/nodes/:node/history/:field?timeSpan=days&fromDate="2019-11-11 12:00:00"&toDate="2019-11-12 12:00:00"
		timeSpan = [minutes, hours, days, months] (possible values)
	*/
	app.get('/nodes/:node/history/:field', (req, res) => {
		var node = req.params.node;
		var field = (req.params.field).toString();
		getNodesDataSet(node, field, req.query, res);
	});
};