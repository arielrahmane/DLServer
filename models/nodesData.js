module.exports = (sequelize, type) => {
	return sequelize.define('NodesData', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nodeID: type.INTEGER,
		tempA: type.FLOAT,
		tempB: type.FLOAT,
		tempC: type.FLOAT,
		humidA: type.FLOAT,
		humidB: type.FLOAT,
		humidC: type.FLOAT,
		alcohol: type.FLOAT
	}, {
		freezeTableName: true,
		tableName: 'NodesData'
	})
};
