import sys

from flask import Flask, request, render_template
from pymets.metric.length_metric import web_length_metric

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'swc', 'txt'}


@app.route('/')
def hello(name=None):
    return render_template('webmets.html', name=name)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/geometry', methods=['POST'])
def geometry():
    gold_swc = request.form['gold_swc']
    test_swc = request.form['test_swc']
    method = request.form['method']
    rad_threshold = request.form['rad_threshold']
    len_threshold = request.form['len_threshold']

    recall, precision, swc_gold_str = web_length_metric(gold_swc=gold_swc,
                                                        test_swc=test_swc,
                                                        method=int(method),
                                                        rad_threshold=rad_threshold,
                                                        len_threshold=len_threshold)
    print(recall, precision)
    return render_template('webmets.html', recall=recall, precision=precision, )


if __name__ == "__main__":
    pass