//const pageNum = document.querySelector('#pageNum');


var currentPage = {"main":1};
var currentPerPage = {"main":10};
var sortMode = true;
var colInfo = {};
var upCheck = "";
var downCheck = "";
var tempCardJSON = {};
var filenn = Math.random().toString(36).substring(5, 10)
var filen = "ff"+filenn+".csv";
var pivottables = -1;
var streaktables = -1;
const myWorker = new Worker("js/worker.js");




myWorker.onmessage = function(e) {
	
	let retmess = JSON.parse(e.data);
	
	if (retmess[0][0] == 'Rk') {
		//document.getElementById('table1').style.display = "block";
		let gridid = 'grid1';
		chgTable(retmess,gridid,'main');
	}
	else if (retmess[0][0].substring(0,5) == 'Pivot') {
		let gridid = 'grid3';
		chgTable(retmess,gridid,'pivot');
	}
	else if (retmess[0][0].substring(0,6) == 'Streak') {
		let gridid = 'grid2';
		chgTable(retmess,gridid,'streak');
	}
	
	
	
	var d = new Date();
	var n = d.getTime();
  	console.log(n);
  	console.log("hello");
  	if (tempCardJSON.type != 'Page' && tempCardJSON.type != 'moveCol' && tempCardJSON.type != 'removeCol'){
  		addCard(tempCardJSON);
  	}
}

