// This is the route for the nodes status information

const {NodeStatus} = require("../../src/database");

function find(res) {
	NodeStatus.findAll({
		where: {
			
		}
	})
	.then(nodes => {
		res.send(JSON.stringify(nodes));
	})
	.catch(err => {
		res.send(err);
	})
}

module.exports = app => {
	app.get('/nodes', (req, res) => {
		find(res);
	});
};

/*
JSON.stringify(actives) = 
[{"id":8,"nodeID":7,"active":true,"createdAt":"2019-05-30T19:25:13.000Z","updatedAt":"2019-05-30T19:25:22.000Z"},
{"id":13,"nodeID":12,"active":true,"createdAt":"2019-05-30T19:25:13.000Z","updatedAt":"2019-05-30T19:25:27.000Z"}]
*/