function initMapSize() {
	window.isPrint = location.href.indexOf("pw=2") > 0;
	if(isPrint) {
		return
	}
	var c = document.getElementById("MapHolder"), b = document.getElementById("MapInfoTab"), a = document.getElementById("MapInfo"), f = document.getElementById("shad_v"), d = getClientSize().height - 154, e = document.getElementById("toolsContent");
	d = d < 0 ? 0 : d;
	c.style.height = d + "px";
	a.style.height = d + "px";
	f.style.height = d + "px";
	e.style.height = d - 55 + "px";
	b.style.top = parseInt((d - 55) / 2) + "px"
}

function mapResize() {
	if(isPrint) {
		return
	}
	if(window._resizeTimer) {
		return
	}
	window._resizeTimer = setTimeout(function() {
		var e = document.getElementById("MapHolder"), d = document.getElementById("MapInfoTab"), a = document.getElementById("MapInfo"), h = document.getElementById("shad_v"), c = getClientSize().width, f = getClientSize().height, g = document.getElementById("toolsContent");
		if( typeof map != "undefined" && map && map.fullScreenMode) {
			f -= 32
		} else {
			f -= 154
		}
		if( typeof map != "undefined" && map && !map.fullScreenMode && sideBar.status == "open") {
			c -= 310
		}
		c = c < 0 ? 0 : c;
		f = f < 0 ? 0 : f;
		e.style.height = f + "px";
		a.style.height = f + "px";
		g.style.height = f - 55 + "px";
		if(document.getElementById("ROUTE_CustomTip1")) {
			document.getElementById("ROUTE_CustomTip1").style.left = (c - 235) / 2 + "px"
		}
		var b = parseInt(e.style.height) - (window.overviewCtrl && window.overviewCtrl.getSize().height);
		b = b < 0 ? 0 : b;
		h.style.height = b + "px";
		d.style.top = parseInt((f - 55) / 2) + "px";
		window._resizeTimer = null
	}, 100)
}

function getClientSize() {
	if(window.innerHeight) {
		return {
			width : window.innerWidth,
			height : window.innerHeight
		}
	} else {
		if(document.documentElement && document.documentElement.clientHeight) {
			return {
				width : document.documentElement.clientWidth,
				height : document.documentElement.clientHeight
			}
		} else {
			return {
				width : document.body.clientWidth,
				height : document.body.clientHeight
			}
		}
	}
}

function scriptRequest(url, echo, id, charset, flag) {
	var isIe = /msie/i.test(window.navigator.userAgent);
	if(isIe && document.getElementById("_script_" + id)) {
		var script = document.getElementById("_script_" + id)
	} else {
		if(document.getElementById("_script_" + id)) {
			document.getElementById("_script_" + id).parentNode.removeChild(document.getElementById("_script_" + id))
		}
		var script = document.createElement("script");
		if(charset != null) {
			script.charset = charset
		}
		if(id != null && id != "") {
			script.setAttribute("id", "_script_" + id)
		}
		script.setAttribute("type", "text/javascript");
		document.body.appendChild(script)
	}
	if(!flag) {
		var t = new Date();
		if(url.indexOf("?") > -1) {
			url += "&t=" + t.getTime()
		} else {
			url += "?t=" + t.getTime()
		}
	}
	var _complete = function() {
		if(!script.readyState || script.readyState == "loaded" || script.readyState == "complete") {
			if( typeof (echo) == "function") {
				try {
					echo()
				} catch(e) {
				}
			} else {
				eval(echo)
			}
		}
	};
	if(isIe) {
		script.onreadystatechange = _complete
	} else {
		script.onload = _complete
	}
	script.setAttribute("src", url)
}initMapSize(); 