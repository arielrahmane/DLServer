//Here we create the different routines the server will be executing periodically

const CronJob = require('cron').CronJob;
const moment = require('moment')


//Routine every midnight
const midnightJob = new CronJob('00 00 00 * * *', function() {
	const d = moment();
	console.log('Midnight:', d);
});

//Rutine every hour
const hourJob = new CronJob('0 0  */1 * * *', function() {
	const d = moment();
	console.log('Hour:', d);
});

//Rutine every month
const monthJob = new CronJob('0 0 0 0 */1 *', function() {
	const d = moment();
	console.log('Month:', d);
});

module.exports = {
    midnightJob,
    hourJob,
    monthJob
}