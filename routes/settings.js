const Settings = require('../src/database');
const DBstorage = require('../DL_modules/DBstorage');

module.exports = app => {
	app.get('/settings', (req, res) => {
		DBstorage.getSettings().then(settings => {
			res.send(settings);
		});
	});

	app.get('/settings/:setting', (req, res) => {
		var setting = req.params.setting;
		DBstorage.getSettings().then(settings => {
			res.send(settings[setting]);
		});
	});

	app.put('/settings', (req, res) => {
		var setting = req.params.setting;
		var values = req.body;
		DBstorage.updateSettings(values)
		.then(result => {res.status(200).send(result.message);})
		.catch(error => {res.status(400).send(error)});
	});
};