class NanoTable extends HTMLElement {

  // A getter/setter for an open property.
  get src() {
    return this.hasAttribute('src');
  }
  
  
  // Can define constructor arguments if you wish.
  constructor() {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super();

    /* Setup a click listener on <nano-table> itself.
    this.addEventListener('click', e => {
      this.ws.send('ff.csv,0,10,print,main');
      
    });
    */
    
    
	
	var _this = this;
	this.colInfo = {};
    //this.createTable();
    this.createCards();
    this.addPaginate();
    this.addColumnButton();
    this.addFilterButton();
    this.addPivotButton();
    this.addColumnOperationButtons();
    this.startRow = 0;
    this.endRow = 10;
    this.userid = "ff.csv";
    this.usecache = true;
    this.showit = true;
    this.foundit = true;
    this.retdata = "";
    this.gtMode = false;
	this.ltMode = false;
	this.sortondown = false;
	this.currentMode = "sort";
	this.currentTable = "main";
    
    
    this.ws = new WebSocket('ws://155.138.201.160:8080');
    
    
	this.ws.onmessage = function(evt){
		if (evt.data.substring(0,4) == 'foot') {
			if (2 == 2) {
				console.log(evt.data.substring(4,evt.data.length));
				_this.addFoot(JSON.parse(evt.data.substring(4,evt.data.length)));
				var d = new Date();
				var n = d.getTime();
				console.log(n);
			}
			else{
				
			}
		}
		else if (evt.data[0] == '['){
			if (_this.showit) {
				console.log(evt.data);
				_this.addData(JSON.parse(evt.data));
				var d = new Date();
				var n = d.getTime();
				console.log(n);
			}
			else{
				_this.retdata = JSON.parse(evt.data);
				_this.foundit = true;
			}
		}
		else{
			_this.userid = evt.data;
			_this.ws.send(_this.userid+",0,10,sort,0");
			_this.ws.send(_this.userid+",0,10,print,main");
		}
	};
	
	
	this.ws.onopen = function(){
		_this.ws.send("Table,"+_this.getAttribute('src'));
	};
	
	

  }
  
  createTable() {
  	
  	const shadowRoot = this.attachShadow({mode: 'open'});
  	var table = document.createElement('table');
  		var thead = document.createElement('thead');
  			var tr = document.createElement('tr');
  			tr.style.display = "table-row";
			thead.appendChild(tr);
  		thead.style.background ='white';
  		table.appendChild(thead);
  		var tbody = document.createElement('tbody');
  		table.appendChild(tbody);
  		var tfoot = document.createElement('tfoot');
  		table.appendChild(tfoot);
  	table.style.overflowY = "auto";
  	table.style.overflowX = "auto";
  	table.style.maxHeight = "40vh";
  	table.style.margin = "0px";
  	table.style.border = "1px dashed blue";
  	table.style.maxWidth = (this.parentNode.clientWidth-20)+"px";
  	table.style.display = "block";
  	table.addEventListener("scroll",e => {this.scrollTable(e);});
  	//this.appendChild(table);
  	this.style.maxWidth = (this.parentNode.clientWidth-20)+"px";
  	this.shadowRoot.appendChild(table);
  	
  }
  
  createCards() {
  	
  	const shadowRoot = this.attachShadow({mode: 'open'});
  	shadowRoot.innerHTML = "<style>@import url('https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css');</style>";
  	var container = document.createElement('div');
  	container.classList.add("container");
		var containerrow = document.createElement('div');
		containerrow.classList.add("row");
	container.appendChild(containerrow);
  	container.style.border = "1px dashed blue";
  	container.style.maxWidth = (this.parentNode.clientWidth-20)+"px";
  	this.style.maxWidth = (this.parentNode.clientWidth-20)+"px";
  	this.shadowRoot.appendChild(container);
  	
  }
  
  scrollTable(e) {
  	latestKnownScrollY = e.target.scrollTop;
	this.requestTick();
  	
  }
  
  moveHeader(moveAmt) {
  	var thead = this.shadowRoot.querySelector("thead");
  	thead.style.transform = 'translate(0px, '+moveAmt+'px)';
  }
  
  requestTick() {
  	if(!ticking) {
		requestAnimationFrame(updateHP);
	}
	ticking = true;
  }
  
