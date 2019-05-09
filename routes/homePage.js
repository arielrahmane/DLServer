//const NodeStatus = require('../src/database');

module.exports = app => {
	app.get('/', (req, res) => {
	  res.send(
	    [{
	      title: "This is the home page!",
	      description: "In development"
	    }]
	  )
	})
};