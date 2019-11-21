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
var hour = 23;
var day = 11;
const testJob = new CronJob('5 * * * * *', function() {
	var tempA = []; 
	var tempB = []; 
	var tempC = []; 
	var humidA = []; 
	var humidB = []; 
	var humidC = []; 
	var alcohol = []; 

	//var date1 = moment().subtract(0, "days").format("YYYY-MM-DD");
	//var time1 = moment().subtract(0, "hours").format("HH:mm:ss");
	var date1 = "2019-11-" + day.toString();
	var time1 = hour.toString() + ":00:00";
	var datetime1 = date1 + " " + time1;
	//var date2 = moment().subtract(0, "days").format("YYYY-MM-DD");
	//var time2 = moment().subtract(0, "hours").format("HH:mm:ss");
	hour++;
	if (hour > 23) {
		hour = 00;
		day++; //Cuidado con pasarse de fechas permitidas
	};
	var date2 = "2019-11-" + day.toString();
	var time2 = hour.toString() + ":00:00";
	var datetime2 = date2 + " " + time2;
	dbStorage.getNodesDataSpan(14, datetime1, datetime2)
	.then(data => {
		var length = data.length;
		for (var i = 0; i<length; i++) {
			tempA.push(data[i].dataValues.tempA); 
			tempB.push(data[i].dataValues.tempB); 
			tempC.push(data[i].dataValues.tempC); 
			humidA.push(data[i].dataValues.humidA); 
			humidB.push(data[i].dataValues.humidB); 
			humidC.push(data[i].dataValues.humidC);
			alcohol.push(data[i].dataValues.alcohol); 
		}
		alcoholAvg = getAvg(alcohol);
		console.log("Promedio de tempA: " + alcoholAvg.toFixed(2));
	});

	//Output ---> [NodesData: {dataValues}, ]
});

function getAvg(arr) {
	var sum = arr.reduce((a,b) => a + b, 0);
	return sum/arr.length;
}

module.exports = {
    dailyJob,
    hourJob,
	monthJob,
	testJob
}