const NodeStatus = require('../src/database');

module.exports = app => {
	app.get('/', (req, res) => {
	  var data = {
	  	nodeID: 7,
      	active: false
	  };

	  NodeStatus.create(data)
	      .then(() => {
	        res.send({
	          success: true,
	          message: 'Node saved successfully!'
	        });
	      })
	      .catch(err => {
	        console.log("Problem saving Node");
	        res.status(500).json(err);
	      });
	})
};