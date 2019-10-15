const internetAvailable = require("internet-available");
const localtunnel = require('localtunnel');

// Most easy way
var onlineCheck = function(timeout_, retires_, callback) {
    internetAvailable({
        // Provide maximum execution time for the verification
        timeout: timeout_,
        // If it tries 5 times and it fails, then it will throw no internet
        retries: retires_
    }).then(() => {
        console.log("INTERNET AVAILABLE");
        callback();
    }).catch(() => {
        console.log("NO INTERNET");
    });
}

async function  startTunnel() {
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