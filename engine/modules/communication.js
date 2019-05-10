const comMode = require('./comMode');
const sp = require('./serialport');
const fm = require('./filesManage');
const nm = require('./nodesManage');

var startedBody = false;

function write(message)
{
  console.log("sending: " + message);
  sp.write(message, error => {
    console.log('write calback returned. Error: ', error);
  });

  drain();
}

function drain()
{
  sp.drain(error => {
    console.log('drain callback returned. Error: ', error)
    comMode.rx();
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
		comMode.tx();
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
			  nm.addToActiveNodes(message);
			  fm.writeToFile(message);
			}
			message = "";
			setStartedBody(false);
		}

		return message;
	},
	setStartedBody
};