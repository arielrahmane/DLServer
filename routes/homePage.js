const Engine = require('../engine/engine');

module.exports = app => {
	app.post('/', (req, res) => {
		switch (req.body.value) {
			case 1: 
				Engine.startNodesScan(function() {
					Engine.startSensorsRead();
					res.sendStatus(200);
				});
				break;
			case 2:
				Engine.startNodesScan(function() {
					res.status(200).send({finished: true, message: "Scan Finished"});
				});
				break;
			case 3:
				Engine.startSensorsRead();
				res.sendStatus(200);
				break;
			default:
				res.status(400).send({message: "Error: There is not such option."});
		}
	  console.log("Entered to Home Page");
	})
};