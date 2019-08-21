dragula([document.getElementById("moveColumns")], {
  removeOnSpill: true,
}).on('drop', function (el, target, source, sibling) {
    console.log(el.id, sibling.id);
}).on('remove', function (el, container, source) {
	console.log(el);
});
