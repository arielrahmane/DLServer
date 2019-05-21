const Sequelize = require('sequelize');
const nodeStatusModel = require('../models/nodeStatus');
const sensorsDataModel = require('../models/sensorsData');

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
const SensorsData = sensorsDataModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  console.log(`Users db and user table have been created`);
});

module.exports.NodeStatus = NodeStatus;
module.exports.SensorsData = SensorsData;