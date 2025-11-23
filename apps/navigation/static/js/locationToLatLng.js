export function convertLocation(location) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: location }, function (results, status) {
            if (status == "OK") {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                const latLng = { lat, lng }
                resolve(latLng)
            } else {
                reject(new Error("座標の変換に失敗しました" + status))
            }
        }
        )
    })
}