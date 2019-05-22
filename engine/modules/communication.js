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
			  if (FLAG.getInitialStage()) NM.addToActiveNodes(message);
			  FM.writeToFile(message);
			  /* En este bloque entra dos veces por nodo. Debo almacenar en la DB al finalizar el pedido en el nodo.
			  var temp = SM.getTemp(message);
			  var humid = SM.getHumid(message);
			  var alcohol = SM.getAlcohol(message);
			  var id = NM.getCurrentID();
			  DBstorage.addNodeData(id, temp, humid, alcohol);
			  */
			}
			message = "";
			FLAG.setStartedBody(false);
		}

		return message;
	}
};