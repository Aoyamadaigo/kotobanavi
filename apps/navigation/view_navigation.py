"""
view_navigation.py

navigation機能の初期画面を定義
__init__ファイルでbpの定義を行い、トップ画面のURLを定義する
"""

import os
from flask import render_template,current_app
from . import bp

@bp.get("/",endpoint = "navigation")
def navigation():
    api_key = current_app.config["GOOGLE_MAPS_API_KEY"]
    return render_template("index.html", api_key = api_key)

