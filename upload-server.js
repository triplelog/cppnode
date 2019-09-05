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
		
			var buffer = Buffer.concat(data); // read as buffer
			var bytesArray = new Uint8Array(buffer); // convert buffer to u8Array
			var start = process.hrtime() // start a timer
			// we print out the size of the data we recieved - it's compressed!
			console.log("Recieved data:", bytesArray.length)
			if (bytesArray.length > 1) {
				// well run flate and decompress the data
				var decomp = flate.deflate_decode_raw(bytesArray)
				// we print out the size of the decompressed data
				console.log("Decompressed data:", decomp.length);
				var filepart = Math.random().toString(36).substring(5, 10);
				fs.writeFile("uploads/up"+filepart+".csv", decomp, function (err) {
					var runtime = process.hrtime(start) // we also check how much time has passed
					console.info('Execution time (hr): %ds %dms', runtime[0], runtime[1] / 1000000);
					res.write(filepart); //write a response to the client
					res.end(); //end the response
					
				});
			
			}
		
			
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
			//console.log(chunk.length);
			//res.write(chunk.length);
			var bytesArray = new Uint8Array(chunk);
			
			var colinfo = new TextDecoder("utf-8").decode(bytesArray);
			colinfo = decodeURIComponent(colinfo).substring(7,);
			console.log(colinfo);
			var acmd = require('child_process').spawn('../cppsv/createnanotable', ['uploads/up'+filepart, colinfo]);
			setTimeout(intervalFunc,20, res, filepart);
			
		// below we process the full data
		});
    	

    }
    
}).listen(3000);

function intervalFunc(res,filepart) {
	fs.stat('uploads/up'+filepart+'.csv.tar.gz', function(err, stats) {
		if (!err) {
			if (stats.isFile() && stats.size > 16) {
				fs.readFile('templates/nanotest.html', 'utf8', function(err, contents) {
					fs.writeFile("static/tables/"+filepart+".html", contents.replace('{{tablesrc}}',filepart), function (err) {
			
						res.writeHead(302, {'Location': '/tables/' + filepart+'.html'});
						res.end();
				
					});
				});
				
			}
			else if (stats.isFile()) {
				//Add logic here
			}
		}
		else {
			setTimeout(intervalFunc,20, res, filepart);
		}
		
	});
}


