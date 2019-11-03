const localtunnel = require('localtunnel');
const isOnline = require('is-online');
const { exec } = require('child_process');
const FLAG = require('../engine/modules/flags');

var command = "sudo wifi-connect -s OpenDL -p arielraspi";

function startWAP() {
    return new Promise(function (resolve, reject) {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                console.log("Command could not be executed");
                reject(false);
                return;
            }
                // the *entire* stdout and stderr (buffered)
                console.log("Executing WiFi-Connect command");
                onlineCheck(startTunnel, true)
                .then( (val) => {
                    resolve(val);
                })
                .catch( (val) => {
                    reject(val);
                });
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
    });
}

function onlineCheck(callback, retry) {
    return new Promise(function (resolve, reject) {
        isOnline().then( (online) => {
            if(online) {
                console.log("Device is online");
                resolve(true);
                callback();
            } else {
                console.log("No connection to internet");
                if(retry) {
                    setTimeout(() => {
                        onlineCheck(callback);
                    }, 5000, callback);
                } else {
                    reject(false);
                }
            }
        }).catch( (err) => {
            if (err) {console.log("Problem connecting: " + err);}
            reject(false);
        });
    });
}

async function startTunnel() {
    const tunnel = await localtunnel({ 
        port: 8081,
        subdomain: "opendl"
      });
   
    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    tunnel.url;
    console.log(tunnel.url);
    FLAG.setTunnel(tunnel);
    console.log(tunnel);
   
    tunnel.on('close', () => {
      console.log("TUNNEL IS CLOSED");
    });
    tunnel.on('error', () => {
      console.log("TUNNEL ERROR: " + err);
    });
  }


module.exports = {
    onlineCheck,
    startTunnel,
    startWAP
}