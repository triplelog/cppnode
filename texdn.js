const http = require('http');
var fs = require("fs");
var express = require('express');
const flate = require('wasm-flate');

var app = express();
app.use('/',express.static('static'));
var serverStatic = app.listen(12312);



http.createServer(function(req, res) {
	if (req.url == "/uploadfile"){
		var data = [];

		// when we get data we want to store it in memory
		req.on('end', () => {
			
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



