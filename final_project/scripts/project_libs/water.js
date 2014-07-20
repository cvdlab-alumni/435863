function createWater(renderer,camera,scene,geometry) {
	/* Utilizzo uno shader da https://github.com/jbouny/ocean per realizzare dell'acqua */

	var waterNormals = new THREE.ImageUtils.loadTexture('images/textures/waternormals.jpg');
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 

	water = new THREE.Water(renderer, camera, scene, {
	  textureWidth: 256,
	  textureHeight: 256,
	  waterNormals: waterNormals,
	  alpha:  0.5,
	  sunColor: 0xffffff,
	  waterColor: 0x001e0f,
	  betaVersion: 0,
	  side: THREE.DoubleSide
	});

	var aMeshMirror = new THREE.Mesh(
	  geometry, 
	  water.material
	);
	aMeshMirror.add(water);
	aMeshMirror.rotation.x = - Math.PI * 0.5;

	var result = {};
	result.water = water;
	result.mesh = aMeshMirror;

	return result;
}