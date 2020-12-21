module.exports = {
	getDate: function() {
		let now = new Date();
		var year = String(now.getFullYear());
		var month = String(now.getMonth());
		var day = String(now.getDate());
		var hour = String(now.getHours());
		var minutes = String(now.getMinutes());
		var seconds = String(now.getSeconds());

		return year + "/" + month + "/" + day + " " + hour + ":" + minutes + ":" + seconds + " ===> ";
	},
	separator: function() {
		console.log('=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::\n');
	}
};