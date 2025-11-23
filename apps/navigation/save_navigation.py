
"""
get_text_navigation.py

案内開始で作成したテキスト案内をサーバーに送る
"""

from . import bp
from flask import render_template,request, jsonify,session


# getCurrentLocation.jsから現在地を取得する
@bp.post("/api/save_text_navigation")
def save_navigation():
    text_navigation = request.get_json()
    session["text_navigation"] = text_navigation
    return jsonify({"status": "ok"})
    
        