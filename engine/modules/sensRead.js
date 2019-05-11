const nm = require('./nodesManage');
const com = require('./communication');

function readDHT(nodeID)
{
  var message = String(nodeID) + " dht";
  com.send(message);
}

function readMQ3(nodeID)
{
  var message = String(nodeID) + " mq3";
  com.send(message);
}

module.exports = {
	readSensors: function() {
		nm.updateCurrentID(nm.getCurrentID());
		readDHT(nm.getCurrentID());
  		setTimeout(readMQ3, 3000, nm.getCurrentID());
	}
};