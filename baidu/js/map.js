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

var ac_local_search_input = new BMap.Autocomplete({
	"input" : "location_search_input",
	"location" : map
});
var ac_transit_search_input_from = new BMap.Autocomplete(//建立一个自动完成的对象
{
	"input" : "transit_search_input_from",
	"location" : map
});
var ac_transit_search_input_to = new BMap.Autocomplete(//建立一个自动完成的对象
{
	"input" : "transit_search_input_to",
	"location" : map
});
var ac_drive_search_input_from = new BMap.Autocomplete(//建立一个自动完成的对象
{
	"input" : "drive_search_input_from",
	"location" : map
});
var ac_drive_search_input_to = new BMap.Autocomplete(//建立一个自动完成的对象
{
	"input" : "drive_search_input_to",
	"location" : map
});

function addMarker(point, index) {
	var myIcon = new BMap.Icon("../images/markers_new.png", new BMap.Size(28, 32), {
		offset : new BMap.Size(10, 25),
		imageOffset : new BMap.Size(0 - index * 29, 0)
	});
	var marker = new BMap.Marker(point, {
		icon : myIcon
	});
	map.addOverlay(marker);
	return marker;
}

function localSearch(place, panel) {
	//var localInfowin =
	var options = {
		renderOptions : {
			map : map,
			panel : panel,
		},

		/*
		 onSearchComplete : function(results) {
		 // 判断状态是否正确
		 if(local.getStatus() == BMAP_STATUS_SUCCESS) {

		 var s = [];
		 var position_object;
		 var marker;

		 for(var i = 0; i < results.getCurrentNumPois(); i++) {
		 position_object = results.getPoi(i)
		 s.push("<div><p><a onmouseover='map.openInfoWindow(localInfowin,startResults.getPoi(" + i + ").point);' href='#'>");
		 s.push(position_object.title);
		 s.push("</a></p><p>");
		 s.push(position_object.address);
		 s.push("</p></div>");

		 }
		 $("#local_search_results").html(s.join(""));

		 }

		 }

		 */
	}
	map.clearOverlays();
	var local = new BMap.LocalSearch(map, options);
	local.search(place);
	local.enableAutoViewport();
	local.setMarkersSetCallback(function() {
		map.setZoom(14);

	})
	local.disableFirstResultSelection()
}

var startInfowindowArray = new Array();
var endInfowindowArray = new Array();
var startResults = null;
var endResults = null;
var startPoint = null;
var endPoint = null;

