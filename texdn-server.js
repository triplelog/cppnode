
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
		var start = process.hrtime();
        req.on('data', function (chunk) {
            data += chunk;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (data.length > 1e6)
                req.connection.destroy();
        });

		// when we get data we want to store it in memory
		req.on('end', () => {
			console.log(qs.parse(data).latexArea);
			fs.writeFile("texdnLatex/newtest.tex", qs.parse(data).latexArea, function (err) {
				var runtime = process.hrtime(start) // we also check how much time has passed
				console.info('Execution time (hr): %ds %dms', runtime[0], runtime[1] / 1000000);
				var acmd = require('child_process').exec('time latex texdnLatex/newtest2.tex');
				console.log('Executing');
			});
			res.write('avvv'); //write a response to the client
			res.end();
		});
	

    }

    
}).listen(3000);



