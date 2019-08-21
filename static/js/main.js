//const pageNum = document.querySelector('#pageNum');

const table1head = document.querySelector('#table1head');
const table1body = document.querySelector('#table1body');
var currentPage = 1;


const myWorker = new Worker("js/worker.js");


myWorker.onmessage = function(e) {
	let retmess = JSON.parse(e.data);
	
	const headrow = table1head.querySelector('tr');
	const headers = headrow.querySelectorAll('th');
	for (var ii=0;ii<32;ii++) {
		if (ii < retmess[0].length) {
			headers[ii].textContent = retmess[0][ii*2];
			headers[ii].setAttribute('onmousedown',"sort("+retmess[0][ii*2 + 1]+")");
			headers[ii].style.display = 'table-cell';
		}
		else {
			headers[ii].style.display = 'none';
		}
	}
	
	
	const rows = table1body.querySelectorAll('tr');
	for (var i=0;i<10;i++){
		const results = rows[i].querySelectorAll('td');
		for (var ii=0;ii<32;ii++) {
			if (ii < retmess[i+1].length) {
				results[ii].textContent = retmess[i+1][ii]; //add one because of header
				results[ii].style.display = 'table-cell';
			}
			else {
				results[ii].style.display = 'none';
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
	/*
	var d = new Date();
	var n = d.getTime();
	console.log(n);
  addCard({'type':"Sort",'sortCol':sortCol});
	var mymessage = "ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",sort,"+ sortCol;
	mymessage += "|ff.csv,"+ (currentPage*10-10) +","+ (currentPage*10) +",print,csv";
	myWorker.postMessage(mymessage);
	
	*/
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
