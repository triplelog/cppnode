//const pageNum = document.querySelector('#pageNum');

const table1head = document.querySelector('#table1head');
const table1body = document.querySelector('#table1body');
var currentPage = 1;
var sortMode = true;
var colInfo = {};


const myWorker = new Worker("js/worker.js");


myWorker.onmessage = function(e) {
	let retmess = JSON.parse(e.data);
	
	const headrow = table1head.querySelector('tr');
	const headers = headrow.querySelectorAll('th');
	for (var ii=0;ii<100;ii++) {
		if (ii*2 + 1 < retmess[0].length && ii < headers.length) {
			headers[ii].textContent = retmess[0][ii*2];
			headers[ii].setAttribute('onmousedown',"sort("+retmess[0][ii*2 + 1]+")");
			headers[ii].id = "cHeader"+retmess[0][ii*2 + 1];
			headers[ii].style.display = 'table-cell';
			colInfo[parseInt(retmess[0][ii*2 + 1])]=retmess[0][ii*2];
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
			colInfo[retmess[0][ii*2 + 1]]=retmess[0][ii*2];
			headrow.appendChild(newHeader);
		}
		else {
			break;
		}
	}
	
	
	const rows = table1body.querySelectorAll('tr');
	for (var i=0;i<10;i++){
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
	
	
	var d = new Date();
	var n = d.getTime();
  	console.log(n);
  	console.log("hello");
}



function newPage(pageId) {
  
  
	var d = new Date();
	var n = d.getTime();
	console.log(n);


	if (pageId == 'Next'){
		currentPage += 1;
	}
	else if (pageId == 'Previous') {
		if (currentPage > 1){
			currentPage -= 1;
		}
	}
	else {
		currentPage = pageId;
	}
	
	var allPages = document.getElementById("paginate");
  var allPageNums = allPages.querySelectorAll("a");
  for (var i=0;i<allPageNums.length;i++) {
    if (allPageNums[i].id == "page"+currentPage){
      allPageNums[i].classList.add("active");
    }
    else {
      allPageNums[i].classList.remove("active");
    }
  }
  
	var mymessage = "ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",print,csv";
	myWorker.postMessage(mymessage);


}

function sort(sortCol) {

	if (sortMode) {
		var d = new Date();
		var n = d.getTime();
		console.log(n);
		addCard({'type':"Sort",'sortCol':colInfo[sortCol]});
		var mymessage = "ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",sort,"+ sortCol;
		mymessage += "|ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",print,csv";
		myWorker.postMessage(mymessage);
	}
	
	
}

function newCol() {
  
	let colFormula = document.getElementById("newcol").value;
	var mymessage = "ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",addcol,"+ colFormula +"|";
	mymessage += "ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",print,csv|";
	mymessage += "ff.csv,0,-1,addcol,"+ colFormula;
	addCard({'type':"AddColumn",'colFormula':colFormula});
	myWorker.postMessage(mymessage);

}

function filter() {
  
	let colFormula = document.getElementById("filter").value;
	
	var mymessage = "ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",filter,"+ colFormula +"|";
	mymessage += "ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",print,csv|";
	mymessage += "ff.csv,0,-1,filter,"+ colFormula;
	addCard({'type':"Filter",'filterText':colFormula,'filterCode':mymessage});
	myWorker.postMessage(mymessage);

}

function toggleSort() {
	if (sortMode){sortMode = false;}
	else {sortMode = true;}
}
