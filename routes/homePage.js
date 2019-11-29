const Engine = require('../engine/engine');
const routines = require('../DL_modules/routines');
const mail = require('../DL_modules/mail');

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
			case 4:
				Engine.stopSensorsRead();
				res.sendStatus(200);
				break;
			default:
				res.status(400).send({message: "Error: There is not such option."});
		}
	  console.log("Entered to Home Page");
	}),
	
	app.post('/emailData', (req, res) => {
		var to = req.body.to;
		routines.csv((fileOut, fileOutPath) => {
			var parameters = {
				to: to,
				fileName: fileOut,
				filePath: fileOutPath
			};
			mail.sendEmail(parameters)
			.then(info => {
				res.status(200).send({message: info});
			})
			.catch(err => {
				res.status(400).send({message: err});
			});
		});
	});
};