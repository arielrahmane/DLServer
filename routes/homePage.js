var data = {
	title: "Welcome to ArielDL",
	description: "This is a test for the HTTP requests"
};

module.exports = app => {
	app.get('/', (req, res) => {
	  res.send(data);
	  console.log("Entered to Home Page");
	})
};