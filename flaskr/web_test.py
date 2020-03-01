from flask import Flask, escape, url_for, request, render_template
app = Flask(__name__)


@app.route('/')
def hello(name=None):
    return render_template('index.html', name=name)

