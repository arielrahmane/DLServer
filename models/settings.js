// If any other field is added to the database, it will be needed to update the updateSettings() function in the
// DBStorage.js module.

module.exports = (sequelize, type) => {
	return sequelize.define('Settings', {
		deviceConfigured: type.BOOLEAN,
		amountOfNodes: type.INTEGER,
		sensorSamplingFreq: type.FLOAT
	}, {
		freezeTableName: true,
		tableName: 'Settings'
	})
};
