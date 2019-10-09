
var fs = require("fs");
const https = require('https');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/tabdn.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tabdn.com/fullchain.pem')
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8080);


const WebSocket = require('ws');
//const wss = new WebSocket.Server({ port: 8080 , origin: 'http://tabdn.com'});
const wss = new WebSocket.Server({ server });
//const { exec } = require('child_process');

//var acmd = require('child_process').spawn('../cppsv/nanotable', ['31','uploads/upmkd3w'])
//kill with acmd.kill();

//fs.writeFile("quicktxt.txt", "", (err) => {});
//fs.writeFile("slowtxt.txt", "", (err) => {});
var allusers = {};
wss.on('connection', function connection(ws) {
  var userid = "ff"+Math.random().toString(36).substring(5, 10)+".csv";
  ws.on('message', function incoming(message) {

	console.log(JSON.parse(message));
	var dm = JSON.parse(message);
	var message2 = "";
	var message3 = "";
	
	if (dm.command == 'create'){
		var tablename = dm.src;
		allusers[userid]={'messages':[],'startRow':0,'endRow':10,'currentTable':'main','table':"up"+tablename,'memory':false,'sort':0,'quick':'quick/up'+tablename+'.txt','slow':'slow/up'+tablename+'.txt'};
		var tarcmd = require('child_process').spawn('tar', ['xvzf','uploads/'+allusers[userid].table+'.csv.tar.gz']);
		message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow +',sort,0\n';
		message2 = userid+','+allusers[userid].startRow+','+allusers[userid].endRow +',print,'+allusers[userid].currentTable+'\n';
	}
	else if (dm.command == 'display'){
		message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',display,'+dm.column+'@'+dm.location+'\n';
	}
	else if (dm.command == 'sum' || dm.command == 'max' || dm.command == 'min' || dm.command == 'mean'){
		message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+','+dm.command+',main\n';
	}
	else if (dm.command == 'print'){
		if (!isNaN(dm.startrow)){allusers[userid].startRow = parseInt(dm.startrow);}
		if (!isNaN(dm.endrow)){allusers[userid].endRow = parseInt(dm.endrow);}
		
		if (dm.type == 'pivot'){
			allusers[userid].currentTable = 'pivot@0';
			message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',print,'+allusers[userid].currentTable+'\n';
		}
		else if (dm.type == 'main'){
			allusers[userid].currentTable = 'main';
			message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',print,'+allusers[userid].currentTable+'\n';
		}
		else if (dm.type == null) {message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',print,'+allusers[userid].currentTable+'\n';}
		else {
			allusers[userid].currentTable = dm.type;
			message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',print,'+allusers[userid].currentTable+'\n';
		}

	}
	else if (dm.command == 'switch'){
		allusers[userid].currentTable = dm.type;
		message ="skip";
	}
	else if (dm.command == 'pivot'){
		var colstr = '';
		if (dm.columns && dm.columns.length > 0){
			for (var i=0;i<dm.columns.length;i++) {
				colstr += ';'+dm.columns[i];
			}
		}
		if (dm.formulas && dm.formulas.length > 0){
			for (var i=0;i<dm.formulas.length;i++) {
				colstr += ';='+dm.formulas[i];
			}
		}
		message = userid+',0,'+(allusers[userid].endRow-allusers[userid].startRow) +',pivot,'+dm.pivotcol+';'+dm.sort+colstr+'\n';
		allusers[userid].endRow = parseInt(allusers[userid].endRow-allusers[userid].startRow);
		allusers[userid].startRow = 0;
		allusers[userid].currentTable = 'pivot@0';
	}
	else if (dm.command == 'filter'){
		var d = new Date();
		var n = d.getTime();
		console.log('to filter',allusers[userid].currentTable,n);
		/*
		message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow +',filter,'+dm.formula+'\n';
		message2 = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',print,'+allusers[userid].currentTable+'\n';
		if (allusers[userid].currentTable == 'main') {
			message3 = userid+',0,-1,filter,'+dm.formula+'\n';
		}
		*/
		message = userid+',0,-1,filter,'+dm.formula+'\n';
	}
	else if (dm.command == 'sort'){
		message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow +',sort,'+dm.column+'\n';
		message2 = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',print,main\n';
	}
	else if (dm.command == 'multisort'){
		var colstr = '';
		if (dm.columns && dm.columns.length > 0){
			for (var i=0;i<dm.columns.length;i++) {
				colstr += ';'+dm.columns[i];
			}
		}
		if (dm.formulas && dm.formulas.length > 0){
			for (var i=0;i<dm.formulas.length;i++) {
				colstr += ';='+dm.formulas[i];
			}
		}
		message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow +',pivot,1'+colstr+'\n';
		message2 = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',multisort,pivot@5\n';
	}
	else if (dm.command == 'addcol'){
		message = userid+','+allusers[userid].startRow+','+allusers[userid].endRow +',addcol,'+dm.formula+'\n';
		message2 = userid+','+allusers[userid].startRow+','+allusers[userid].endRow+',print,'+allusers[userid].currentTable+'\n';
		if (allusers[userid].currentTable == 'main') {
			message3 = userid+',0,-1,addcol,'+dm.formula+'\n';
		}
	}
	else if (dm.command == 'load'){
		var d = new Date();
		var n = d.getTime();
		console.log('to load',n);
		allusers[userid].memory = true;
		var newtable = true;
		for (var otheruserid in allusers) {
		  if (otheruserid != userid && allusers[otheruserid].table == allusers[userid].table && allusers[otheruserid].memory){
		  	newtable = false;
		  	break;
		  }
		}
		var d = new Date();
		var n = d.getTime();
		console.log('searched users',n);
		if (newtable){
			var d = new Date();
			var n = d.getTime();
			console.log('new:',n);
			fs.writeFile(allusers[userid].quick, "", (err) => {});
			fs.writeFile(allusers[userid].slow, "", (err) => {});
			//var acmd = require('child_process').spawn('../cppsv/nanotable', [allusers[userid].table,'>>','output.txt']);
			var acmd = require('child_process').exec('../cppsv/nanotable '+allusers[userid].table+' >> '+' output.txt');
		}
		else {
			var d = new Date();
			var n = d.getTime();
			console.log('not new:',n);
		}
		
		message = userid+',0,10,sort,0\n';
		message2 = userid+',0,10,sort,0\n';
	}
	else {
		console.log("what?",message);
		return 0;
	}


	if (allusers[userid].messages.length == 0 && message != 'skip') {
		allusers[userid].messages.push(message);
		if (message2.length > 3) {allusers[userid].messages.push(message2);}
		if (message3.length > 3) {allusers[userid].messages.push(message3);}
		try {
		  fs.unlinkSync(userid);
		  //file removed
		} catch(err) {
		  //console.error(err);
		}
		var d = new Date();
		var n = d.getTime();
		console.log('new message', message, "," ,allusers[userid].messages," ,",n);
		if (!allusers[userid].memory){
			cachedFunc(ws,message,userid);
		}
		else if (message.split(",")[3] == 'print' || message.split(",")[3] == 'display' || (message.split(",")[3] == 'addcol' && message.split(",")[2] != '-1')){
			fs.appendFile(allusers[userid].quick, message, (err) => {});
			setTimeout(intervalFunc,50, ws, userid);

		}
		else {
			fs.appendFile(allusers[userid].slow, message, (err) => {});
			setTimeout(intervalFunc,50, ws, userid);

		}
	}
	else if (message != 'skip'){
		allusers[userid].messages.push(message);
		if (message2.length > 3) {allusers[userid].messages.push(message2);}
		if (message3.length > 3) {allusers[userid].messages.push(message3);}
	}
	else {
		console.log('skip it');
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
						var d = new Date();
						var n = d.getTime();
						console.log('new message from cache', nmessage, "," ,allusers[userid].messages," ,",n);
						if (!allusers[userid].memory){
							cachedFunc(ws,nmessage,userid);
						}
						else if (nmessage.split(",")[3] == 'print' || nmessage.split(",")[3] == 'display' || (nmessage.split(",")[3] == 'addcol' && nmessage.split(",")[2] != '-1')){
							fs.appendFile(allusers[userid].quick, nmessage, (err) => {});
							setTimeout(intervalFunc,5, ws, userid);

						}
						else {
							var d = new Date();
							var n = d.getTime();
							console.log('new slow message from cache', nmessage, "," ,allusers[userid].messages," ,",n);
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
function intervalFunc(ws, userid, iterations = 0) {
		if (iterations > 1000){
			console.log("Too many iterations");
			return 0;
			/*
			allusers[userid].messages.splice(0,1);
			if (allusers[userid].messages.length > 0) {
				try {
				  fs.unlinkSync(userid);
				  //file removed
				} catch(err) {
				  //console.error(err);
				}
				nmessage = allusers[userid].messages[0];
			
				var d = new Date();
				var n = d.getTime();
				console.log('new message from toomany', nmessage, "," ,allusers[userid].messages," ,",n);
		
				if (nmessage.split(",")[3] == 'print' || nmessage.split(",")[3] == 'display' || (nmessage.split(",")[3] == 'addcol' && nmessage.split(",")[2] != '-1')){
					fs.appendFile(allusers[userid].quick, nmessage, (err) => {});
				}
				else {
					fs.appendFile(allusers[userid].slow, nmessage, (err) => {});
				}

				setTimeout(intervalFunc,50, ws, userid, 0);
				return 0;
			}
			*/
		}
		else {iterations++;}
		fs.stat(userid, function(err, stats) {
			if (!err) {
				if (stats.isFile() && stats.size > 16) {
					
					fs.readFile(userid, 'utf8', function(err, data) {
						var clearF = true;
						if (data.substring(0,22) != "completedwithoutoutput"){
							var d = new Date();
							var n = d.getTime();
							console.log('send output',allusers[userid].messages," ,",n);
							ws.send(data);
						}
						else {
							var d = new Date();
							var n = d.getTime();
							clearF = false;
							console.log('no output',allusers[userid].messages," ,",n);
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
							
							
							
							while ((nmessage.split(',')[3]=='filter' || nmessage.split(',')[3]=='pivot' || nmessage.split(',')[3]=='multisort') && clearF){
								clearF = false;
								var bmess = nmessage.split(',')[3];
								for (var i=1;i<allusers[userid].messages.length;i++) {
									if (allusers[userid].messages[i].split(',')[3]==bmess){
										allusers[userid].messages.splice(0,1);
										nmessage = allusers[userid].messages[0];
										clearF = true;
										break;
									}
								}
								
							}
							
							var d = new Date();
							var n = d.getTime();
							console.log('new message', nmessage, "," ,allusers[userid].messages," ,",n);
						
							if (nmessage.split(",")[3] == 'print' || nmessage.split(",")[3] == 'display' || (nmessage.split(",")[3] == 'addcol' && nmessage.split(",")[2] != '-1')){
								fs.appendFile(allusers[userid].quick, nmessage, (err) => {});
							}
							else {
								fs.appendFile(allusers[userid].slow, nmessage, (err) => {});
							}

							setTimeout(intervalFunc,50, ws, userid, 0);
						}
					});
				}
				else if (stats.isFile()) {
					//Add logic here
					console.log("File but not big enough");
				}
			}
			else {
				setTimeout(intervalFunc,50, ws, userid, iterations)
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

