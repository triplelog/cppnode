document.querySelector('#to-compress').addEventListener('change', function(inp) {
	var reader = new FileReader();
	reader.onload = function() {
		console.log(inp.target.id)

		console.log("Compressing")
		
		var partBuffer = this.result.slice(0,1000),
			partarray = new Uint8Array(partBuffer)
		var partstr = new TextDecoder("utf-8").decode(partarray);
		toTable(partstr);
		
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
		console.log(xmlHttp.responseText);
		return xmlHttp.responseText;
	}
	reader.readAsArrayBuffer(this.files[0]);
}, false);

function toTable(input_str){
	
	var tableDiv = document.getElementById("outputTable");
	var parse_csv = input_str.split("\n")[0];
	tableDiv.textContent = parse_csv;
}