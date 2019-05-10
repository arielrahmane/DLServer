const fs = require("fs");
const flag = require('./flags');
const mixins = require('./mixins');
const nm = require('./nodesManage');

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
	},
	writeToFile: function(data) {
		var nullData = false;
		while (data.includes("!")) {
			if (data.length == 0) {
			  nullData = true;
			  break;
			}

			data = data.substr(1);
		}

		//if (!data.startsWith(String(currentID))) return;

		while (data.includes('?')) {
			data = data.substr(0, data.length-1);

			if (data.length == 0) {
			  nullData = true;
			  break;
			}
		}

		if (!nullData) {
			data = data + "\n";
			if (flag.getInitialStage()) {
			  this.writeFile("activeNodes.txt", data, 'a');
			}
			else {
			  data = mixins.getDate() + data;
			  this.writeFile("node" + String(nm.getCurrentID()) + ".txt", data, 'a');
			}
		}
	}
};