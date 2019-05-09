module.exports = (sequelize, type) => {
	return sequelize.define('nodeStatus', {
		id: {
			type: type.INTEGER,
			primaryKey: true
		},
		active: type.BOOLEAN
	})
};
