const localtunnel = require('localtunnel');
const isOnline = require('is-online');

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
    startTunnel
}