const internetAvailable = require("internet-available");

// Most easy way
var onlineCheck = function(timeout_, retires_) {
    internetAvailable({
        // Provide maximum execution time for the verification
        timeout: timeout_,
        // If it tries 5 times and it fails, then it will throw no internet
        retries: retires_
    }).then(() => {
        console.log("INTERNET AVAILABLE");
    }).catch(() => {
        console.log("NO INTERNET");
    });
}

module.exports = {
    onlineCheck
}