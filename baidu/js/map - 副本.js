function addMarker(map, point, jump, index) {
	jump = jump || false;
	var myIcon = new BMap.Icon("../images/markers_new.png", new BMap.Size(28, 32), {
		offset : new BMap.Size(10, 25),
		imageOffset : new BMap.Size(0 - index * 29, 0)
	});

	var marker = new BMap.Marker(point, {
		icon : myIcon
	});

	map.addOverlay(marker);
	// 将标注添加到地图中
	if(jump === true) {
		marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		//跳动的动画
	}
	return marker;
}

function addDefaultLabel(info_string, offset_x, offset_y, label_display) {
	offset_x = offset_x || 20;
	offset_y = offset_y || -10;
	label_display = label_display || "none"
	var label = new BMap.Label(info_string, {
		offset : new BMap.Size(offset_x, offset_y)
	});
	label.setStyle({
		borderColor : "#999",
		display : label_display,
	});
	// 浅灰色边框
	return label;
}

function addDefaultEventMarker(map, point, label, jump, index) {
	clearOverlays();
	jump = jump || false;
	var maker = addMarker(map, point, jump, index);
	maker.setLabel(label);
	maker.addEventListener("mouseover", function() {
		label.setStyle({
			display : "block"
		});
	});
	//鼠标经过时 显示label
	maker.addEventListener("mouseout", function() {
		label.setStyle({
			display : "none"
		});
	});
	//鼠标离开时 隐藏label
	return maker;
}

function getCurrentPositionOnMap(map) {
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r) {
		if(this.getStatus() == BMAP_STATUS_SUCCESS) {
			var label = addDefaultLabel("您的位置", 20, -10, "none");

			//var mk = addDefaultEventMarker(map, r.point, label, jump = true);

			var myIcon = new BMap.Icon("../images/markers_new.png", new BMap.Size(28, 48), {
				offset : new BMap.Size(10, 25),
				imageOffset : new BMap.Size(-100, -150)
			});

			var marker = new BMap.Marker(r.point, {
				icon : myIcon
			});
			marker.setLabel(label);
			marker.addEventListener("mouseover", function() {
				label.setStyle({
					display : "block"
				});
			});
			//鼠标经过时 显示label
			marker.addEventListener("mouseout", function() {
				label.setStyle({
					display : "none"
				});
			});
			marker.setAnimation(BMAP_ANIMATION_BOUNCE);
			map.addOverlay(marker);

			//添加跳动标注
			map.panTo(r.point);
			// 跳转到当前坐标点

			return r.point;

		} else {
			return undefined;
		}
	})
}

function inital() {
	var map = new BMap.Map("container");
	var point = new BMap.Point(116.404, 39.915);
	// 创建点坐标
	map.centerAndZoom(point, 15);
	// 初始化地图,设置中心点坐标和地图级别。
	map.enableScrollWheelZoom();
	map.addControl(new BMap.NavigationControl());
	map.addControl(new BMap.ScaleControl());
	map.addControl(new BMap.OverviewMapControl());
	map.addControl(new BMap.MapTypeControl());

	return map;

}

function search(map, location) {

}

function addressSearch(map, address, city) {
	var myGeo = new BMap.Geocoder();
	alert(address + " " + city);
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(address, function(point) {
		if(point) {
			map.panTo(point);
			map.addOverlay(new BMap.Marker(point));

		}
	}, city);
}

function localSearch(map, position, panel) {

	var options = {
		renderOptions : {
			map : map,
			panel : panel
		}

	};
	var local = new BMap.LocalSearch(map, options);
	local.search(position);
}

function transitSearch(map, from, to) {
	localSearch(map, from)
	localSearch(map, to)
	var transit = new BMap.TransitRoute(map, {
		renderOptions : {
			map : map,
			panel : "transit_results"
		}
	});
	//transit.search("王府井", "西单");

	transit.search(from, to);

}

function get_from_position(map) {
	var position;
	function add_position_listenner(e) {
		if(e.overlay) {
			alert('你点击的是覆盖物：' + e.overlay.toString());
			position = Point(e.point.lng.e.point.lat);

		} else {
			alert('你点击的是地图');
		}
	}


	map.addEventListener("click", add_position_listenner);
	map.removeEventListener("click", add_position_listenner);
	return postion
}

