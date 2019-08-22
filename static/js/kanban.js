
allCards = [];
myCards = [];
myInstructions = [];
card1 = {'id':"otherUser1",'type':"Sort",'title':"Sort by 3rd Col.",'detail':"Sort table by HR.",'comments':[],'code':"ff.csv,0,100,sort,3"};
card2 = {'id':"otherUser2",'type':"Sort",'title':"Sort by 4th Col.",'detail':"Sort table by RBI.",'comments':[],'code':"ff.csv,0,100,sort,4"};
allCards.push(card1);
allCards.push(card2);
createInstructionCard(allCards[0]);
createInstructionCard(allCards[1]);
var idCounter = 0;


dragula([document.getElementById("otherUser2"), document.getElementById("otherUser1"), document.getElementById("myCommands")], {
  removeOnSpill: true,
  copy: function (el, source) {
    return source === document.getElementById("otherUser1") || source === document.getElementById("otherUser2");
  },
  accepts: function (el, target) {
    return target === document.getElementById("myCommands")
  },
}).on('cloned', function (clone, original, type) {
    clone.childNodes[0].id = "inputID"+idCounter;
    clone.childNodes[1].setAttribute('for',"inputID"+idCounter);
}).on('drop', function (clone, original, type) {
    myCards.push("inputID"+idCounter);
    myInstructions.push(original.code);
    idCounter++;
}).on('remove', function (el, container, source) {
	for (var i=0;i<myCards.length;i++) {
		console.log(el.childNodes[0].id, myCards[i]);
		if (el.childNodes[0].id === myCards[i]){
			myCards.splice(i, 1); myInstructions.splice(i, 1); break;
		}
	}
	console.log(myCards);
});


function createInstructionCard(cardData) {


	var containerEl = document.getElementById(cardData.id);
	var newEl = document.createElement("div");
	newEl.classList.add("kanban"+cardData.type);
	newEl.classList.add("collapse");

	var newEl1 = document.createElement("input");
	newEl1.id = "inputID"+idCounter;
	newEl1.setAttribute('aria-hidden',"true");
	newEl1.setAttribute('type',"checkbox");
	
	var newEl2 = document.createElement("label");
	newEl2.setAttribute('for',"inputID"+idCounter);
	newEl2.setAttribute('aria-hidden',"true");
	
	var newEl2a = document.createElement("span");
	newEl2a.textContent = cardData.title;
	newEl2a.style.float = "left";
	newEl2.appendChild(newEl2a);
	
	if (cardData.id == "myCommandsssss") {
		var newEl2b = document.createElement("a");
		newEl2b.textContent = "x";
		newEl2b.style.float = "right";
		newEl2b.addEventListener("click",ignoreInstruction);
		newEl2.appendChild(newEl2b);
		
	}

	var newEl3 = document.createElement("div");
	var newEl3a = document.createElement("p");
	newEl3a.textContent = cardData.detail;
	newEl3.appendChild(newEl3a);
	
	if (cardData.id == "myCommandsssss") {
		var newEl3b = document.createElement("span");
		newEl3b.classList.add("icon-edit");
		newEl3b.style.float = "right";
		newEl3b.addEventListener("click",editCommand);
		newEl3.appendChild(newEl3b);
	}
	
	newEl.appendChild(newEl1);
	newEl.appendChild(newEl2);
	newEl.appendChild(newEl3);
	
	containerEl.appendChild(newEl);
	cardData.dragID = "inputID"+idCounter;
	idCounter++;
	
}

function closeCard(userid) {
	document.getElementById("otherUser"+userid).style.display = "none";
	document.getElementById("otherUser"+userid+"-sm").style.display = "inline-block";
}
function openCard(userid) {
	document.getElementById("otherUser"+userid+"-sm").style.display = "none";
	document.getElementById("otherUser"+userid).style.display = "inline-block";
}

function copyCard(cardid) {
	if (myCards.length != 0){return 0;}
	for (var i=0;i<allCards.length;i++){
		if (allCards[i].id == 'otherUser'+cardid) {
			var newCard = {'id':"myCommands"};
			newCard.title = allCards[i].title;
			newCard.detail = allCards[i].detail;
			newCard.comments = [];
			newCard.code = allCards[i].code;
			newCard.type = allCards[i].type;
			myCards.push("inputID"+idCounter);
			myInstructions.push(allCards[i].code);
			createInstructionCard(newCard);
			
		}
	}
}

function runAll() {
	var cLength = myInstructions.length;
	var simpleInstructions = {'sorts':[],'addcols':[],'filters':[]};
	for (var i=0;i<cLength;i++) {
		var instru = myInstructions[i].split(",");
		if (instru[3] == 'sort') {
			simpleInstructions.sorts.push(instru[4]);
		}
		else if (instru[3] == 'addcol') {
			simpleInstructions.addcols.push(instru[4]);
		}
		else if (instru[3] == 'filter') {
			simpleInstructions.filters.push(instru[4]);
		}
	}
	console.log(simpleInstructions);

}

function clearCards() {
	if (myCards.length == 0){return 0;}
	var mcl = myCards.length
	for (var i=0;i<mcl;i++) {
		var elem = document.querySelector('#'+myCards[i]);
		elem.parentNode.removeChild(elem);
	}
	myCards = [];
	myInstructions = [];
	//Post reset message
}

function ignoreInstruction(e) {
	e.preventDefault();
	var parentEl = e.target.parentNode.childNodes[0];
	console.log(parentEl);
	parentEl.style.textDecoration = "line-through";
}

function editCommand(e) {
	e.preventDefault();
	var parentEl = e.target.parentNode.childNodes[0];
	console.log(parentEl);
	parentEl.textContent = "hi";
}

function addCard(cardData) {
	if (cardData.type == "Sort"){
		var newCard = {'id':"myCommands"};
		newCard.title = "Sort by column "+cardData.sortCol;
		newCard.detail = "Sort by column "+cardData.sortCol;
		newCard.comments = [];
		newCard.code = "ff.csv,0,100,sort,"+cardData.sortCol;
		newCard.type = cardData.type;
		myCards.push("inputID"+idCounter);
		myInstructions.push("ff.csv,0,100,sort,"+cardData.sortCol);
		createInstructionCard(newCard);
	}
	else if (cardData.type == "Filter"){
		var newCard = {'id':"myCommands"};
		newCard.title = "Filter: "+cardData.filterText;
		newCard.detail = cardData.filterText;
		newCard.comments = [];
		newCard.code = cardData.filterCode;
		newCard.type = cardData.type;
		myCards.push("inputID"+idCounter);
		myInstructions.push(cardData.filterCode);
		createInstructionCard(newCard);
	}
	else if (cardData.type == "AddColumn"){
		var newCard = {'id':"myCommands"};
		newCard.title = "Add Column: "+cardData.colFormula;
		newCard.detail = cardData.colFormula;
		newCard.comments = [];
		newCard.code = "ff.csv,0,100,addcol,"+cardData.sortCol;
		newCard.type = cardData.type;
		myCards.push("inputID"+idCounter);
		myInstructions.push("ff.csv,0,100,addcol,"+cardData.sortCol);
		createInstructionCard(newCard);
	}
}