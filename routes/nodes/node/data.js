// This is the routes to get individuals nodes data

const {NodesData} = require("../../../src/database");

module.exports = app => {
	app.get('/nodes/:node', (req, res) => {
		console.log("Entered to /nodes/", req.body.node);
	});
};