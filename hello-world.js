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
	
	fs.appendFile("newtesttxt.txt", message, (err) => {
  	
	});
	
	fs.stat('ff.csv', function(err, stats) {
		if (stats.isFile()) {
			fs.readFile('ff.csv', 'utf8', function(err, data) {
				ws.send(data);
			});
		}
	});

	
  });
});
