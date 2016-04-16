function initialize() {
  var canvas = document.getElementById('main');
  var w = canvas.width, h = canvas.height;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  var camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100000);
  var scene = new THREE.Scene();

  scene.add(camera);
  renderer.setSize(canvas.width, canvas.height);
}

document.addEventListener('DOMContentLoaded', initialize);
