/* global sharkViewer */
let s = null;
let gold_swc = null;
let test_swc = null;

let gold_txt = null;
let test_txt = null;
let vertical_txt = null;

let method = 2;
let rad_threshold = -1;
let len_threshold = 0.2;

let mdata;
let is_gold_show = true;
let is_test_show = true;
let is_vertical_show = true;
let glob_recall= 0.0;
let glob_precision = 0.0;

function readGoldSwcFile(e) {
 const f = e.target.files[0];
  if (f) {
    const r = new FileReader();
    r.onload = (e2) => {
      gold_txt = e2.target.result;
      gold_swc = sharkViewer.swcParser(gold_txt);
      if (Object.keys(gold_swc).length > 0) {
        s.unloadNeuron('gold');
        s.loadNeuron('gold', null, gold_swc);
        s.render();
      } else {
        alert("Please upload a valid swc file.");
      }
    };
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function readTestSwcFile(e) {
 const f = e.target.files[0];
  if (f) {
    const r = new FileReader();
    r.onload = (e2) => {
      test_txt = e2.target.result;
      test_swc = sharkViewer.swcParser(test_txt);
      if (Object.keys(test_swc).length > 0) {
        s.unloadNeuron('test');
        s.loadNeuron('test', null, test_swc);
        s.render();
      } else {
        alert("Please upload a valid swc file.");
      }
    };
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function readObjFile(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const objText = event.target.result;
      s.loadCompartment('foo', '#ff0000', objText);
      s.render();
    };
    reader.readAsText(file);
  }
}

window.onload = () => {
  document
    .getElementById("swc_input")
    .addEventListener("change", readGoldSwcFile, false);
  document
    .getElementById("test_input")
    .addEventListener("change", readTestSwcFile, false);
  const swc = sharkViewer.swcParser(document.getElementById("swc").text);
  mdata = JSON.parse(document.getElementById("metadata_swc").text);
  s = new sharkViewer.default({
    animated: false,
    mode: 'particle',
    dom_element: document.getElementById('container'),
    metadata: mdata,
    showAxes: 0,
    show_cones:false,
    maxVolumeSize: 5000,
    cameraChangeCallback: (data) => { console.log(data) }
  });
  window.s = s;
  s.init();
  s.animate();
  s.render();
};


function getLi(text) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    var node = document.createTextNode(text);

    a.appendChild(node);
    li.appendChild(a);
    return li;
}

// geometry
$(function() {
$('#geometry').bind('click', function() {
  $.post(
    $SCRIPT_ROOT + '/geometry',
    {gold_txt: gold_txt,
     test_txt: test_txt,
     method: method,
     rad_threshold: rad_threshold,
     len_threshold: len_threshold
    },
    function(result) {
        var gold_swc_res = result.result.gold_swc;
        var test_swc_res = result.result.test_swc;
        var vertical_res = result.result.vertical_swc;

        glob_recall = result.result.recall;
        glob_precision = result.result.precision;

        if (Object.keys(gold_swc).length > 0 && Object.keys(test_swc).length > 0) {
            gold_txt = gold_swc_res;
            test_txt = test_swc_res;
            vertical_txt = vertical_res;
            var item = document.getElementById("radiusRate");
            item.value = 0.1;
            adjust_radius(item);

            var len_res = document.getElementById("lengthThreshold");
            var rad_res = document.getElementById("radiusThreshold");
            len_res.value = 0.2;
            rad_res.value = -1.0;
       }
    },
    "json"
    );
});
});

// topology
$(function() {
$('#topology').bind('click', function() {
  $.post(
    $SCRIPT_ROOT + '/topology',
    {gold_txt: gold_txt,
     test_txt: test_txt,
     weight_mode: 1,
     remove_spur: 0,
     count_excess_nodes:true,
     align_tree_by_root:false,
     find_proper_root:true,
     list_miss:true,
     list_distant_matches: true,
     list_continuations: true
    },
    function(result) {
        var gold_swc_res = result.result.gold_swc;
        var test_swc_res = result.result.test_swc;
        var weight_sum = result.result.weight_sum;
        var score_sum = result.result.score_sum;
        var final_score = result.result.final_score;

        if (Object.keys(gold_swc).length > 0 && Object.keys(test_swc).length > 0) {
            gold_txt = gold_swc_res;
            test_txt = test_swc_res;

            var item = document.getElementById("radiusRate");
            item.value = 0.1;
            adjust_radius(item)
       }
       else {
            alert("wrong")
       }
    },
    "json"
    );
});
});

function lenTrhCh(newLen) {
    new_len_threshold = parseFloat(newLen.value);
    $.post(
    $SCRIPT_ROOT + '/geometry',
    {gold_txt: gold_txt,
     test_txt: test_txt,
     method: method,
     rad_threshold: rad_threshold,
     len_threshold: new_len_threshold
    },
    function(result) {
        var gold_swc_res = result.result.gold_swc;
        var test_swc_res = result.result.test_swc;
        var vertical_res = result.result.vertical_swc;

        var recall = result.result.recall;
        var precision = result.result.recall;

        if (Object.keys(gold_swc).length > 0 && Object.keys(test_swc).length > 0) {
            gold_txt = gold_swc_res;
            test_txt = test_swc_res;
            vertical_txt = vertical_res;

            var item = document.getElementById("radiusRate");
            item.value = 0.1;
            adjust_radius(item);
       }
    },
    "json"
    );
};

function radTrhCh(newRad) {
    new_rad_threshold = parseFloat(newRad.value);
    rad_method = document.getElementById("radiusMethod").value;
    if (rad_method == 'relative') {
        new_rad_threshold = -new_rad_threshold;
        alert("rel");
    }

    $.post(
    $SCRIPT_ROOT + '/geometry',
    {gold_txt: gold_txt,
     test_txt: test_txt,
     method: method,
     rad_threshold: new_rad_threshold,
     len_threshold: len_threshold
    },
    function(result) {
        var gold_swc_res = result.result.gold_swc;
        var test_swc_res = result.result.test_swc;
        var vertical_res = result.result.vertical_swc;

        var recall = result.result.recall;
        var precision = result.result.recall;

        if (Object.keys(gold_swc).length > 0 && Object.keys(test_swc).length > 0) {
            gold_txt = gold_swc_res;
            test_txt = test_swc_res;
            vertical_txt = vertical_res;

            var item = document.getElementById("radiusRate");
            item.value = 0.1;
            adjust_radius(item)
       }
    },
    "json"
    );
}

function switch_display(item) {
    if (item.id == "gold_display") {
        swc_file = gold_swc;
        if (is_gold_show) {
            is_gold_show = false;
            s.setNeuronVisible("gold", false);
            s.render();
            item.src = "/static/img/icon/view_off.png"
        }
        else {
            is_gold_show = true;
            s.setNeuronVisible("gold", true);
            s.render();
            item.src = "/static/img/icon/view.png"
        }
    }
    else if (item.id == "vertical_display") {
        if (is_vertical_show) {
            is_vertical_show = false;
            s.setNeuronVisible("vertical", false);
            s.render()
            item.src = "/static/img/icon/view_off.png"
        }
        else {
            is_vertical_show = true;
            s.setNeuronVisible("vertical", true);
            s.render();
            item.src = "/static/img/icon/view.png"
        }
    }
    else {
        swc_file = test_swc;
        if (is_test_show) {
            is_test_show = false;
            s.setNeuronVisible("test", false);
            s.render();
            item.src = "/static/img/icon/view_off.png"
        }
        else {
            is_test_show = true;
            s.setNeuronVisible("test", true);
            s.render();
            item.src = "/static/img/icon/view.png"
        }
    }
}

function adjust_radius(item) {
    radius_mul = item.value;
    $.post(
    $SCRIPT_ROOT + '/adjust_radius',
    {gold_txt: gold_txt,
     test_txt: test_txt,
     vertical_txt: vertical_txt,
     radius_mul: radius_mul,
    },
    function(result) {
        var gold_swc_res = result.result.gold_swc;
        var test_swc_res = result.result.test_swc;
        var vertical_res = result.result.vertical_swc;

        let tmp_gold_swc = sharkViewer.swcParser(gold_swc_res);
        let tmp_test_swc = sharkViewer.swcParser(test_swc_res);
        let tmp_vertical_swc = sharkViewer.swcParser(vertical_res);

        if (Object.keys(tmp_gold_swc).length > 0) {
            s.unloadNeuron('gold');
            s.loadNeuron('gold', null, tmp_gold_swc);
        }
        if (Object.keys(tmp_test_swc).length > 0) {
            s.unloadNeuron('test')
            s.loadNeuron('test', null, tmp_test_swc);
        }
        s.unloadNeuron('vertical')
        if (Object.keys(tmp_vertical_swc).length > 0) {
            s.loadNeuron('vertical', null, tmp_vertical_swc)
        }
        s.render();
    },
    "json"
    );
}

// topology
$(function() {
$('#save').bind('click', function() {
  $.post(
    $SCRIPT_ROOT + '/save',
    {gold_txt: gold_txt,
     test_txt: test_txt,
     recall: glob_recall,
     precision: glob_precision
    },
    function(result) {
        if (result.result.state == true) {
            try{
                var link = document.createElement('a');
                link.href = $SCRIPT_ROOT + '/download' + '?name=' + result.result.name + '&path=' + result.result.path;
                link.click();
                alert("successfully saved");
            }
            catch (error) {
                alert("save error!");
            }
            $.post(
                $SCRIPT_ROOT + '/zip_delete',
                {name: result.result.name,
                 path: result.result.path
                },null,'json'
            );
        }
        else {
            alert("error");
        }
    },
    "json"
    );
});
});