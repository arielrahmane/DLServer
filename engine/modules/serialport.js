const serialport = require("serialport");
const port = '/dev/ttyS0'; 
const SerialPort = serialport.SerialPort;

const sp = new serialport(port, {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
 });

module.exports = sp;