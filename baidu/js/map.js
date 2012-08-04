function inital() {
    var map = new BMap.Map("container"); // 创建Map实例
    var point = new BMap.Point(116.404, 39.915); // 创建点坐标
    map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别。
    map.enableScrollWheelZoom();
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());

    function setCenterToMyCity(result) {
        var cityName = result.name;
        map.setCenter(cityName);
    }
    var myCity = new BMap.LocalCity();
    myCity.get(setCenterToMyCity);
    return map;
}

function addJumpMarker(map, point) {
    
    var marker = new BMap.Marker(point); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
}

function search(map, location) {
    
    var options = {
        onSearchComplete: function(results) {
            // 判断状态是否正确
            alert(results.getStatus());
            if (results.getStatus() === BMAP_STATUS_SUCCESS) {
                var s = [];
                for (var i = 0; i < results.getCurrentNumPois(); i++) {
                    s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
                }
                document.getElementById("results").innerHTML = s.join("<br/>");
            }
        }
    };
    
    var local = new BMap.LocalSearch(map, options);
    local.search(location);
    
    /*
    var localsearch = new BMap.LocalSearch(map, {
        renderOptions: {
            map: map,
            autoViewport:true,
            panel: "results"
        }
    });
    
    $("#results").html(""); //每次生成前清空文本域  
    
    //map.clearOverlays(); //清除地图上所有标记  
    alert(location);
    localsearch.search(location); //查找城市 
    
    $("#results").html(location + " " + localsearch.getStatus() + " "+ localsearch.getResults());
    */
    /*
    var i = 1;
    localsearch.setSearchCompleteCallback(function(rs) {
        if (localsearch.getStatus() == BMAP_STATUS_SUCCESS) {
            for (j = 0; j < rs.getCurrentNumPois(); j++) {
                var poi = rs.getPoi(j);
                map.addOverlay(new BMap.Marker(poi.point)); //如果查询到，则添加红色marker  
                var result = $("results").html() + poi.title + ":" + poi.point.lng + "," + poi.point.lat + '\n';
                $("results").html(result)
            }
            if (rs.getPageIndex != rs.getNumPages()) {
                localsearch.gotoPage(i);
                i = i + 1;
            }
        }
    });
    */
}
function localSearch(map, position) {
    var local = new BMap.LocalSearch(map, {
        renderOptions: {
            map: map,
            panel: "results"
        }
    });
    local.search(position);
}
