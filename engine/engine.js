//Engine Modules
const SP = require('./modules/serialport');
const RL = require('./modules/readline');
const FM = require('./modules/filesManage');
const COM = require('./modules/communication');
const FLAG = require('./modules/flags');
const NM = require('./modules/nodesManage');
const SR = require('./modules/sensRead');
const MIXINS = require('./modules/mixins');
const AnalogCtl = require('./modules/analogControl');
const DBstorage = require('../DL_modules/DBstorage');
const CONFIG = require('./config');

// Definición de variables
var inMessage = "";  // Mensaje recibido
FLAG.setStartedBody(false);

// Erase this function
function readFile() 
{
  var content = FM.readFile('temp.txt');
  MIXINS.separator();
  console.log(content);
  MIXINS.separator();
}

let askNode;
var nodeID = 0;

module.exports.startNodesScan = function(callback) {
  FLAG.setInitialStage(true);
  FLAG.setDeviceScanning(true);
  AnalogCtl.scanningLed(true);
  DBstorage.createNodeStatus();
  NM.resetActiveNodes();
  askNode = setInterval(gatherActiveNodes, 1000, callback);
}

function gatherActiveNodes(callback)
  {
    if (nodeID > CONFIG.numberOfNodes_-1)
    {
      clearInterval(askNode);
      FLAG.setInitialStage(false);
      FLAG.setDeviceScanning(false);
      nodeID = 0;
      AnalogCtl.scanningLed(false);
      NM.setCurrentID(NM.getActiveNodes()[0]);
      callback();
    } 
    else {   
      NM.setCurrentID(nodeID);
      console.log(NM.getCurrentID());
      COM.send(nodeID);
    }
    nodeID++;
  }

  //aborted is a boolean for stating if the function was called because of aborting the scan 
  // (aborted=true) or because the node scan finished (aborted = false)
module.exports.stopNodesScan = function(aborted) {
  console.log("NODES SCAN STOPED!!!");
  clearInterval(askNode);
  FLAG.setInitialStage(false);
  FLAG.setDeviceScanning(false);
  AnalogCtl.scanningLed(false, aborted);
  nodeID = 0;
}

let sensorsReadInterval;

module.exports.startSensorsRead = function() {
  console.log("SENSORS READ STARTED!!!");
  FLAG.setDeviceScanning(false);
  FLAG.setDeviceRunning(true);
  AnalogCtl.runningLed(true);
  sensorsReadInterval = setInterval(SR.readSensors, 6000);
}

module.exports.stopSensorsRead = function () {
  console.log("SENSORS READ STOPED!!!");
  FLAG.setDeviceScanning(false);
  FLAG.setDeviceRunning(false);
  AnalogCtl.runningLed(false);
  clearInterval(sensorsReadInterval);
  SR.stopSensors();
}

module.exports.engine = function() {
  //init();

  //Create Settings' table unique row only for the first time
  //DBstorage.getSettings();


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

  AnalogCtl.analogctl();

  //Just for testing
  // DBstorage.createdAtUpdate();
};