  addPaginate() {
  	var pageDiv = document.createElement("div");
	pageDiv.classList.add('paginate');
		var link = document.createElement("a");
		link.id = "pagePrev";
		link.textContent = "Prev";
		link.addEventListener('mousedown',e => {this.newPage(e);});
		pageDiv.appendChild(link);
		
		link = document.createElement("a");
		link.id = "page1";
		link.textContent = "1";
		link.addEventListener('mousedown',e => {this.newPage(e);});
		link.classList.add("active");
		pageDiv.appendChild(link);
		for (var i=2;i<11;i++) {
			link = document.createElement("a");
			link.id = "page"+i;
			link.textContent = i;
			link.addEventListener('mousedown',e => {this.newPage(e);});
			pageDiv.appendChild(link);
		}
		link = document.createElement("a");
		link.id = "pageNext";
		link.textContent = "Next";
		link.addEventListener('mousedown',e => {this.newPage(e);});
		pageDiv.appendChild(link);
	var perPage = document.createElement("input");
	perPage.setAttribute("type","number");
	perPage.setAttribute("value","10");
	perPage.id = "perPage";
	perPage.addEventListener("input",e => {this.setPerPage(e,0);});
	pageDiv.appendChild(perPage);
	
	var modeDropdown = document.createElement("select");
  		var option = document.createElement("option");
  		option.value = "sort";
  		option.textContent = "Sort";
  		modeDropdown.appendChild(option);
  		
  		option = document.createElement("option");
  		option.value = "newcol";
  		option.textContent = "New Column";
  		modeDropdown.appendChild(option);
  		
  		option = document.createElement("option");
  		option.value = "pivot";
  		option.textContent = "Pivot Table";
  		modeDropdown.appendChild(option);
  		
  		option = document.createElement("option");
  		option.value = "arrange";
  		option.textContent = "Arrange";
  		modeDropdown.appendChild(option);
  	modeDropdown.addEventListener("change", e => {this.chgMode(e,0);});
	pageDiv.appendChild(modeDropdown);
	
	this.shadowRoot.appendChild(pageDiv);
	
  }
  
  addColumnButton() {
  	var columnFormula = document.createElement("input");
  	columnFormula.setAttribute("type","text");
  	columnFormula.id = "columnFormula";
  	this.shadowRoot.appendChild(columnFormula);
  	var columnButton = document.createElement("button");
	columnButton.classList.add('columnButton');
	columnButton.textContent = 'Columns';
	columnButton.addEventListener("mousedown", e => {this.newCol(e,0);});
	columnButton.addEventListener("mouseup", e => {this.newCol(e,1);});
	this.shadowRoot.appendChild(columnButton);
  }
  
  addFilterButton() {
  	var filterFormula = document.createElement("input");
  	filterFormula.setAttribute("type","text");
  	filterFormula.id = "filterFormula";
  	this.shadowRoot.appendChild(filterFormula);
  	var filterButton = document.createElement("button");
	filterButton.classList.add('filterButton');
	filterButton.textContent = 'Filter';
	filterButton.addEventListener("mouseover", e => {this.newFilter(e,0);});
	filterButton.addEventListener("mousedown", e => {this.newFilter(e,1);});
	filterButton.addEventListener("mouseout", e => {this.newFilter(e,2);});
	filterButton.addEventListener("mouseup", e => {this.newFilter(e,3);});
	this.shadowRoot.appendChild(filterButton);
	
	var gtButton = document.createElement("button");
	gtButton.textContent = '>';
	gtButton.addEventListener("click", e => {this.filterCell(e,0);});
	this.shadowRoot.appendChild(gtButton);
	var ltButton = document.createElement("button");
	ltButton.textContent = '<';
	ltButton.addEventListener("click", e => {this.filterCell(e,1);});
	this.shadowRoot.appendChild(ltButton);
	var eqButton = document.createElement("button");
	eqButton.textContent = '=';
	eqButton.addEventListener("click", e => {this.filterCell(e,2);});
	this.shadowRoot.appendChild(eqButton);
  }
  
  addPivotButton() {
  	var pivotFormula = document.createElement("input");
  	pivotFormula.setAttribute("type","text");
  	pivotFormula.id = "pivotFormula";
  	this.shadowRoot.appendChild(pivotFormula);
  	var pivotButton = document.createElement("button");
	pivotButton.classList.add('pivotButton');
	pivotButton.textContent = 'Pivot';
	pivotButton.addEventListener("mousedown", e => {this.newPivot(e,1);});
	pivotButton.addEventListener("mouseup", e => {this.newPivot(e,3);});
	this.shadowRoot.appendChild(pivotButton);

  }
  
