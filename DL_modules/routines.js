//Here we create the different routines the server will be executing periodically

const CronJob = require('cron').CronJob;
const moment = require('moment');
const DB = require('../src/database');
const dbStorage = require('./DBstorage');

//Rutine every hour
/*
===> This routine is meant for saving every hour, an avarage value of all the data collected by each node.
===> Therefore, when we want to display, for e.g. the history of node N for a certain day, 
we wil receive a set of 24 values, representing the average for each hour of the day, 
instead of receiveing thousand of values impossible to display in a chart.
===> The values are stored in the database "NodesHourAv".
*/
const hourJob = new CronJob('0 0 */1 * * *', function() { 

	var currentDate = moment().format("YYYY-MM-DD");
	var currentTime = moment().format("HH:mm:ss");
	var passedDate = moment().subtract(1, "hours").format("YYYY-MM-DD");
	var passedTime = moment().subtract(1, "hours").format("HH:mm:ss");

	var datetime2 = currentDate + " " + currentTime;
	var datetime1 = passedDate + " " + passedTime;

	beginJob(datetime1, datetime2);

	async function beginJob(d1, d2) {
		for (var node = 0; node<16; node++) {
			await dbStorage.getNodesDataSpan(node, d1, d2)
			.then(data => {
				var length = data.length;
				var tempA = []; 
				var tempB = []; 
				var tempC = []; 
				var humidA = []; 
				var humidB = []; 
				var humidC = []; 
				var alcohol = []; 

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
					nodeID: node,
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
			})
			.catch(err => {
				console.log(err);
			});
		}
	}
});

//Routine every midnight
/*
===> This routine is meant for saving every day, an avarage value of all the data collected by each node.
===> Therefore, when we want to display, for e.g. the history of node N for a certain week, 
we wil receive a set of 7 values, representing the average for each day of the week, 
instead of receiveing thousand of values impossible to display in a chart.
===> The values are stored in the database "NodesDailyAv".
*/
const dailyJob = new CronJob('00 00 00 * * *', function() {
	var currentDate = moment().subtract(1, "hours").format("YYYY-MM-DD");
	var passedDate = moment().subtract(1, "days").format("YYYY-MM-DD");

	var datetime2 = currentDate;
	var datetime1 = passedDate;

	beginJob(datetime1, datetime2);

	async function beginJob(d1, d2) {
		for (var node = 0; node<16; node++) {
			await dbStorage.getNodeHourAv(node, d1, d2)
			.then(data => {
				var length = data.length;
				var tempA = []; 
				var tempB = []; 
				var tempC = []; 
				var humidA = []; 
				var humidB = []; 
				var humidC = []; 
				var alcohol = []; 

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
	
				var dailyAv = {
					nodeID: node,
					tempA: tempAAvg,
					tempB: tempBAvg,
					tempC: tempCAvg,
					humidA: humidAAvg,
					humidB: humidBAvg,
					humidC: humidCAvg,
					alcohol: alcoholAvg,
					date: datetime1
				};
	
				dbStorage.addNodeDailyAv(dailyAv);
			})
			.catch(err => {
				console.log(err);
			});
		}
	}
});

//Rutine every month
/*
===> This routine is meant for saving every month, an avarage value of all the data collected by each node.
===> Therefore, when we want to display, for e.g. the history of node N for a certain year, 
we wil receive a set of 12 values, representing the average for each month of the year, 
instead of receiveing thousand of values impossible to display in a chart.
===> The values are stored in the database "NodesMonthlyAv".
*/
const monthlyJob = new CronJob('0 0 0 1 * *', function() { 
	var currentDate = moment().subtract(1, "days").format("YYYY-MM-DD");
	var passedDate = moment().subtract(1, "months").format("YYYY-MM-DD");

	var datetime2 = currentDate;
	var datetime1 = passedDate;

	beginJob(datetime1, datetime2);

	async function beginJob(d1, d2) {
		for (var node = 0; node<16; node++) {
			await dbStorage.getNodeDailyAv(node, d1, d2)
			.then(data => {
				var length = data.length;
				var tempA = []; 
				var tempB = []; 
				var tempC = []; 
				var humidA = []; 
				var humidB = []; 
				var humidC = []; 
				var alcohol = []; 

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
	
				var monthlyAv = {
					nodeID: node,
					tempA: tempAAvg,
					tempB: tempBAvg,
					tempC: tempCAvg,
					humidA: humidAAvg,
					humidB: humidBAvg,
					humidC: humidCAvg,
					alcohol: alcoholAvg,
					date: datetime1
				};
	
				dbStorage.addNodeMonthlyAv(monthlyAv);
			})
			.catch(err => {
				console.log(err);
			});
		}
	}
});

function getAvg(arr) {
	if (arr.length == 0) return null;
	var sum = arr.reduce((a,b) => a + b, 0);
	var avg = (sum/arr.length).toFixed(2);
	return avg;
}

module.exports = {
    hourJob,
    dailyJob,
	monthlyJob
}