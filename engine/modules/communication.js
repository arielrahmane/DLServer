const COMMODE = require('./comMode');
const SP = require('./serialport');
const FM = require('./filesManage');
const NM = require('./nodesManage');
const FLAG = require('./flags');
const SM = require('./stringManage');
const DBstorage = require('../../DL_modules/DBstorage');

function write(message)
{
  console.log("sending: " + message);
  SP.write(message, error => {
    console.log('write calback returned. Error: ', error);
  });

  drain();
}

function drain()
{
  SP.drain(error => {
    console.log('drain callback returned. Error: ', error)
    COMMODE.rx();
  });
}

module.exports = {
	send: function(message) {
		//separator();
		COMMODE.tx();
		message = message + '\n';
		setTimeout(write, 10, message);
	},
	read: function(data, inMessage) {
		var inChar = data.toString();
		var message = inMessage;
		//console.log(inChar);

		if (!inChar.startsWith("!"))
		{
			if (!FLAG.getStartedBody()) return;
		}
		else FLAG.setStartedBody(true);

		if (inChar != "?")  //If received message did not finish
		{ 
			message += inChar;
		}

		if (inChar == "?")  // Si el mensaje recibido finalizó
		{
			if (message.length > 0)           // Si el mensaje no está vacío
			{
			  console.log('data received: ' + message);
			  if (FLAG.getInitialStage()) {
			  	NM.addToActiveNodes(message);
			  }
			  else if (message.includes("TEMP")) {
			  	var nodeID = NM.getCurrentID();
			  	var temp = SM.getTemp(message);
			  	var humid = SM.getHumid(message);
			  	NM.setCurrentNodeData("nodeID", nodeID);
			  	NM.setCurrentNodeData("temp", temp);
			  	NM.setCurrentNodeData("humid", humid);
			  }
			  else if (message.includes("VOLT")) {
			  	// It enters this block if the MQ3 sensor data is the input message. This means that the complete node has been read.
			  	var alcohol = SM.getAlcohol(message);
			  	NM.setCurrentNodeData("alcohol", alcohol);
			  	var nodeData = NM.getCurrentNodeData();
			  	DBstorage.addNodeData(nodeData);
			  };
			}
			message = "";
			FLAG.setStartedBody(false);
		}

		return message;
	}
};