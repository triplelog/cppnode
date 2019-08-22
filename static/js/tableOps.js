dragula([document.getElementById("moveColumns")], {
  removeOnSpill: true,
}).on('drop', function (el, target, source, sibling) {
    var mymessage = filen+",0,10,display,"+el.id.substring(7,);
    if (sibling) {
    	mymessage += "@"+sibling.id.substring(7,);
    }
    else {
    	mymessage += "@-2";
    }
    myWorker.postMessage(mymessage);
}).on('remove', function (el, container, source) {
    var mymessage = filen+",0,10,display,"+el.id.substring(7,);
    mymessage += "@-3";
    myWorker.postMessage(mymessage);
});
