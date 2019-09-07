
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
  var userid = "ff"+Math.random().toString(36).substring(5, 10);+".csv";
  ws.on('message', function incoming(message) {
    if (message.substring(0,1)=='{'){
  		console.log(JSON.parse(message));
  	}
  	else if (message.substring(0,4)=='Save'){
  		fs.writeFile("saved.txt", message, (err) => {});
  	}
  	else if (message.substring(0,5)=='Table'){
  		var tablename = message.split(",")[1];
  		
  		allusers[userid]={'messages':[],'table':"up"+tablename,'memory':false,'sort':0,'quick':'quick/up'+tablename+'.txt','slow':'slow/up'+tablename+'.txt'};
  		var tarcmd = require('child_process').spawn('tar', ['xvzf','uploads/'+allusers[userid].table+'.csv.tar.gz']);
  		ws.send(userid);
  	}
  	else if (message.substring(0,4)=='Load'){
  		allusers[userid].memory = true;
  		var acmd = require('child_process').spawn('../cppsv/nanotable', [allusers[userid].table]);
  		fs.writeFile(allusers[userid].quick, "", (err) => {});
  		fs.writeFile(allusers[userid].slow, "", (err) => {});
  	}
  	else{
  		console.log(message);
		message += '\n';
		message = message.replace(/\|/g, '\n');
		message = message.replace(/\\n/g, '\r\n');
	
	
		//wss.clients.forEach(function each(client) {
		//	client.send("hi");
		//});

		allusers[userid].messages.push(message);
	
		if (allusers[userid].messages.length == 1) {
			try {
			  fs.unlinkSync(userid);
			  //file removed
			} catch(err) {
			  //console.error(err);
			}
			
			if (!allusers[userid].memory){
				cachedFunc(ws,message,userid);
			}
			else if (message.split(",")[3] == 'print' || message.split(",")[3] == 'display' || (message.split(",")[3] == 'addcol' && message.split(",")[2] != '-1')){
				fs.appendFile(allusers[userid].quick, message, (err) => {});
				setTimeout(intervalFunc,5, ws, userid);

			}
			else {
				fs.appendFile(allusers[userid].slow, message, (err) => {});
				setTimeout(intervalFunc,5, ws, userid);

			}
	
			
		}
	}
	
	
  });
});


function cachedFunc(ws, message, userid) {
	var outputcsv = "[[";
	var startRow = parseInt(message.split(",")[1])+1;
	var endRow = parseInt(message.split(",")[2])+1;
	if (message.split(",")[3] == 'sort') {
		allusers[userid].sort = parseInt(message.split(",")[4]);
		allusers[userid].messages.splice(0,1);
		if (allusers[userid].messages.length > 0) {
			var nmessage = allusers[userid].messages[0];
			cachedFunc(ws,nmessage,userid);
		}
	}
	else if (message.split(",")[3] == 'print') {
		fs.stat("uploads/"+allusers[userid].table+allusers[userid].sort+".csv", function(err, stats) {
			if (!err && stats.isFile() && stats.size > 16) {
				fs.readFile("uploads/"+allusers[userid].table+allusers[userid].sort+".csv", 'utf8', function(err, data) {
					var spldata = data.split("\n");
					outputcsv += "\"Rk\",-1,"+spldata[0];
					outputcsv += "],[";
					for (var i=startRow;i<endRow-1;i++) {
						outputcsv += (i)+','+spldata[i];
						outputcsv += "],[";
					}
					outputcsv += (endRow-1)+','+spldata[endRow-1];
					outputcsv += "]]";
					ws.send(outputcsv);
				
				
					allusers[userid].messages.splice(0,1);
					if (allusers[userid].messages.length > 0) {
						var nmessage = allusers[userid].messages[0];
						if (!allusers[userid].memory){
							cachedFunc(ws,nmessage,userid);
						}
						else if (nmessage.split(",")[3] == 'print' || nmessage.split(",")[3] == 'display' || (nmessage.split(",")[3] == 'addcol' && nmessage.split(",")[2] != '-1')){
							fs.appendFile(allusers[userid].quick, nmessage, (err) => {});
							setTimeout(intervalFunc,5, ws, userid);

						}
						else {
							fs.appendFile(allusers[userid].slow, nmessage, (err) => {});
							setTimeout(intervalFunc,5, ws, userid);
						}
					}
				});
			}
			else {
				setTimeout(cachedFunc,5,ws,message,userid);
			}
		});
	}

	
}
function intervalFunc(ws, userid) {
		fs.stat(userid, function(err, stats) {
			if (!err) {
				if (stats.isFile() && stats.size > 16) {
					
					fs.readFile(userid, 'utf8', function(err, data) {
						if (data.substring(0,22) != "completedwithoutoutput"){
							ws.send(data);
						}
						else {
						}
						
						allusers[userid].messages.splice(0,1);
						if (allusers[userid].messages.length > 0) {
							try {
							  fs.unlinkSync(userid);
							  //file removed
							} catch(err) {
							  //console.error(err);
							}
							nmessage = allusers[userid].messages[0];
						
							if (nmessage.split(",")[3] == 'print' || nmessage.split(",")[3] == 'display' || (nmessage.split(",")[3] == 'addcol' && nmessage.split(",")[2] != '-1')){
								fs.appendFile(allusers[userid].quick, nmessage, (err) => {});
							}
							else {
								fs.appendFile(allusers[userid].slow, nmessage, (err) => {});
							}

							setTimeout(intervalFunc,5, ws, userid);
						}
					});
				}
				else if (stats.isFile()) {
					//Add logic here
				}
			}
			else {
				setTimeout(intervalFunc,20, ws, userid)
			}
			
		});
}

function deleteFunc(userid) {
	try {
	  fs.unlinkSync(userid);
	} catch(err) {
	  console.error(err);
	}
}

