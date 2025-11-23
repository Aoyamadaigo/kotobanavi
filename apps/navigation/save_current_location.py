"""
get_current_location.py

現在地情報をサーバーに保存する
"""

from . import bp
from flask import render_template,request, jsonify,session


# getCurrentLocation.jsから現在地を取得する
@bp.post("/api/current_location")
def gat_current_location():
    userLating = request.get_json()
    session["current_location"] = userLating
    return jsonify({"status": "ok"})
    
        