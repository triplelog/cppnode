
const https = require('https');
var fs = require("fs");
var request = require('request');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/tabdn.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tabdn.com/fullchain.pem')
};


var express = require('express');
const flate = require('wasm-flate');

var app = express();
app.use('/',express.static('static'));

const server1 = https.createServer(options, app);

server1.listen(12312);






https.createServer(options, function(req, res) {
	if (req.url == "/createchart"){
		var data = [];

		// when we get data we want to store it in memory
		req.on('end', () => {
			res.write(req.body.user.name); //write a response to the client
			res.end();
		});
	
		req.on('data', chunk => {
			//console.log(chunk.length);
			//res.write(chunk.length);
			data.push(chunk);

		// below we process the full data
		});
    }

    else if (req.url.substring(0,9) == "/savefile"){
    	var filepart = req.url.substring(12,req.url.length);
    	req.on('data', chunk => {
			
		});
    	

    }
    
}).listen(3000);



