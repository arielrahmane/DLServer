module.exports = (sequelize, type) => {
	return sequelize.define('System', {
		deviceConfigured: type.BOOLEAN,
		tunnel: type.String
	}, {
		freezeTableName: true,
		tableName: 'System'
	})
};