  addColumnOperationButtons() {
	var sumButton = document.createElement("button");
	sumButton.textContent = 'Sum';
	sumButton.addEventListener("click", e => {this.columnOperation(e,0);});
	this.shadowRoot.appendChild(sumButton);
	var meanButton = document.createElement("button");
	meanButton.textContent = 'Mean';
	meanButton.addEventListener("click", e => {this.columnOperation(e,1);});
	this.shadowRoot.appendChild(meanButton);
	var maxButton = document.createElement("button");
	maxButton.textContent = 'Max';
	maxButton.addEventListener("click", e => {this.columnOperation(e,2);});
	this.shadowRoot.appendChild(maxButton);
  }
  
  addData(retmess) {
	this.addDataCards(retmess);
	return 0;
	
	if (retmess[0][0].substring(0,5)=="Pivot"){
		this.currentTable = "pivot@" + retmess[0][0].substring(6,retmess[0][0].length-2);
		retmess[0][0] = "Rk";
	}
	var thead = this.shadowRoot.querySelector('thead');
	const headrow = thead.querySelector('tr');
	const headers = headrow.querySelectorAll('th');
	for (var ii=0;ii*2 + 1<Math.max(retmess[0].length,headers.length*2 + 1);ii++) {
		if (ii*2 + 1 < retmess[0].length && ii < headers.length) {
			headers[ii].textContent = retmess[0][ii*2];
			headers[ii].id = "cHeader"+retmess[0][ii*2 + 1];
			headers[ii].style.display = 'table-cell';
			this.colInfo[parseInt(retmess[0][ii*2 + 1])]=retmess[0][ii*2];
		}
		else if (ii < headers.length) {
			headers[ii].style.display = 'none';
		}
		else if (ii*2 + 1 < retmess[0].length) {
			var newHeader = document.createElement("th");
			newHeader.textContent = retmess[0][ii*2];
			newHeader.addEventListener('mouseover',e => {this.sort(e,0);});
			newHeader.addEventListener('mousedown',e => {this.sort(e,1);});
			newHeader.addEventListener('mouseout',e => {this.sort(e,2);});
			newHeader.addEventListener('mouseup',e => {this.sort(e,3);});
			newHeader.setAttribute("draggable","true");
			newHeader.addEventListener('dragstart',e => {this.dragColumn(e,0);});
			newHeader.addEventListener("dragover", e => {e.preventDefault();});
  			newHeader.addEventListener("drop", e => {e.preventDefault(); this.dropColumn(e,1);});
			newHeader.id = "cHeader"+retmess[0][ii*2 + 1];
			newHeader.style.display = 'table-cell';
			newHeader.classList.add("th-sm");
			this.colInfo[parseInt(retmess[0][ii*2 + 1])]=retmess[0][ii*2];
			headrow.appendChild(newHeader);
		}
		else {
			break;
		}
	}
	
	var tbody = this.shadowRoot.querySelector('tbody');
	var rows = tbody.querySelectorAll('tr');
	for (var i=0;i<retmess.length-1;i++){
		if (rows.length <= i) {
			var newrow = document.createElement('tr');
			newrow.addEventListener("dragover", e => {e.preventDefault();});
  			newrow.addEventListener("drop", e => {e.preventDefault(); this.dropColumn(e,0);});
			tbody.appendChild(newrow);
		}
	}
	rows = tbody.querySelectorAll('tr');
	for (var i=0;i<rows.length;i++){
		if (retmess.length-1 <= i) {
			rows[i].style.display = 'none';
		}
		else {
			rows[i].style.display = 'table-row';
		}
	}
	
	for (var i=0;i<retmess.length-1;i++){

		const results = rows[i].querySelectorAll('td');
		for (var ii=0;ii<Math.max(retmess[i+1].length,results.length);ii++) {
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
				newResult.id = 'cell-'+i+'-'+ii;
				newResult.addEventListener("click",e => {this.cellClick(e,0);});
				rows[i].appendChild(newResult);
			}
			else {
				break;
			}
		}
	}
  }
  
  addFoot(retmess) {
	
	var tfoot = this.shadowRoot.querySelector('tfoot');
	var rows = tfoot.querySelectorAll('tr');
	for (var i=0;i<retmess.length;i++){
		if (rows.length <= i) {
			var newrow = document.createElement('tr');
			tfoot.appendChild(newrow);
		}
	}
	rows = tfoot.querySelectorAll('tr');
	for (var i=0;i<rows.length;i++){
		if (retmess.length <= i) {
			rows[i].style.display = 'none';
		}
		else {
			rows[i].style.display = 'table-row';
		}
	}
	
	for (var i=0;i<retmess.length;i++){

		const results = rows[i].querySelectorAll('td');
		for (var ii=0;ii<Math.max(retmess[i].length,results.length);ii++) {
			if (ii < retmess[i].length && ii < results.length) {
				results[ii].textContent = retmess[i][ii];
				results[ii].style.display = 'table-cell';
			}
			else if (ii < results.length) {
				results[ii].style.display = 'none';
			}
			else if (ii < retmess[i].length) {
				var newResult = document.createElement("td");
				newResult.textContent = retmess[i][ii];
				newResult.style.display = 'table-cell';
				rows[i].appendChild(newResult);
			}
			else {
				break;
			}
		}
	}
  }
  
  addDataCards(retmess) {
	
	if (retmess[0][0].substring(0,5)=="Pivot"){
		this.currentTable = "pivot@" + retmess[0][0].substring(6,retmess[0][0].length-2);
		retmess[0][0] = "Rk";
	}
	/*
	var containerrow = this.shadowRoot.querySelector('.row');
	const cards = containerrow.querySelectorAll('div');
	*/
	/*
	for (var ii=0;ii*2 + 1<Math.max(retmess[0].length,cards.length*2 + 1);ii++) {
		if (ii*2 + 1 < retmess[0].length && ii < cards.length) {
			headers[ii].textContent = retmess[0][ii*2];
			headers[ii].id = "cHeader"+retmess[0][ii*2 + 1];
			headers[ii].style.display = 'table-cell';
			this.colInfo[parseInt(retmess[0][ii*2 + 1])]=retmess[0][ii*2];
		}
		else if (ii < headers.length) {
			headers[ii].style.display = 'none';
		}
		else if (ii*2 + 1 < retmess[0].length) {
			var newHeader = document.createElement("th");
			newHeader.textContent = retmess[0][ii*2];
			newHeader.addEventListener('mouseover',e => {this.sort(e,0);});
			newHeader.addEventListener('mousedown',e => {this.sort(e,1);});
			newHeader.addEventListener('mouseout',e => {this.sort(e,2);});
			newHeader.addEventListener('mouseup',e => {this.sort(e,3);});
			newHeader.setAttribute("draggable","true");
			newHeader.addEventListener('dragstart',e => {this.dragColumn(e,0);});
			newHeader.addEventListener("dragover", e => {e.preventDefault();});
  			newHeader.addEventListener("drop", e => {e.preventDefault(); this.dropColumn(e,1);});
			newHeader.id = "cHeader"+retmess[0][ii*2 + 1];
			newHeader.style.display = 'table-cell';
			newHeader.classList.add("th-sm");
			this.colInfo[parseInt(retmess[0][ii*2 + 1])]=retmess[0][ii*2];
			headrow.appendChild(newHeader);
		}
		else {
			break;
		}
	}
	*/
	
	var containerrow = this.shadowRoot.querySelector('.row');
	var cards = containerrow.querySelectorAll('.card');
	
	for (var i=0;i<retmess.length-1;i++){
		if (cards.length <= i) {
			var newcard = document.createElement('div');
			newcard.classList.add("card");
				var newhead = document.createElement('div');
				newhead.classList.add("section");
				newcard.appendChild(newhead);
				var newbody = document.createElement('div');
				newbody.classList.add("section");
				newcard.appendChild(newbody);
			containerrow.appendChild(newcard);
		}
	}
	
	cards = containerrow.querySelectorAll('.card');
	for (var i=0;i<cards.length;i++){
		if (retmess.length-1 <= i) {
			cards[i].style.display = 'none';
			cards[i].querySelectorAll('div')[0].textContent = "";
			cards[i].querySelectorAll('div')[1].textContent = "";
		}
		else {
			cards[i].style.display = 'flex';
			cards[i].querySelectorAll('div')[0].textContent = "";
			cards[i].querySelectorAll('div')[1].textContent = "";
		}
	}
	
	for (var i=0;i<retmess.length-1;i++){

		//const results = cards[i].querySelectorAll('td');
		cards[i].querySelectorAll('div')[0].textContent += retmess[i+1][0]+":";
		cards[i].querySelectorAll('div')[0].textContent += retmess[i+1][1];
		for (var ii=2;ii<Math.max(retmess[i+1].length);ii++) {
			cards[i].querySelectorAll('div')[1].textContent += retmess[i+1][ii]+"\n";
		}
	}
  }
  
  addFootCards(retmess) {
	
	var tfoot = this.shadowRoot.querySelector('tfoot');
	var rows = tfoot.querySelectorAll('tr');
	for (var i=0;i<retmess.length;i++){
		if (rows.length <= i) {
			var newrow = document.createElement('tr');
			tfoot.appendChild(newrow);
		}
	}
	rows = tfoot.querySelectorAll('tr');
	for (var i=0;i<rows.length;i++){
		if (retmess.length <= i) {
			rows[i].style.display = 'none';
		}
		else {
			rows[i].style.display = 'table-row';
		}
	}
	
	for (var i=0;i<retmess.length;i++){

		const results = rows[i].querySelectorAll('td');
		for (var ii=0;ii<Math.max(retmess[i].length,results.length);ii++) {
			if (ii < retmess[i].length && ii < results.length) {
				results[ii].textContent = retmess[i][ii];
				results[ii].style.display = 'table-cell';
			}
			else if (ii < results.length) {
				results[ii].style.display = 'none';
			}
			else if (ii < retmess[i].length) {
				var newResult = document.createElement("td");
				newResult.textContent = retmess[i][ii];
				newResult.style.display = 'table-cell';
				rows[i].appendChild(newResult);
			}
			else {
				break;
			}
		}
	}
  }
  
  sort(e,x) {
  	var d = new Date();
	var n = d.getTime();
	console.log(n);
	
  	var sortCol = e.target.id.substring(7,e.target.id.length);
  	var type = "main";
  	
  	if (this.currentMode == "sort" && this.currentTable == "main") {
  		if (this.usecache){
  			if (x==0){
				//Ignore mouseover
			}
			else if (x==1){
				var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",sort,"+ sortCol;
				this.ws.send(mymessage);
				mymessage = this.userid+","+ this.startRow +","+ this.endRow +",print,"+type;
				this.ws.send(mymessage);
				this.showit = false;
				//this.cancelit = false;
				this.foundit = false;
			}
			else if (x==2){
				//Cancel Sort
				//this.cancelit = true;
				this.sortondown = false;
			}
			else if (x==3){
			
				//Release Array and load table into memory, set usecache to false
				this.usecache = false;
				if (this.foundit){
					this.addData(this.retdata);
					this.showit = true;
				}
				else {
					this.showit = true;
					this.foundit = true;
				}
				this.ws.send("Load,"+this.userid);
				this.ws.send(this.userid+",0,10,sort,"+sortCol);
				this.sortondown = true;
				
			}
  		}
  		else {
			if (x==0){
				//var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",sort,"+ sortCol;
				//this.ws.send(mymessage);
				//this.sortondown = false;
				this.sortondown = true;
			}
			else if (x==1){
				if (this.sortondown) {
					var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",sort,"+ sortCol;
					this.ws.send(mymessage);
				}
				var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",print,"+type;
				this.ws.send(mymessage);
				this.showit = false;
				this.foundit = false;
			}
			else if (x==2){
				//Cancel Sort
				this.sortondown = false;
			}
			else if (x==3){
				if (this.foundit){
					this.addData(this.retdata);
					this.showit = true;
				}
				else {
					this.showit = true;
					this.foundit = true;
				}
				this.sortondown = true;
			}
		}
		
	}

  }
  
  newPage(e) {
  
	var d = new Date();
	var n = d.getTime();
	console.log(n);
	
	var pageId = e.target.id.substring(4,e.target.id.length);
	var cpage = 1;

	if (pageId == 'Next'){
		var diff = this.endRow - this.startRow;
		this.endRow += diff;
		this.startRow += diff;
		cpage++;
	}
	else if (pageId == 'Prev') {
		var diff = this.endRow - this.startRow;
		if (this.startRow >= diff){
			this.endRow -= diff;
			this.startRow -= diff;
			cpage--;
		}
		else {
			this.startRow = 0;
			this.endRow = diff;
			cpage = 1;
		}
	}
	else {
		var diff = this.endRow - this.startRow;
		this.startRow = (pageId - 1) * diff;
		this.endRow = pageId * diff;
		cpage = pageId;
	}

	var allPages = this.shadowRoot.querySelector(".paginate");
	var allPageNums = allPages.querySelectorAll("a");
	for (var i=0;i<allPageNums.length;i++) {
		if (allPageNums[i].id == "page"+cpage){
		  allPageNums[i].classList.add("active");
		}
		else {
		  allPageNums[i].classList.remove("active");
		}
	  }
	var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",print,"+this.currentTable;
	this.ws.send(mymessage);


  }
  
  newCol(e,x) {
  	//Add formula to convert
  	
  	var rawFormula = this.shadowRoot.querySelector("#columnFormula").value;
  	var colFormula;
  	var newColName = "New";
  	if (rawFormula.split(':').length>1){
  		newColName = rawFormula.split(':')[0];
  		rawFormula = rawFormula.split(':')[1];
  		
  	}
	colFormula = postfixify(rawFormula,this.colInfo)+'@'+newColName;
	var type = 'main';
	//console.log(colFormula);
	
	if (this.usecache){
		if (x==0){
			var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",addcol,"+ colFormula;
			this.ws.send(mymessage);
			mymessage = this.userid+","+ this.startRow +","+ this.endRow +",print,"+type;
			this.ws.send(mymessage);
			this.showit = false;
			this.foundit = false;
		}
		else {
			this.usecache = false;
			if (this.foundit){
				this.addData(this.retdata);
				this.showit = true;
			}
			else {
				this.showit = true;
				this.foundit = true;
			}
			this.ws.send("Load,"+this.userid);
			this.ws.send(this.userid+",0,10,sort,0");
			var mymessage = this.userid+","+"0,-1,addcol,"+ colFormula;
			this.ws.send(mymessage);
		}
	}
	else {
		if (x==0){
			if (this.currentTable == "pivot@0"){colFormula += "@0";}
			
			var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",addcol,"+ colFormula;
			console.log(mymessage)
			this.ws.send(mymessage);
			mymessage = this.userid+","+ this.startRow +","+ this.endRow +",print,"+this.currentTable;
			this.ws.send(mymessage);
			this.showit = false;
			this.foundit = false;
		}
		else {
			if (this.foundit){
				this.addData(this.retdata);
				this.showit = true;
			}
			else {
				this.showit = true;
				this.foundit = true;
			}
			if (this.currentTable == "main") {
				var mymessage = this.userid+","+"0,-1,addcol,"+ colFormula;
				this.ws.send(mymessage);
			}
		}
	}
	
	
  }
  
  newFilter(e,x) {
  	var type = 'main';
	let rawFormula = this.shadowRoot.querySelector("#filterFormula").value;
	if (rawFormula == ''){return 0;}
	let filterFormula = postfixify(rawFormula,this.colInfo);
	console.log(filterFormula);
	
	if (this.usecache){
		this.usecache = false;
		this.ws.send("Load,"+this.userid);
		this.ws.send(this.userid+",0,10,sort,0");
	}
	
	
	if (x == 0){
		var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",filter,"+ filterFormula;
		this.ws.send(mymessage);
	}
	else if (x == 1){
		var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",print,"+type;
		this.ws.send(mymessage);
		mymessage = this.userid+","+"0,-1,filter,"+ filterFormula;
		this.ws.send(mymessage);
		this.showit = false;
		this.foundit = false;
	}
	else if (x == 3){
		if (this.foundit){
			this.addData(this.retdata);
			this.showit = true;
		}
		else {
			this.showit = true;
			this.foundit = true;
		}
	}

  }
  
  newPivot(e,x) {
  	/*
	let rawFormula = this.shadowRoot.querySelector("#filterFormula").value;
	if (rawFormula == ''){return 0;}
	let filterFormula = postfixify(rawFormula,this.colInfo);
	console.log(filterFormula);
	*/
	
	if (this.usecache){
		this.usecache = false;
		this.ws.send("Load,"+this.userid);
		this.ws.send(this.userid+",0,10,sort,0");
	}
	
	
	if (x == 1){
		var diff = this.endRow - this.startRow;
		this.startRow = 0;
		this.endRow = diff;
		var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",pivot,1@6";
		this.ws.send(mymessage);
		mymessage = this.userid+","+this.startRow +","+ this.endRow+",print,pivot@0";
		this.ws.send(mymessage);
		this.showit = false;
		this.foundit = false;
	}
	else if (x == 3){
		if (this.foundit){
			this.addData(this.retdata);
			this.showit = true;
		}
		else {
			this.showit = true;
			this.foundit = true;
		}
	}

  }
  
  setPerPage(e,x) {
  	var diff = parseInt(this.shadowRoot.querySelector("#perPage").value);
  	if (isNaN(diff) || diff < 1 ){return 0;}
  	this.startRow = this.startRow - (this.startRow % diff);
  	this.endRow = this.startRow + diff;
  	var cpage = this.startRow / diff + 1;
  	var allPages = this.shadowRoot.querySelector(".paginate");
	var allPageNums = allPages.querySelectorAll("a");
	for (var i=0;i<allPageNums.length;i++) {
		if (allPageNums[i].id == "page"+cpage){
		  allPageNums[i].classList.add("active");
		}
		else {
		  allPageNums[i].classList.remove("active");
		}
	}
	var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",print,"+this.currentTable;
	this.ws.send(mymessage);
  }
  
  filterCell(e,x) {
  	if (x == 0) {
		this.gtMode = true;
		this.ltMode = false;
  	}
  	else if (x == 1) {
  		this.gtMode = false;
		this.ltMode = true;
  	}
  }
  
  columnOperation(e,x) {
  	var type = 'main';
  	if (x == 0) {
		var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",sum,"+type;
		this.ws.send(mymessage);
  	}
  	else if (x == 1) {
  		var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",mean,"+type;
		this.ws.send(mymessage);
  	}
  	else if (x == 2) {
  		var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",max,"+type;
		this.ws.send(mymessage);
  	}
  	else if (x == 3) {
  		var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",min,"+type;
		this.ws.send(mymessage);
  	}
  }
  
  cellClick(e,x) {
  	if (this.gtMode || this.ltMode){
  		var cell = e.target.id;
  		var val = parseInt(this.shadowRoot.querySelector('#'+cell).textContent);
  		var col = parseInt(cell.split('-')[2]);
  		var thead = this.shadowRoot.querySelector('thead');
		const headrow = thead.querySelector('tr');
		const headers = headrow.querySelectorAll('th');
		var colName = headers[col].textContent;
  		console.log(val,colName);
  		if (this.shadowRoot.querySelector("#filterFormula").value != ""){
  			this.shadowRoot.querySelector("#filterFormula").value += 'AND';
  		}
  		
  		if (this.gtMode) {
  			this.shadowRoot.querySelector("#filterFormula").value += colName.toUpperCase()+'>'+val;
  		}
  		else if (this.ltMode) {
  			this.shadowRoot.querySelector("#filterFormula").value += colName.toUpperCase()+'<'+val;
  		}
  		
  	}
  }
  
  chgMode(e,x) {
  	this.currentMode = e.target.value;
  }
  
  dragColumn(e,x) {
  	if (this.currentMode == 'arrange') {
  		e.dataTransfer.setData("text", e.target.id);
  		e.dataTransfer.dropEffect = "move";
  		//var img = document.createElement("img");
    	//img.src = "http://kryogenix.org/images/hackergotchi-simpler.png";
   		//e.dataTransfer.setDragImage(img, 0, 0);
  	}
  }
  
  dropColumn(e,x) {
  	if (x == 1){
  		if (this.currentMode == 'arrange') {
  			if (e.dataTransfer.getData("text").substring(7,) != e.target.id.substring(7,)){
				var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",display,"+e.dataTransfer.getData("text").substring(7,);
				mymessage += "@"+e.target.id.substring(7,);
				this.ws.send(mymessage);
			}
		}
  	}
  	else {
		if (this.currentMode == 'arrange') {
			var mymessage = this.userid+","+ this.startRow +","+ this.endRow +",display,"+e.dataTransfer.getData("text").substring(7,);
			mymessage += "@-3";
			this.ws.send(mymessage);
		}
  	}
  }
	
  
}

