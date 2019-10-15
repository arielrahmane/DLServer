let initialStage_ = false;
let startedBody_ = false;
let deviceRunning_ = false;
let deviceScanning_ = false;

module.exports = {
	setInitialStage: function(val) {
		initialStage_ = val;
	},
	getInitialStage: function() {
		return initialStage_;
	},
	setStartedBody: function(val) {
		startedBody_ = val;
	},
	getStartedBody: function() {
		return startedBody_;
	},
	setDeviceRunning: function(val) {
		deviceRunning_ = val;
	},
	getDeviceRunning: function() {
		return deviceRunning_;
	},
	setDeviceScanning: function(val) {
		deviceScanning_ = val;
	},
	getDeviceScanning: function() {
		return deviceScanning_;
	}
};