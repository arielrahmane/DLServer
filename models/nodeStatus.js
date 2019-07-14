module.exports = (sequelize, type) => {
	return sequelize.define('NodeStatus', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nodeID: type.INTEGER,
		active: type.BOOLEAN
	}, {
		freezeTableName: true,
		tableName: 'NodeStatus'
	})
};
