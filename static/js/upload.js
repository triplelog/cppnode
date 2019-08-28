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
	
	
	
	var data = Papa.parse(input_str);
	
	var tableDiv = document.getElementById("outputTable");
	tableDiv.classList.add("flex-center");
	tableDiv.classList.add("flex-column");
		var table = document.createElement("table");
		table.classList.add("striped");
		table.classList.add("hoverable");
			var thead = document.createElement("thead");
				var tr = document.createElement("tr");
					for (var i=0;i<data.data[0].length;i++) {
						var td = document.createElement("td");
						td.textContent = data.data[0][i];
						tr.appendChild(td);
					}
				thead.appendChild(tr);
			table.appendChild(thead);
			var tbody = document.createElement("tbody");
				for (var ii=0;ii<data.data.length;ii++) {
					var tr2 = document.createElement("tr");
					for (var i=0;i<data.data[ii].length;i++) {
						var td = document.createElement("td");
						td.textContent = data.data[ii][i];
						tr2.appendChild(td);
					}
					tbody.appendChild(tr2);
				}
			table.appendChild(tbody);
		tableDiv.appendChild(table);
		
	console.log(data.data);
}