// This is the routes to get individuals nodes data history

const {NodesData} = require("../../../src/database");

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
}

module.exports = app => {
	app.get('/nodes/:node/history/:field', (req, res) => {
		var node = req.params.node;
		var field = (req.params.field).toString();
		findNodeHistory(node, field, res);
	});
};