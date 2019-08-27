//const pageNum = document.querySelector('#pageNum');


var currentPage = {"main":1,"pivot":1,"streak":1};
var currentPerPage = {"main":10,"pivot":10,"streak":10};
var sortMode = true;
var colInfo = {};
var upCheck = "";
var downCheck = "";
var tempCardJSON = {};
var filenn = Math.random().toString(36).substring(5, 10)
var filen = "ff"+filenn+".csv";

const myWorker = new Worker("js/worker.js");




myWorker.onmessage = function(e) {
	
	let retmess = JSON.parse(e.data);
	if (retmess[0][0] == 'Rk') {
		document.getElementById('table1').style.display = "block";
		chgTable(retmess);
	}
	else if (retmess[0][0] == 'PivotRk') {
		chgTable(retmess,'tableP');
	}
	else if (retmess[0][0] == 'StreakRk') {
		chgTable(retmess,'tableS');
	}
	
	
	
	var d = new Date();
	var n = d.getTime();
  	console.log(n);
  	console.log("hello");
  	if (tempCardJSON.type != 'Page' && tempCardJSON.type != 'moveCol' && tempCardJSON.type != 'removeCol'){
  		addCard(tempCardJSON);
  	}
}

function chgTable(retmess,tablePrefix="table1"){
	const table1head = document.querySelector('#'+tablePrefix+'head');
	const table1body = document.querySelector('#'+tablePrefix+'body');
	table1head.style.display = "flex";
	table1body.style.display = "flex";
	const headrow = table1head.querySelector('tr');
	const headers = headrow.querySelectorAll('th');
	for (var ii=0;ii<100;ii++) {
		if (ii*2 + 1 < retmess[0].length && ii < headers.length) {
			headers[ii].textContent = retmess[0][ii*2];
			headers[ii].setAttribute('onmousedown',"sort("+retmess[0][ii*2 + 1]+")");
			headers[ii].id = "cHeader"+retmess[0][ii*2 + 1];
			headers[ii].style.display = 'table-cell';
			if (tablePrefix=="table1") {colInfo[parseInt(retmess[0][ii*2 + 1])]=retmess[0][ii*2];}
		}
		else if (ii < headers.length) {
			headers[ii].style.display = 'none';
		}
		else if (ii*2 + 1 < retmess[0].length) {
			var newHeader = document.createElement("th");
			newHeader.textContent = retmess[0][ii*2];
			newHeader.setAttribute('onmousedown',"sort("+retmess[0][ii*2 + 1]+")");
			newHeader.id = "cHeader"+retmess[0][ii*2 + 1];
			newHeader.style.display = 'table-cell';
			newHeader.classList.add("th-sm");
			if (tablePrefix=="table1") {colInfo[retmess[0][ii*2 + 1]]=retmess[0][ii*2];}
			headrow.appendChild(newHeader);
		}
		else {
			break;
		}
	}
	
	var rows = table1body.querySelectorAll('tr');
	for (var i=0;i<retmess.length-1;i++){
		if (rows.length <= i) {
			var newrow = document.createElement('tr');
			table1body.appendChild(newrow);
		}
	}
	rows = table1body.querySelectorAll('tr');
	for (var i=0;i<rows.length;i++){
		if (retmess.length-1 <= i) {
			rows[i].style.display = 'none';
		}
		else {
			rows[i].style.display = 'flex';
		}
	}
	
	for (var i=0;i<retmess.length-1;i++){

		const results = rows[i].querySelectorAll('td');
		for (var ii=0;ii<100;ii++) {
			if (ii < retmess[i+1].length && ii < results.length) {
				results[ii].textContent = retmess[i+1][ii]; //add one because of header
				results[ii].style.display = 'table-cell';
			}
			else if (ii < results.length) {
				results[ii].style.display = 'none';
			}
			else if (ii < retmess[i+1].length) {
				var newResult = document.createElement("td");
				newResult.textContent = retmess[i+1][ii];
				newResult.style.display = 'table-cell';
				rows[i].appendChild(newResult);
			}
			else {
				break;
			}
		}
	}
}



