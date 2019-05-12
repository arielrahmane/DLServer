const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mysql = require('mysql')
const Sequelize = require('sequelize');
const NodeStatusModel = require("../models/nodeStatus");

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

//Routes
require('../routes/getSens')(app);
require('../routes/homePage')(app);

//Engine
const Engine = require('../engine/engine');
Engine.engine();

app.listen(process.env.PORT || 8081, "192.168.0.18")

module.exports = app;