customElements.define('nano-table', NanoTable);


latestKnownScrollY = 0;
ticking = false;
var myVar = setTimeout(after10,50);
function updateHP() {
	/*
	ticking = false;
	document.querySelector("nano-table").moveHeader(0);
	clearTimeout(myVar);
	myVar = setTimeout(after10,50);
	*/

}

function after10() {
	/*
	document.querySelector("nano-table").moveHeader(latestKnownScrollY);
	*/
}
  
function makePost(infixexpr) {
	prec = {}
	prec["*"] = 4
	prec["/"] = 4
	prec["+"] = 3
	prec["~"] = 3
	prec[">"] = 2
	prec["<"] = 2
	prec["="] = 2
	prec["!"] = 2
	prec["["] = 2
	prec["]"] = 2
	prec["&"] = 1
	prec["|"] = 0
	prec["("] = -1
	opStack = []
	postfixList = []
	intstr = ''
	expstr = ''
	tokenList = []
	temptoken = ''
	for (var i=0;i<infixexpr.length;i++){
		var ie = infixexpr[i];
		if ("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(ie) > -1){
			temptoken += ie
		}
		else{
			if (temptoken != ''){
				tokenList.push(temptoken)
			}
			tokenList.push(ie)
			temptoken = ''
		}
	}
	if (temptoken != ''){
		tokenList.push(temptoken)
	}
	
	for (var i=0;i<tokenList.length;i++){
		var token = tokenList[i];
		if ("*/+~><=![]&|()".indexOf(token) == -1){
			postfixList.push(token)
		}
		else if (token == '('){
			opStack.push(token)
		}
		else if (token == ')'){
			topToken = opStack.pop()
			while (topToken != '('){
				postfixList.push(topToken)
				topToken = opStack.pop()
			}
		}
		else {
			while ((opStack.length > 0) && (prec[opStack[opStack.length-1]] >= prec[token])){
				postfixList.push(opStack.pop())
			}
			opStack.push(token)
		}
	}
	while (opStack.length > 0){
		postfixList.push(opStack.pop())
	}
	for (var i=0;i<postfixList.length;i++){
		var ci = postfixList[i];
		if ("*/+~><=![]&|".indexOf(ci) == -1){
			intstr += ci + '_'
			expstr += '#'
		}
		else if (ci == '~'){
			expstr += '-'
		}
		else{
			expstr += ci
		}
	}
	intstr = intstr.substring(0,intstr.length-1)
	return [intstr,expstr]

}

