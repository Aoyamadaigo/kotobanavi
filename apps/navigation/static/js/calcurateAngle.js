/**
 * 2つのベクトルの間の角度を計算
 */

export function angleBetween(v1, v2) {
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);

  if (mag1 === 0 || mag2 === 0) return 0; 

  let cosTheta = dot / (mag1 * mag2);

  // 浮動小数点の誤差対策（-1〜1にクランプ）
  cosTheta = Math.min(1, Math.max(-1, cosTheta));

  const rad = Math.acos(cosTheta);       // ラジアン
  const deg = rad * (180 / Math.PI);     // 度数に変換
  return deg;
}
