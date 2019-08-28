var tables = [{'id':'table1','type':'main','typeid':0}];
for (var i=1;i<13;i++) {
	for (var ii=1;ii<13;ii++) {
		var el = document.createElement("div");
		el.style.gridColumn = ii;
		el.style.gridRow = i;
		el.classList.add("ui-selectable");
		el.id = "testbox-"+i+"-"+ii;
		document.getElementById("gridwrapper").appendChild(el);
	}
}  	  

var selection = 0;
	
function newBlock(type="pivot") {
	if (selection == 0) {
		selection = new Selection({
			class: 'gridwrapper',
			startThreshold: 50,
			disableTouch: false,
			mode: 'touch',
			singleClick: false,
			// Query selectors from elements which can be selected
			selectables: ['.ui-selectable'],
			// Query selectors for elements from where a selection can be start
			startareas: ['html'],
			// Query selectors for elements which will be used as boundaries for the selection
			boundaries: ['html'],
			// Query selector or dom node to set up container for selection-area-element
			selectionAreaContainer: 'body',
			// On scrollable areas the number on px per frame is devided by this amount.
			// Default is 10 to provide a enjoyable scroll experience.
			scrollSpeedDivider: 10
		});

		selection.on('move', evt => {
			var addedElements = evt.changed.added;
			var addedN = addedElements.length;
			if (addedN > 0){
				createTmp(evt.selected);
			}
			else {
				var removedElements = evt.changed.removed;
				var removedN = removedElements.length;
				if (removedN > 0){
					createTmp(evt.selected);
				}
			}
	
		}).on('stop', evt => {
			if (document.getElementById("tmpgrid")){
				var tmpEl = document.getElementById('tmpgrid');
				if (type == "pivot"){
					createPerm(tmpEl,type+"table1",'tableP','pivot');
				}
				else if (type == "streak"){
					createPerm(tmpEl,type+"Table1",'tableS','streak');
				}
				else if (type == "main"){
					createPerm(tmpEl,type+"Table1",'tableM','streak');
				}
				else if (type == "games"){
					createPerm(tmpEl,type+"Table1",'tableS','streak');
				}
				
			}
	
		});
	}
	else {
		selection.destroy();
		selection = 0;
	}
}

function rearrangeMode() {
	var baseNode = document.getElementById("table1");
	var toChange = baseNode.cloneNode();
	toChange.style.border = "30px solid rgba(0,0,255,.75)";
	toChange.style.background = "rgba(255,255,255,.75)";
	toChange.style.zIndex = "3000";
	baseNode.parentNode.appendChild(toChange);
}

function createPerm(tmpEl,divid,tablePrefix="tableP",tabletype="pivot") {
	tmpEl.id = divid;
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
			thead.style.display = "none";
			thead.id = tablePrefix+"head";
				var tr = document.createElement("tr");
				tr.id = "move"+tablePrefix+"Columns";
				thead.appendChild(tr);
			table.appendChild(thead);
			var tbody = document.createElement("tbody");
			tbody.style.display = "none";
			tbody.id = tablePrefix+"body";
				for (var i=0;i<10;i++) {
					var tr2 = document.createElement("tr");
					tbody.appendChild(tr2);
				}
			table.appendChild(tbody);
		tableDiv.appendChild(table);
	var pageDiv = document.createElement("div");
	pageDiv.id = "paginate"+tabletype;
	pageDiv.classList.add('paginate');
		var link = document.createElement("a");
		link.id = "pagePrev";
		link.setAttribute("onmousedown","newPage('Previous','"+tabletype+"')");
		link.textContent = "Previous";
		pageDiv.appendChild(link);
		
		link = document.createElement("a");
		link.id = "page1";
		link.setAttribute("onmousedown","newPage(1,'"+tabletype+"')");
		link.textContent = "1";
		link.classList.add("active");
		pageDiv.appendChild(link);
		for (var i=2;i<11;i++) {
			link = document.createElement("a");
			link.id = "page"+i;
			link.setAttribute("onmousedown","newPage("+i+",'"+tabletype+"')");
			link.textContent = i;
			pageDiv.appendChild(link);
		}
		link = document.createElement("a");
		link.id = "pageNext";
		link.setAttribute("onmousedown","newPage('Next','"+tabletype+"')");
		link.textContent = "Next";
		pageDiv.appendChild(link);
	
	tmpEl.appendChild(tableDiv);
	tmpEl.appendChild(pageDiv);
}
function createTmp(allElements) {
	var allN = allElements.length;
	var topleft = [-1,-1];
	var botright = [0,0];
	if (allN > 0){
		for (var i=0;i<allN;i++) {
			var coords = allElements[i].id.substring(7,).split('-');
			var xc = parseInt(coords[1]);
			var yc = parseInt(coords[2]);
			if (xc < topleft[0] || topleft[0] == -1){topleft[0] = xc;}
			if (xc > botright[0]){botright[0] = xc;}
			if (yc < topleft[1] || topleft[1] == -1){topleft[1] = yc;}
			if (yc > botright[1]){botright[1] = yc;}
		}
	}
	console.log(topleft, botright);
	botright[0] +=1; botright[1] +=1;
	
	if (document.getElementById("tmpgrid")){
		var tmpEl = document.getElementById('tmpgrid');
		tmpEl.style.gridColumn = topleft[1]+" / "+botright[1];
		tmpEl.style.gridRow = topleft[0]+" / "+botright[0];
	}
	else {
		var newEl = document.createElement('div');
		newEl.style.gridColumn = topleft[1]+" / "+botright[1];
		newEl.style.gridRow = topleft[0]+" / "+botright[0];
		newEl.classList.add("newGrid");
		newEl.id = "tmpgrid";
		document.getElementById("gridwrapper").appendChild(newEl);
	}
}

function maxEl(evt){
	toMax = evt.target.parentNode.cloneNode(true);
	toMax.style.gridColumn = "1 / 13";
	toMax.style.gridRow = "1";
	toMax.style.backgroundColor = "rgba(0,0,0,.8)";
	toMax.style.zIndex = "2";
	toMax.querySelector("button").addEventListener("click",normEl);
	evt.target.parentNode.parentNode.appendChild(toMax);
	
	var nrows = toMax.offsetHeight / 100;
	console.log(nrows);
	toMax.style.gridRow = "1 / " + Math.trunc(nrows + 1);
	
}

function normEl(evt){
	toNorm = evt.target.parentNode;
	toNorm.parentNode.removeChild(toNorm);
}