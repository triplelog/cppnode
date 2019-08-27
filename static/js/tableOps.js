dragula([document.getElementById("moveColumns")], {
  removeOnSpill: true,
}).on('drop', function (el, target, source, sibling) {
    var type = 'main';
    var mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type])+",display,"+el.id.substring(7,);
    if (sibling) {
    	mymessage += "@"+sibling.id.substring(7,);
    }
    else {
    	mymessage += "@-2";
    }
    myWorker.postMessage(mymessage);
    tempCardJSON = {'type':'moveCol'};
}).on('remove', function (el, container, source) {
	var type = 'main';
    var mymessage = filen+","+ (currentPage[type]*currentPerPage[type]-currentPerPage[type]) +","+ (currentPage[type]*currentPerPage[type])+",display,"+el.id.substring(7,);
    mymessage += "@-3";
    myWorker.postMessage(mymessage);
    tempCardJSON = {'type':'removeCol'};
});
