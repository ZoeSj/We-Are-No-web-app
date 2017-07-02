/*公共头部js文件*/
function bind_clickEvent(eles, txts, win) {
	var items = $api.domAll('.' + eles + '');
	var texts = $api.domAll('' + txts + '');
	for (var i = 0; i < items.length; i++) {
		var clickEvent = function(k, title) {
			items[k].onclick = function() {
				openwin(win, {
					id : k,
					title : title
				})
			}
		}
		clickEvent(i, $api.trim($api.text(texts[i])));
		/*注释部分是另一种写法
		 college[i].id = i;
		 college[i].title = $api.trim($api.text(texts[i]));
		 $api.addEvt(college[i], 'click', function() {
		 openwin('../campus/campus_win', {
		 id : this.id,
		 title : this.title
		 })
		 });*/
	}
}

//打开frame
function openUsually_frm(frmUrl) {
	var header = $api.byId('header');
	$api.fixStatusBar(header);
	api.openFrame({
		name : frmUrl,
		url : frmUrl + '.html',
		rect : {
			x : 0,
			y : header.offsetHeight,
			w : 'auto',
			h : 'auto'
		},
		pageParam : {
			id : api.pageParam.data.id
		}
	});
}
