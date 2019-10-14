const Engine = require('../engine');
const FLAG = require('./flags');
const Gpio = require('pigpio').Gpio;

const button = new Gpio(23, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN, //Pull-down for gpio 
    alert: true
    //edge: Gpio.EITHER_EDGE //Interruption in rising and falling edge
  });

  button.glitchFilter(100000); //100ms de espera para filtrar rebote

  module.exports.analogctl = function () {
    button.on('alert', (level, tick) => {
        console.log("BOTON PRESIONADO: " + level + " -> time: " + tick);
        if (FLAG.getDeviceScanning() == false) {
            if (level === 1) {
                Engine.startNodesScan(function() {
                    Engine.startSensorsRead();
                });
            } else if (level === 0) {
                Engine.stopSensorsRead();
            }
        }
      });
  }
   
 