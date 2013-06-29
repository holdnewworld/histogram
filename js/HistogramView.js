function HistogramView(model, container){
  this.model = model;
  this.container = container;

  this.squareGeometry = new THREE.CubeGeometry(1, 0.001, 1, 1, 1, 1);
  this.barGeometry = new THREE.CubeGeometry(0.5, 1, 0.5, 1, 1, 1);
  this.wireframeMaterial = new THREE.MeshBasicMaterial({color: 0x999999, wireframe: true})
  this.base = new THREE.Object3D();
  this.height = 3;
  this.cameraRotation = 0;

  this._initializeWebGL();
  this._initialize();
}

HistogramView.prototype = {
  _initializeWebGL: function(){
    var self = this;
    var renderer = new THREE.WebGLRenderer({antialias: true});
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); 
    var scene = new THREE.Scene();
    var light = new THREE.DirectionalLight(0xFFFFFF);
    var ambient = new THREE.AmbientLight(0x444444);
    var time = undefined;

    renderer.setSize(window.innerWidth, window.innerHeight); 
    this.container.appendChild(renderer.domElement);

    light.position.set(10, 10, 5);
    scene.add(light);
    scene.add(ambient);

    camera.position.z = 7; 
    camera.position.y = 7; 
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.cameraFrame = new THREE.Object3D();
    this.cameraFrame.add(camera);
    scene.add(this.cameraFrame);

    scene.add(this.base);
    render();

    function render(delta){
      var now = new Date().getTime();
      var dt = now - (time || now);
      time = now;

      if(self.cameraRotation){
        self.cameraFrame.rotation.y += dt * (self.cameraRotation / 5000);
        self.cameraRotation = 0;
      }

      requestAnimationFrame(render); 
      renderer.render(scene, camera); 
    }
  },

  _initialize: function(){
    var xs = this.model.getSizeX();
    var zs = this.model.getSizeZ();
    var materials = [];

    for(var i = 0; i < zs; i++){
      var color = this._randomColor();
      materials.push(new THREE.MeshPhongMaterial({color: color, ambient: color, transparent:true, opacity: 0.95}));
      this._createYLabel(i, new THREE.MeshBasicMaterial({color: color}));
    }

    for(var i = 0; i < xs; i++){
      for(var j = 0; j < zs; j++){
        var square = new THREE.Mesh(this.squareGeometry, this.wireframeMaterial);

        square.position.x = i;
        square.position.z = -j;
        this.base.add(square);

        var bar = new THREE.Mesh(this.barGeometry, materials[j]);
        var h = this.model.getNormalizedYValue(i, j) * this.height;
        bar.scale.y = h;
        bar.position.y = h/2;
        square.add(bar);
      }

      this._createXLabel(i);
    }

    this.base.position.x = -this.model.getSizeX()/2 + 0.5;
    this.base.position.z = this.model.getSizeZ()/2 - 0.5;
  },

  _createXLabel: function(i){
    var textSize = 0.15;
    var text3d = new THREE.TextGeometry(this.model.getXLabel(i), {
      size: textSize,
      height: 0.001,
      font: "helvetiker"
    });

    var text = new THREE.Mesh(text3d, new THREE.MeshBasicMaterial({color: 0x000000}));
    var textFrame = new THREE.Object3D();

    text.rotation.x = -Math.PI/2;
    text.updateMatrix()
    textFrame.add(text);
    text3d.computeBoundingBox();

    textFrame.rotation.y = Math.PI/2;
    textFrame.position.x = textSize/2 + i;
    textFrame.position.z = text3d.boundingBox.max.x - text3d.boundingBox.min.x + 0.75;
    this.base.add(textFrame);
  },

  _createYLabel: function(i, material){
    var textSize = 0.25;
    var text3d = new THREE.TextGeometry(this.model.getZLabel(i), {
      size: textSize,
      height: 0.001,
      font: "helvetiker"
    });

    var text = new THREE.Mesh(text3d, material);
    var textFrame = new THREE.Object3D();

    text.rotation.x = -Math.PI/2;
    text.updateMatrix()
    textFrame.add(text);
    text3d.computeBoundingBox();

    textFrame.position.x = -text3d.boundingBox.max.x + text3d.boundingBox.min.x - 0.75;
    textFrame.position.z = -i;
    this.base.add(textFrame);
  },

  _randomColor: function(){
    return Math.random() * 0xffffff;
  },

  rotateCamera: function(offset){
    this.cameraRotation += offset;
  }
};
