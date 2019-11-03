const Sequelize = require('sequelize');
const nodeStatusModel = require('../models/nodeStatus');
const nodesDataModel = require('../models/nodesData');
const settingsModel = require('../models/settings');
const systemModel = require('../models/system');
const DBstorage = require('../DL_modules/DBstorage');

const sequelize = new Sequelize('dlserverDB', 'root', 'ariel', {
  host: 'localhost',
  dialect: 'mysql'
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
const Settings = settingsModel(sequelize, Sequelize);
const System = systemModel(sequelize, Sequelize);

// Create tables if they were not already in the database.
sequelize.sync().then(() => {
  console.log('TABLES HAVE BEEN CREATED');
  DBstorage.getTableCount('Settings')
    .then(count => {
      if (count == 0) DBstorage.createSettingsOnce();
  });
  DBstorage.getTableCount('System')
    .then(count => {
      if (count == 0) {
        console.log("Creating SYSTEM table");
        DBstorage.createSystemOnce();
      };
    })
    .catch(error => {
      console.log("ERROR AL CREAR SYSTEM " + error);
    });
});

module.exports.NodeStatus = NodeStatus;
module.exports.NodesData = NodesData;
module.exports.Settings = Settings;
module.exports.System = System;