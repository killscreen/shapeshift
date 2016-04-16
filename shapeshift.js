function Loop(schedule) {
  this.schedule = schedule;
  this.active = false;
}

Loop.prototype.start = function () {
  if (this.active) return;
  this.active = true;
  this.next();
};

Loop.prototype.next = function () {
  if (!this.active) return;
  this.body();
  this.schedule(this.next.bind(this));
};

Loop.prototype.stop = function () {
  this.active = false;
}


function RenderingLoop(renderer, scene, camera) {
  Loop.call(this, window.requestAnimationFrame.bind(window));
  this.renderer = renderer;
  this.scene = scene;
  this.camera = camera;
}

RenderingLoop.prototype = Object.create(Loop.prototype);

RenderingLoop.prototype.body = function () {
  this.renderer.render(this.scene, this.camera);
};


function PhysicsLoop(mesh) {
  Loop.call(this, function (callback) {
    window.setTimeout(callback, 15);
  });
  this.mesh = mesh;
}

PhysicsLoop.prototype = Object.create(Loop.prototype);

PhysicsLoop.prototype.body = function () {
  this.mesh.position.x = Math.sin(Date.now() / 1000);
};

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

  new RenderingLoop(renderer, scene, camera).start();
  new PhysicsLoop(mesh).start();
}

document.addEventListener('DOMContentLoaded', initialize);