function chgTable(retmess,gridid,type){
	const maingrid = document.getElementById(gridid);
	if (maingrid.querySelectorAll('.tablehead').length == 0){
		makeTable(maingrid);
	}
	var tableend = 'main';
	if (type == 'pivot') {
		tableend = retmess[0][0].substring(0,retmess[0][0].length-2).toLowerCase();
	}
	else if (type == 'streak') {
		tableend = retmess[0][0].substring(0,retmess[0][0].length-2).toLowerCase();
	}
	const table1head = maingrid.querySelector('.tablehead');
	const table1body = maingrid.querySelector('.tablebody');
	table1head.style.display = "flex";
	table1body.style.display = "flex";
	const headrow = table1head.querySelector('tr');
	const headers = headrow.querySelectorAll('th');
	retmess[0][0] = 'Rk';
	for (var ii=0;ii<100;ii++) {
		if (ii*2 + 1 < retmess[0].length && ii < headers.length) {
			headers[ii].textContent = retmess[0][ii*2];
			headers[ii].setAttribute('onmousedown',"sort("+retmess[0][ii*2 + 1]+","+tableend+")");
			headers[ii].id = "cHeader"+retmess[0][ii*2 + 1];
			headers[ii].style.display = 'table-cell';
			if (type=='main') {colInfo[parseInt(retmess[0][ii*2 + 1])]=retmess[0][ii*2];}
		}
		else if (ii < headers.length) {
			headers[ii].style.display = 'none';
		}
		else if (ii*2 + 1 < retmess[0].length) {
			var newHeader = document.createElement("th");
			newHeader.textContent = retmess[0][ii*2];
			newHeader.setAttribute('onmousedown',"sort("+retmess[0][ii*2 + 1]+","+tableend+")");
			newHeader.id = "cHeader"+retmess[0][ii*2 + 1];
			newHeader.style.display = 'table-cell';
			newHeader.classList.add("th-sm");
			if (type=='main') {colInfo[retmess[0][ii*2 + 1]]=retmess[0][ii*2];}
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
	
	var pageDiv = maingrid.querySelector('.paginate');
	pageDiv.id = "paginate"+tableend;
		var links = pageDiv.querySelectorAll("a");
		links[0].setAttribute("onmousedown","newPage('Previous','"+tableend+"')");
		links[1].setAttribute("onmousedown","newPage(1,'"+tableend+"')");
		links[2].setAttribute("onmousedown","newPage(2,'"+tableend+"')");
		links[3].setAttribute("onmousedown","newPage(3,'"+tableend+"')");
		links[4].setAttribute("onmousedown","newPage(4,'"+tableend+"')");
		links[5].setAttribute("onmousedown","newPage(5,'"+tableend+"')");
		links[6].setAttribute("onmousedown","newPage(6,'"+tableend+"')");
		links[7].setAttribute("onmousedown","newPage(7,'"+tableend+"')");
		links[8].setAttribute("onmousedown","newPage(8,'"+tableend+"')");
		links[9].setAttribute("onmousedown","newPage(9,'"+tableend+"')");
		links[10].setAttribute("onmousedown","newPage(10,'"+tableend+"')");
		links[11].setAttribute("onmousedown","newPage('Next','"+tableend+"')");

	var perPage = maingrid.querySelector("input");
	perPage.id = "perPage"+tableend;
	perPage.setAttribute("oninput","setPerPage('"+tableend+"')");
	perPage.setAttribute("onkeydown","setPerPage('"+tableend+"')");
	var button = document.createElement("button");
	button.setAttribute("onclick","toggleSort()");
	button.textContent = "Columns";
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

function sort(sortCol,type) {

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
	streaktables++;
	var tableend = type+'@'+streaktables;
	currentPage[tableend]=1;
	currentPerPage[tableend]=10;
	
	var mymessage = filen+","+ (currentPage[tableend]*currentPerPage[tableend]-currentPerPage[tableend]) +","+ (currentPage[tableend]*currentPerPage[tableend]) +",streak,"+ colFormula;
	myWorker.postMessage(mymessage);
	mymessage = filen+","+ (currentPage[tableend]*currentPerPage[tableend]-currentPerPage[tableend]) +","+ (currentPage[tableend]*currentPerPage[tableend]) +",print,"+tableend;
	myWorker.postMessage(mymessage);
	
	upCheck = "abc";
	tempCardJSON = {'type':"Streak",'filterText':rawFormula,'filterCode':mymessage};

}

function pivot(type="pivot") {
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
	pivottables++;
	var tableend = type+'@'+pivottables;
	currentPage[tableend]=1;
	currentPerPage[tableend]=10;
	var mymessage = filen+","+"0,10,pivot,"+xcol+"@"+ycol+"@"+zcol;
	myWorker.postMessage(mymessage);
	mymessage = filen+","+"0,10,print,"+tableend;
	myWorker.postMessage(mymessage);
	
	upCheck = "abc";
	tempCardJSON = {'type':"Pivot",'pviotText':"",'pivotCode':""};

}

function lookup() {
	var mymessage = filen+",0,10,lookupq,sum@0@1@1@29";
	myWorker.postMessage(mymessage);
	mymessage = filen+","+"0,10,print,main";
	myWorker.postMessage(mymessage);
	upCheck = "abc";
	tempCardJSON = {'type':"Page"};
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

function save() {
	console.log(myInstructions);
	myWorker.postMessage('Save:myname:'+myInstructions);
}

function makeTable(tmpEl) {
	tmpEl.innerHTML = '';
	var maxbutton = document.createElement("button");
	maxbutton.textContent = "F";
	maxbutton.addEventListener("click",maxEl);
	tmpEl.appendChild(maxbutton);
	
	var tableDiv = document.createElement("div");
	tableDiv.classList.add("flex-center");
	tableDiv.classList.add("flex-column");
		var table = document.createElement("table");
		table.classList.add("striped");
		table.classList.add("hoverable");
			var thead = document.createElement("thead");
			thead.style.display = "flex";
			thead.classList.add("tablehead");
				var tr = document.createElement("tr");
				thead.appendChild(tr);
			table.appendChild(thead);
			var tbody = document.createElement("tbody");
			tbody.style.display = "flex";
			tbody.classList.add("tablebody");
			table.appendChild(tbody);
		tableDiv.appendChild(table);
	var pageDiv = document.createElement("div");
	pageDiv.classList.add('paginate');
		var link = document.createElement("a");
		link.id = "pagePrev";
		link.textContent = "Previous";
		pageDiv.appendChild(link);
		
		link = document.createElement("a");
		link.id = "page1";
		link.textContent = "1";
		link.classList.add("active");
		pageDiv.appendChild(link);
		for (var i=2;i<11;i++) {
			link = document.createElement("a");
			link.id = "page"+i;
			link.textContent = i;
			pageDiv.appendChild(link);
		}
		link = document.createElement("a");
		link.id = "pageNext";
		link.textContent = "Next";
		pageDiv.appendChild(link);
	var perPage = document.createElement("input");
	perPage.setAttribute("type","number");
	perPage.setAttribute("value","10");
	perPage.setAttribute("oninput","setPerPage()");
	perPage.setAttribute("onkeydown","setPerPage()");
	var button = document.createElement("button");
	button.setAttribute("onclick","toggleSort()");
	button.textContent = "Columns";
		
	tmpEl.appendChild(tableDiv);
	tmpEl.appendChild(pageDiv);
	tmpEl.appendChild(perPage);
	tmpEl.appendChild(button);
	
}
