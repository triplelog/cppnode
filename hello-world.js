const http = require('http');
var fs = require("fs");
var express = require('express');

var app = express();
app.use('/static',express.static('static'));
var serverStatic = app.listen(12312);

/*
const hostname = '127.0.0.1';
const port = 12312;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
	message = "ff.csv,0,10,sort,HR\n";
	fs.appendFile("../go/src/cppsvserver/newtesttxt.txt", message, (err) => {
  	if (err) console.log(err);
  	console.log("Successfully Written to File.");
	});
  });
});