function replaceDecimals(istr){
	dindex = istr.indexOf('.');
	while (dindex >-1){
		intpart = 0;
		decpart = 0;
		denom = 1;
		strparts = [dindex,dindex+1];
		for (var i=1;i<dindex+1;i++){
			if ("0123456789".indexOf(istr[dindex-i]) > -1){
				intpart += parseInt(istr[dindex-i])*Math.pow(10,i-1);
				strparts[0] = dindex-i;
			}
			else{break;}
		}
		for (var i=dindex+1;i<istr.length;i++){
			if ("0123456789".indexOf(istr[i]) > -1){
				decpart *=10;
				denom *=10;
				decpart += parseInt(istr[i]);
				strparts[1] = i+1;
			}
			else{break;}
		}
		istr = istr.substring(0,strparts[0])+'('+ (intpart*denom+decpart) +'/'+ denom +')'+istr.substring(strparts[1],);
		dindex = istr.indexOf('.');
	}

	return istr
}

function replaceNegatives(istr){
	dindex = istr.indexOf('-')
	while (dindex >-1){
		if (dindex == 0){
			if ("0123456789".indexOf(istr[1]) == -1) {
				istr = '-1*'+istr.substring(1,);
			}
			dindex = istr.indexOf('-',1);
		}
		else{
			if ("><=![]&|(".indexOf(istr[dindex-1])> -1) {
				if ("0123456789".indexOf(istr[dindex-1])== -1){
					istr = istr.substring(0,dindex)+'-1*'+istr.substring(dindex+1,);
				}
				dindex = istr.indexOf('-',dindex+1);
			}
			else{
				istr = istr.substring(0,dindex)+'~'+istr.substring(dindex+1,);
				dindex = istr.indexOf('-',dindex+1);
			}
		}
	}
				
	return istr
}

