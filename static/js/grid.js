
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

const selection = new Selection({
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
		createPerm(tmpEl,"pivotTable1");
		selection.destroy();
	}
	
});

function createPerm(tmpEl,divid) {
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
			thead.id = "tablePhead";
				var tr = document.createElement("tr");
				tr.id = "movePColumns";
				thead.appendChild(tr);
			table.appendChild(thead);
			var tbody = document.createElement("tbody");
			tbody.style.display = "none";
			tbody.id = "tablePbody";
				for (var i=0;i<10;i++) {
					var tr2 = document.createElement("tr");
					tbody.appendChild(tr2);
				}
			table.appendChild(tbody);
		tableDiv.appendChild(table);
	tmpEl.appendChild(tableDiv);
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
	toMax.style.height = "100%";
	toMax.style.backgroundColor = "rgba(0,0,0,.8)";
	toMax.querySelector("button").addEventListener("click",normEl);
	evt.target.parentNode.parentNode.appendChild(toMax);
	
}

function normEl(evt){
	toNorm = evt.target.parentNode;
	toNorm.parentNode.removeChild(toNorm);
}