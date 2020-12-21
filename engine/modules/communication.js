const COMMODE = require('./comMode');
const SP = require('./serialport');
const FM = require('./filesManage');
const NM = require('./nodesManage');
const FLAG = require('./flags');
const SM = require('./stringManage');
const DBstorage = require('../../DL_modules/DBstorage');

function write(message)
{
  console.log("================> Sending: " + message);
  SP.write(message, error => {
    if (error) console.log('write calback returned. Error: ', error);
  });

  drain();
}

function drain()
{
  SP.drain(error => {
    if (error) console.log('drain callback returned. Error: ', error);
    COMMODE.rx();
  });
}

function cleanMsg(msg) {
	while (msg.includes("!")) {
		msg = msg.replace("!", "");
	};

	while (msg.includes("?")) {
		msg = msg.replace("?", "");
	};

	return msg;
}

module.exports = {
	send: function(message) {
		//separator();
		COMMODE.tx();
		message = message + '\n';
		setTimeout(write, 10, message);
	},
	read: function(data, inMessage) {
		var inChar = data.toString(); //This is the incoming character from the node
		var message = inMessage; //This is the String that will compile all the characters into a message

		/* 
			To identify a message coming from the node, the protocol states that this message
			should come with a serie of "!" characters for redundancy to avoid data loss.

			If the incoming character does not start with "!" it can mean 2 things:
			- That the character belongs to the message body;
			- Or that before the incoming "!" came garbage characters left in the buffer.
			If the incoming character starts with "!", it means that the body of the message began.

			We use the method startsWith() for a character because sometimes 
			it can read two characters at the time.
		*/
		if (!inChar.startsWith("!")) 
		{
			//If the startedBody flag is not true, it means that the character was garbage.
			if (!FLAG.getStartedBody()) {
				return message; //We return the same String we received
			}
		}
		else FLAG.setStartedBody(true); 

		if (!inChar.startsWith("?"))  //If received message did not finish
		{ 
			if (inChar) {
				message += inChar;
			}
			else return message;
		}

		else  // If received message finished
		{
			message = cleanMsg(message);
			if (message.length > 0)  // If message is not empty
			{
			  if (FLAG.getInitialStage()) {
			  	console.log('ESTADO INICIAL');
			  	NM.addToActiveNodes(message);
			  }
			  else if (message.includes("temp")) {
			  	console.log('================> DHT reading: ' + message);
			  	var nodeID = NM.getCurrentID();
			  	var trimmedMsg = message.substring(message.lastIndexOf('{'), message.lastIndexOf('}')+1);
			  	var dhtData_json = JSON.parse(trimmedMsg);
			  	NM.setCurrentNodeData("nodeID", nodeID);
			  	NM.setCurrentNodeData("dht", dhtData_json);
			  }
			  else if (message.includes("ALC")) {
			  	console.log('================> MQ3 Reading: ' + message);
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