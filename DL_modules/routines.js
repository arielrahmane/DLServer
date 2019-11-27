//Here we create the different routines the server will be executing periodically

const CronJob = require('cron').CronJob;
const moment = require('moment');
const XLSX = require('xlsx');
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

	beginJob(datetime1, datetime2, dbStorage.getNodesDataSpan, dbStorage.addNodeHourAv);

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

	beginJob(datetime1, datetime2, dbStorage.getNodeHourAv, dbStorage.addNodeDailyAv);
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

	beginJob(datetime1, datetime2, dbStorage.getNodeDailyAv, dbStorage.addNodeMonthlyAv);
});

/*
	Format of the output from the DB request:
	[
		NodesData: {
			dataValues: {
				id: Integer,
				tempA: float,
				tempB: float,
				tempC: float,
				humidA: float,
				humidB: float,
				humidC: float,
				alcohol: float,
				createdAt: Date, -----> (YYYY-MM-DD HH:mm:ss)
				updatedAt: Date  -----> (YYYY-MM-DD HH:mm:ss)
			}
		}
	]
 */
var wb = XLSX.utils.book_new();
var ws = new Object();
function csv() {
	var jsonArray = [];
	const fields = ['id', 'nodeID', 
					'tempA', 'tempB', 'tempC', 
					'humidA', 'humidB', 'humidC', 
					'alcohol', 'createdAt', 'updatedAt'];
	dbStorage.getNodesDataSpan(7, "2019-11-11 22:30:00", "2019-11-11 22:31:00")
	.then(dataSet => {
		for (var i=0; i<dataSet.length; i++) {
			var idata = dataSet[i].dataValues;
			jsonArray.push(idata);
		};
		var ws_aux = XLSX.utils.json_to_sheet(jsonArray, {header: fields});
		ws = ws_aux;
	})
	.catch(err => {
		console.log(err);
	});
	dbStorage.getNodesDataSpan(14, "2019-11-11 22:30:00", "2019-11-11 22:31:00")
	.then(dataSet => {
		for (var i=0; i<dataSet.length; i++) {
			var idata = dataSet[i].dataValues;
			jsonArray.push(idata);
		};
		XLSX.utils.sheet_add_json(ws, jsonArray, {header: fields, skipHeader: true, origin: -1});
	})
	.catch(err => {
		console.log(err);
	});
	setTimeout(() => {
		XLSX.utils.book_append_sheet(wb, ws, 'out.xlsx');
		XLSX.writeFile(wb, 'out.xlsx');
	}, 5000);
}

function fakeDB() { 
	var currentDate = moment().subtract(1, "days");
	var passedDate = moment().subtract(3, "years");

	var minTemp = 20.0;
	var maxTemp = 40.0;
	var minHumid = 0.0;
	var maxHumid = 100.0;
	var minalcohol = 0.0;
	var maxalcohol = 20.0;

	var tempA_p = 20.0; 
	var humidA_p = 60.0; 
	var alcohol_p = 5.0; 
	while (currentDate.diff(passedDate, 'days') > 0) {

		if (passedDate.month() <= 4 || passedDate.month() >= 10) {
			minTemp = 20.0;
			maxTemp = 40.0;
			minHumid = 40.0;
			maxHumid = 100.0;
		} else {
			minTemp = 0.0;
			maxTemp = 20.0;
			minHumid = 0.0;
			maxHumid = 80.0;
		}
		var multipTemp = (tempA_p-minTemp < 3.0 || maxTemp-tempA_p < 3.0) ? 1.13 : 0.31;
		var multipHumid = (humidA_p-minHumid < 6.0 || maxHumid-humidA_p < 6.0) ? 3.2 : 1.1;
		var multipAlcohol = (alcohol_p-minalcohol < 2.0 || maxalcohol-alcohol_p < 2) ? 0.91 : 0.11;
		var rand = Math.floor(Math.random()*10);
		var sign = parseFloat(Math.sign(rand-4));

		if (tempA_p-minTemp < 3.0) {sign=1.0; multipTemp = multipTemp*(-1.0)};
		if (maxTemp-tempA_p < 3.0) {sign=-1.0;multipTemp = multipTemp*(-1.0)};
		var refTemp = tempA_p + sign - multipTemp*sign;

		if (humidA_p-minHumid < 6.0) {sign=1.0; multipHumid = multipHumid*(-1.0)};
		if (maxHumid-humidA_p < 6.0) {sign=-1.0;multipHumid = multipHumid*(-1.0)};
		var refHumid = humidA_p + sign*5 - multipHumid*sign;

		if (alcohol_p-minalcohol < 2.0) {sign=1.0; multipAlcohol = multipAlcohol*(-1.0)};
		if (maxalcohol-alcohol_p < 2.0) {sign=-1.0;multipAlcohol = multipAlcohol*(-1.0)};
		var refAlcohol = alcohol_p + sign*0.5 - multipAlcohol*sign;

		refTemp = parseFloat(refTemp).toFixed(2);
		refHumid = parseFloat(refHumid).toFixed(2);
		refAlcohol = parseFloat(refAlcohol).toFixed(2);

		var monthlyAvg = {
			nodeID: 14,
			tempA: refTemp,
			tempB: refTemp,
			tempC: refTemp,
			humidA: refHumid,
			humidB: refHumid,
			humidC: refHumid,
			alcohol: refAlcohol,
			date: passedDate.format("YYYY-MM-DD HH:mm:ss")
		}

		dbStorage.addNodeMonthlyAv(monthlyAvg);

		tempA_p = parseFloat(refTemp); 
		humidA_p = parseFloat(refHumid); 
		alcohol_p = parseFloat(refAlcohol); 

		passedDate = passedDate.add(1, "months");
	};
}

async function beginJob(d1, d2, funcGet, funcSet) {
	for (var node = 0; node<16; node++) {
		await funcGet(node, d1, d2)
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

			var avg = {
				nodeID: node,
				tempA: tempAAvg,
				tempB: tempBAvg,
				tempC: tempCAvg,
				humidA: humidAAvg,
				humidB: humidBAvg,
				humidC: humidCAvg,
				alcohol: alcoholAvg,
				date: d1
			};

			funcSet(avg);
		})
		.catch(err => {
			console.log(err);
		});
	}
}

function getAvg(arr) {
	if (arr.length == 0) return null;
	var sum = arr.reduce((a,b) => a + b, 0);
	var avg = (sum/arr.length).toFixed(2);
	return avg;
}

module.exports = {
    hourJob,
    dailyJob,
	monthlyJob,
	fakeDB,
	csv
}