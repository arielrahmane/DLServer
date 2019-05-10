//Engine Modules
const sp = require('./modules/serialport');
const rl = require('./modules/readline');
const comMode = require('./modules/comMode');
const fm = require('./modules/filesManage');
const com = require('./modules/communication');
const flag = require('./modules/flags');
const nm = require('./modules/nodesManage');

// Definición de variables
var message = 'Probando 1234\n';                        // El mensaje siempre debe terminar con \n para ser leído por el arduino
var inMessage = "";                                 // Mensaje recibido
com.setStartedBody(false);
//var activeNodes = [];
//var initialStage = false;
//var currentID = 0;
var transmit = false;
var waiting = false;
//var startedBody = false;

/*function send(message)
{
  separator();
  comMode.tx();
  message = message + '\n';
  setTimeout(write, 10, message);
}*/

/*function read(data)
{
  var inChar = data.toString();

  if (!inChar.startsWith("!"))
  {
    if (!getStartedBody()) return;
  }
  else setStartedBody(true);

  if (inChar != "?")  // Si el mensaje recibido no finalizó
  { 
    inMessage += inChar;
  }

  if (inChar == "?")  // Si el mensaje recibido finalizó
  {
    if (inMessage.length > 0)           // Si el mensaje no está vacío
    {
      console.log('data received: ' + inMessage);
      addToActiveNodes(inMessage);
      writeToFile(inMessage);
    }
    inMessage = "";
    setStartedBody(false);
  }
}*/

/*function write(message)
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
}*/

/*function writeToFile(data)
{
  var nullData = false;
  while (data.includes("!"))
  {
    if (data.length == 0) 
    {
      nullData = true;
      break;
    }

    data = data.substr(1);
  }

  //if (!data.startsWith(String(currentID))) return;

  while (data.includes('?'))
  {
    data = data.substr(0, data.length-1);

    if (data.length == 0) {
      nullData = true;
      break;
    }
  }

  if (!nullData)
  {
    data = data + "\n";
    if (flag.getInitialStage())
    {
      fm.writeFile("activeNodes.txt", data, 'a');
    }
    else
    {
      data = getDate() + data;
      fm.writeFile("node" + String(currentID) + ".txt", data, 'a');
    }

  }
}*/

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
  message = String(nodeID) + " dht";
  com.send(message);
}

function readMQ3(nodeID)
{
  message = String(nodeID) + " mq3";
  com.send(message);
}

function readSensors()
{
  updateCurrentID(nm.getCurrentID());
  readDHT(nm.getCurrentID());
  setTimeout(readMQ3, 3000, nm.getCurrentID());
}

function updateCurrentID(oldID, first)
{
  var index = nm.getActiveNodes().indexOf(oldID) + 1;
  if (index >= nm.getActiveNodes().length) index = 0;
  nm.setCurrentID(nm.getActiveNodes()[index]);
}

function resetCurrentID()
{
  currentID = activeNodes[0];
}

/*function addToActiveNodes(nodeResponse)
{
  if (flag.getInitialStage() && nodeResponse.includes("ID" + currentID))
  {
    activeNodes.push(currentID);
  }
}*/

function init()
{
  // initialStage = true;
  flag.setInitialStage(true);
  var nodeID = 0;
  resetActiveNodesFile();
  askNode = setInterval(gatherActiveNodes, 1000);
  function gatherActiveNodes()
  {
    nm.setCurrentID(nodeID);//currentID = nodeID;
    console.log(nm.getCurrentID());//console.log(nodeID);
    com.send(nodeID);//send(nodeID)
    nodeID++;
    if (nodeID > 15) 
    {
      clearInterval(askNode);
      flag.setInitialStage(false);
      setInterval(readSensors, 6000);
      nm.setCurrentID(nm.getActiveNodes()[0]); //resetCurrentID();
    }
  }
}

/*function getDate()
{
  let now = new Date();
  var year = String(now.getFullYear());
  var month = String(now.getMonth());
  var day = String(now.getDate());
  var hour = String(now.getHours());
  var minutes = String(now.getMinutes());
  var seconds = String(now.getSeconds());

  return year + "/" + month + "/" + day + " " + hour + ":" + minutes + ":" + seconds + " ===> ";
}*/

function resetActiveNodesFile()
{
  fm.writeFile("activeNodes.txt", "", 'w');
}

function getMode()
{
  return pinReDe.digitalRead()
}

function setWaiting(val)
{
  waiting = val;
}

function getWaiting()
{
  return waiting;
}

/*function setStartedBody(val)
{
  startedBody = val;
}

function getStartedBody()
{
  return startedBody;
}*/

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
      //read(data);
      inMessage = com.read(data, inMessage);
    });
  });
};