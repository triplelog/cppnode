const http = require('http');
var fs = require("fs");
var express = require('express');

var app = express();
app.use('/static',express.static('static'));
var serverStatic = app.listen(12312);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
  	message += '\n';
	message = message.replace(/\|/g, '\n');
	message = message.replace(/\\n/g, '\r\n');
	
	try {
	  console.log("trying remove ff.csv");
	  fs.unlinkSync('ff.csv');
	  console.log("removed ff.csv");
	  //file removed
	} catch(err) {
	  //console.error(err);
	}
	
	console.log("no more ff.csv");
	
	fs.appendFile("newtesttxt.txt", message, (err) => {
  	
	});
	var i = 0;
	while (i < 100) {
		
		fs.stat('ff.csv', function(err, stats) {
			console.log('ee ', err);
			if (stats.isFile()) {
				fs.readFile('ff.csv', 'utf8', function(err, data) {
					console.log("ff.csv:", data);
					ws.send(data);
					i = 100;
				});
			}
			else {
				console.log("no ff.csv");
				await sleep(100);
			}
		});
		i++;
		
	}

	
  });
});
