const Gpio = require('pigpio').Gpio;

const pinReDe = new Gpio(18, {mode: Gpio.OUTPUT});

module.exports = {
	rx: function() {
		console.log("Estableciendo en modo receptor");
  		pinReDe.digitalWrite(0);
  		transmit = false;
	},
	tx: function() {
		console.log("Estableciendo en modo transmisor");
  		pinReDe.digitalWrite(1);
  		transmit = true;
	}
};
