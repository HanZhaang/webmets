from flask import Flask, escape, url_for, request, render_template
app = Flask(__name__)


@app.route('/')
def hello(name=None):
    return render_template('webmets.html', name=name)


def valid_login(username, password):
    return True


@app.route('/login', methods=['POST', 'GET'])
def login():
    error = None
    if request.method == 'POST':
        if valid_login(request.form['username'],
                       request.form['password']):
            print("YES")
        else:
            error = 'Invalid username/password'
    # the code below is executed if the request method
    # was GET or the credentials were invalid
    return render_template('flexStudy', error=error)