function driving_search(map, startPlace) {
	var startInfowin = new BMap.InfoWindow("<p class='t-c'>这是神马</p><p class='t-c'><input value='选为终点' type='button' onclick='startDeter();' /></p>");
	var startResults = null;
	var startPoint;
	var driving = new BMap.DrivingRoute(map, {
		renderOptions : {
			map : map,
			autoViewport : true,
			panel : 'drivingPanel'
		}
	});
	var startOption = {
		onSearchComplete : function(results) {
			// 判断状态是否正确
			if(startSearch.getStatus() == BMAP_STATUS_SUCCESS) {
				startResults = results;
				var s = [];
				for(var i = 0; i < results.getCurrentNumPois(); i++) {
					s.push("<div><p><a onmouseover='map.openInfoWindow(startInfowin,startResults.getPoi(" + i + ").point);' href='#'>");
					s.push(results.getPoi(i).title);
					s.push("</a></p><p>");
					s.push(results.getPoi(i).address);
					s.push("</p></div>");
					addMarker(map, results.getPoi(i), false, i)
				}
				document.getElementById("startPanel").innerHTML = s.join("");
			} else {
				startResults = null;
			}
		}
	};
	var startSearch = new BMap.LocalSearch(map, startOption);

	startSearch.search(startPlace);
	document.getElementById("box").style.display = "block";
	
	function startDeter() {
		//map.clearOverlays();
		startPoint = startInfowin.getPosition();
		var marker = new BMap.Marker(startPoint);
		map.addOverlay(marker);
		document.getElementById("startPanel").style.display = "none";
	}

}

function driving_transition(map, startPlace, endPlace) {
	var startInfowin = new BMap.InfoWindow("<p class='t-c'>adsfadsf</p>");
	var endInfowin = new BMap.InfoWindow("<p class='t-c'><input value='选为终点' type='button' onclick='endDeter();' /></p>");

	var startResults = null;
	var endResults = null;

	var startPoint;
	var endPoint;

	//var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true,panel:drivingPanel}});
	var driving = new BMap.DrivingRoute(map, {
		renderOptions : {
			map : map,
			autoViewport : true,
			panel : 'drivingPanel'
		}
	});

	var startOption = {
		onSearchComplete : function(results) {
			// 判断状态是否正确
			if(startSearch.getStatus() == BMAP_STATUS_SUCCESS) {
				startResults = results;
				var s = [];
				for(var i = 0; i < results.getCurrentNumPois(); i++) {
					s.push("<div><p><a onmouseover='map.openInfoWindow(startInfowin,startResults.getPoi(" + i + ").point);' href='#'>");
					s.push(results.getPoi(i).title);
					s.push("</a></p><p>");
					s.push(results.getPoi(i).address);
					s.push("</p></div>");
					addMarker(map, results.getPoi(i), false, i)
				}
				document.getElementById("startPanel").innerHTML = s.join("");
			} else {
				startResults = null;
			}
		}
	};
	var endOption = {
		onSearchComplete : function(results) {
			// 判断状态是否正确
			if(endSearch.getStatus() == BMAP_STATUS_SUCCESS) {
				endResults = results;
				var s = [];
				for(var i = 0; i < results.getCurrentNumPois(); i++) {
					s.push("<div><p><a href='#' onmouseover='map.openInfoWindow(endInfowin,endResults.getPoi(" + i + ").point);'>");
					s.push(results.getPoi(i).title);
					s.push("</a></p><p>");
					s.push(results.getPoi(i).address);
					s.push("</p></div>");
					addMarker(map, results.getPoi(i), false, i)
				}
				document.getElementById("endPanel").innerHTML = s.join("");
			} else {
				endResults = null;
			}
		}
	};
	//创建2个搜索实例
	var startSearch = new BMap.LocalSearch(map, startOption);
	var endSearch = new BMap.LocalSearch(map, endOption);

	startSearch.search(startPlace);
	endSearch.search(endPlace);
	document.getElementById("box").style.display = "block";

	function startDeter() {
		//map.clearOverlays();
		startPoint = startInfowin.getPosition();
		var marker = new BMap.Marker(startPoint);
		map.addOverlay(marker);
		document.getElementById("startPanel").style.display = "none";
	}

	function endDeter() {
		if(startPoint == null) {
			alert("请先选择起点！");
		} else {
			endPoint = endInfowin.getPosition();
			driving.search(startPoint, endPoint);
			document.getElementById("endPanel").style.display = "none";
		}
	}

}
