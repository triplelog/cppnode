document.querySelector('#to-compress').addEventListener('change', function(inp) {
	var readerP = new FileReader();
	
	readerP.onload = function() {
		console.log(inp.target.id)

		console.log("Compressing")
		
		var partBuffer = this.result.slice(0,10000),
			partarray = new Uint8Array(partBuffer)
		var partstr = new TextDecoder("utf-8").decode(partarray);
		var datatypes = toTable(partstr);
		
		
		
	}
	readerP.readAsArrayBuffer(this.files[0]);
	fullCompression(this.files[0],[]);
	
	
	
	
	
}, false);

function fullCompression(to_compress,datatypes) {
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
		
		var ctypestr = "-1";
		for (var i=0;i<datatypes.length;i++) {
			if (!datatypes[i]['Not']){datatypes[i]['Not'] = 0;}
			if (!datatypes[i]['Int']){datatypes[i]['Int'] = 0;}
			if (datatypes[i]['Int']> datatypes[i]['Not']){
				ctypestr += ",1";
			}
			else {
				ctypestr += ",0";
			}
		}
		createConfirmForm(filen,ctypestr);		
		
		return xmlHttp.responseText;
	}
	readerF.readAsArrayBuffer(to_compress);
}
function createConfirmForm(filen,ctypestr){
	var form = document.createElement("form");
	form.setAttribute("action","/savefile?n="+filen);
	form.setAttribute("method","post");
		var input = document.createElement("input");
		input.setAttribute("type","text");
		input.setAttribute("name","ctypes");
		input.value = ctypestr;
		form.appendChild(input);
		var button = document.createElement("button");
		button.textContent = "Submit";
		form.appendChild(button);
	document.getElementById("formholder").appendChild(form);
}
function toTable(input_str){
	
	
	
	var data = Papa.parse(input_str);
	var datatypes = [];
	var ncols = Math.max(data.data[0].length,data.data[1].length);
	
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
						datatypes.push({});
					}
				thead.appendChild(tr);
			table.appendChild(thead);
			var tbody = document.createElement("tbody");
				for (var ii=1;ii<data.data.length-1;ii++) {
					var tr2 = document.createElement("tr");
					for (var i=0;i<data.data[ii].length;i++) {
						var td = document.createElement("td");
						td.textContent = data.data[ii][i];
						tr2.appendChild(td);
						if (datatypes[i][getDataType(data.data[ii][i])]){
							datatypes[i][getDataType(data.data[ii][i])]+=1;
						}
						else {
							datatypes[i][getDataType(data.data[ii][i])]=1;
						}
					}
					tbody.appendChild(tr2);
				}
			table.appendChild(tbody);
		tableDiv.appendChild(table);
		

	return datatypes;
}

function getDataType(input_str){
	if (parseInt(input_str).toString() == input_str){
		return 'Int';
	}
	return 'Not';
}