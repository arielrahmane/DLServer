const Engine = require('../engine');
const FLAG = require('./flags');
const Gpio = require('pigpio').Gpio;
const InternetAv = require("../../DL_modules/online");

const button = new Gpio(23, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP, //Pull-down for gpio 
    alert: true
  });

const push_button = new Gpio(8, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP, //Pull-down for gpio 
    alert: true
});

const deviceRunningLed = new Gpio(24, {mode: Gpio.OUTPUT});
const nodeScanningLed = new Gpio(25, {mode: Gpio.OUTPUT});
const internetConnectionLed = new Gpio(7, {mode: Gpio.OUTPUT});

deviceRunningLed.digitalWrite(0);
nodeScanningLed.digitalWrite(0);
internetConnectionLed.digitalWrite(0);

let scanLedBlink;
let inernetLedBlink;

button.glitchFilter(100000); //100ms waiting for rebound filter
push_button.glitchFilter(100000); //100ms waiting for rebound filter

module.exports.analogctl = function () {
    button.on('alert', (level, tick) => {
        console.log("BOTON PRESIONADO: " + level + " -> time: " + tick); //lógica negada
        if (FLAG.getDeviceScanning() == false) {
            if (level === 0 && FLAG.getDeviceRunning() == false) {
                Engine.startNodesScan(function() {
                    Engine.startSensorsRead();
                });
            } else if (level === 1 && FLAG.getDeviceRunning() == true) {
                Engine.stopSensorsRead();
            }
        } else if (FLAG.getDeviceScanning() == true) {
            if (level === 1) {
                Engine.stopNodesScan();
            }
        }
    });

    push_button.on('alert', (level, tick) => {
        if (level === 0) {
            console.log("PULSADOR PRESIONADO"); //lógica negada
            setTimeout(() => {
                if (push_button.digitalRead() === 0) {
                    console.log("Button pushed for 3 seconds. Proceed to connect.");
                    inernetLedBlink = setInterval(blink, 500, internetConnectionLed);
                    if (FLAG.getTunnel()) {FLAG.getTunnel().close()};
                    InternetAv.startWAP()
                    .then( (val) => {
                        console.log("Returned " + val);
                        clearInterval(inernetLedBlink);
                        inernetLedBlink = setInterval(blink, 200, internetConnectionLed);
                        setTimeout(() => {
                            clearInterval(inernetLedBlink);
                            internetConnectionLed.digitalWrite(1);
                        }, 1000);
                    })
                    .catch( (val) => {
                        console.log("Returned " + val);
                        clearInterval(inernetLedBlink);
                        internetConnectionLed.digitalWrite(0);
                    });
                }
            }, 3000);
        } else {
            console.log("PULSADOR SOLTADO");
        }
    });
}

module.exports.runningLed = function(state) {
    if (state == true) {
        deviceRunningLed.digitalWrite(1);
    } else if (state == false) {
        deviceRunningLed.digitalWrite(0);
    }
}

module.exports.scanningLed = function(state) {
    if (state == true) {
        scanLedBlink = setInterval(blink, 500, nodeScanningLed);
    } else if (state == false) {
        clearInterval(scanLedBlink);
        nodeScanningLed.digitalWrite(0);
    }
}

function blink(led) {
    led.digitalWrite(!led.digitalRead());
}
   
 
