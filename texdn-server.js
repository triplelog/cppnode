
const https = require('https');
var fs = require("fs");
//var myParser = require("body-parser");
var qs = require('querystring');

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
		var data = '';

        req.on('data', function (chunk) {
            data += chunk;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (data.length > 1e6)
                req.connection.destroy();
        });

		// when we get data we want to store it in memory
		req.on('end', () => {
			console.log(qs.parse(data));
			res.write('avvv'); //write a response to the client
			res.end();
		});
	

    }

    else if (req.url.substring(0,9) == "/savefile"){
    	var filepart = req.url.substring(12,req.url.length);
    	req.on('data', chunk => {
			
		});
    	

    }
    
}).listen(3000);



