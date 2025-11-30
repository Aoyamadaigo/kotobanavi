// static/js/getNavigationText.js

import { toVector } from "./locationToVector.js";
import { angleBetween } from "./calcurateAngle.js";

function cross(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
}

export function getNavigationText(prevStep, currentStep, index) {
  // ---- 1手目（準備ステップ） ----
  if (index === 0) {
    
    return (
      "地図で青い線が伸びている方向へ歩いてください。" +
      "現在地が移動するので、次のステップに切り替わるまで青い線に沿って進んでください"
    );
  }

  // ---- 2手目以降 ----
  const v1 = toVector(prevStep.start_location, prevStep.end_location);
  const v2 = toVector(currentStep.start_location, currentStep.end_location);

  const deg = angleBetween(v1, v2);
  const c = cross(v1, v2);

  const straightThreshold = 15;
  const diagonalThreshold = 60;
  const sharpTurnThreshold = 110;

  if (deg < straightThreshold) {
    return "このまま まっすぐ進んでください";
  }

  const isRight = c < 0;
  const isLeft = c > 0;

  if (deg < diagonalThreshold) {
    if (isRight) return "ななめ右方向に進んでください";
    if (isLeft) return "ななめ左方向に進んでください";
    return "このまま まっすぐ進んでください";
  }

  if (deg < sharpTurnThreshold) {
    if (isRight) return "右方向に進んでください";
    if (isLeft) return "左方向に進んでください";
    return "このまま まっすぐ進んでください";
  }

  if (isRight) return "左後ろに振り返って進んでください";
  if (isLeft) return "右後ろに振り返って進んでください";
  return "後ろを向いて進んでください";
}
