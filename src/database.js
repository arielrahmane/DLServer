const Sequelize = require('sequelize');
const nodeStatusModel = require('../models/nodeStatus');
const nodesDataModel = require('../models/nodesData');
const nodesHourAvModel = require('../models/nodesHourAv');
const nodesDailyAvModel = require('../models/nodesDailyAv');
const nodesMonthlyAvModel = require('../models/nodesMonthlyAv');
const settingsModel = require('../models/settings');
const systemModel = require('../models/system');

const sequelize = new Sequelize('dlserverDB', 'root', 'ariel', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typeCast: true
  },
  timezone: '-03:00'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const NodeStatus = nodeStatusModel(sequelize, Sequelize);
const NodesData = nodesDataModel(sequelize, Sequelize);
const NodesHourAv = nodesHourAvModel(sequelize, Sequelize);
const NodesDailyAv = nodesDailyAvModel(sequelize, Sequelize);
const NodesMonthlyAv = nodesMonthlyAvModel(sequelize, Sequelize);
const Settings = settingsModel(sequelize, Sequelize);
const System = systemModel(sequelize, Sequelize);

// Create tables if they were not already in the database.
sequelize.sync().then(() => {
  console.log('TABLES HAVE BEEN CREATED');
  Settings.count().then(count => {
    if (count == 0) {
      Settings.create({
        amountOfNodes: 0,
        sensorSamplingFreq: 0.0
      });
    }
  });

  System.count().then(count => {
    if (count == 0) {
      System.create({
        deviceConfigured: false,
        ltSubdomain: "opendl"
      });
    }
  });
});

module.exports.NodeStatus = NodeStatus;
module.exports.NodesData = NodesData;
module.exports.NodesDailyAv = NodesDailyAv;
module.exports.NodesHourAv = NodesHourAv;
module.exports.NodesMonthlyAv = NodesMonthlyAv;
module.exports.Settings = Settings;
module.exports.System = System;