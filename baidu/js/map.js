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
}

function transSearch(from,to){
		
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

