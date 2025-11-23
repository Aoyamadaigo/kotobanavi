// static/js/main.js
import { getCurrentLocation } from "/navigation/static/js/getCurrentLocation.js";
import { createTextDirections } from "/navigation/static/js/textNavigation.js";
import { sendFlasktoServer } from "/navigation/static/js/sendFlaskToServer.js";
import { convertLocation } from "/navigation/static/js/locationToLatLng.js";

let userLatLng = null; // 

export function setupApp() {
    const locateBtn = document.getElementById("locate-btn");
    const navBtn = document.getElementById("make-navigation");
    const destInput = document.getElementById("destination");

    if (!locateBtn || !navBtn || !destInput) {
        console.warn("入力ページ用の要素が見つかりませんでした");
        return;
    }

    // Step1: 現在地を取得
    locateBtn.addEventListener("click", () => {
        getCurrentLocation()
            .then((location) => {
                userLatLng = location;
                alert("現在地を取得しました");
                console.log("現在地:", userLatLng);
            })
            .catch((err) => {
                console.error("現在地取得エラー:", err);
                alert("現在地を取得できませんでした");
            });
    });

    // Step3: 案内開始
    navBtn.addEventListener("click", async () => {

        if (!userLatLng) {
            alert("現在地を取得してください");
            return;
        }

        //入力された目的地を取得後、座標に変換してFlaskerverに送る
        const destination = destInput.value.trim();

        if (!destination) {
            alert("目的地を入力してください");
            return;
        }


        //取得した目的地の情報をサーバーに送る（セッションに保存）
        const destinationLatLng = await convertLocation(destination)
        await sendFlasktoServer(destinationLatLng, "/api/destination")

        try {
            await createTextDirections(userLatLng, destinationLatLng);
            window.location.href = "/text_navigation";
        } catch (err) {
            console.error(err);
            alert("案内の作成に失敗しました");
        }

        // データ送信が終わったらテキスト案内ページへ遷移
        window.location.href = "/text_navigation";
    });
}

// モジュールが読み込まれたら自動でセットアップ
document.addEventListener("DOMContentLoaded", setupApp);

