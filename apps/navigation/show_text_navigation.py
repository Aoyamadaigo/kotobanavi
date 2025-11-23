"""
show_text_navigetion

index.htmlの案内開始ボタンを押下後、テキスト案内を実施する
ページに遷移する
"""
from . import bp
from flask import render_template,session,abort,current_app

@bp.get("/text_navigation")
def show_text_navigation():
    api_key = current_app.config["GOOGLE_MAPS_API_KEY"]
    text_navigation =  session.get("text_navigation")
    if not(text_navigation):
        abort(400, description="ルートが見つかりません")
    return render_template("text_navigation.html", text_navigation = text_navigation,api_key=api_key)