/* global sharkViewer */
let s = null;
let gold_swc = null;
let test_swc = null;

let gold_txt = null;
let test_txt = null;

let method = 2;
let rad_threshold = 'default'
let len_threshold = 'default'

let mdata;
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
  // const swc2 = sharkViewer.swcParser(document.getElementById("swc2").text);
  // s.loadNeuron('swc2', '#ff0000', swc2);
  s.loadNeuron('swc', null, swc);
  s.render();
};

function do_post_ch_method(to, p){
    var myForm = document.createElement("form");
    myForm.method = "post";
    myForm.action = to;

    var gold_swc_input = document.createElement("input");
    var text_swc_input = document.createElement("input");
    var method_input = document.createElement("input");
    var rad_threshold_input = document.createElement("input");
    var len_threshold_input = document.createElement("input");
    if (gold_txt != null) {
        gold_txt = gold_txt.replace(/[;]/g," ");
        gold_txt = gold_txt.replace(/[\n\r]/g,";");
    }
    if (test_txt != null) {
        test_txt = test_txt.replace(/[;]/g," ");
        test_txt = test_txt.replace(/[\n\r]/g,";")
    }

    gold_swc_input.setAttribute("name", "gold_swc");
    gold_swc_input.setAttribute("value", gold_txt);
    text_swc_input.setAttribute("name", "test_swc");
    text_swc_input.setAttribute("value", test_txt);

    if (p == "geometry"){
        method_input.setAttribute("name", "method");
        method_input.setAttribute("value", method);
        rad_threshold_input.setAttribute("name", "rad_threshold");
        rad_threshold_input.setAttribute("value", rad_threshold);
        len_threshold_input.setAttribute("name", "len_threshold");
        len_threshold_input.setAttribute("value", len_threshold);
    }

    myForm.appendChild(gold_swc_input);
    myForm.appendChild(text_swc_input);
    myForm.appendChild(method_input);
    myForm.appendChild(rad_threshold_input);
    myForm.appendChild(len_threshold_input);

    document.body.appendChild(myForm);
    myForm.submit();
    document.body.removeChild(myForm);
}
