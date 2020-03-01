/* global sharkViewer */
let s = null;
let gold_swc = null
let test_swc = null

let mdata;
function readGoldSwcFile(e) {
 const f = e.target.files[0];
  if (f) {
    const r = new FileReader();
    r.onload = (e2) => {
      const swcTxt = e2.target.result;
      gold_swc = sharkViewer.swcParser(swcTxt);
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
      const swcTxt = e2.target.result;
      test_swc = sharkViewer.swcParser(swcTxt);
      if (Object.keys(gold_swc).length > 0) {
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
