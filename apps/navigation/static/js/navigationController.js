import { getNavigationText } from "./getNavigationText.js";
import { toVector } from "./locationToVector.js";

let steps = [];              // Directions API から取得した steps
let currentStepIndex = 0;    // 今どのステップか
let watchId = null;          // geolocation のID
let lastUserPos = null;      // 一つ前のユーザー位置（v_user用）

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

// DirectionsService のレスポンスをセット
export function setRoute(route) {
  // 1つ目のルートの 0番目の leg の steps を使う例
  steps = route.legs[0].steps;
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
function handlePositionUpdate(position) {
  const userCurrentLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };

  // v_user を計算（前回位置があれば）
  let v_user = null;
  if (lastUserPos) {
    v_user = toVector(lastUserPos, userCurrentLocation);
  }
  lastUserPos = userCurrentLocation;

  // 現在のステップ
  const currentStep = steps[currentStepIndex];
  const prevStep = steps[Math.max(currentStepIndex - 1, 0)];

  // ステップ終点との距離
  const endLoc = currentStep.end_location; // DirectionsのLatLng
  const endLatLng = { lat: endLoc.lat(), lng: endLoc.lng() };

  const dist = distanceMeters(userCurrentLocation, endLatLng);
  // console.log("現在ステップの終点まで", dist, "m");

  // ---- ここでテキスト案内を更新 ----
  const text = getNavigationText(
    prevStep,
    currentStep,
    currentStepIndex,
    v_user,
    userCurrentLocation
  );

  updateUIDirections(text, dist); // DOM書き換え用

  // ---- ステップ切り替え判定 ----
  const STEP_REACH_THRESHOLD = 18; 

  if (dist < STEP_REACH_THRESHOLD) {
    // 次のステップへ
    if (currentStepIndex < steps.length - 1) {
      currentStepIndex += 1;
      console.log("次のステップへ →", currentStepIndex);
    } else {
      // 最終ステップ到達
      finishNavigation();
    }
  }
}

// 案内完了処理
function finishNavigation() {
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

