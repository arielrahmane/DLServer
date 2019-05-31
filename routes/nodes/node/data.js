// This is the routes to get individuals nodes data

const {NodesData} = require("../../../src/database");

function findLatestEntry(node, res) {
	NodesData.findOne({
		where: {
			nodeID: node
		},
		order: [['createdAt', 'DESC']]
	})
	.then(nodeData => {
		console.log("THIS IS THE NODE DATA: ", JSON.stringify(nodeData));
		res.send(JSON.stringify(nodeData));
	})
	.catch(err => {
		res.status(400).send(err);
	})
}

module.exports = app => {
	app.get('/nodes/:node', (req, res) => {
		var node = req.params.node;
		findLatestEntry(node, res);
	});
};