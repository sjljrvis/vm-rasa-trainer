const async = require('async');
const deleteDroplet = require('./functions').deleteDroplet;

let id = process.env.DROPLETID ;
(async () => {
	try{
		let response = await (deleteDroplet(id));
		console.log("Droplet Deleted Successfully")
	}
	catch(e){
		console.log("Error while deleting Droplet")
		return ;
	}
})();
