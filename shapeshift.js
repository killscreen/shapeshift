function initialize() {
  var canvas = document.getElementById('main');
  var w = canvas.width, h = canvas.height;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  var camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100000);
  var scene = new THREE.Scene();

  var material = new THREE.MeshLambertMaterial({ color: 0x0000DD });
  var geometry = new THREE.SphereGeometry(2, 12, 12);
  var mesh = new THREE.Mesh(geometry, material);
  var light = new THREE.PointLight(0xFFFFFF);

  light.position.x = 5;
  light.position.y = 5;

  mesh.position.z = -10;

  scene.add(camera);
  scene.add(mesh);
  scene.add(light);

  renderer.setSize(canvas.width, canvas.height);
  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', initialize);
