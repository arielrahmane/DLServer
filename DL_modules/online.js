const localtunnel = require('localtunnel');
const isOnline = require('is-online');
const { exec } = require('child_process');

var command = "sudo wifi-connect -s OpenDL -p arielraspi";

function startWAP() {
    exec(command, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.log("Command could not be executed");
            return;
        }
            // the *entire* stdout and stderr (buffered)
            onlineCheck(startTunnel, true);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
}

function onlineCheck(callback, retry) {
    isOnline().then( (online) => {
        if(online) {
            console.log("Device is online");
            callback();
        } else {
            console.log("No connection to internet");
            if(retry) {
                setTimeout(() => {
                    onlineCheck(callback);
                }, 5000, callback);
            }
        }
    }).catch( (err) => {
        if (err) {console.log("Problem connecting: " + err);}
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