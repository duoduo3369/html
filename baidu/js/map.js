function addJumpMarker(map, point) {

	var marker = new BMap.Marker(point);
	// 创建标注
	map.addOverlay(marker);
	// 将标注添加到地图中
	marker.setAnimation(BMAP_ANIMATION_BOUNCE);
	//跳动的动画
	return marker;
}

function addDefaultLabel(info_string, offset_x, offset_y) {
	var label = new BMap.Label(info_string, {
		offset : new BMap.Size(offset_x, offset_y)
	});
	label.setStyle({
		borderColor : "#999",
	});
	// 浅灰色边框
	return label;
}

function getCurrentPositionOnMap(map) {
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r) {
		if(this.getStatus() == BMAP_STATUS_SUCCESS) {
			var mk = addJumpMarker(map, r.point);
			//添加跳动标注
			map.panTo(r.point);
			// 跳转到当前坐标点
			var label = addDefaultLabel("您的位置", 20, -10);
			label.setStyle({
				display : "none"
			});
			mk.setLabel(label);
			mk.addEventListener("mouseover", function() {
				label.setStyle({
					display : "block"
				});
			});
			//鼠标经过时 显示label
			mk.addEventListener("mouseout", function() {
				label.setStyle({
					display : "none"
				});
			});
			//鼠标离开时 隐藏label
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
			alert("find it!");
		}
	}, city);
}

function localSearch(map, position) {
	var local = new BMap.LocalSearch(map, {
		renderOptions : {
			map : map,
			panel : "results"
		}
	});
	local.search(position);
}
