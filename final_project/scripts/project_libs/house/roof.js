function drawShape1() {

  var shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.lineTo(5.5, 0);
  shape.lineTo(5.5, 2);
  shape.lineTo(0, 0);

  return shape;
}

function drawShape2() {

  var shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.lineTo(6, 0);
  shape.lineTo(0, 1.5);
  shape.lineTo(0, 0);

  return shape;
}

function createMesh(geom) {

  var meshMaterial = new THREE.MeshLambertMaterial();
  var mesh = new THREE.Mesh(geom, meshMaterial);

  return mesh;
}

function createRoof() {

  var options1 = {
    amount: 12.067,
    bevelThickness: 0,
    bevelSize: 0,
    bevelSegments: 1,
    bevelEnabled: false,
    curveSegments: 1,
    steps: 1
  };

  var options2 = {
    amount: 10.567,
    bevelThickness: 0,
    bevelSize: 0,
    bevelSegments: 1,
    bevelEnabled: false,
    curveSegments: 1,
    steps: 1
  };

  var roof = new THREE.Object3D();

  var material1 = new THREE.MeshLambertMaterial({color:0xffffff});

  var texture = THREE.ImageUtils.loadTexture("images/textures/house/roofTexture.jpg");
  var normal = THREE.ImageUtils.loadTexture("images/textures/house/roofTextureNormal.jpg");

  var tileMaterial = new THREE.MeshPhongMaterial({map:texture, normalMap: normal});
  tileMaterial.normalScale.set(3,3);
  tileMaterial.normalMap.wrapS = THREE.RepeatWrapping;
  tileMaterial.normalMap.wrapT = THREE.RepeatWrapping;
  tileMaterial.normalMap.repeat.set(0.2, 0.2);

  tileMaterial.map.wrapS = THREE.RepeatWrapping;
  tileMaterial.map.wrapT = THREE.RepeatWrapping;
  tileMaterial.map.repeat.set(0.2, 0.2);

  var geometry = new THREE.ExtrudeGeometry(drawShape1(), options1);

  var materials = [material1, tileMaterial];

  var roofMaterial = new THREE.MeshFaceMaterial(materials);

  var shape1 = new THREE.Mesh(geometry, roofMaterial);
  shape1.rotation.x = Math.PI/2;

  shape1.geometry.faces[6].materialIndex = 1;
  shape1.geometry.faces[7].materialIndex = 1;

  shape1.position.set(0,12.067,2.8);

  var geometry2 = new THREE.ExtrudeGeometry(drawShape2(), options2);

  var shape2 = new THREE.Mesh(geometry2, roofMaterial);
  shape2.rotation.x = Math.PI/2;

  shape2.geometry.faces[4].materialIndex = 1;
  shape2.geometry.faces[5].materialIndex = 1;


  shape2.position.set(5.5,12.067,2.8);

  roof.add(shape1);
  roof.add(shape2);

  return roof;
}