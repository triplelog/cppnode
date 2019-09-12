document.querySelector('#to-compress').addEventListener('change', function(inp) {
	
	var syncWorker = new Worker('js/uploadworker.js');
	var ffile = this.files[0];
	syncWorker.postMessage(ffile);
	syncWorker.onmessage = function(e) {
		var ctypestr = toTable(e.data.result);
		setTimeout(100,fullCompression,ffile,ctypestr);
	};
	

	
	
}, false);


function fullCompression(to_compress,ctypestr) {
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
		createConfirmForm(filen,ctypestr);
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
						var th = document.createElement("th");
						th.textContent = data.data[0][i];
						tr.appendChild(th);
						datatypes.push({});
					}
				//thead.appendChild(tr);
			table.appendChild(thead);
			var tbody = document.createElement("tbody");
				for (var ii=1;ii<data.data.length-1;ii++) {
					var tr2 = document.createElement("tr");
					for (var i=0;i<data.data[ii].length;i++) {
						var td = document.createElement("td");
						td.textContent = data.data[ii][i];
						tr2.appendChild(td);
						if (datatypes[i][getDataType(data.data[ii][i],data.data[0][i])]){
							datatypes[i][getDataType(data.data[ii][i],data.data[0][i])]+=1;
						}
						else {
							datatypes[i][getDataType(data.data[ii][i],data.data[0][i])]=1;
						}
					}
					tbody.appendChild(tr2);
				}
			table.appendChild(tbody);
		tableDiv.appendChild(table);
	
	var ctypestr = '-1';
	var cheaders = [];
	for (var i=0;i<datatypes.length;i++) {
		if (!datatypes[i]['Not']){datatypes[i]['Not'] = 0;}
		if (!datatypes[i]['Int']){datatypes[i]['Int'] = 0;}
		if (!datatypes[i]['Num']){datatypes[i]['Num'] = 0;}
		if (!datatypes[i]['Date']){datatypes[i]['Date'] = 0;}
		if (datatypes[i]['Num']+datatypes[i]['Int']> 2*(datatypes[i]['Not']+datatypes[i]['Date']) ){
			ctypestr += ",1";
			cheaders.push('Number');
		}
		else if (datatypes[i]['Date']> 2*(datatypes[i]['Int']+datatypes[i]['Not']+datatypes[i]['Num']) ){
			ctypestr += ",2";
			cheaders.push('Date');
		}
		else if (datatypes[i]['Not']> 2*(datatypes[i]['Int']+datatypes[i]['Date']+datatypes[i]['Num']) ){
			ctypestr += ",0";
			cheaders.push('String');
		}
		else {
			ctypestr += ",?";
			cheaders.push('Unknown');
		}
	}
	var newRow = document.createElement('tr');
	for (var i=0;i<cheaders.length;i++){
		var th = document.createElement("th");
		var tdiv = document.createElement("div");
		var tspan = document.createElement("span");
		tspan.textContent = cheaders[i];
		tdiv.appendChild(tspan);
		th.appendChild(tdiv);
		th.classList.add('rotate');
		newRow.appendChild(th);
	}
	//thead.insertBefore(newRow, thead.childNodes[0]);
	thead.appendChild(newRow);

	return ctypestr;
}

