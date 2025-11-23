"""
__init__.py

アプリの作成やDBの作成など初期設定を行う
app.pyにexportすることで使用する
"""

import os
from pathlib import Path
from flask import Flask

from dotenv import load_dotenv

# ローカルでは .env を読み込む（本番は無視される）
load_dotenv()

# def load_google_maps_api_key() -> str | None:
#     """
#     .env から GOOGLE_MAPS_API_KEY を手動で読み込む。
#     読み込めなかった場合は None を返す。
#     """
#     # apps/ の 1つ上がプロジェクトルート（MapApp）
#     base_dir = Path(__file__).resolve().parents[0]
#     env_path = base_dir / ".env"

#     try:
#         with env_path.open(encoding="utf-8") as f:
#             for line in f:
#                 line = line.strip()

#                 # 空行・コメントは飛ばす
#                 if not line or line.startswith("#"):
#                     continue

#                 # キー=値 の形を想定
#                 if line.startswith("GOOGLE_MAPS_API_KEY="):
#                     # 1回だけ = で分割
#                     _, value = line.split("=", 1)
#                     value = value.strip()
#                     print("DEBUG api_key from file:", value)
#                     return value or None

#     except FileNotFoundError:
#         print("DEBUG .env file not found at:", env_path)
#         return None

#     # 該当キーなし
#     print("DEBUG GOOGLE_MAPS_API_KEY not found in .env")
#     return None

def create_app():
    # アプリを作成する際の初期設定
    app = Flask(__name__)
    app.secret_key = os.getenv("SECRET_KEY", "login_secret_key") #Flaskアプリの暗号化
    app.url_map.strict_slashes = False #URL末尾の"/"判定を緩くする

    # app.config["GOOGLE_MAPS_API_KEY"] = load_google_maps_api_key()
    app.config["GOOGLE_MAPS_API_KEY"] = os.getenv("GOOGLE_MAPS_API_KEY")


    #Blueprint設定（後ほど、アプリを作成したら登録していく）
    from apps.navigation import bp as navigation_bp
    app.register_blueprint(navigation_bp)

    return app
    

    
    