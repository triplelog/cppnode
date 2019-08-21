url = 'ws://155.138.201.160:8080';
ws = new WebSocket(url);
ws.onmessage=function(evt){
    postMessage(evt.data);
    var d = new Date();
	var n = d.getTime();
	console.log(n);
};

onmessage = function(e) {
  let mymessage = e.data;

  console.log(mymessage);
  ws.send(mymessage);
	  
}