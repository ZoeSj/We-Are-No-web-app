/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
(function(window) {
	var u = {};
	var isAndroid = (/android/gi).test(navigator.appVersion);
	var uzStorage = function() {
		var ls = window.localStorage;
		if (isAndroid) {
			ls = os.localStorage();
		}
		return ls;
	};
	function parseArguments(url, data, fnSuc, dataType) {
		if ( typeof (data) == 'function') {
			dataType = fnSuc;
			fnSuc = data;
			data = undefined;
		}
		if ( typeof (fnSuc) != 'function') {
			dataType = fnSuc;
			fnSuc = undefined;
		}
		return {
			url : url,
			data : data,
			fnSuc : fnSuc,
			dataType : dataType
		};
	}


	u.trim = function(str) {
		if (String.prototype.trim) {
			return str == null ? "" : String.prototype.trim.call(str);
		} else {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
	};
	u.trimAll = function(str) {
		return str.replace(/\s*/g, '');
	};
	u.isElement = function(obj) {
		return !!(obj && obj.nodeType == 1);
	};
	u.isArray = function(obj) {
		if (Array.isArray) {
			return Array.isArray(obj);
		} else {
			return obj instanceof Array;
		}
	};
	u.isEmptyObject = function(obj) {
		if (JSON.stringify(obj) === '{}') {
			return true;
		}
		return false;
	};
	u.addEvt = function(el, name, fn, useCapture) {
		if (!u.isElement(el)) {
			console.warn('$api.addEvt Function need el param, el param must be DOM Element');
			return;
		}
		useCapture = useCapture || false;
		if (el.addEventListener) {
			el.addEventListener(name, fn, useCapture);
		}
	};
	u.rmEvt = function(el, name, fn, useCapture) {
		if (!u.isElement(el)) {
			console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
			return;
		}
		useCapture = useCapture || false;
		if (el.removeEventListener) {
			el.removeEventListener(name, fn, useCapture);
		}
	};
	u.one = function(el, name, fn, useCapture) {
		if (!u.isElement(el)) {
			console.warn('$api.one Function need el param, el param must be DOM Element');
			return;
		}
		useCapture = useCapture || false;
		var that = this;
		var cb = function() {
			fn && fn();
			that.rmEvt(el, name, cb, useCapture);
		};
		that.addEvt(el, name, cb, useCapture);
	};
	u.dom = function(el, selector) {
		if (arguments.length === 1 && typeof arguments[0] == 'string') {
			if (document.querySelector) {
				return document.querySelector(arguments[0]);
			}
		} else if (arguments.length === 2) {
			if (el.querySelector) {
				return el.querySelector(selector);
			}
		}
	};
	u.domAll = function(el, selector) {
		if (arguments.length === 1 && typeof arguments[0] == 'string') {
			if (document.querySelectorAll) {
				return document.querySelectorAll(arguments[0]);
			}
		} else if (arguments.length === 2) {
			if (el.querySelectorAll) {
				return el.querySelectorAll(selector);
			}
		}
	};
	u.byId = function(id) {
		return document.getElementById(id);
	};
	u.first = function(el, selector) {
		if (arguments.length === 1) {
			if (!u.isElement(el)) {
				console.warn('$api.first Function need el param, el param must be DOM Element');
				return;
			}
			return el.children[0];
		}
		if (arguments.length === 2) {
			return this.dom(el, selector + ':first-child');
		}
	};
	u.last = function(el, selector) {
		if (arguments.length === 1) {
			if (!u.isElement(el)) {
				console.warn('$api.last Function need el param, el param must be DOM Element');
				return;
			}
			var children = el.children;
			return children[children.length - 1];
		}
		if (arguments.length === 2) {
			return this.dom(el, selector + ':last-child');
		}
	};
	u.eq = function(el, index) {
		return this.dom(el, ':nth-child(' + index + ')');
	};
	u.not = function(el, selector) {
		return this.domAll(el, ':not(' + selector + ')');
	};
	u.prev = function(el) {
		if (!u.isElement(el)) {
			console.warn('$api.prev Function need el param, el param must be DOM Element');
			return;
		}
		var node = el.previousSibling;
		if (node.nodeType && node.nodeType === 1) {
			//			node = node.previousSibling;
			return node;
		}
	};
	u.next = function(el) {
		if (!u.isElement(el)) {
			console.warn('$api.next Function need el param, el param must be DOM Element');
			return;
		}
		var node = el.nextSibling;
		if (node.nodeType && node.nodeType === 1) {
			//			node = node.nextSibling;
			return node;
		}
	};
	u.closest = function(el, selector) {
		if (!u.isElement(el)) {
			console.warn('$api.closest Function need el param, el param must be DOM Element');
			return;
		}
		var doms, targetDom;
		var isSame = function(doms, el) {
			var i = 0, len = doms.length;
			for (i; i < len; i++) {
				if (doms[i].isEqualNode(el)) {
					return doms[i];
				}
			}
			return false;
		};
		var traversal = function(el, selector) {
			doms = u.domAll(el.parentNode, selector);
			targetDom = isSame(doms, el);
			while (!targetDom) {
				el = el.parentNode;
				if (el != null && el.nodeType == el.DOCUMENT_NODE) {
					return false;
				}
				traversal(el, selector);
			}

			return targetDom;
		};

		return traversal(el, selector);
	};
	u.contains = function(parent, el) {
		var mark = false;
		if (el === parent) {
			mark = true;
			return mark;
		} else {
			do {
				el = el.parentNode;
				if (el === parent) {
					mark = true;
					return mark;
				}
			} while(el === document.body || el === document.documentElement);

			return mark;
		}

	};
	u.remove = function(el) {
		if (el && el.parentNode) {
			el.parentNode.removeChild(el);
		}
	};
	u.attr = function(el, name, value) {
		if (!u.isElement(el)) {
			console.warn('$api.attr Function need el param, el param must be DOM Element');
			return;
		}
		if (arguments.length == 2) {
			return el.getAttribute(name);
		} else if (arguments.length == 3) {
			el.setAttribute(name, value);
			return el;
		}
	};
	u.removeAttr = function(el, name) {
		if (!u.isElement(el)) {
			console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
			return;
		}
		if (arguments.length === 2) {
			el.removeAttribute(name);
		}
	};
	u.hasCls = function(el, cls) {
		if (!u.isElement(el)) {
			console.warn('$api.hasCls Function need el param, el param must be DOM Element');
			return;
		}
		if (el.className.indexOf(cls) > -1) {
			return true;
		} else {
			return false;
		}
	};
	u.addCls = function(el, cls) {
		if (!u.isElement(el)) {
			console.warn('$api.addCls Function need el param, el param must be DOM Element');
			return;
		}
		if ('classList' in el) {
			el.classList.add(cls);
		} else {
			var preCls = el.className;
			var newCls = preCls + ' ' + cls;
			el.className = newCls;
		}
		return el;
	};
	u.removeCls = function(el, cls) {
		if (!u.isElement(el)) {
			console.warn('$api.removeCls Function need el param, el param must be DOM Element');
			return;
		}
		if ('classList' in el) {
			el.classList.remove(cls);
		} else {
			var preCls = el.className;
			var newCls = preCls.replace(cls, '');
			el.className = newCls;
		}
		return el;
	};
	u.toggleCls = function(el, cls) {
		if (!u.isElement(el)) {
			console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
			return;
		}
		if ('classList' in el) {
			el.classList.toggle(cls);
		} else {
			if (u.hasCls(el, cls)) {
				u.removeCls(el, cls);
			} else {
				u.addCls(el, cls);
			}
		}
		return el;
	};
	u.val = function(el, val) {
		if (!u.isElement(el)) {
			console.warn('$api.val Function need el param, el param must be DOM Element');
			return;
		}
		if (arguments.length === 1) {
			switch(el.tagName) {
				case 'SELECT':
					var value = el.options[el.selectedIndex].value;
					return value;
					break;
				case 'INPUT':
					return el.value;
					break;
				case 'TEXTAREA':
					return el.value;
					break;
			}
		}
		if (arguments.length === 2) {
			switch(el.tagName) {
				case 'SELECT':
					el.options[el.selectedIndex].value = val;
					return el;
					break;
				case 'INPUT':
					el.value = val;
					return el;
					break;
				case 'TEXTAREA':
					el.value = val;
					return el;
					break;
			}
		}

	};
	u.prepend = function(el, html) {
		if (!u.isElement(el)) {
			console.warn('$api.prepend Function need el param, el param must be DOM Element');
			return;
		}
		el.insertAdjacentHTML('afterbegin', html);
		return el;
	};
	u.append = function(el, html) {
		if (!u.isElement(el)) {
			console.warn('$api.append Function need el param, el param must be DOM Element');
			return;
		}
		el.insertAdjacentHTML('beforeend', html);
		return el;
	};
	u.before = function(el, html) {
		if (!u.isElement(el)) {
			console.warn('$api.before Function need el param, el param must be DOM Element');
			return;
		}
		el.insertAdjacentHTML('beforebegin', html);
		return el;
	};
	u.after = function(el, html) {
		if (!u.isElement(el)) {
			console.warn('$api.after Function need el param, el param must be DOM Element');
			return;
		}
		el.insertAdjacentHTML('afterend', html);
		return el;
	};
	u.html = function(el, html) {
		if (!u.isElement(el)) {
			console.warn('$api.html Function need el param, el param must be DOM Element');
			return;
		}
		if (arguments.length === 1) {
			return el.innerHTML;
		} else if (arguments.length === 2) {
			el.innerHTML = html;
			return el;
		}
	};
	u.text = function(el, txt) {
		if (!u.isElement(el)) {
			console.warn('$api.text Function need el param, el param must be DOM Element');
			return;
		}
		if (arguments.length === 1) {
			return el.textContent;
		} else if (arguments.length === 2) {
			el.textContent = txt;
			return el;
		}
	};
	u.offset = function(el) {
		if (!u.isElement(el)) {
			console.warn('$api.offset Function need el param, el param must be DOM Element');
			return;
		}
		var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

		var rect = el.getBoundingClientRect();
		return {
			l : rect.left + sl,
			t : rect.top + st,
			w : el.offsetWidth,
			h : el.offsetHeight
		};
	};
	u.css = function(el, css) {
		if (!u.isElement(el)) {
			console.warn('$api.css Function need el param, el param must be DOM Element');
			return;
		}
		if ( typeof css == 'string' && css.indexOf(':') > 0) {
			el.style && (el.style.cssText += ';' + css);
		}
	};
	u.cssVal = function(el, prop) {
		if (!u.isElement(el)) {
			console.warn('$api.cssVal Function need el param, el param must be DOM Element');
			return;
		}
		if (arguments.length === 2) {
			var computedStyle = window.getComputedStyle(el, null);
			return computedStyle.getPropertyValue(prop);
		}
	};
	u.jsonToStr = function(json) {
		if ( typeof json === 'object') {
			return JSON && JSON.stringify(json);
		}
	};
	u.strToJson = function(str) {
		if ( typeof str === 'string') {
			return JSON && JSON.parse(str);
		}
	};
	u.setStorage = function(key, value) {
		if (arguments.length === 2) {
			var v = value;
			if ( typeof v == 'object') {
				v = JSON.stringify(v);
				v = 'obj-' + v;
			} else {
				v = 'str-' + v;
			}
			var ls = uzStorage();
			if (ls) {
				ls.setItem(key, v);
			}
		}
	};
	u.getStorage = function(key) {
		var ls = uzStorage();
		if (ls) {
			var v = ls.getItem(key);
			if (!v) {
				return;
			}
			if (v.indexOf('obj-') === 0) {
				v = v.slice(4);
				return JSON.parse(v);
			} else if (v.indexOf('str-') === 0) {
				return v.slice(4);
			}
		}
	};
	u.rmStorage = function(key) {
		var ls = uzStorage();
		if (ls && key) {
			ls.removeItem(key);
		}
	};
	u.clearStorage = function() {
		var ls = uzStorage();
		if (ls) {
			ls.clear();
		}
	};

	/*by king*/
	u.fixIos7Bar = function(el) {
		if (!u.isElement(el)) {
			console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
			return;
		}
		var strDM = api.systemType;
		if (strDM == 'ios') {
			var strSV = api.systemVersion;
			var numSV = parseInt(strSV, 10);
			var fullScreen = api.fullScreen;
			var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
			if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
				el.style.paddingTop = '20px';
			}
		}
	};
	u.fixStatusBar = function(el) {
		if (!u.isElement(el)) {
			console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
			return;
		}
		var sysType = api.systemType;
		if (sysType == 'ios') {
			u.fixIos7Bar(el);
		} else if (sysType == 'android') {
			var ver = api.systemVersion;
			ver = parseFloat(ver);
			if (ver >= 4.4) {
				el.style.paddingTop = '25px';
			}
		}
	};
	u.toast = function(title, text, time) {
		var opts = {};
		var show = function(opts, time) {
			api.showProgress(opts);
			setTimeout(function() {
				api.hideProgress();
			}, time);
		};
		if (arguments.length === 1) {
			var time = time || 500;
			if ( typeof title === 'number') {
				time = title;
			} else {
				opts.title = title + '';
			}
			show(opts, time);
		} else if (arguments.length === 2) {
			var time = time || 500;
			var text = text;
			if ( typeof text === "number") {
				var tmp = text;
				time = tmp;
				text = null;
			}
			if (title) {
				opts.title = title;
			}
			if (text) {
				opts.text = text;
			}
			show(opts, time);
		}
		if (title) {
			opts.title = title;
		}
		if (text) {
			opts.text = text;
		}
		time = time || 500;
		show(opts, time);
	};
	u.post = function(/*url,data,fnSuc,dataType*/) {
		var argsToJson = parseArguments.apply(null, arguments);
		var json = {};
		var fnSuc = argsToJson.fnSuc;
		argsToJson.url && (json.url = argsToJson.url);
		argsToJson.data && (json.data = argsToJson.data);
		if (argsToJson.dataType) {
			var type = argsToJson.dataType.toLowerCase();
			if (type == 'text' || type == 'json') {
				json.dataType = type;
			}
		} else {
			json.dataType = 'json';
		}
		json.method = 'post';
		api.ajax(json, function(ret, err) {
			if (ret) {
				fnSuc && fnSuc(ret);
			}
		});
	};
	u.get = function(/*url,fnSuc,dataType*/) {
		var argsToJson = parseArguments.apply(null, arguments);
		var json = {};
		var fnSuc = argsToJson.fnSuc;
		argsToJson.url && (json.url = argsToJson.url);
		//argsToJson.data && (json.data = argsToJson.data);
		if (argsToJson.dataType) {
			var type = argsToJson.dataType.toLowerCase();
			if (type == 'text' || type == 'json') {
				json.dataType = type;
			}
		} else {
			json.dataType = 'text';
		}
		json.method = 'get';
		api.ajax(json, function(ret, err) {
			if (ret) {
				fnSuc && fnSuc(ret);
			}
		});
	};

	/*end*/

	window.$api = u;

})(window);
//ajax请求地址
var url = 'http://app.zhonglibao.net.cn';
//无法连接到服务器时的显示
var offLine = '<div class="H-flexbox-vertical"><div class="H-flex-item"></div><div><div class="H-text-align-center"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAACXBIWXMAAAsTAAALEwEAmpwYAAA57mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTYtMTAtMjFUMjE6MjI6NDMrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNi0xMC0yMVQyMjoyNzoxMSswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTYtMTAtMjFUMjI6Mjc6MTErMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6YWRmYzVhNzMtMzg2My1lMjQwLWFiZjYtNmE1ZTNiYzVkOTQ4PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NmQ4YTRjZmUtOTc5YS0xMWU2LTljZjQtZDkxOWU1YjExMTQ5PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6NzE1MDQ3OTktODRmYS02ZTQyLThkZWEtODU0M2I2N2UyMmNlPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjcxNTA0Nzk5LTg0ZmEtNmU0Mi04ZGVhLTg1NDNiNjdlMjJjZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0yMVQyMToyMjo0MyswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDphZGZjNWE3My0zODYzLWUyNDAtYWJmNi02YTVlM2JjNWQ5NDg8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMTAtMjFUMjI6Mjc6MTErMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTIwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjEyMDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+Bj8DmQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAV4klEQVR42uydeZRtVX3nP9+9z53qIYoIGp9IC4rDi9q4NKJGW1E0cZmgOGfsDA6RNopDtw3GIUajRtN0kxCJkix9axETYzoOvQQVzTLgvKCVyWZQRm14HRCEqjucvb/9xzn3vvveq6pX91bVo6re3f9Urap77jnn9zl779/+/b77d2SbWdu6TTPAM8CzNgM8azPAszYDPGszwLM2AzxrM8AzwLM2AzxrM8CzNgM8azPAszYDPGszwAct4GuvuKL6BRiiLhoNEuBej9hs4hhJ3S4xBHLOhFYLbNJgADax2ay/TXgwQDZuNpENIeBejywhIEokm2CTbSQhmwQUMZLrv0cJgJTz7t9tyJnQbhNDIPV6ANGwDXsOqSG4TwjhUcAg53wkcFR9W3s/yap/3hRC2IWdsn2NYR67B/Ql3Q2k2GqRcsbdLoRACGHPa6uvXxJBqv4OWMJACIGUErHdJg8GOGeo7UHO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"/></div><div class="H-text-align-center H-theme-font-color-444 H-font-size-16 H-margin-vertical-bottom-10">hi，真不巧，网页走丢了。</div><div class="H-text-align-center"><button onclick="location.reload()" class="H-theme-background-color1 H-border-none H-theme-font-color-white H-border-radius-5 H-font-size-16 H-padding-horizontal-both-25 H-padding-vertical-both-3">刷新试试</button></div></div><div class="H-flex-item"></div><div class="H-flex-item"></div></div>';
//提示框
function toast(msg, duration, location, global) {
	if (!location) {
		location = 'middle';
	}
	api.toast({
		msg : msg,
		duration : duration,
		location : location,
		global : global
	});
}

