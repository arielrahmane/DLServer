const Engine = require('../engine/engine');
const FLAGS = require('../engine/modules/flags');

module.exports = app => {
	app.get('/device/:query', (req, res) => {
		var query = String(req.params.query);
		switch (query) {
			case "isRunning":
				var isRunning = FLAGS.getDeviceRunning();
				res.status(200).send(isRunning);
				break;
			default:
				res.status(404).send({message: "Not Found"});
		}
	}),
	app.post('/device/:action', (req, res) => {
		var action = String(req.params.action);
		switch (action) {
			case "start":
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
				break;
			case "stop":
				Engine.stopSensorsRead();
				res.sendStatus(200);
				break;
			default:
				res.status(404).send({message: "Not Found"});
		}
	})
};