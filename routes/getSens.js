const NodeStatus = require('../src/database');

module.exports = app => {
	app.get('/sensData', (req, res) => {
	  res.send(
	    [{
	      title: "Hello World!",
	      description: "Hi there! How are you?"
	    }]
	  )
	})
};