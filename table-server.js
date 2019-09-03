
var fs = require("fs");



const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
//const { exec } = require('child_process');

//var acmd = require('child_process').spawn('../cppsv/nanotable', ['31','uploads/upmkd3w'])
//kill with acmd.kill();

//fs.writeFile("quicktxt.txt", "", (err) => {});
//fs.writeFile("slowtxt.txt", "", (err) => {});
var allusers = {};
wss.on('connection', function connection(ws) {
  var userid = "ff1.csv";
  allusers[userid]={'messages':[],'table':"uphmi4a",'memory':false};
  ws.send(userid);
  var tarcmd = require('child_process').spawn('tar', ['xvzf','uploads/uphmi4a.csv.tar.gz']);

  ws.on('message', function incoming(message) {
  	if (message.substring(0,4)=='Save'){
  		fs.writeFile("saved.txt", message, (err) => {});
  	}
  	else{
		message += '\n';
		message = message.replace(/\|/g, '\n');
		message = message.replace(/\\n/g, '\r\n');
	
		messagefname = message.split(",")[0];
	
		//wss.clients.forEach(function each(client) {
		//	client.send("hi");
		//});

		allusers[messagefname].messages.push(message);
	
		if (allusers[messagefname].messages.length == 1) {
			try {
			  fs.unlinkSync(messagefname);
			  //file removed
			} catch(err) {
			  //console.error(err);
			}
			if (message.split(",")[3] == 'print' || message.split(",")[3] == 'display' || (message.split(",")[3] == 'addcol' && message.split(",")[2] != '-1')){
				if (allusers[messagefname].memory){
					fs.appendFile("quicktxt.txt", message, (err) => {});
					setTimeout(intervalFunc,5, ws, messagefname);
				}
				else {
					cachedFunc(ws,message,messagefname);

				}
			}
			else {
				if (allusers[messagefname].memory){
					fs.appendFile("slowtxt.txt", message, (err) => {});
					setTimeout(intervalFunc,5, ws, messagefname);
				}
				else {
					//load into memory
				}
			}
	
			
		}
	}
	
	
  });
});


function cachedFunc(ws, message, messagefname) {
	var outputcsv = "[[";
	var startRow = parseInt(message.split(",")[1])+1;
	var endRow = parseInt(message.split(",")[2])+1;
	fs.stat("uploads/uphmi4a4.csv", function(err, stats) {
		if (!err && stats.isFile() && stats.size > 16) {
			fs.readFile("uploads/uphmi4a4.csv", 'utf8', function(err, data) {
				var spldata = data.split("\n");
				outputcsv += spldata[0];
				outputcsv += "],[";
				for (var i=startRow;i<endRow-1;i++) {
					outputcsv += spldata[i];
					outputcsv += "],[";
				}
				outputcsv += spldata[endRow-1];
				outputcsv += "]]";
				ws.send(outputcsv);
				
				
				allusers[messagefname].messages.splice(0,1);
				if (allusers[messagefname].messages.length > 0) {
					cachedFunc(ws,message,messagefname);
				}
			});
		}
		else {
			setTimeout(cachedFunc,5,ws,message,messagefname);
		}
	});

	
}
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
						

					
						allusers[messagefname].messages.splice(0,1);
						if (allusers[messagefname].messages.length > 0) {
							try {
							  fs.unlinkSync(messagefname);
							  //file removed
							} catch(err) {
							  //console.error(err);
							}
							nmessage = allusers[messagefname].messages[0];
						
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
				else if (stats.isFile()) {
					//Add logic here
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

