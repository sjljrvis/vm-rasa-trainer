const digitalOcean = require('../../config').do;
const axios = require('axios');
const fs = require('fs');

module.exports.addKeyToDigitalOcean = (name, key) => {
	const options = {
		method: `POST`,
		url: `${digitalOcean.url}/account/keys`,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${digitalOcean.token}`
		},
		data: {
			"name": name,
			"public_key": key
		}
	};

	return new Promise((resolve, reject) => {
		axios(options)
			.then((res) => {
				resolve({ err: null, res: res.data })
			})
			.catch((err) => {
				reject({ err: err, res: null });
			});
	})
}

module.exports.addDroplet = (sshId) => {
	const options = {
		method: `POST`,
		url: `${digitalOcean.url}/droplets`,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${digitalOcean.token}`
		},
		data: {

			"name": "rasa-vm.com",
			"region": "nyc3",
			"size": "s-4vcpu-8gb",
			"image": "ubuntu-16-04-x64",
			"ssh_keys": [sshId],
			"backups": false,
			"ipv6": true,
			"user_data": null,
			"private_networking": null,
			"volumes": null,
			"tags": [
				"web"
			]

		}
	};
	return new Promise((resolve, reject) => {
		axios(options)
			.then((res) => {
				resolve({ err: null, res: res.data })
			})
			.catch((err) => {
				reject({ err: err, res: null });
			});
	})
}

module.exports.getDropletIp = (dropletId) => {
	const options = {
		method: `GET`,
		url: `${digitalOcean.url}/droplets/${dropletId}`,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${digitalOcean.token}`
		},
	};

	return new Promise((resolve, reject) => {
		axios(options)
			.then((res) => {
				resolve({ err: null, res: res.data })
			})
			.catch((err) => {
				reject({ err: err, res: null });
			});
	});
}

module.exports.deleteDroplet = (id) => {
	const options = {
		method: `DELETE`,
		url: `${digitalOcean.url}/droplets/${id}`,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${digitalOcean.token}`
		},
	};

	return new Promise((resolve, reject) => {
		axios(options)
			.then((res) => {
				resolve({ err: null, res: res.data })
			})
			.catch((err) => {
				reject({ err: err, res: null });
			});
	});
}


module.exports.generateShellScript = (ip,id) => {
	let data =
`#!/bin/sh
cat ./data/demo-rasa.json | ssh -i default-rasa.rsa root@${ip} "cat > demo-rasa.json" 
cat rasa-deploy.sh |ssh -i default-rasa.rsa root@${ip}
echo " Training Complete ---->"
echo "Deleting Droplet ----->"
env DROPLETID=${id} node ./cloud/digitalOcean/deregisterDroplet.js
echo "Complete ---->"
`
	fs.writeFileSync(`${__base}/deploy.sh`, data);
	fs.chmodSync(`${__base}/deploy.sh`, 0700);

	return true;

}