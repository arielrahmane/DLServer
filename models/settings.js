module.exports = (sequelize, type) => {
	return sequelize.define('Settings', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nodeID: type.INTEGER,
		active: type.BOOLEAN
	}, {
		freezeTableName: true,
		tableName: 'Settings'
	})
};
