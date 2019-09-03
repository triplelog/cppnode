const http = require('http');
var fs = require("fs");
var express = require('express');
const flate = require('wasm-flate');

var app = express();
app.use('/static',express.static('static'));
var serverStatic = app.listen(12312);



http.createServer(function(req, res) {
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
            	var acmd = require('child_process').spawn('../cppsv/createnanotable', ['uploads/up'+filepart]);
			});
            
        }
        
        res.write('ok'); //write a response to the client
    	res.end(); //end the response
    });
    
    req.on('data', chunk => {
		//console.log(chunk.length);
		//res.write(chunk.length);
        data.push(chunk);

    // below we process the full data
    });
    
}).listen(3000);



