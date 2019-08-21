const http = require('http');
var fs = require("fs");
var express = require('express');

var app = express();
app.use('/static',express.static('static'));
var serverStatic = app.listen(12312);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const { exec } = require('child_process');

exec('"../cppsv/asthreefilespart" 31 batterleader newtesttxt.txt');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
  	
  	message += '\n';
	message = message.replace(/\|/g, '\n');
	message = message.replace(/\\n/g, '\r\n');
	
	try {
	  fs.unlinkSync('ff.csv');
	  //file removed
	} catch(err) {
	  //console.error(err);
	}
	
	fs.appendFile("newtesttxt.txt", message, (err) => {
  	
	});
	
	setTimeout(intervalFunc,5, ws);
	
	
  });
});

function intervalFunc(ws) {
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

