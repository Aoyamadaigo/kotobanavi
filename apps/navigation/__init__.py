"""
__init__.py

navigation機能の初期化モジュール
Blueprint機能の初期設定と必要なview関数の読み込みを行う
app.py/create_appで登録して使用する
"""
from flask import Blueprint

bp = Blueprint('navigation',
               __name__, 
               url_prefix="", 
               template_folder="templates",
               static_folder="static",
               static_url_path="/navigation/static")
from . import save_current_location, save_destination, view_navigation,show_map,show_text_navigation,save_navigation