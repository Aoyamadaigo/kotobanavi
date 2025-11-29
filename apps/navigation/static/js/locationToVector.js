/**
 *  2点（Google Maps の LatLng: {lat, lng}）からベクトルを作る
* */

// static/js/locationToVector.js

export function toVector(p1, p2) {
  const x1 = typeof p1.lng === "function" ? p1.lng() : p1.lng;
  const y1 = typeof p1.lat === "function" ? p1.lat() : p1.lat;
  const x2 = typeof p2.lng === "function" ? p2.lng() : p2.lng;
  const y2 = typeof p2.lat === "function" ? p2.lat() : p2.lat;

  return {
    x: x2 - x1,
    y: y2 - y1,
  };
}
