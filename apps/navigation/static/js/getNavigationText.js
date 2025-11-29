// getNavigationText.js

import { toVector } from "./locationToVector.js";
import { angleBetween } from "./calcurateAngle.js";

function cross(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
}

// v1, v2 の長さ
function vecLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function getNavigationText(prevStep, currentStep, index, v_user, originLatLng) {

    // ---- STEP1 専用ロジック ----
    if (index === 1 && v_user) {

        // 進むべきルート方向（step0）
        const v_route = toVector(originLatLng, prevStep.end_location);

        // ユーザーの進行方向（移動ベクトル）
        const deg = angleBetween(v_user, v_route);
        const c = cross(v_user, v_route);

        const isRight = c < 0;
        const isLeft = c > 0;

        if (deg < 15) {
            return "このまま前の方向に進んでください";
        }
        if (deg < 60) {
            if (isRight) return "ななめ右方向に進んでください";
            if (isLeft) return "ななめ左方向に進んでください";
            return "前の方向に進んでください";
        }
        if (deg < 120) {
            if (isRight) return "右方向に進んでください";
            if (isLeft) return "左方向に進んでください";
            return "前の方向に進んでください";
        }

        if (isRight) return "左後ろに向いて進んでください";
        if (isLeft) return "右後ろに向いて進んでください";
        return "後ろを向いて進んでください";
    }

    // ---- STEP2 以降：従来ロジック ----

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

    if (isRight) return "左後ろに向いて進んでください";
    if (isLeft) return "右後ろに向いて進んでください";
    return "後ろを向いて進んでください";
}
