/*
getCurrentLocation.js

ユーザーの現在地を取得するための関数
initMap.js で使用するために、export で定義し、
btnが押されたときだけ、現在地を取得する

＜処理手順＞
１．Geolocation で現在地を取得
２．{lat, lng} を作る
３．JSON を /api/current_location に fetch で送信
４．サーバーのレスポンスを .json() でパース
５．resolve(userLatLng) で呼び出し元へ返す
*/
import { sendFlasktoServer } from "./sendFlaskToServer.js";

export function getCurrentLocation() {

        //非同期処理として、案内開始のボタンが押されたときにデータあを返す
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                alert("このブラウザは位置情報取得に対応していません");
                reject(new Error("Geolocation is not supported"));
                return;
            }

            // 現在地の取得
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    const userLatLng = { lat, lng };

                    //取得した現在地の情報をサーバーに送る（→セッションに保存）
                    sendFlasktoServer(userLatLng,"/navigation/api/current_location")

                    // 取得した位置情報を呼び出し元に返す
                    resolve(userLatLng);
                },
                (err) => {
                    console.error(err);
                    alert("現在地を取得できませんでした。");
                    reject(err);
                }
            );
        });
}
