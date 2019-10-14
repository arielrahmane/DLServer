const FS = require("fs");
const path = require('path');
const { exec } = require('child_process');

const startWap = ['sudo systemctl enable hostapd dnsmasq', 
				'sudo systemctl start hostapd', 
				'sudo systemctl start dnsmasq']; //,'sudo reboot'];

const startClient = ['sudo systemctl stop hostapd', 
					'sudo systemctl stop dnsmasq',
					'sudo systemctl disable hostapd dnsmasq']; //,'sudo reboot'];

function cmdTest(command) {
	exec(command, (err, stdout, stderr) => {
	if (err) {
		// node couldn't execute the command
		return;
	}

		// the *entire* stdout and stderr (buffered)
		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
	});
}

function service(commands) {
	var i = 0;
	iterate(i);
	function iterate(i) {
		exec(commands[i], (err, stdout, stderr) => {
			if (err) {
				console.log(i + ' =========================> Imposible de ejecutar comando ' + commands[i]);
				console.log(err);
				return;
			}
			console.log(i + " =========================> Comando: " + commands[i]);
			i++;
			if (i >= commands.length) return;
			else iterate(i);
		});
	}
}



var srcClient = path.join(__dirname, 'client.txt');
var srcWap = path.join(__dirname, 'wap.txt');
var destDir = '/etc/dhcpcd.conf';

function wap() {
	FS.access(destDir, (err) => {
	  if(err) console.log(err);

	  copyFile(srcWap, destDir, startWap);
	});
}

function client() {
	FS.access(destDir, (err) => {
	  if(err) console.log(err);

	  copyFile(srcClient, destDir, startClient);
	});
}

function copyFile(src, dest, commands) {
	let readStream = FS.createReadStream(src);

	readStream.once('error', (err) => {
		console.log(err);
	});

	readStream.once('end', () => {
		console.log('done copying');
		service(commands);
	});

	readStream.pipe(FS.createWriteStream(dest));
}

module.exports = {
	wap,
	client
};