function postfixify(input_str,colInfo) {
	input_str = input_str.toUpperCase();
	input_str = input_str.replace(/AND/g,'&');
	input_str = input_str.replace(/OR/g,'|');
	input_str = input_str.replace(/\[/g,'(');
	input_str = input_str.replace(/]/g,')');
	input_str = input_str.replace(/{/g,'(');
	input_str = input_str.replace(/}/g,')');
	input_str = input_str.replace(/>=/g,']');
	input_str = input_str.replace(/<=/g,'[');
	input_str = input_str.replace(/==/g,'=');
	input_str = input_str.replace(/!=/g,'!');
	input_str = input_str.replace(/\+-/g,'-');
	input_str = input_str.replace(/--/g,'+');
	input_str = replaceDecimals(input_str);
	input_str = replaceNegatives(input_str);
	var twoparts = makePost(input_str);
	//Convert column names
	console.log(twoparts[0]);
	console.log(twoparts[1]);
	var firstpart = twoparts[0].split("_");
	for (var i=0;i<firstpart.length;i++){
		if (parseInt(firstpart[i]).toString() != firstpart[i]){
			for (var ii in colInfo) {
				if (colInfo[ii].toUpperCase() == firstpart[i]) {
					firstpart[i] = 'c'+ii;
					break;
				}
			}
		}
		else {
			firstpart[i] = firstpart[i]+'.1.I';
		}
	}
	var fullstr = firstpart.join("_")+'@'+twoparts[1];
	return fullstr;
}

//12.3-4.5==-2+aAND4.552!=(x-1)