function addMarker(map, point, jump,index) {
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

function addDefaultEventMarker(map, point, label, jump,index) {
	jump = jump || false;
	var maker = addMarker(map, point, jump,index);
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
			var mk = addDefaultEventMarker(map, r.point, label, jump = true);
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

function localSearch(map, position) {

	var options = {
		onSearchComplete : function(results) {
			// 判断状态是否正确
			if(local.getStatus() == BMAP_STATUS_SUCCESS) {
				var s = [];
				var label;
				var info;
				//var maker;
				map.panTo(results.getPoi(0).point);
				for(var i = 0; i < results.getCurrentNumPois(); i++) {
					info = results.getPoi(i).title + ", " + results.getPoi(i).address;
					s.push(info);
					label = addDefaultLabel(info);
					addDefaultEventMarker(map, results.getPoi(i).point, label,false,i);

				}

				document.getElementById("results").innerHTML = s.join("<br/>");
			}
		}
	};
	var local = new BMap.LocalSearch(map, options);
	local.search(position);
}
