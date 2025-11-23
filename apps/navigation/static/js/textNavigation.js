/* 
static/js/textNavigation.js

DirectionsService を使って「テキストの案内」を作るだけのモジュール
*/


import { sendFlasktoServer } from "./sendFlaskToServer.js";


export function createTextDirections(originLatLng, destination) {
  return new Promise((resolve, reject) => {
    if (!originLatLng) return reject(new Error("originLatLng が指定されていません"));
    if (!destination) return reject(new Error("destination が指定されていません"));


    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin: originLatLng,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING,
    };

    directionsService.route(request, (result, status) => {
      console.log("[Directions status]", status, result); // ←追加
      
      if (status !== google.maps.DirectionsStatus.OK) {
        console.error(result);
        return reject(new Error("Directions API エラー: " + status));
      }

      const route = result.routes[0];
      const leg = route.legs[0];

      const simpleSteps = leg.steps.map((step) => ({
        instruction: step.instructions,
        distance_m: step.distance.value,
        duration_s: step.duration.value,
      }));

      const textNavigation = {
        total_distance_m: leg.distance.value,
        total_duration_s: leg.duration.value,
        steps: simpleSteps,
      };

      // console.log("textNavigation:",textNavigation)

      // ここで保存が終わったら resolve
      sendFlasktoServer(textNavigation, "/api/save_text_navigation")
        .then(() => resolve(textNavigation))
        .catch(reject);
    });
  });
}

