// static/js/textNavigation.js

import { getNavigationText } from "./getNavigationText.js";
import { sendFlasktoServer } from "./sendFlaskToServer.js";

export function createTextDirections(originLatLng, destinationLatLng, v_user) {
  return new Promise((resolve, reject) => {
    if (!originLatLng) return reject(new Error("originLatLng が指定されていません"));
    if (!destinationLatLng) return reject(new Error("destination が指定されていません"));

    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin: originLatLng,
      destination: destinationLatLng,
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

      if (!steps.length) {
        return reject(new Error("ルートのステップが空です"));
      }

      const simpleSteps = [];

      // ─────────────────────
      // ① 準備ステップ（index 関係なく、最初に1つだけ）
      // ─────────────────────
      {
        const firstStep = steps[0];

        // getNavigationText の「index=0」特別処理を使う
        const prepText = getNavigationText(
          firstStep, // prevStep
          firstStep, // currentStep
          0,         // index=0 → 準備ステップ扱い
        );

        simpleSteps.push({
          is_prepare: true,          // 準備ステップかどうかのフラグ
          step_no: null,             // 実ステップ番号ではない
          instruction: prepText,     // 準備ステップ用の文言
          distance_m: firstStep.distance.value,
          duration_s: firstStep.duration.value,
          end_location: {
            lat: firstStep.end_location.lat(),
            lng: firstStep.end_location.lng(),
          },
        });
      }

      // ─────────────────────
      // ② 実ステップ（曲がり案内） index=1〜
      // ─────────────────────
      //
      for (let i = 1; i < steps.length; i++) {
        const prevStep = steps[i-1];
        const currentStep = steps[i];

        const text = getNavigationText(
          prevStep,
          currentStep,
          i,      // 
        );

        simpleSteps.push({
          is_prepare: false,
          step_no: i,                 // 実ステップ番号（1,2,3…）
          instruction: text,          // 右/左/ななめ/まっすぐ など
          distance_m: currentStep.distance.value,
          duration_s: currentStep.duration.value,
          end_location: {
            lat: currentStep.end_location.lat(),
            lng: currentStep.end_location.lng(),
          },
        });
      }

      const textNavigation = {
        total_distance_m: leg.distance.value,
        total_duration_s: leg.duration.value,
        steps: simpleSteps,
      };

      // Flask に保存
      sendFlasktoServer(textNavigation, "/api/save_text_navigation")
        .then(() => resolve(textNavigation))
        .catch(reject);
    });
  });
}
