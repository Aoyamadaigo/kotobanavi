import { createMapDirections } from "./mapNavigation.js";
import { startLocationTracking } from "./locationTracking.js";
import { setupOrientationTracking } from "./setupOrientationTracking.js";

let map;
let directionsRenderer;

function initMap() {
  const mapElement = document.getElementById("map");

  const zoom = window.mapZoom ?? 18;

  map = new google.maps.Map(mapElement, {
    center: currentLocation,
    zoom: zoom, // 
  });

   // ★ 現在地マーカー
  const currentMarker = new google.maps.Marker({
    position: currentLocation,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE, // ← 矢印アイコン
      scale: 8,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeColor: "white",
      strokeWeight: 2,
    },
  });

  setupOrientationTracking(currentMarker);


  directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    preserveViewport: true,
  });

  createMapDirections(currentLocation, destination, mapElement, map, directionsRenderer);

  startLocationTracking(map, currentMarker);

  window.map = map;
  window.directionsRenderer = directionsRenderer;
}

// google.maps が使えるまで待ってから initMap を実行する
function waitForMaps() {
  if (window.google && window.google.maps) {
    initMap();
  } else {
    setTimeout(waitForMaps, 100); // 0.1秒おきにチェック
  }
}

waitForMaps();
