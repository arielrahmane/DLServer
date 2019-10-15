const Engine = require('../engine');
const FLAG = require('./flags');
const Gpio = require('pigpio').Gpio;

const button = new Gpio(23, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN, //Pull-down for gpio 
    alert: true
  });

  button.glitchFilter(100000); //100ms waiting for rebound filter

  module.exports.analogctl = function () {
    button.on('alert', (level, tick) => {
        console.log("BOTON PRESIONADO: " + level + " -> time: " + tick);
        if (FLAG.getDeviceScanning() == false) {
            if (level === 1 && FLAG.getDeviceRunning() == false) {
                Engine.startNodesScan(function() {
                    Engine.startSensorsRead();
                });
            } else if (level === 0 && FLAG.getDeviceRunning() == true) {
                Engine.stopSensorsRead();
            }
        } else if (FLAG.getDeviceScanning() == true) {
            if (level === 0) {
                Engine.stopNodesScan();
            }
        }
      });
  }
   
 