//先判断产品或新闻是否已收藏    type=1(新闻),type=2(商品)
var headers = {
	uid : $api.getStorage('uid'),
	phone : $api.getStorage('userphone'),
	key : $api.getStorage('secret_key')
}
function check_Collection(gid, type) {
	if (islogin()) {
		api.ajax({
			url : url + '/user/isfacorite',
			method : 'post',
			headers : headers,
			data : {
				values : {
					uid : $api.getStorage('uid'),
					gid : gid,
					type : type
				}
			}
		}, function(ret, err) {
			//			console.log($api.jsonToStr(ret));
			if (ret) {
				sta = ret.status;
				if (ret.status == 1) {
					$api.removeCls(collection, 'H-theme-font-color-ccc');
					$api.addCls(collection, 'yellow');
				} else {
					$api.removeCls(collection, 'yellow');
					$api.addCls(collection, 'H-theme-font-color-ccc');
				}
			}
		});
	} else {
		openLoginwin('../entry/entry_win');
	}
}

//		点击收藏
function click_Collection(gid, type, sta) {
	if (islogin()) {
		if (sta == 1) {
			//取消收藏
			cancel_Collection(gid, type);
		} else {
			//添加收藏
			add_Collection(gid, type);
		}
	} else {
		openLoginwin('../entry/entry_win');
	}
}

//添加收藏
function add_Collection(gid, type) {
	api.ajax({
		url : url + '/user/addfavorite',
		method : 'post',
		headers : headers,
		data : {
			values : {
				uid : $api.getStorage('uid'),
				goods_id : gid,
				type : type
			}
		}
	}, function(ret, err) {
		//		alert($api.jsonToStr(ret));
		if (ret) {
			if (ret.status == 1) {
				check_Collection(gid, type);
				toast('收藏成功!可以到我的收藏里面进行查看');
			} else {
				toast('收藏失败，请稍后重试');
			}
		} else {
			toast('无法连接到服务器，请稍后重试！');
		}
	});
}

//		取消收藏
function cancel_Collection(gid, type) {
	api.ajax({
		url : url + '/user/delfacorite',
		method : 'post',
		headers : headers,
		data : {
			values : {
				uid : $api.getStorage('uid'),
				gid : gid,
				type : type
			}
		}
	}, function(ret, err) {
		if (ret) {
			//			alert($api.jsonToStr(ret));
			if (ret.status == 1) {
				check_Collection(gid, type);
				toast('收藏已取消');
				if (type == 1) {
					api.execScript({
						name : "my/my_collect/collect_win",
						frameName : "collect_frm1",
						script : 'show_collectList(1);'
					});
				} else {
					api.execScript({
						name : "my/my_collect/collect_win",
						frameName : "collect_frm0",
						script : 'show_collectList(2);'
					})
				}

			} else {
				toast('取消收藏失败');
			}
		} else {

			toast('无法连接到服务器，请稍后重试！');
		}
	});
}

//显示收藏的产品列表
function show_collectList(type) {
	openframe('../../loading');
	var Body = $api.dom('body');
	var html = '';
	var c_url = type == 1 ? '/user/getfavoritenews' : '/user/getfavoritegoods'
	api.ajax({
		url : url + c_url,
		method : 'post',
		headers : headers,
		data : {
			values : {
				uid : $api.getStorage('uid')
			}
		}
	}, function(ret, err) {
		//				alert($api.jsonToStr(ret));
		if (ret) {
			if (ret.status == 1) {
				closeframe('../../loading');
				html += '<ul>';
				for (var i = 0; i < ret.data.length; i++) {
					if (type == 1) {
						html += '<li tapmode="" onclick="news(' + ret.data[i].id + ')" class="H-touch-active H-flexbox-horizontal H-theme-background-color-white H-border-vertical-bottom-eee H-clear-both H-padding-5"><div class="H-flex-item H-padding-10 H-position-relative H-box-sizing-border-box" style="height: 90px; "><strong class="H-font-size-15 H-font-weight-normal H-display-block H-text-show-row-2">' + ret.data[i].tittle + '</strong><p class="H-font-size-13 H-theme-font-color-999 H-position-absolute H-z-index-10 H-margin-0" style="bottom: 0; left: 10px; right: 10px;"><span class="H-float-left"></span><span class="H-float-right">' + transform(ret.data[i].ctime) + '</span></p></div><div class="H-padding-vertical-both-5 H-box-sizing-border-box"><img src="' + url + ret.data[i].image + '" alt="" title="" class="H-display-block H-margin-horizontal-right-10" style="width: 80px; height: 80px;"></div></li>';
					} else {
						var max = ret.data[i].max_save * 100;
						html += '<li onclick="pro_detail_win(' + ret.data[i].id + ')" class="H-flexbox-horizontal H-theme-background-color-white H-padding-5 H-border-vertical-bottom-after H-touch-active"><div class="H-flex-item H-position-relative H-padding-5" style="height: 90px;">' + '<strong class="H-font-size-15 H-font-weight-normal H-theme-font-color-333">' + ret.data[i].title + '</strong><span class="H-font-size-13 H-theme-font-color-999 H-display-block H-text-show-row-2">' + ret.data[i].present + '</span>' + '<div class="H-font-size-13 H-position-absolute H-margin-0" style="bottom: 0;left:5px;right:10px;"><span class="H-float-left" style="color: #ff485c"> ￥<i>' + ret.data[i].min_price + '</i> 元起 </span><span class="H-float-right" style="color: #ffa801"> 推广费比例最高: <span>' + max + '</span>% </span></div></div>' + '<div class="H-padding-vertical-both-5 H-box-sizing-border-box"><img class="H-display-block H-margin-horizontal-right-10" style="width: 80px; height: 80px;" src="' + url + ret.data[i].img_description + '"></div></li>';
					}
				}
				html += '</ul>';
				$api.html(Body, html);
			} else if (ret.status == 2 || ret.status == 3) {
				closeframe('../../loading');
				openLoginwin('../../entry/entry_win.html');
			} else {
				closeframe('../../loading');
				$api.html(Body, '<div class="H-text-align-center H-padding-vertical-both-5">暂无收藏</div>');
			}
		} else {
			closeframe('../../loading');
			$api.html(Body, offLine);
		}
	});
}

//打开收藏的产品详情页
function pro_detail_win(gid) {
	api.openWin({
		name : 'pro_detail_win',
		url : '../../Insurance/pro_detail_win.html',
		pageParam : {
			gid : gid
		}
	});
}

//打开收藏的新闻页
function news(id) {
	api.openWin({
		name : 'news_win',
		url : '../../news/news_win.html',
		pageParam : {
			newsid : id,
		}
	});
}