//打开window
function openwin(winName, data) {
	api.openWin({
		name : winName,
		url : winName + '.html',
		pageParam : {
			data : data
		}
	});
}

//打开登录页面
function openLoginwin(winName) {
	api.openWin({
		name : 'entry_win',
		url : winName + '.html'
	});
}

function gologin(data) {
	api.setPrefs({
		key : 'userinfo',
		value : data
	});
	$api.setStorage('islogin', true);
}

function logout() {
	api.removePrefs({
		key : 'userinfo'
	});
	$api.rmStorage('uid');
	$api.rmStorage('islogin');
}

function islogin() {
	if ($api.getStorage('islogin')) {
		return true;
	} else {
		return false;
	}
}

//打开弹窗式frame
function openframe(frameName, id) {
	api.openFrame({
		name : frameName,
		url : frameName + '.html',
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : 'auto'
		}
	});
	$api.setStorage(frameName, 1);
	api.sendEvent({
		name : 'closefrm',
		extra : {
			key1 : id,
		}
	});
}

//关闭弹窗式frame 配合安卓keyback（返回键）监听使用
function closeframe(frameName) {
	api.closeFrame({
		name : frameName
	});
	$api.rmStorage(frameName);
}

//监听keyback，关闭弹窗式frame时监听
function addkeybackListener(frameName) {
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		if ($api.getStorage(frameName)) {
			closeframe(frameName);
		} else {
			api.closeWin();
		}
	});
}