function newPage(pageId,type="main") {
  
  
	var d = new Date();
	var n = d.getTime();
	console.log(n);


	if (pageId == 'Next'){
		currentPage[type] += 1;
	}
	else if (pageId == 'Previous') {
		if (currentPage[type] > 1){
			currentPage[type] -= 1;
		}
	}
	else {
		currentPage[type] = pageId;
	}
	
	var allPages = document.getElementById("paginate"+type);
  var allPageNums = allPages.querySelectorAll("a");
  for (var i=0;i<allPageNums.length;i++) {
    if (allPageNums[i].id == "page"+currentPage[type]){
      allPageNums[i].classList.add("active");
    }
    else {
      allPageNums[i].classList.remove("active");
    }
  }
	var mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",print,"+type;
	myWorker.postMessage(mymessage);
	tempCardJSON = {'type':"Page"};


}

function sort(sortCol,type="main") {

	if (sortMode) {
		var d = new Date();
		var n = d.getTime();
		console.log(n);
		
		var mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",sort,"+ sortCol;
		myWorker.postMessage(mymessage);
		mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",print,"+type;
		myWorker.postMessage(mymessage);
		upCheck = "abc";
		
		tempCardJSON = {'type':"Sort",'sortCol':colInfo[sortCol]};
		
	}
	
	
}

function newCol(type="main") {
	
  	//Add formula to convert
  	let rawFormula = document.getElementById("newcol").value
	let colFormula = postfixify(rawFormula);
	console.log(colFormula);

	var mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",addcol,"+ colFormula;
	myWorker.postMessage(mymessage);
	mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",print,"+type;
	myWorker.postMessage(mymessage);
	mymessage = filen+","+"0,-1,addcol,"+ colFormula;
	myWorker.postMessage(mymessage);
	
	upCheck = "abc";
	tempCardJSON = {'type':"AddColumn",'rawFormula':rawFormula,'colFormula':colFormula};
	

}

function filter(type="main") {
  
	let rawFormula = document.getElementById("filter").value;
	let colFormula = postfixify(rawFormula);
	console.log(colFormula);
	
	var mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",filter,"+ colFormula;
	myWorker.postMessage(mymessage);
	mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",print,"+type;
	myWorker.postMessage(mymessage);
	mymessage = filen+","+"0,-1,filter,"+ colFormula;
	myWorker.postMessage(mymessage);
	
	upCheck = "abc";
	tempCardJSON = {'type':"Filter",'filterText':rawFormula,'filterCode':mymessage};

}

function streak(type="streak") {
  
	let rawFormula = document.getElementById("streak").value;
	let colFormula = postfixify(rawFormula);
	console.log(colFormula);
	
	var mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",streak,"+ colFormula;
	myWorker.postMessage(mymessage);
	mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type]) +",print,"+type;
	myWorker.postMessage(mymessage);
	
	upCheck = "abc";
	tempCardJSON = {'type':"Streak",'filterText':rawFormula,'filterCode':mymessage};

}

function pivot() {
	var xcol = document.getElementById("pivotx").value;
	var ycol = document.getElementById("pivoty").value;
	var zcol = document.getElementById("pivotz").value;
	for (var ii in colInfo) {
		if (colInfo[ii].toUpperCase() == xcol.toUpperCase()) {
			xcol = ii;
		}
		if (colInfo[ii].toUpperCase() == ycol.toUpperCase()) {
			ycol = ii;
		}
		if (colInfo[ii].toUpperCase() == zcol.toUpperCase()) {
			zcol = ii;
		}
	}
	var mymessage = filen+","+"0,10,pivot,"+xcol+"@"+ycol+"@"+zcol;
	myWorker.postMessage(mymessage);
	mymessage = filen+","+"0,10,print,pivot";
	myWorker.postMessage(mymessage);
	upCheck = "abc";
	tempCardJSON = {'type':"Pivot",'pviotText':"",'pivotCode':""};

}

function toggleSort() {
	if (sortMode){sortMode = false;}
	else {sortMode = true;}
}


function setPerPage(type='main') {
	var npp = document.getElementById("perPage"+type).value;
	console.log(npp);
	if (parseInt(npp)>0){
		currentPage[type] = 1;
		currentPerPage[type] = parseInt(npp);
		var allPages = document.getElementById("paginate"+type);
	  var allPageNums = allPages.querySelectorAll("a");
	  for (var i=0;i<allPageNums.length;i++) {
		if (allPageNums[i].id == "page"+currentPage[type]){
		  allPageNums[i].classList.add("active");
		}
		else {
		  allPageNums[i].classList.remove("active");
		}
	  }
		var mymessage = filen+","+(currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type])+",print,"+type;
		myWorker.postMessage(mymessage);
		
		tempCardJSON = {'type':"Page"};
	}
}
