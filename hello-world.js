const http = require('http');
var fs = require("fs");
var express = require('express');

var app = express();
app.use('/static',express.static('static'));
var serverStatic = app.listen(12312);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const { exec } = require('child_process');

exec('"../cppsv/asthreefilespart" 31 batterleader');
var allmessages = {};
wss.on('connection', function connection(ws) {
	
  ws.on('message', function incoming(message) {
  	
  	message += '\n';
	message = message.replace(/\|/g, '\n');
	message = message.replace(/\\n/g, '\r\n');
	
	messagefname = message.split(",")[0];
	try {
	  fs.unlinkSync(messagefname);
	  //file removed
	} catch(err) {
	  //console.error(err);
	}
	//wss.clients.forEach(function each(client) {
	//	client.send("hi");
	//});
	if (!allmessages[messagefname]) {
		allmessages[messagefname] = [];
	}
	allmessages[messagefname].push(message);
	
	if (allmessages[messagefname].length == 1) {
		if (message.split(",")[3] == 'print'){
			fs.appendFile("quicktxt.txt", message, (err) => {});
		}
		else {
			fs.appendFile("slowtxt.txt", message, (err) => {});
		}
	
		setTimeout(intervalFunc,5, ws, messagefname);
	}
	
	
  });
});

function intervalFunc(ws, messagefname) {
		fs.stat(messagefname, function(err, stats) {
			if (!err) {
				if (stats.isFile() && stats.size > 16) {
					fs.readFile(messagefname, 'utf8', function(err, data) {
						if (data.substring(0,22) != "completedwithoutoutput"){
							ws.send(data);
						}
						else {
						}

					});
					allmessages[messagefname].splice(0,1);
					if (allmessages[messagefname].length > 0) {
						nmessage = allmessages[messagefname][0];
						if (nmessage.split(",")[3] == 'print' || nmessage.split(",")[3] == 'display' || (nmessage.split(",")[3] == 'addcol' && nmessage.split(",")[2] != '-1')){
							fs.appendFile("quicktxt.txt", nmessage, (err) => {});
						}
						else {
							fs.appendFile("slowtxt.txt", nmessage, (err) => {});
						}

						setTimeout(intervalFunc,5, ws, messagefname);
					}
					setTimeout(deleteFunc,1000, messagefname)
				}
			}
			else {
				setTimeout(intervalFunc,20, ws, messagefname)
			}
			
		});
}

function deleteFunc(messagefname) {
	try {
	  fs.unlinkSync(messagefname);
	} catch(err) {
	  console.error(err);
	}
}