function isMonth(input_str){
	input_str = input_str.replace('.','');
	if (input_str == 'january') {return true;}
	if (input_str == 'jan') {return true;}
	if (input_str == 'february') {return true;}
	if (input_str == 'feb') {return true;}
	if (input_str == 'march') {return true;}
	if (input_str == 'mar') {return true;}
	if (input_str == 'april') {return true;}
	if (input_str == 'apr') {return true;}
	if (input_str == 'may') {return true;}
	if (input_str == 'june') {return true;}
	if (input_str == 'jun') {return true;}
	if (input_str == 'july') {return true;}
	if (input_str == 'jul') {return true;}
	if (input_str == 'august') {return true;}
	if (input_str == 'aug') {return true;}
	if (input_str == 'september') {return true;}
	if (input_str == 'sep') {return true;}
	if (input_str == 'october') {return true;}
	if (input_str == 'oct') {return true;}
	if (input_str == 'november') {return true;}
	if (input_str == 'nov') {return true;}
	if (input_str == 'december') {return true;}
	if (input_str == 'dec') {return true;}
	return false;
}
function isDate(input_str){
	var threeparts = input_str.split('/');
	if (threeparts.length == 3) {
		if (parseInt(threeparts[0]) > 0 && parseInt(threeparts[0]) < 13 && parseInt(threeparts[0]).toString() == threeparts[0]){
			if (parseInt(threeparts[1]) > 0 && parseInt(threeparts[1]) < 32 && parseInt(threeparts[1]).toString() == threeparts[1]){
				if (parseInt(threeparts[2]).toString() == threeparts[2]){
					return 'MM/DD/YYYY';
				}
			}
		}
		if (parseInt(threeparts[0]) > 0 && parseInt(threeparts[0]) < 32 && parseInt(threeparts[0]).toString() == threeparts[0]){
			if (parseInt(threeparts[1]) > 0 && parseInt(threeparts[1]) < 12 && parseInt(threeparts[1]).toString() == threeparts[1]){
				if (parseInt(threeparts[2]).toString() == threeparts[2]){
					return 'DD/MM/YYYY';
				}
			}
		}
	}
	else if (threeparts.length == 2) {
		if (parseInt(threeparts[0]) > 0 && parseInt(threeparts[0]) < 13 && parseInt(threeparts[0]).toString() == threeparts[0]){
			if (parseInt(threeparts[1]) > 1500 && parseInt(threeparts[1]) < 2500 && parseInt(threeparts[1]).toString() == threeparts[1]){
				return 'MM/YYYY';
			}
		}
	}
	threeparts = input_str.replace(',','').split(' ');
	if (threeparts.length == 3) {
		if (isMonth(threeparts[0])){
			if (parseInt(threeparts[1]) > 0 && parseInt(threeparts[1]) < 32 && parseInt(threeparts[1]).toString() == threeparts[1]){
				if (parseInt(threeparts[2]).toString() == threeparts[2]){
					return 'MONTH DAY, YYYY';
				}
			}
		}
		if (parseInt(threeparts[0]) > 0 && parseInt(threeparts[0]) < 32 && parseInt(threeparts[0]).toString() == threeparts[0]){
			if (isMonth(threeparts[1])){
				if (parseInt(threeparts[2]).toString() == threeparts[2]){
					return 'DAY MONTH, YYYY';
				}
			}
		}
	}
	else if (threeparts.length == 2) {
		if (isMonth(threeparts[0])){
			if (parseInt(threeparts[1]) > 1500 && parseInt(threeparts[1]) < 2500 && parseInt(threeparts[1]).toString() == threeparts[1]){
				return 'MONTH YYYY';
			}
		}
	}
	return false;
}
function getDataType(input_str,head_str){
	input_str = input_str.trim().toLowerCase();
	head_str = head_str.trim().toLowerCase();
	if (input_str.length == 0) {
		return 'Blank';
	}
	else if (parseInt(input_str).toString() == input_str){
		if (head_str.indexOf('zip') == 0 && parseInt(input_str) <10000 && parseInt(input_str) > 0) {
			return 'Zip';
		}
		return 'Int';
	}
	else if (parseInt(input_str.replace('.','')).toString() == input_str.replace('.','')){
		if (head_str.indexOf('lat') == 0 && parseFloat(input_str) < 200 && parseFloat(input_str) > -200) {
			if (head_str.length < 6 || head_str.indexOf('latitude') == 0){
				return 'Lat';
			}
		}
		else if (head_str.indexOf('lon') == 0 && parseFloat(input_str) < 200 && parseFloat(input_str) > -200) {
			if (head_str.length < 6 || head_str.indexOf('longitude') == 0){
				return 'Lon';
			}
		}
		return 'Num';
	}
	else if (isDate(input_str)){
		return 'Date';//+isDate(input_str);
	}
	else if (parseInt(input_str.replace('/','')).toString() == input_str.replace('/','')){
		return 'Num';
	}
	else if (parseInt(input_str.replace('/','').replace('.','').replace('%','')).toString() == input_str.replace('/','').replace('.','').replace('%','')){
		return 'Percent';
	}
	else if (parseInt(input_str.replace('-','')).toString() == input_str.replace('-','')){
		if (input_str.length == 10 && input_str.indexOf('-') == 5) {
			return 'Zip';
		}
		else if (input_str.length == 8 && input_str.indexOf('-') == 3) {
			return 'Phone';
		}
	}
	else if (parseInt(input_str.replace('-','').replace('-','')).toString() == input_str.replace('-','').replace('-','')){
		if (input_str.length == 12 && input_str.indexOf('-') == 3) {
			return 'Phone';
		}
	}
	else if (input_str.indexOf('www.') > -1 || input_str.indexOf('http') > -1 || (input_str.indexOf('.com') > -1 && input_str.indexOf('@') == -1)){
		return 'Link';
	}
	else if ( (input_str.indexOf('.com') > -1 || input_str.indexOf('.edu') > -1 || input_str.indexOf('.org') > -1) && input_str.indexOf('@') > -1){
		return 'Email';
	}
	else if ( (input_str.indexOf('.com') == -1 && input_str.indexOf('.edu') == -1 && input_str.indexOf('.org') == -1) && input_str.indexOf('@') == 0){
		return 'Twitter';
	}
	
	return 'Not';
}