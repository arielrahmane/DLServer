module.exports = (sequelize, type) => {
	return sequelize.define('nodesData', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nodeID: type.INTEGER,
		temp: type.FLOAT,
		humid: type.FLOAT,
		alcohol: type.FLOAT
	}, {
		freezeTableName: true,
		tableName: 'nodesData'
	})
};