//打开外部链接，调用webBrowser模块的open方法
function open_outLink(url) {
	var browser = api.require('webBrowser');
	browser.open({
		url : url
	});
}

//60s倒计时
function time(obj) {
	var t = 60;
	obj.setAttribute("disabled", true);
	var interval = setInterval(function() {
		if (t <= 1) {
			clearInterval(interval);
			obj.removeAttribute("disabled");
			obj.value = "重新获取验证码";
		} else {
			t--;
			obj.value = t + 's后重新获取'
		}
	}, 1000)
}

//获取短信验证码
function get_smsVerify(obj, phone) {
	time(obj)
	var smsVerify = api.require('smsVerify');
	smsVerify.register(function(ret, err) {
		if (ret.status) {
			smsVerify.sms({
				phone : phone,
				country : "86"
			}, function(ret, err) {
				if (ret.status) {
					toast('短信发送成功!');
				} else {
					toast('短信发送失败！');
				}
			});
		} else {
			toast('获取验证码失败！');
		}
	});
}

//验证验证码
function check_smsVerify(code, phone, fn) {
	var smsVerify = api.require('smsVerify');
	if (code == '') {
		toast('验证码不能为空！');
	} else {
		smsVerify.verify({
			phone : phone,
			code : code,
		}, function(ret, err) {
			if (ret.status) {
				fn();
			} else {
				toast('验证码有误');
			}
		});
	}
}

