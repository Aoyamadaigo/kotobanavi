import { createMapDirections } from "./mapNavigation.js";

let map;
let directionsRenderer;

function initMap() {
  const mapElement = document.getElementById("map");
  map = new google.maps.Map(mapElement, {
    center: currentLocation,
    zoom: 15,
  });

  new google.maps.Marker({
    position: currentLocation,
    map: map,
    title: "現在地",
  });

  directionsRenderer = new google.maps.DirectionsRenderer({ map });
  createMapDirections(currentLocation, destination, mapElement);

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
