const exec = require('child_process').exec;

module.exports.shell = (command) => {
	return new Promise((resolve, reject) => {
		exec(command, (err, stdout, stderr) => {
			if (err) {
				reject({ err: err, data: null })
			}
			else {
				resolve({ err: null, data: { stdout: stdout, stderr: stderr } })
			};
		});
	});
};