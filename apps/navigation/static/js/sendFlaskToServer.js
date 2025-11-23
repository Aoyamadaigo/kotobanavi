export function sendFlasktoServer(latLng, flaskURL) {
  return fetch(flaskURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(latLng),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("サーバー送信 OK:", data);
      return data;
    })
    .catch((err) => {
      console.error("サーバー送信エラー:", err);
      throw err;
    });
}
