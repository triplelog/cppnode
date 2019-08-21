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
  	var d = new Date();
	var n = d.getTime();
	console.log(n);
  	message += '\n';
	message = message.replace(/\|/g, '\n');
	message = message.replace(/\\n/g, '\r\n');
	
	var d = new Date();
	var n = d.getTime();
	console.log(n);
	
	try {
	  fs.unlinkSync('ff.csv');
	  //file removed
	} catch(err) {
	  //console.error(err);
	}
	
	var d = new Date();
	var n = d.getTime();
	console.log(n);
	
	fs.appendFile("newtesttxt.txt", message, (err) => {
  	
	});
	
	var d = new Date();
	var n = d.getTime();
	console.log(n);
	
	setTimeout(intervalFunc,10, ws);
	
	
  });
});

function intervalFunc(ws) {
		var d = new Date();
		var n = d.getTime();
		console.log('fn, ',n);
		fs.stat('ff.csv', function(err, stats) {
			if (!err) {
				if (stats.isFile() && stats.size > 16) {
					fs.readFile('ff.csv', 'utf8', function(err, data) {
						ws.send(data);
					});
				}
			}
			else {
				setTimeout(intervalFunc,20, ws)
			}
			
		});
}

