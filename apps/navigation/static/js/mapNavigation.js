// static/js/mapNavigation.js

export function createMapDirections(currentLocation, destination, mapElement) {
  if (!currentLocation) {
    throw new Error("currentLocation が指定されていません");
  }
  if (!destination) {
    throw new Error("destination が指定されていません");
  }
  if (!mapElement) {
    throw new Error("mapElement が指定されていません");
  }

  // Google Maps のインスタンスを作成
  const map = new google.maps.Map(mapElement, {
    zoom: 16,
    center: currentLocation,
  });

  // Directions API
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const request = {
    origin: currentLocation,
    destination: destination,
    travelMode: google.maps.TravelMode.WALKING,
  };

  directionsService.route(request, (result, status) => {
    if (status !== google.maps.DirectionsStatus.OK) {
      console.error("[Directions API error]", status, result);

      mapElement.innerHTML = `<p>ルートを取得できませんでした：${status}</p>`;
      return;
    }

    // ルート描画
    directionsRenderer.setDirections(result);
  });
}
