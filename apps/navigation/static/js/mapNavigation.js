// static/js/mapNavigation.js

export function createMapDirections(currentLocation, destination, mapElement, map, directionsRenderer) {
  if (!currentLocation) {
    throw new Error("currentLocation が指定されていません");
  }
  if (!destination) {
    throw new Error("destination が指定されていません");
  }
  if (!mapElement) {
    throw new Error("mapElement が指定されていません");
  }

  if (!map) {
    throw new Error("map が指定されていません");
  }

  if (!directionsRenderer) {
    throw new Error("directionsRenderer が指定されていません");
  }


  // Directions API
  const directionsService = new google.maps.DirectionsService();

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

    //各 step の「終点」に番号マーカーを出す
    const route = result.routes[0];
    const leg = route.legs[0];
    const steps = leg.steps;
    
    steps.forEach((s, i) => {
      new google.maps.Marker({
        position: s.end_location,
        map: map,
        label: String(i),  // "0", "1", "2", ...
      });
    });
  });
}
