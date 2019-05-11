//Engine Modules
const sp = require('./modules/serialport');
const rl = require('./modules/readline');
const comMode = require('./modules/comMode');
const fm = require('./modules/filesManage');
const com = require('./modules/communication');
const flag = require('./modules/flags');
const nm = require('./modules/nodesManage');

// Definición de variables
// var message = 'Probando 1234\n';                        // El mensaje siempre debe terminar con \n para ser leído por el arduino
var inMessage = "";                                 // Mensaje recibido
com.setStartedBody(false);

function readFile()
{
  var content = fm.readFile('temp.txt');
  separator();
  console.log(content);
  separator();
}

function separator()
{
  console.log('=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::\n')
}

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

function readSensors()
{
  nm.updateCurrentID(nm.getCurrentID());
  readDHT(nm.getCurrentID());
  setTimeout(readMQ3, 3000, nm.getCurrentID());
}

function updateCurrentID(oldID, first)
{
  var index = nm.getActiveNodes().indexOf(oldID) + 1;
  if (index >= nm.getActiveNodes().length) index = 0;
  nm.setCurrentID(nm.getActiveNodes()[index]);
}

function init()
{
  flag.setInitialStage(true);
  var nodeID = 0;
  resetActiveNodesFile();
  askNode = setInterval(gatherActiveNodes, 1000);
  function gatherActiveNodes()
  {
    nm.setCurrentID(nodeID);
    console.log(nm.getCurrentID());
    com.send(nodeID);
    nodeID++;
    if (nodeID > 15) 
    {
      clearInterval(askNode);
      flag.setInitialStage(false);
      setInterval(readSensors, 6000);
      nm.setCurrentID(nm.getActiveNodes()[0]);
    }
  }
}

function resetActiveNodesFile()
{
  fm.writeFile("activeNodes.txt", "", 'w');
}

function getMode()
{
  return pinReDe.digitalRead()
}

module.exports.engine = function() {
  init();

  // Cuando el puerto se encuentre abierto
  sp.on('open', function() 
  {
    console.log('Port open');
    rl.question('Escribir mensaje: ', (answer) => {
      //send(answer);
      com.send(answer);
    });

    rl.on('line', (input) => {

      switch(input) 
      {
        case 'leer':
          readFile();
          break;
        default:
          //send(input);
          com.send(input);
      } 
    });

    // Cuando haya data disponible para leer
    sp.on('data', function(data) 
    {
      inMessage = com.read(data, inMessage);
    });
  });
};