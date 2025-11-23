"""
app.py

アプリ実行時の入り口として使用される
flaskでは、アプリの実行時にapp.pyを探してアプリを実行する
"""

from . import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug = True)