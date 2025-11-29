export function setupOrientationTracking(marker) {
  // iOS では許可が必要
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response !== "granted") {
          console.warn("デバイスの向きを許可してください");
          return;
        }
        addOrientationListener(marker);
      })
      .catch(console.error);
  } else {
    // AndroidやPCはそのままイベントを追加
    addOrientationListener(marker);
  }
}

function addOrientationListener(marker) {
  window.addEventListener("deviceorientation", (event) => {
    const heading = event.webkitCompassHeading || event.alpha;

    if (heading == null) return;

    // マーカーのアイコンを更新（rotationだけ変える）
    const icon = marker.getIcon();

    marker.setIcon({
      ...icon,
      rotation: heading,
    });
  });
}
