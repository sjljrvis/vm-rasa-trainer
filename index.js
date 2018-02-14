const fs = require('fs');

const cloud = process.env.CLOUD;
const filePath = process.env.FILE;

global.__base = __dirname;

/*
* Clear files from previous run
*/

if (fs.existsSync(`${__base}/default-rasa.rsa`)) {
	fs.unlinkSync(__base + "/default-rasa.rsa");
}

if (fs.existsSync(`${__base}/default-rasa.rsa.pub`)) {
	fs.unlinkSync(__base + "/default-rasa.rsa.pub");
}

if (fs.existsSync(`${__base}/deploy.sh`)) {
	fs.unlinkSync(__base + "/deploy.sh");
}


/*
* Create dir data which will be migrated to server 
*/

if (!fs.existsSync(`${__base}/data`)) {
	fs.mkdirSync(__base + "/data");
}

/*
* copy training-data.json from filepath to data-dir
*/

if (!filePath) {
	console.log("Please add file path to ENV variable");
	process.exit(1);
}
else {
	if (fs.existsSync(filePath)) {
		fs.copyFileSync(filePath, `${__base}/data/demo-rasa.json`);
	}
}

if (cloud) {
	switch (cloud) {
		case "aws": break;
		case "do": require(`${__base}/cloud/digitalOcean/initDigitalOcean.js`);
			break;
		case "gcp": break;
		default:
	}
}
else {
	console.log("Please provide cloud-provider");
	process.exit(1);
}
