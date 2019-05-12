const COMMODE = require('./comMode');
const SP = require('./serialport');
const FM = require('./filesManage');
const NM = require('./nodesManage');

var startedBody = false;

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

function setStartedBody(val)
{
  startedBody = val;
}

function getStartedBody()
{
  return startedBody;
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

		if (!inChar.startsWith("!"))
		{
			if (!getStartedBody()) return;
		}
		else setStartedBody(true);

		if (inChar != "?")  //If received message did not finish
		{ 
			message += inChar;
		}

		if (inChar == "?")  // Si el mensaje recibido finalizó
		{
			if (message.length > 0)           // Si el mensaje no está vacío
			{
			  console.log('data received: ' + message);
			  NM.addToActiveNodes(message);
			  FM.writeToFile(message);
			}
			message = "";
			setStartedBody(false);
		}

		return message;
	},
	setStartedBody
};