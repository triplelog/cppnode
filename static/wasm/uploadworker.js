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
			var ctypestr = "-1";
			console.log(parsedstr.data[1]);
			console.log(partstr);
			for (var ii=0; ii<10; ii++ ) {
				console.log(ii,parsedstr.data[ii].length);
			}
			for (var i=0; i<parsedstr.data[1].length; i++ ) {
				ctypestr += ",";
				var isdata = 0; var isstring = 0;
				for (var ii=1; ii<parsedstr.data.length; ii++ ) {
					var dtype = get_type(parsedstr.data[ii][i]);
					if (dtype == "string") {
						isstring++;
					}
					else {
						isdata++;
					}
				}
				if (isdata > isstring * 2) {
					ctypestr += '1';
				}
				else {
					ctypestr += '0';
				}
			}
			
		
			postMessage({
				result: partstr,
				ctypestr: ctypestr
			});
		
		}
		readerP.readAsArrayBuffer(data.slice(0,10000));

   } catch(e){
        postMessage({
            result:'error'
        });
   }
}, false);





