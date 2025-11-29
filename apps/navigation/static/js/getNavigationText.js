// getNavigationText.js

import { toVector } from "./locationToVector.js";
import { angleBetween } from "./calcurateAngle.js";

function cross(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
}

export function getNavigationText(prevStep, currentStep) {
  const v1 = toVector(prevStep.start_location, prevStep.end_location);
  const v2 = toVector(currentStep.start_location, currentStep.end_location);

  const deg = angleBetween(v1, v2); // 0〜180°
  const c   = cross(v1, v2);        // 符号で右/左判定

  const straightThreshold = 15;   // 15度以内は直進
  const diagonalThreshold = 60;   // 60度までは「ななめ」
  const sharpTurnThreshold = 110; // それ以上は「大きく曲がる」

  if (deg < straightThreshold) {
    return "このまま まっすぐ進んでください";
  }

  const isRight = c < 0;
  const isLeft  = c > 0;

  if (deg < diagonalThreshold) {
    if (isRight) return "少し右に向かって進んでください";
    if (isLeft)  return "少し左に向かって進んでください";
    return "このまま まっすぐ進んでください";
  } else if (deg < sharpTurnThreshold) {
    if (isRight) return "この先、右に曲がってください";
    if (isLeft)  return "この先、左に曲がってください";
    return "このまま まっすぐ進んでください";
  } else {
    if (isRight) return "ほぼ来た道を戻るように、右に曲がってください";
    if (isLeft)  return "ほぼ来た道を戻るように、左に曲がってください";
    return "このまま まっすぐ進んでください";
  }
}
