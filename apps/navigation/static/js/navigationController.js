import { getNavigationText } from "./getNavigationText.js";
import { toVector } from "./locationToVector.js";

let steps = [];              // Directions API から取得した steps（Google生データ）
let textSteps = [];          // 事前に作った simpleSteps（instruction, distance_m など）
let currentStepIndex = 0;
let watchId = null;
let lastUserPos = nul

// 距離を計算（Googleのgeometry使えるならそれでOK）
export function distanceMeters(latLng1, latLng2) {
  const R = 6378137; // 地球の半径[m]
  const toRad = d => (d * Math.PI) / 180;

  const dLat = toRad(latLng2.lat - latLng1.lat);
  const dLng = toRad(latLng2.lng - latLng1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(latLng1.lat)) *
    Math.cos(toRad(latLng2.lat)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// DirectionsService のレスポンス & テキスト案内をセット
export function setRoute(route, simpleSteps) {
  steps = route.legs[0].steps;
  textSteps = simpleSteps;     // 
  currentStepIndex = 0;
}

// 案内をスタート
export function startAutoNavigation() {
  if (!steps.length) {
    console.error("steps がセットされていません");
    return;
  }

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  watchId = navigator.geolocation.watchPosition(
    handlePositionUpdate,
    (err) => {
      console.error("現在地の取得に失敗しました", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    }
  );
}

// ジオロケーション更新時に呼ばれる
export function handlePositionUpdate(position) {
  const userCurrentLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };

  // v_user は今「使わない」ならそのまま残してもOK・後で拡張用
  let v_user = null;
  if (lastUserPos) {
    v_user = toVector(lastUserPos, userCurrentLocation);
  }
  lastUserPos = userCurrentLocation;

  const currentStep = steps[currentStepIndex];
  const prevStep = steps[Math.max(currentStepIndex - 1, 0)];

  const endLoc = currentStep.end_location;
  const endLatLng = { lat: endLoc.lat(), lng: endLoc.lng() };

  const dist = distanceMeters(userCurrentLocation, endLatLng);

  // 事前生成されたテキストをそのまま使う
  const currentText =
    textSteps[currentStepIndex]?.instruction ??
    "案内中です。しばらく直進してください。";

  updateUIDirections(currentText, dist);

  // ---- ステップ切り替え判定 ----
  const STEP_REACH_THRESHOLD = 10;

  if (dist < STEP_REACH_THRESHOLD) {
    if (currentStepIndex < steps.length - 1) {
      currentStepIndex += 1;
      console.log("次のステップへ →", currentStepIndex);
    } else {
      finishNavigation();
    }
  }
}


// 案内完了処理
export function finishNavigation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  updateUIDirections("目的地周辺です。おつかれさまでした🌻", 0);
}

function updateUIDirections(text, dist) {
  const textEl = document.getElementById("nav-text");
  const distEl = document.getElementById("nav-distance");
  if (textEl) textEl.textContent = text;
  if (distEl) distEl.textContent = `この区間はあと約 ${Math.round(dist)} m です`;
}

