const http = require('http');
var fs = require("fs");
var express = require('express');
var multer  = require('multer');
const flate = require('wasm-flate');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.substring(0,file.originalname.length-4) + '-' + Date.now() + '.csv')
  }
})
var upload = multer({ storage: storage })

var app = express();
app.use('/static',express.static('static'));
var serverStatic = app.listen(12312);

/*
var appu = express();
appu.post('/uploadfile', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file.filename);
  exec('"../cppsv/createfilesauto" uploads/'+req.file.filename.substring(0,req.file.filename.length-4));
})
appu.listen(3000,function(){
    console.log("Working on port 3000");
});
*/

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
            console.log("Decompressed data:", decomp.length)
            fs.writeFile("uploadedD.txt", decomp, function (err) {

			});
            var runtime = process.hrtime(start) // we also check how much time has passed
            console.info('Execution time (hr): %ds %dms', runtime[0], runtime[1] / 1000000)
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

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const { exec } = require('child_process');

exec('"../cppsv/asthreefilespart" 31 batterleader');
fs.writeFile("quicktxt.txt", "", (err) => {});
fs.writeFile("slowtxt.txt", "", (err) => {});
var allmessages = {};
wss.on('connection', function connection(ws) {
	
  ws.on('message', function incoming(message) {
  	
  	message += '\n';
	message = message.replace(/\|/g, '\n');
	message = message.replace(/\\n/g, '\r\n');
	
	messagefname = message.split(",")[0];
	
	//wss.clients.forEach(function each(client) {
	//	client.send("hi");
	//});
	if (!allmessages[messagefname]) {
		allmessages[messagefname] = [];
	}
	allmessages[messagefname].push(message);
	
	if (allmessages[messagefname].length == 1) {
		try {
		  fs.unlinkSync(messagefname);
		  //file removed
		} catch(err) {
		  //console.error(err);
		}
		if (message.split(",")[3] == 'print' || message.split(",")[3] == 'display' || (message.split(",")[3] == 'addcol' && message.split(",")[2] != '-1')){
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
						

					
						allmessages[messagefname].splice(0,1);
						if (allmessages[messagefname].length > 0) {
							try {
							  fs.unlinkSync(messagefname);
							  //file removed
							} catch(err) {
							  //console.error(err);
							}
							nmessage = allmessages[messagefname][0];
						
							if (nmessage.split(",")[3] == 'print' || nmessage.split(",")[3] == 'display' || (nmessage.split(",")[3] == 'addcol' && nmessage.split(",")[2] != '-1')){
								fs.appendFile("quicktxt.txt", nmessage, (err) => {});
							}
							else {
								fs.appendFile("slowtxt.txt", nmessage, (err) => {});
							}

							setTimeout(intervalFunc,5, ws, messagefname);
						}
					});
					
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

