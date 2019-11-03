module.exports = (sequelize, type) => {
	return sequelize.define('System', {
		deviceConfigured: type.BOOLEAN,
		tunnel: type.STRING
	}, {
		freezeTableName: true,
		tableName: 'System'
	})
};