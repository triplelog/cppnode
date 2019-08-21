dragula([document.getElementById("moveColumns")], {
  removeOnSpill: true,
}).on('drop', function (el, target, source, sibling) {
    var mymessage = "ff.csv,0,10,display,"+el.id;
    if (sibling) {
    	mymessage += "@"+sibling.id;
    }
    else {
    	mymessage += "@end";
    }
    myWorker.postMessage(mymessage);
}).on('remove', function (el, container, source) {
    var mymessage = "ff.csv,0,10,display,"+el.id;
    mymessage += "@remove";
    myWorker.postMessage(mymessage);
});
