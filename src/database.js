const Sequelize = require('sequelize');
const nodeStatusModel = require('../models/nodeStatus');
const nodesDataModel = require('../models/nodesData');
const settingsModel = require('../models/settings');
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

// Create tables if they were not already in the database.
sequelize.sync().then(() => {
  console.log('TABLES HAVE BEEN CREATED');
  DBstorage.getTableCount('Settings')
    .then(count => {
      if (count == 0) DBstorage.createSettingsOnce();
  });
});

module.exports.NodeStatus = NodeStatus;
module.exports.NodesData = NodesData;
module.exports.Settings = Settings;