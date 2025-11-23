"""
get_destination.py

main.jsで取得した目的地の情報をサーバーに保存する
"""

from . import bp
from flask import render_template,request, jsonify,session


# getCurrentLocation.jsから現在地を取得する
@bp.post("/api/destination")
def get_destination():
    destination = request.get_json()
    session["destination"] = destination
    return jsonify({"status": "ok"})
    
        