import { createMapDirections } from "./mapNavigation.js";

//各変数の初期値を設定
let map
let directionsService;
let directionsRenderer;

//現在地周辺のmapを表示
function initMap() {

    //default位置を現在地に設定
    const mapElement = document.getElementById("map");
    map = new google.maps.Map(mapElement, {
    center: currentLocation, 
    zoom: 15,
  });

  // 現在地マーカー
  new google.maps.Marker({
    position: currentLocation,
    map: map,
    title: "現在地",
  }); 

    //Direction用オブジェクトの初期化
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map, })

    createMapDirections(currentLocation, destination, mapElement);
    

    // URLパラメータから dest を読みたいならここ
    const params = new URLSearchParams(window.location.search);
    const destFromUrl = params.get("dest");
    if (destFromUrl) {
        const destInput = document.getElementById("destination");
        if (destInput) destInput.value = destFromUrl;
    }
    //window(JSの最上位オブジェクト)でグローバル変数にする 
    window.map = map;
    window.directionsRenderer = directionsRenderer;
}

window.initMap = initMap;
