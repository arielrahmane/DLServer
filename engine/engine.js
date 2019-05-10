//Engine Modules
const sp = require('./modules/serialport');
const rl = require('./modules/readline');
const comMode = require('./modules/comMode');
const fm = require('./modules/filesManage');

// Definición de variables
var message = 'Probando 1234\n';                        // El mensaje siempre debe terminar con \n para ser leído por el arduino
var inMessage = "";                                 // Mensaje recibido
var activeNodes = [];
var initialStage = false;
var currentID = 0;
var transmit = false;
var waiting = false;
var startedBody = false;

function send(message)
{
  separator();
  comMode.tx();
  message = message + '\n';
  setTimeout(write, 10, message);
}

function read(data)
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
}

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

function writeToFile(data)
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
    if (initialStage)
    {
      fm.writeFile("activeNodes.txt", data, 'a');
    }
    else
    {
      data = getDate() + data;
      fm.writeFile("node" + String(currentID) + ".txt", data, 'a');
    }

  }
}

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
  send(message);
}

function readMQ3(nodeID)
{
  message = String(nodeID) + " mq3";
  send(message);
}

function readSensors()
{
  updateCurrentID(currentID);
  readDHT(currentID);
  setTimeout(readMQ3, 3000, currentID);
}

function updateCurrentID(oldID, first)
{
  var index = activeNodes.indexOf(oldID) + 1;
  if (index >= activeNodes.length) index = 0;
  currentID = activeNodes[index];
}

function resetCurrentID()
{
  currentID = activeNodes[0];
}

function addToActiveNodes(nodeResponse)
{
  if (initialStage == true && nodeResponse.includes("ID" + currentID))
  {
    activeNodes.push(currentID);
  }
}

function init()
{
  initialStage = true;
  var nodeID = 0;
  resetActiveNodesFile();
  askNode = setInterval(getActiveNodes, 1000);
  function getActiveNodes()
  {
    currentID = nodeID;
    console.log(nodeID)
    send(nodeID)
    nodeID++;
    if (nodeID > 15) 
    {
      clearInterval(askNode);
      initialStage = false;
      setInterval(readSensors, 6000);
      resetCurrentID();
    }
  }
}

function getDate()
{
  let now = new Date();
  var year = String(now.getFullYear());
  var month = String(now.getMonth());
  var day = String(now.getDate());
  var hour = String(now.getHours());
  var minutes = String(now.getMinutes());
  var seconds = String(now.getSeconds());

  return year + "/" + month + "/" + day + " " + hour + ":" + minutes + ":" + seconds + " ===> ";
}

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

function setStartedBody(val)
{
  startedBody = val;
}

function getStartedBody()
{
  return startedBody;
}

module.exports.engine = function() {
  init();

  // Cuando el puerto se encuentre abierto
  sp.on('open', function() 
  {
    console.log('Port open');
    rl.question('Escribir mensaje: ', (answer) => {
      send(answer);
    });

    rl.on('line', (input) => {

      switch(input) 
      {
        case 'leer':
          readFile();
          break;
        default:
          send(input);
      } 
    });

    // Cuando haya data disponible para leer
    sp.on('data', function(data) 
    {
      read(data);
    });
  });
};