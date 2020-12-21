const FS = require("fs");
const FLAG = require('./flags');
const MIXINS = require('./mixins');
const NM = require('./nodesManage');

module.exports = {
	writeFile: function(name, data, _flag) {
		FS.writeFile(name, data, {flag: _flag}, function(err, data) {
        	if (err) console.log(err);
    		console.log("Successfully Written to File.");
      	});
	},
	readFile: function(fileName) {
		FS.readFile(fileName, 'utf8', (err, content) => {
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
			if (FLAG.getInitialStage()) {
			  this.writeFile("activeNodes.txt", data, 'a');
			}
			else {
			  data = MIXINS.getDate() + data;
			  this.writeFile("node" + String(NM.getCurrentID()) + ".txt", data, 'a');
			}
		}
	}
};