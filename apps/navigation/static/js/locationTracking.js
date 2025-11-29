/** 
 * locationTracking.js
 * 
 * 現在地の自動追従を行う
*/

/**
 * @param {google.maps.map} map - 追従させたい地図
 * @param {google.maps.Marker} marker - 現在地を示すマーカー
 */

let watchId = null

export function startLocationTracking(map, marker) {
    if (!navigator.geolocation) {
        console.log("このブラウザは位置情報に対応していません")
        return
    }


    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
    }

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const newPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };


            //マーカーの位置を更新
            marker.setPosition(newPos)

            map.setCenter(newPos);
        },
        (error) => {
            console.error("位置情報の取得に失敗しました: ", error);
        },
        {
            enableHighAccuracy: true, 
            maximumAge: 0,            
            timeout: 10000,           
        }
    )
}

/**
 * 現在地の自動追跡を停止する
 */
export function stopLocationTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}