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
  this.update();
  this.schedule(this.next.bind(this));
};

Loop.prototype.stop = function () {
  this.active = false;
};

Loop.prototype.update = function () {
};

function GameLoop(systems) {
  Loop.call(this, window.requestAnimationFrame.bind(window));
  this.systems = systems;
}


GameLoop.prototype = Object.create(Loop.prototype);

GameLoop.prototype.update = function () {
  this.systems.forEach(function (system) {
    system.update();
  });
};


function RenderingSystem(renderer, scene, camera) {
  this.update = renderer.render.bind(renderer, scene, camera);
}


function PhysicsSystem(world) {
    this.world = world;
}

PhysicsSystem.prototype.update = function () {
  var now = Date.now();
  if (this.last !== undefined) {
    this.world.step(1 / 60, (now - last) / 1000, 3);
  }
  this.last = now;
};


function Synchronizer(scene, world) {
  this.entities = [];
  this.scene = scene;
  this.world = world;
}

Synchronizer.prototype.add = function (mesh, body) {
  var entity = { mesh: mesh, body: body };
  this.scene.add(mesh);
  this.world.addBody(body);
  return this.remove.bind(this, entity);
};

Synchronizer.prototype.remove = function (entity) {
  this.dirty = true;
  entity.remove = true;
  this.scene.remove(entity.mesh);
  this.world.removeBody(entity.body);
};

Synchronizer.prototype.update = function () {
  if (this.dirty) {
    this.entities = this.
    this.dirty = false;
  }
  this.entities.forEach(function (entity) {
    entity.mesh.position.x = entity.body.position.x;
    entity.mesh.position.y = entity.body.position.y;
    entity.mesh.position.z = entity.body.position.z;
  });
};




function Colorizer(canvas, scene, camera) {
  this.raycaster = new THREE.Raycaster();
  this.canvas = canvas;
  this.scene = scene;
  this.camera = camera;
}

Colorizer.prototype.hover = function (event) {
  var x = event.pageX - this.canvas.offsetLeft;
  var y = event.pageY - this.canvas.offsetTop;
  var w = this.canvas.width;
  var h = this.canvas.height;
  var mouse = new THREE.Vector2(x / w * 2 - 1, -y / h * 2 + 1);
  var intersections;

  this.raycaster.setFromCamera(mouse, this.camera);
  intersections = this.raycaster.intersectObjects(this.scene.children);

  if (this.previous) {
    this.previous.material.color.setHex(0x00BB00);
    this.previous = undefined;
  }
  if (intersections.length > 0) {
    intersections[0].object.material.color.setHex(0xBB0000);
    this.previous = intersections[0].object;
  }
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

  //var world = new CANNON.World();

  var colorizer = new Colorizer(canvas, scene, camera);

  light.position.x = 5;
  light.position.y = 5;

  mesh.position.z = -10;

  scene.add(camera);
  scene.add(mesh);
  scene.add(light);

  renderer.setSize(canvas.width, canvas.height);

  canvas.onmousemove = colorizer.hover.bind(colorizer);

  new GameLoop([
    // new PhysicsSystem(world),
    // new Synchronizer(scene, world),
    new RenderingSystem(renderer, scene, camera)
  ]).start();
}

document.addEventListener('DOMContentLoaded', initialize);
