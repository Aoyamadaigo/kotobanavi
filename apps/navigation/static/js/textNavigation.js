/* 
static/js/textNavigation.js

DirectionsService を使って「テキストの案内」を作るだけのモジュール
*/

import { sendFlasktoServer } from "./sendFlaskToServer.js";
import { getNavigationText } from "./getNavigationText.js";

export function createTextDirections(originLatLng, destination,v_user) {
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
      console.log("[Directions status]", status, result);

      if (status !== google.maps.DirectionsStatus.OK) {
        console.error(result);
        return reject(new Error("Directions API エラー: " + status));
      }

      const route = result.routes[0];
      const leg = route.legs[0];
      const steps = leg.steps;

      const simpleSteps = [];

      if (steps.length < 3) {
        // 短いルート用の簡易ステップ
        const onlyStep = steps[0];
        simpleSteps.push({
          instruction: "このルートでは、ほぼまっすぐ進んでください",
          distance_m: onlyStep.distance.value,
          duration_s: onlyStep.duration.value,
        })
      }
      else {
        for (let i = 1; i < steps.length; i++) {
          const prevStep = steps[i - 1];
          const currentStep = steps[i];

          const text = getNavigationText(prevStep, currentStep,i,v_user,originLatLng);

          simpleSteps.push({
            instruction: text,
            distance_m: currentStep.distance.value,
            duration_s: currentStep.duration.value,
          });
        }
      }

      const textNavigation = {
        total_distance_m: leg.distance.value,
        total_duration_s: leg.duration.value,
        steps: simpleSteps,
      };

      sendFlasktoServer(textNavigation, "/api/save_text_navigation")
        .then(() => resolve(textNavigation))
        .catch(reject);
    });
  });
}
