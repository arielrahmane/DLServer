const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mysql = require('mysql')
const Sequelize = require('sequelize');
const NodeStatusModel = require("../models/nodeStatus");
const InternetAv = require("../DL_modules/online");
const routines = require("../DL_modules/routines");
// const WAP = require('../DL_modules/wap');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

//Routes
require('../routes/getSens')(app);
require('../routes/homePage')(app);
require('../routes/device')(app);
require('../routes/settings')(app);
require('../routes/nodes/status')(app);
require('../routes/nodes/node/data')(app);
require('../routes/nodes/node/dataHistory')(app);

//Engine
const Engine = require('../engine/engine');

Engine.engine();
//Engine.startNodesScan(Engine.startSensorsRead);

//Port config
 app.listen(process.env.PORT || 8081); //, "https://opendl.localtunnel.me"); //, "192.168.0.7")
 /*app.listen(process.env.PORT || 8081, "opendl.localtunnel.me", function() {
 	 console.log("... port %d in %s mode", app.address());
 });*/

//InternetAv.onlineCheck(InternetAv.startTunnel, true);
InternetAv.startTunnel();

routines.hourJob.start();
routines.dailyJob.start();
routines.monthlyJob.start();

module.exports = app;