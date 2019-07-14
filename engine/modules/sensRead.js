const NM = require('./nodesManage');
const COM = require('./communication');
const FLAG = require('./flags');

function readDHT(nodeID)
{
  var message = String(nodeID) + " dht";
  COM.send(message);
}

function readMQ3(nodeID)
{
  var message = String(nodeID) + " mq3";
  COM.send(message);
}

module.exports = {
	readSensors: function() {
		NM.updateCurrentID(NM.getCurrentID());
		readDHT(NM.getCurrentID());
  		setTimeout(readMQ3, 5000, NM.getCurrentID());
	}
};