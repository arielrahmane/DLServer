const {NodeStatus} = require("../src/database");


/*
let getActiveNodes = new Promise((resolve, reject) => {
	NodeStatus.findAll({
		where: {
			active: true
		}
	})
	.then(actives => {
		if (actives != null) {
			resolve(JSON.stringify(actives));
		} else {
			resolve([{}]);
		}
	})
	.catch(err => {
		reject(err);
	})
});
*/

function find(res) {
	NodeStatus.findAll({
		where: {
			active: true
		}
	})
	.then(actives => {
		res.send(JSON.stringify(actives));
	})
	.catch(err => {
		res.send(err);
	})
}

module.exports = app => {
	app.get('/nodes-status', (req, res) => {
		find(res);
	});
};

/*
JSON.stringify(actives) = 
[{"id":8,"nodeID":7,"active":true,"createdAt":"2019-05-30T19:25:13.000Z","updatedAt":"2019-05-30T19:25:22.000Z"},
{"id":13,"nodeID":12,"active":true,"createdAt":"2019-05-30T19:25:13.000Z","updatedAt":"2019-05-30T19:25:27.000Z"}]
*/