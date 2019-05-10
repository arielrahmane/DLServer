const fs = require("fs");

module.exports = {
	writeFile: function(name, data, _flag) {
		fs.writeFile(name, data, {flag: _flag}, function(err, data) {
        	if (err) console.log(err);
    		console.log("Successfully Written to File.");
      	});
	},
	readFile: function(fileName) {
		fs.readFile(fileName, 'utf8', (err, content) => {
		    if (err) 
		    {
		      if (err.code === 'ENOENT') 
		      {
		        console.error('myfile does not exist');
		        return;
		      }

		      throw err;
		    }
		    return content;
	  });
	}
};