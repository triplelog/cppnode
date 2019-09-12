self.addEventListener('message', function(e) {
    var data=e.data;
    try {
        var readerF = new FileReader();
		readerF.onload = function() {
			console.log("Compressing")
		
			var arrayBuffer = this.result,
				array = new Uint8Array(arrayBuffer)
			var original_size = array.length
			document.getElementById("compress_original_size").textContent = original_size;

			var array = flate.deflate_encode_raw(array)
			var compressed_size = array.length
			document.getElementById("compress_compressed_size").textContent = compressed_size;
			console.log(original_size, compressed_size)

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
        
   } catch(e){
        postMessage({
            result:'error'
        });
   }
}, false);

