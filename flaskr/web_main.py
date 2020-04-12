import sys,json
import shutil
from flask import Flask, request, render_template, jsonify, send_from_directory
from pymets.metric.length_metric import web_length_metric
from pymets.metric.diadem_metric import web_diadem_metric
import time,os
app = Flask(__name__)

ALLOWED_EXTENSIONS = {'swc', 'txt'}
SCRIPT_ROOT = "D:\gitProject\mine\WebMets"

@app.route('/')
def hello():
    return render_template('main.html')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/geometry', methods=['POST'])
def geometry():
    gold_swc = request.form.get('gold_txt')
    test_swc = request.form.get('test_txt')
    method = request.form.get('method')
    rad_threshold = request.form.get('rad_threshold')
    len_threshold = request.form.get('len_threshold')
    result = web_length_metric(gold_swc=gold_swc,
                               test_swc=test_swc,
                               method=int(method),
                               rad_threshold=rad_threshold,
                               len_threshold=len_threshold)
    # result['gold_swc'] = adjust_radius_work(result['gold_swc'], 0.1)
    # result['test_swc'] = adjust_radius_work(result['test_swc'], 0.1)
    return jsonify(result=result)


@app.route('/topology', methods=['POST'])
def topology():
    gold_swc = request.form.get('gold_txt')
    test_swc = request.form.get('test_txt')

    config = {
        'weight_mode': int(request.form.get('weight_mode')),
        'remove_spur': int(request.form.get('remove_spur')),
        'count_excess_nodes': request.form.get('count_excess_nodes'),
        "align_tree_by_root": request.form.get('align_tree_by_root'),
        'list_miss': request.form.get('list_miss'),
        'list_distant_matches': request.form.get('list_distant_matches'),
        'list_continuations': request.form.get('list_continuations'),
        'find_proper_root': request.form.get('find_proper_root'),
    }

    result = web_diadem_metric(gold_swc, test_swc, config)
    # result['gold_swc'] = adjust_radius_work(result['gold_swc'], 0.1)
    # result['test_swc'] = adjust_radius_work(result['test_swc'], 0.1)

    return jsonify(result=result)


@app.route('/adjust_radius', methods=['POST'])
def adjust_radius():
    gold_swc = request.form.get('gold_txt')
    test_swc = request.form.get('test_txt')
    vertical_swc = request.form.get('vertical_txt')

    radius_mul = float(request.form.get('radius_mul'))

    new_gold_swc = adjust_radius_work(gold_swc, radius_mul)
    new_test_swc = adjust_radius_work(test_swc, radius_mul)
    print(vertical_swc)
    new_vertical_swc = adjust_radius_work(vertical_swc, radius_mul)

    result = {
        'gold_swc': new_gold_swc,
        'test_swc': new_test_swc,
        'vertical_swc': new_vertical_swc
    }
    return jsonify(result=result)


def adjust_radius_work(swc_text, rate):
    swc_text = swc_text.split("\n")
    new_swc = []

    for line in swc_text:
        if len(line) == 0 or line[0] == '#':
            continue
        words = line.split(" ")
        if len(words) == 0:
            continue
        words[5] = str(float(words[5]) * rate)
        new_line = " ".join(words)
        new_swc.append(new_line)

    new_gold_swc = "\n".join(new_swc)
    return new_gold_swc


@app.route('/save', methods=['GET', 'POST'])
def save():
    time_pre = time.strftime("%Y_%m_%d_%H_%M_%S", time.localtime())
    file_path = os.path.join('flaskr', os.path.join(r'data', time_pre))
    os.mkdir(file_path)

    fname_gold = "gold.swc"
    fname_test = "test.swc"
    fname_extra = "extra.txt"

    gold_swc = request.form.get('gold_txt')
    test_swc = request.form.get('test_txt')
    recall = request.form.get('recall')
    precision = request.form.get('precision')

    with open(os.path.join(file_path, fname_gold), 'w+') as f:
        f.write(gold_swc)
    with open(os.path.join(file_path, fname_test), 'w+') as f:
        f.write(test_swc)
    with open(os.path.join(file_path, fname_extra), 'w+') as f:
        f.write('# recall\n{}\n# precision\n{}\n'.format(
            recall, precision
        ))
    shutil.make_archive(base_name=file_path, format='zip', root_dir=file_path)
    shutil.rmtree(file_path)
    return jsonify(result={
        'state': True,
        'path': os.path.join('flaskr', 'data'),
        'name': time_pre+'.zip'
    })


@app.route('/download', methods=['GET'])
def download():
    path = request.args.get('path')
    name = request.args.get('name')
    return send_from_directory(os.path.join(SCRIPT_ROOT, path),
                               filename=name, as_attachment=True)


@app.route('/zip_delete', methods=['POST'])
def zip_delete():
    path = request.form.get('path')
    name = request.form.get('name')
    print(os.path.join(path, name))
    try:
        os.remove(os.path.join(path, name))
        return jsonify(result={"status": True})
    except Exception:
        return jsonify(result={"status": False})


if __name__ == "__main__":
    file_name = time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime())
    print(file_name)
    pass