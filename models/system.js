module.exports = (sequelize, type) => {
	return sequelize.define('System', {
		deviceConfigured: type.BOOLEAN,
		ltSubdomain: type.STRING
	}, {
		freezeTableName: true,
		tableName: 'System'
	})
};