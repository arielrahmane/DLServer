// Importación de paquetes necesarios
const serialport = require("serialport");
const Gpio = require('pigpio').Gpio;
const readline = require('readline');
const fs = require("fs");
// const date = require('date-and-time');

// Definición de variables
var port = '/dev/ttyS0';                            // Puerto por el que se establece la comunicación en la raspi
var SerialPort = serialport.SerialPort;
var message = 'Probando 1234\n';                        // El mensaje siempre debe terminar con \n para ser leído por el arduino
var inMessage = "";                                 // Mensaje recibido
const pinReDe = new Gpio(18, {mode: Gpio.OUTPUT});  // GPIO 18 como output para RE y DE
var activeNodes = [];
var initialStage = false;
var currentID = 0;
var transmit = false;
var waiting = false;
var startedBody = false;

// Configuración del puerto
const sp = new serialport(port, {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
 });

// Crear interfaz de interacción con el cli
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function send(message)
{
  separator();
  modoTransmisor();
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
    modoReceptor();
  });
}

function modoReceptor() 
{
  console.log("Estableciendo en modo receptor");
  pinReDe.digitalWrite(0);
  transmit = false;
}

function modoTransmisor() 
{
  console.log("Estableciendo en modo transmisor");
  pinReDe.digitalWrite(1);
  transmit = true;
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
      fs.writeFile("activeNodes.txt", data, {flag: 'a'}, function(err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });
    }
    else
    {
      data = getDate() + data;
      fs.writeFile("node" + String(currentID) + ".txt", data, {flag: 'a'}, function(err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });
    }

  }
}

function readFile()
{
  fs.readFile('temp.txt', 'utf8', (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('myfile does not exist');
        return;
      }

      throw err;
    }
    separator();
    console.log(content);
    separator();
  });
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
  fs.writeFile("activeNodes.txt", "", {flag: 'w'}, function(err) {
    if (err) console.log(err);
  });
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