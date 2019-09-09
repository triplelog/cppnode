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
	
function newBlock() {
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
				createPerm(document.getElementById('tmpgrid'));
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

function createPerm(tmpEl) {
	var maxbutton = document.createElement("button");
	maxbutton.innerHTML = "<span class='icon-link'></span>";
	maxbutton.addEventListener("click",maxEl);
	tmpEl.appendChild(maxbutton);
	
	var newbutton = document.createElement("button");
	newbutton.innerHTML = "<span class='icon-edit'></span>";
	newbutton.addEventListener("click",newEl);
	tmpEl.appendChild(newbutton);
	
	var tltable = document.createElement("tab-dn");
	tltable.setAttribute("src","tffyz");
	tltable.style.display = "inline-block";
	tmpEl.appendChild(tltable);
	
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

function newEl(evt) {
	alert(evt.target.parentNode.id);
}

function normEl(evt){
	toNorm = evt.target.parentNode;
	toNorm.parentNode.removeChild(toNorm);
}