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
var hour = 20;
var day = 11;
const testJob = new CronJob('*/3 * * * * *', function() {
	var tempA = []; 
	var tempB = []; 
	var tempC = []; 
	var humidA = []; 
	var humidB = []; 
	var humidC = []; 
	var alcohol = []; 

	//var date1 = moment().subtract(0, "days").format("YYYY-MM-DD");
	//var time1 = moment().subtract(0, "hours").format("HH:mm:ss");
	var stringHour = (hour < 10) ? "0" + hour.toString() : hour.toString();
	var date1 = "2019-11-" + day.toString();
	var time1 = stringHour + ":00:00";
	var datetime1 = date1 + " " + time1;

	hour++;
	if (hour > 23) {
		hour = 0;
		day++; //Cuidado con pasarse de fechas permitidas
	};

	stringHour = (hour < 10) ? "0" + hour.toString() : hour.toString();
	var date2 = "2019-11-" + day.toString();
	var time2 = stringHour + ":00:00";
	var datetime2 = date2 + " " + time2;

	var requiredNodeID = 3;

	console.log(datetime1);
	console.log(datetime2);

	dbStorage.getNodeHourAv(14, "2019-11-11 21:00:00", "2019-11-12 03:00:00").then(dataSet => {
		for(var i = 0; i<dataSet.length; i++) {
			console.log(dataSet[i].dataValues);
		}
	})

	/*dbStorage.getNodesDataSpan(requiredNodeID, datetime1, datetime2)
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
		tempAAvg = getAvg(tempA);
		tempBAvg = getAvg(tempB);
		tempCAvg = getAvg(tempC);
		humidAAvg = getAvg(humidA);
		humidBAvg = getAvg(humidB);
		humidCAvg = getAvg(humidC);
		alcoholAvg = getAvg(alcohol);

		var hourAv = {
			nodeID: requiredNodeID,
			tempA: tempAAvg,
			tempB: tempBAvg,
			tempC: tempCAvg,
			humidA: humidAAvg,
			humidB: humidBAvg,
			humidC: humidCAvg,
			alcohol: alcoholAvg,
			date: datetime1
		};

		dbStorage.addNodeHourAv(hourAv);
	});*/

	//Output ---> [NodesData: {dataValues}, ]
});

function getAvg(arr) {
	var sum = arr.reduce((a,b) => a + b, 0);
	if (arr.length == 0) return null;
	var avg = (sum/arr.length).toFixed(2);
	return avg;
}

module.exports = {
    dailyJob,
    hourJob,
	monthJob,
	testJob
}