//UIActionSelector模块选择器（选择城市或者日期）封装函数
function ActionSelector(data, type, cb) {
	var actives = [];
	if (type == 'city') {
		actives = [2, 0, 0];
	} else if (type == 'date') {
		var date = new Date();
		var y = date.getFullYear() - 1947;
		var m = date.getMonth();
		var d = date.getDate() - 1;
		actives = [y, m, d];
	}
	var UIActionSelector = api.require('UIActionSelector');
	UIActionSelector.open({
		datas : 'widget://res/' + data + '.json',
		layout : {
			row : 5,
			col : 3,
			height : 35,
			size : 14,
			sizeActive : 16,
			rowSpacing : 3,
			colSpacing : 8,
			maskBg : 'rgba(0,0,0,0.35)',
			bg : '#fff',
			color : '#999',
			colorActive : '#5b94fb',
			colorSelected : '#5b94fb'
		},
		animation : true,
		cancel : {
			text : '取消',
			size : 14,
			w : 80,
			h : 40,
			bg : '#fff',
			bgActive : '#ccc',
			color : '#999',
			colorActive : '#fff'
		},
		ok : {
			text : '确定',
			size : 14,
			w : 80,
			h : 40,
			bg : '#fff',
			bgActive : '#ccc',
			color : '#999',
			colorActive : '#fff'
		},
		title : {
			text : '请选择',
			size : 15,
			h : 44,
			bg : '#eee',
			color : '#999'
		},
		actives : actives,
		fixedOn : api.frameName
	}, function(ret, err) {
		if (ret) {
			//			alert(JSON.stringify(ret));
			if (ret.eventType == "ok") {
				var SelectInfo = '';
				for (var i = 0; i < ret.selectedInfo.length; i++) {
					SelectInfo += ret.selectedInfo[i].name;
				}
				if (type == 'city') {
					cb(SelectInfo);
				} else if (type == 'date') {
					SelectInfo = $api.trimAll(SelectInfo).replace(/年|月/g, '-').replace(/日/g, '');
					cb(SelectInfo);
				}

			}
		} else {
			//			alert(JSON.stringify(err));
		}
	})
}

//		格式化图片地址
function format_imgSrc(src) {
	return src = src && src.match("http:") ? src : (url + src);
}

//时间戳转日期公用函数
function transform(time) {
	var date = new Date();
	date.setTime(time * 1000);
	return date.toLocaleDateString().replace(/\//g, '-');
}

//下拉刷新
function Refresh(cb) {
	api.setRefreshHeaderInfo({
		visible : true,
		bgColor : '#eee',
		textColor : '#666',
		textDown : '下拉刷新...',
		textUp : '松开刷新...',
		showTime : true
	}, function(ret, err) {
		//在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态
		cb();
		api.refreshHeaderLoadDone();
	});
}