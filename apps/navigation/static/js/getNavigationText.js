// getNavigationText.js

import { toVector } from "./locationToVector.js";
import { angleBetween } from "./calcurateAngle.js";

function cross(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
}

export function getNavigationText(prevStep, currentStep, index, v_user) {

  // ---- 1手目（準備ステップ） ----
  if (index === 0) {

    // v_userがある場合：参考にはするが身体方向は指示しない
    if (v_user) {
      return (
        "地図で青い線が伸びている方向へ歩き始めてみてください。" +
        "歩き出すと、アプリがあなたの向いている方向をつかんで、次の案内をお知らせします。"
      );
    }

    // v_userがない場合（コンパス不安定・GPS静止）
    return (
      "まず、地図で青い線が伸びている方向へ歩き始めてみてください。" +
      "歩き出すと、アプリがあなたの向いている方向をつかんで、次の案内をお知らせします。"
    );
  }

  // ---- 2手目以降 ----

  const v1 = toVector(prevStep.start_location, prevStep.end_location);
  const v2 = toVector(currentStep.start_location, currentStep.end_location);

  const deg = angleBetween(v1, v2);
  const c = cross(v1, v2);

  const straightThreshold = 15;
  const diagonalThreshold = 60;
  const sharpTurnThreshold = 130;

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