function transStartSearch(place) {
	var startOption = {
		onSearchComplete : function(results) {
			// 判断状态是否正确

			if(startSearch.getStatus() == BMAP_STATUS_SUCCESS) {
				startResults = results;
				var s = [];
				var position_object, marker, label, info_string, info_window;

				for(var i = 0; i < results.getCurrentNumPois(); i++) {
					position_object = results.getPoi(i)

					info_string = "<p class='transInfoWindow'>" + position_object.title + "<br /><span>地址：</span>" + position_object.address + "<br />";
					if(position_object.phoneNumber != undefined) {
						info_string += "<span>电话：</span>" + position_object.phoneNumber + "<br />";
					}
					info_string += "<input value='选为起点' type='button' onclick=startDeter(" + i + "); /></p>";
					info_window = new BMap.InfoWindow(info_string);

					startInfowindowArray.push(info_window);

					s.push("<div><p><a onmouseover='map.openInfoWindow(startInfowindowArray[" + i + "],startResults.getPoi(" + i + ").point);' href='#'>");
					s.push(position_object.title);
					s.push("</a></p><p>");
					s.push(position_object.address);
					s.push("</p></div>");
					marker = addMarker(position_object.point, i);
					marker.addEventListener("click", function() {
						map.openInfoWindow(startInfowindowArray[i], this.getPosition());
						map.panTo(this.getPosition());
						// 跳转到当前坐标点
						map.setZoom(14)
					});
				}
				$("#transit_from_results").html(s.join(""));
				map.panTo(results.getPoi(0).point);
				map.setZoom(14);
				alert('true')
			} else {
				alert('没有找到相应的搜索结果')
				startResults = null;
			}
		}
	};
	map.clearOverlays();
	var startSearch = new BMap.LocalSearch(map, startOption);
	startSearch.search(place);
	startSearch.enableAutoViewport();
	startSearch.setMarkersSetCallback(function() {
		map.setZoom(14);

	})
	startSearch.disableFirstResultSelection()
}
function transEndSearch(place) {
	var endOption = {
		onSearchComplete : function(results) {
			// 判断状态是否正确

			if(endSearch.getStatus() == BMAP_STATUS_SUCCESS) {
				
				endResults = results;
				var s = [];
				var position_object, marker, label, info_string, info_window;

				for(var i = 0; i < results.getCurrentNumPois(); i++) {
					position_object = results.getPoi(i)

					info_string = "<p class='transInfoWindow'>" + position_object.title + "<br /><span>地址：</span>" + position_object.address + "<br />";
					if(position_object.phoneNumber != undefined) {
						info_string += "<span>电话：</span>" + position_object.phoneNumber + "<br />";
					}
					info_string += "<input value='选为终点' type='button' onclick=endDeter(" + i + "); /></p>";
					info_window = new BMap.InfoWindow(info_string);

					endInfowindowArray.push(info_window);

					s.push("<div><p><a onmouseover='map.openInfoWindow(endInfowindowArray[" + i + "],endResults.getPoi(" + i + ").point);' href='#'>");
					s.push(position_object.title);
					s.push("</a></p><p>");
					s.push(position_object.address);
					s.push("</p></div>");
					marker = addMarker(position_object.point, i);
					marker.addEventListener("click", function() {
						map.openInfoWindow(endInfowindowArray[i], this.getPosition());
						map.panTo(this.getPosition());
						// 跳转到当前坐标点
						map.setZoom(14)
					});
				}
				$("#transit_to_results").html(s.join(""));
				map.panTo(results.getPoi(0).point);
				map.setZoom(14);
				alert('true')
			} else {
				alert('没有找到相应的搜索结果')
				endResults = null;
			}
		}
	};
	map.clearOverlays();
	var endSearch = new BMap.LocalSearch(map, endOption);
	endSearch.search(place);
	endSearch.enableAutoViewport();
	endSearch.setMarkersSetCallback(function() {
		map.setZoom(14);

	})
	endSearch.disableFirstResultSelection()
}
function startDeter(index) {
	//map.clearOverlays();
	startInfowin = startInfowindowArray[index];
	startPoint = startInfowin.getPosition();

	var marker = new BMap.Marker(startPoint);
	marker.setAnimation()
	map.addOverlay(marker);
	alert(startPoint + trans_type)
	if(startPoint != null && endPoint != null) {
		busSearch(startPoint, endPoint);

	}
}

function endDeter(index) {
	//map.clearOverlays();

	endInfowin = endInfowindowArray[index];

	endPoint = endInfowin.getPosition();

	var marker = new BMap.Marker(endPoint);
	marker.setAnimation()

	map.addOverlay(marker);
	if(startPoint != null && endPoint != null) {
		busSearch(startPoint, endPoint);

	}
}

function busSearch(from, to) {
	var transit = new BMap.TransitRoute(map, {
		renderOptions : {
			map : map,
			autoViewport : true,
			panel : "transit_results"
		}
	});
	transit.search(from, to);
}

function drivingSearch(from, to) {
	var driving = new BMap.DrivingRoute(map, {
		renderOptions : {
			map : map,
			autoViewport : true,
			panel : "transit_results"
		}
	});
	driving.search(from, to);
}

function getCurrentPosition() {

	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r) {
		if(this.getStatus() == BMAP_STATUS_SUCCESS) {

			var label = addDefaultLabel("您的位置", 20, -10, "none");

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
			map.setZoom(14)
			return r.point;

		} else {
			alert("无法获取您当前位置 请稍后再试")
			return undefined;
		}
	})
}

