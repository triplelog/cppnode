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
			
			
			var partBufferH = this.result.slice(0,10000),
				partarrayH = new Uint8Array(partBufferH)
			var partstrH = new TextDecoder("utf-8").decode(partarrayH);
			
			
			var parsedstrH = Papa.parse(partstrH);
			parsedstrH.pop();
			var partBufferE = this.result.slice(10000,20000),
				partarrayE = new Uint8Array(partBufferE)
			var partstrE = new TextDecoder("utf-8").decode(partarrayE);
			

			var parsedstrE = Papa.parse(partstrE);
			parsedstrE.splice(0,1);
			
			var parsedstr = parsedstrH.concat(parsedstrE);
			
			var get_type = Module.cwrap('getType', 'string', ['string']);
			
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
		readerP.readAsArrayBuffer(data.slice(0,10000).concat(data.slice(data.length-10000,data.length)));

   } catch(e){
        postMessage({
            result:'error'
        });
   }
}, false);





