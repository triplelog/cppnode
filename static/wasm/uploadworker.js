var Module = {
		preRun: [],
		postRun: [],
		setStatus: function(text) {
		  if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
		  if (text === Module.setStatus.last.text) return;
		  var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
		  var now = Date.now();
		  if (m && now - Module.setStatus.last.time < 30) return; // if this is a progress update, skip it if too soon
		  Module.setStatus.last.time = now;
		  Module.setStatus.last.text = text;
		  if (m) {
			text = m[1];
		  } else {
		  }
		},
		totalDependencies: 0,
		monitorRunDependencies: function(left) {
		  this.totalDependencies = Math.max(this.totalDependencies, left);
		  Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
		}
};
Module.setStatus('Downloading...');
importScripts('datatype.js');
importScripts('../js/papaparse.min.js');

self.addEventListener('message', function(e) {
    var data=e.data;
    
	
    try {
        var readerP = new FileReader();
	
		readerP.onload = function() {

			console.log("Compressing")
		
			var partBuffer = this.result,
				partarray = new Uint8Array(partBuffer)
			var partstr = new TextDecoder("utf-8").decode(partarray);
			
			var get_type = Module.cwrap('getType', 'string', ['string']);
			var parsedstr = Papa.parse(partstr);
			console.log(parsedstr.data[1][0]);
			console.log(get_type(parsedstr.data[1][0]));
			console.log(get_type(parsedstr.data[1][1]));
			console.log(get_type(parsedstr.data[1][2]));
			console.log(get_type(parsedstr.data[1][3]));
			
		
			postMessage({
				result: partstr
			});
		
		}
		readerP.readAsArrayBuffer(data.slice(0,10000));

   } catch(e){
        postMessage({
            result:'error'
        });
   }
}, false);





