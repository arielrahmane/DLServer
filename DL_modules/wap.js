const FS = require("fs");
const path = require('path');

var srcClient = path.join(__dirname, 'client.txt');
var srcWap = path.join(__dirname, 'wap.txt');
var destDir = '/etc/dhcpcd.conf';

function wap() {
	FS.access(destDir, (err) => {
	  if(err) console.log(err);

	  copyFile(srcWap, destDir);
	});
}

function client() {
	FS.access(destDir, (err) => {
	  if(err) console.log(err);

	  copyFile(srcClient, destDir);
	});
}

function copyFile(src, dest) {
	let readStream = FS.createReadStream(src);

	readStream.once('error', (err) => {
		console.log(err);
	});

	readStream.once('end', () => {
		console.log('done copying');
	});

	readStream.pipe(FS.createWriteStream(dest));
}

module.exports = {
	wap,
	client
};