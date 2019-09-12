//importScripts('https://unpkg.com/wasm-flate@0.1.11-alpha/dist/bootstrap.js');

self.addEventListener('message', function(e) {
    var data=e.data;
    try {
    	
        var readerP = new FileReader();
	
		readerP.onload = function() {

			console.log("Compressing")
		
			var partBuffer = this.result,
				partarray = new Uint8Array(partBuffer)
			var partstr = new TextDecoder("utf-8").decode(partarray);
		
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

