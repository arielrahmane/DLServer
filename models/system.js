module.exports = (sequelize, type) => {
	return sequelize.define('System', {
		deviceConfigured: type.BOOLEAN,
		tunnel: type.STRING(1234)
	}, {
		freezeTableName: true,
		tableName: 'System'
	})
};