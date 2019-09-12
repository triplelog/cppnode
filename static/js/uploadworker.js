//importScripts('https://unpkg.com/wasm-flate@0.1.11-alpha/dist/bootstrap.js');

self.addEventListener('message', function(e) {
    var data=e.data;
    try {
    	/*
        var readerF = new FileReader();
		readerF.onload = function() {
			console.log("Compressing")
		
			var arrayBuffer = this.result,
				array = new Uint8Array(arrayBuffer)
			var original_size = array.length

			var array = flate.deflate_encode_raw(array)
			var compressed_size = array.length
			//console.log(original_size, compressed_size)

			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST", "/uploadfile", false); // false for synchronous request
			xmlHttp.send(array);
			var filen = xmlHttp.responseText;	
			postMessage({
				result: 'done',
				filen: filen
			});
		}
		readerF.readAsArrayBuffer(data);
		*/
		postMessage({
				result: 'done'
			});
        
   } catch(e){
        postMessage({
            result:'error'
        });
   }
}, false);

