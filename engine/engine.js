//Engine Modules
const SP = require('./modules/serialport');
const RL = require('./modules/readline');
const FM = require('./modules/filesManage');
const COM = require('./modules/communication');
const FLAG = require('./modules/flags');
const NM = require('./modules/nodesManage');
const SR = require('./modules/sensRead');

// Definición de variables
var inMessage = "";  // Mensaje recibido
COM.setStartedBody(false);

function readFile()
{
  var content = FM.readFile('temp.txt');
  separator();
  console.log(content);
  separator();
}

function separator()
{
  console.log('=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::=::\n')
}

function init()
{
  FLAG.setInitialStage(true);
  var nodeID = 0;
  FM.writeFile("activeNodes.txt", "", 'w');
  askNode = setInterval(gatherActiveNodes, 1000);
  function gatherActiveNodes()
  {
    NM.setCurrentID(nodeID);
    console.log(NM.getCurrentID());
    COM.send(nodeID);
    nodeID++;
    if (nodeID > 15) 
    {
      clearInterval(askNode);
      FLAG.setInitialStage(false);
      setInterval(SR.readSensors, 6000);
      NM.setCurrentID(NM.getActiveNodes()[0]);
    }
  }
}

module.exports.engine = function() {
  init();

  // Cuando el puerto se encuentre abierto
  SP.on('open', function() 
  {
    console.log('Port open');
    RL.question('Escribir mensaje: ', (answer) => {
      COM.send(answer);
    });

    RL.on('line', (input) => {

      switch(input) 
      {
        case 'leer':
          readFile();
          break;
        default:
          COM.send(input);
      } 
    });

    // Cuando haya data disponible para leer
    SP.on('data', function(data) 
    {
      inMessage = COM.read(data, inMessage);
    });
  });
};