"""
show_map.py

get_current_location.pyでセッションに保存した
現在地の情報を取得し、地図と現在地の情報を表示する
"""
from flask import render_template,session,current_app
from . import bp

@bp.get("/show_map")
def show_map():
    current_location = session.get("current_location")
    destination = session.get("destination")
    api_key = current_app.config["GOOGLE_MAPS_API_KEY"]
    return render_template("map.html",  
                           current_location = current_location,
                           destination=destination,
                           api_key=api_key)