const localtunnel = require('localtunnel');
const ngrok = require('ngrok');
const isOnline = require('is-online');
const { exec } = require('child_process');
const FLAG = require('../engine/modules/flags');
const DBStorage = require('./DBstorage');

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

function startTunnel() {
    DBStorage.getSystem().then(system => {
        var ltSubdomain = system.ltSubdomain;
        //initTunnel(ltSubdomain, 0);
        initTunnel2(ltSubdomain, 0);
    })
}

function retryTunnel(retryNumb) {
    DBStorage.getSystem().then(system => {
        var ltSubdomain = system.ltSubdomain + retryNumb.toString();
        initTunnel(ltSubdomain, retryNumb);
    })
}

async function initTunnel(ltSubdomain, retryNumb) {
    const tunnel = await localtunnel({ 
        port: 8081,
        subdomain: ltSubdomain
      });

    tunnel.url;
    console.log(tunnel.url);
    if (ltSubdomain.localeCompare(tunnel.opts.subdomain) !== 0) {
        retryTunnel(retryNumb+1);
    };
    FLAG.setTunnel(tunnel);
    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
   
    FLAG.getTunnel().on('close', () => {
      console.log("TUNNEL IS CLOSED");
    });
    FLAG.getTunnel().on('error', () => {
      console.log("TUNNEL ERROR");
    });
}

async function initTunnel2(ngrokSubdomain, retryNumb) {
    await ngrok.connect({
        addr: 8081,
        onStatusChange: status => {console.log(status);}
    }).then(done => {
        console.log(done);
        FLAG.setTunnel(done);
        console.log(FLAG.getTunnel());
        ngrok.disconnect(FLAG.getTunnel())
        .then(() => {console.log("Ngrok service disconnected.");})
        .catch(() => {console.log("Error in disconnecting ngrok service.");})
    }).catch(err => {
        console.log(err)
    });
}

module.exports = {
    onlineCheck,
    startTunnel,
    startWAP
}