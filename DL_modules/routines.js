//Here we create the different routines the server will be executing periodically

const CronJob = require('cron').CronJob;
const moment = require('moment');
const DB = require('../src/database');
const dbStorage = require('./DBstorage');

//moment.defaultFormat = "YYYY-MM-DD, HH:mm:ss";


//Routine every midnight
const dailyJob = new CronJob('00 00 00 * * *', function() {
	const d = moment();
	console.log('Midnight:', d);
});

//Rutine every hour
const hourJob = new CronJob('0 0 */1 * * *', function() {
	const d = moment();
	console.log('Hour:', d);
});

//Rutine every month
const monthJob = new CronJob('0 0 0 1 * *', function() {
	const d = moment();
	console.log('Month:', d);
});

//Test routine
const testJob = new CronJob('* * * * * *', function() {
	// dbStorage.getNodesDataSpan(14, "2019-11-12 01:58:00", "2019-11-12 02:20:00")
	//.then(data => {console.log(data)});
	var date = moment().format("YYYY-MM-DD");
	var time = moment().format("HH:mm:ss");
	console.log(date + " " + time);
});

module.exports = {
    dailyJob,
    hourJob,
	monthJob,
	testJob
}