//Engine Modules
const SP = require('./modules/serialport');
const RL = require('./modules/readline');
const FM = require('./modules/filesManage');
const COM = require('./modules/communication');
const FLAG = require('./modules/flags');
const NM = require('./modules/nodesManage');
const SR = require('./modules/sensRead');
const MIXINS = require('./modules/mixins');
const DBstorage = require('../DL_modules/DBstorage');
const CONFIG = require('./config');

// Definición de variables
var inMessage = "";  // Mensaje recibido
COM.setStartedBody(false);

// Erase this function
function readFile() 
{
  var content = FM.readFile('temp.txt');
  MIXINS.separator();
  console.log(content);
  MIXINS.separator();
}

function init()
{
  FLAG.setInitialStage(true);
  var nodeID = 0;
  FM.writeFile("activeNodes.txt", "", 'w'); // Vaciamos el archivo de nodos activos
  DBstorage.createNodeStatus();
  askNode = setInterval(gatherActiveNodes, 1000);
  function gatherActiveNodes()
  {
    NM.setCurrentID(nodeID);
    console.log(NM.getCurrentID());
    COM.send(nodeID);
    nodeID++;
    if (nodeID > CONFIG.numberOfNodes_-1) 
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