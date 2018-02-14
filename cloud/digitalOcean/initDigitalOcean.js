const fs = require('fs');

const shell = require('../../helper/shell').shell;
const addKeyToDigitalOcean = require('./functions').addKeyToDigitalOcean;
const addDroplet = require('./functions').addDroplet;
const getDropletIp = require('./functions').getDropletIp;
const generateShellScript = require('./functions').generateShellScript;
const async = require('async');

const node_ssh = require('node-ssh')
const ssh = new node_ssh()
/*
* generate rsa finger-print for DO virtual machine
*/
let sshKey = "";

(async () => {
	let sshData = await (shell(`ssh-keygen -t rsa -N '' -f default-rasa.rsa`));
	if (sshData.err) {
		console.log('Error occured during generating SSH-key');
	}
	else {

		sshKey = fs.readFileSync(`${__base}/default-rasa.rsa.pub`, 'utf-8');
		console.log('SSH generated successfully \n', sshKey);

		try {
			console.log('\nAdding key to DigitalOcean');
			let sshKeyData = await (addKeyToDigitalOcean(`default-rasa.rsa`, sshKey));

			console.log('\nCreating Droplet  ----->');
			let dropletData = await (addDroplet(sshKeyData.res.ssh_key.fingerprint));

			console.log('\nWaiting for droplet to reboot ---->');


			console.log("\nfetching droplet IPaddress ----->");
			let dropletIpAddress = await (getDropletIp(dropletData.res.droplet.id));

			console.log('\n', dropletIpAddress.res.droplet.networks.v4[0].ip_address);
			console.log('\nGenerating shell script locally ---->');
			let filecreateStatus = generateShellScript(dropletIpAddress.res.droplet.networks.v4[0].ip_address, dropletData.res.droplet.id);
			console.log('\nGenerated shell script  ---->');

			console.log('\nRun ./deploy.sh to train your model  ---->');

		}
		catch (execption) {
			console.log(execption);
			return;
		}
	}
})();

