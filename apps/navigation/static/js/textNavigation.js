/* 
static/js/textNavigation.js

DirectionsService を使って「テキストの案内」を作るだけのモジュール
*/

import { sendFlasktoServer } from "./sendFlaskToServer.js";
import { stepToFriendly } from "./instructionConvert.js";

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

    directionsService.route(request, async (result, status) => {
      console.log("[Directions status]", status, result);

      if (status !== google.maps.DirectionsStatus.OK) {
        console.error(result);
        return reject(new Error("Directions API エラー: " + status));
      }

      const route = result.routes[0];
      const leg = route.legs[0];

      // ★ ここで stepToFriendly を呼んで、すぐ変換してしまう
      const simpleSteps = [];
      for (const step of leg.steps) {
        // Maps JavaScript API の step は step.instructions に HTML が入っている
        // instructionConvert.js は html_instructions を見るので、
        // 一旦「名前だけ合わせたラッパオブジェクト」にして渡してもOK
        const convertedText = await stepToFriendly({
          html_instructions: step.instructions, // JS API → 変換用
          maneuver: step.maneuver,             // そのまま
        });

        simpleSteps.push({
          instruction: convertedText,          // ユーザーに見せるテキスト
          distance_m: step.distance.value,
          duration_s: step.duration.value,
        });
      }

      const textNavigation = {
        total_distance_m: leg.distance.value,
        total_duration_s: leg.duration.value,
        steps: simpleSteps,
      };

      // console.log("textNavigation:", textNavigation);

      sendFlasktoServer(textNavigation, "/api/save_text_navigation")
        .then(() => resolve(textNavigation))
        .catch(reject);
    });
  });
}
