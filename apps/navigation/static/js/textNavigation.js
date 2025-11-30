import { getNavigationText } from "./getNavigationText.js";
import { sendFlasktoServer } from "./sendFlaskToServer.js";

export function createTextDirections(originLatLng, destination, v_user) {
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

      // ---- 1手目（index = 0） ----
      if (steps.length > 0) {
        const firstStep = steps[0];

        // index = 0 を getNavigationText に渡す
        const firstText = getNavigationText(
          firstStep,     // prevStep として扱う
          firstStep,     // currentStep としても同じでOK
          0,             // index=0
          v_user,
        );

        simpleSteps.push({
          instruction: firstText,
          distance_m: firstStep.distance.value,
          duration_s: firstStep.duration.value,
        });
      }

      // ---- 2手目以降（index = 1〜）----
      for (let i = 1; i < steps.length; i++) {
        const prevStep = steps[i - 1];
        const currentStep = steps[i];

        const text = getNavigationText(
          prevStep,
          currentStep,
          i,
          v_user,
        );

        simpleSteps.push({
          instruction: text,
          distance_m: currentStep.distance.value,
          duration_s: currentStep.duration.value,
        });
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
