function createBathroom(mirrorCamera) {

	var bathroom = new THREE.Object3D();


	var bathroomTiles1 = createBathroomTiles(4,0.05,1.5,9,6.55,0.9,4,2,4,8);
	bathroom.add(bathroomTiles1);
	var bathroomTiles2 = createBathroomTiles(4,0.05,1.5,9,4.6,0.9,4,2,4,8);
	bathroom.add(bathroomTiles2);
	var bathroomTiles3 = createBathroomTiles(.5,1.1,1.5,11.2,6.5,0.9,0.5,2,1,1);
	bathroom.add(bathroomTiles3);
	var bathroomTiles4 = createBathroomTiles(.5,0.8,1.5,11.2,4.8,0.9,0.5,2,1,1);
	bathroom.add(bathroomTiles4);
	var bathroomTiles5 = createBathroomTiles(.5,1.1,1.5,6.8,6.47,0.9,0.5,2,1,1);
	bathroomTiles5.rotation.z = Math.PI;
	bathroom.add(bathroomTiles5);
	var bathroomTiles6 = createBathroomTiles(.5,0.8,1.5,6.8,4.84,0.9,0.5,2,1,1);
	bathroomTiles6.rotation.z = Math.PI;
	bathroom.add(bathroomTiles6);
	var bathroomTiles7 = createBathroomTiles(0.75,.5,1,11.2,5.573,.62,1,1,4,4);
	bathroomTiles7.rotation.z = Math.PI/2;
	bathroom.add(bathroomTiles7);

	/* Creo la doccia */
	var shower = createObjectFromObj('models/bathroom/Shower.obj','models/bathroom/Shower.mtl');
	shower.position.set(10.7,4.93,1.2);
	shower.scale.set(.05,.05,.05);
	shower.rotation.set(Math.PI/2,-Math.PI/2,0);
	bathroom.add(shower);

	/* Creo Il wc */
	var wc = createObjectFromObj('models/bathroom/wc.obj','models/bathroom/wc.mtl');
	wc.position.set(10.7,6.25,0.45);
	wc.scale.set(1,1,1);
	wc.rotation.set(Math.PI/2,0,0);
	bathroom.add(wc);

	/* Creo il mobile */
	var bathroomCabinet = createObjectFromObj('models/bathroom/BathroomCabinet.obj','models/bathroom/BathroomCabinet.mtl');
	bathroomCabinet.position.set(8.7,6.3,0.65);
	bathroomCabinet.scale.set(1,1,1);
	bathroomCabinet.rotation.set(Math.PI/2,0,0);
	bathroom.add(bathroomCabinet);

	/* Creo il ripiano sopra il lavandino */
	var rackBathroom = createObjectFromObj('models/bathroom/RackBathroom.obj','models/bathroom/RackBathroom.mtl');
	rackBathroom.position.set(8.7,6.53,1.3);
	rackBathroom.scale.set(.1,.1,.1);
	rackBathroom.rotation.set(Math.PI/2,0,0);
	bathroom.add(rackBathroom);

	/* Creo il bidet */
	var bidet = createObjectFromObj('models/bathroom/bidet.obj','models/bathroom/Bidet.mtl');
	bidet.position.set(10,6.5,0.2);
	bidet.scale.set(.001,.001,.001);
	bidet.rotation.set(Math.PI/2,0,0);
	bathroom.add(bidet);

	/* Creo il rotolo di carta igienica */
	var bathPaper = createObjectFromObj('models/bathroom/BathPaper.obj','models/bathroom/BathPaper.mtl');
	bathPaper.position.set(10.95,6.2,0.8);
	bathPaper.scale.set(.01,.01,.01);
	bathPaper.rotation.set(Math.PI/2,-Math.PI/2,0);
	bathroom.add(bathPaper);

	/* Creo lo spazzolino del bagno */
	var toiletBrush = createObjectFromObj('models/bathroom/ToiletBrush.obj','models/bathroom/ToiletBrush.mtl');
	toiletBrush.position.set(10.3,6.52,0.3);
	toiletBrush.scale.set(.01,.01,.01);
	toiletBrush.rotation.set(Math.PI/2,0,0);
	bathroom.add(toiletBrush);

	/* Creo la scarpiera */
	var bathFurniture = createObjectFromObj('models/bathroom/BathFurniture.obj','models/bathroom/BathFurniture.mtl');
	bathFurniture.position.set(9.3,4.65,0.2);
	bathFurniture.scale.set(.011,.011,.011);
	bathFurniture.rotation.set(Math.PI/2,Math.PI,0);
	bathroom.add(bathFurniture);

	/* Creo la lavatrice */
	var washingMachine = createObjectFromObj('models/bathroom/WashingMachine.obj','models/bathroom/WashingMachine.mtl');
	washingMachine.position.set(7.7,5.2,0.2);
	washingMachine.scale.set(.1,.1,.1);
	washingMachine.rotation.set(Math.PI/2,-Math.PI/2,0);
	bathroom.add(washingMachine);

	/* creo gli asciugamani */

	var bathroomTowels = createBathroomTowels();
	bathroomTowels.position.set(8,6.353,0.9);
	bathroomTowels.scale.set(.2,.2,.2);
	bathroomTowels.rotation.set(Math.PI/2,0,0);
	bathroom.add(bathroomTowels);

	var mirror = createMirror(mirrorCamera);
	mirror.position.set(8.7,6.52,1.4);
	bathroom.add(mirror);

	return bathroom;



}

createBathroomTiles = function(width,height,thickness,x,y,z,repeatx1,repeaty1,repeatx2,repeaty2) {

	/* Con questa funzione disegno una box Geometry sulla quale andranno le mattonelle */

	var textureFrameImage = 'images/textures/bathroom/BathroomTexture.jpg';

	var texture = THREE.ImageUtils.loadTexture(textureFrameImage);
	var texture2 = THREE.ImageUtils.loadTexture(textureFrameImage);

	var wallGeometry = new THREE.BoxGeometry(width,height,thickness);
	wallGeometry.computeVertexNormals();

	var wallMaterial = new THREE.MeshPhongMaterial();
	wallMaterial.map = texture;

	wallMaterial.map.wrapS = THREE.RepeatWrapping;
	wallMaterial.map.wrapT = THREE.RepeatWrapping;

	wallMaterial.map.repeat.set(repeatx1, repeaty1);

	var wallMaterial2 = new THREE.MeshPhongMaterial();
	wallMaterial2.map = texture2;

	wallMaterial2.map.wrapS = THREE.RepeatWrapping;
	wallMaterial2.map.wrapT = THREE.RepeatWrapping;

	wallMaterial2.map.repeat.set(repeatx2, repeaty2);

	/* Costruisco il faceMaterial */
	var mats = [];
	mats.push(wallMaterial);
	mats.push(wallMaterial2);
	mats.push(wallMaterial);
	mats.push(wallMaterial);
	mats.push(wallMaterial);
	mats.push(wallMaterial);

	var faceMaterial = new THREE.MeshFaceMaterial(mats);

	var wall = new THREE.Mesh(wallGeometry,faceMaterial);

	wall.position.x = x;
	wall.position.y = y;
	wall.position.z = z;

	return wall;

}

createBathroomTowels  = function () {

	var loader = new THREE.OBJLoader();
	var towels = new THREE.Object3D();

	loader.load('models/bathroom/BathroomTowels.obj', function (mesh) {

        var textureImage = 'images/textures/bathroom/bathTowel1.jpg';
        var textureImage2 = 'images/textures/house/holderTexture.jpg';        
        var bumpImage = 'images/textures/bathroom/bathTowel1Bump.jpg';

		var texture = THREE.ImageUtils.loadTexture(textureImage);
		var texture2 = THREE.ImageUtils.loadTexture(textureImage2);
		var bump = THREE.ImageUtils.loadTexture(bumpImage);

        var towel1 = mesh.children[0];
        towel1Mat = new THREE.MeshPhongMaterial({
        	color: 0x000000,
        	emissive: 0x4F5B97,
        	shininess: 0,
    		map: texture,
    		bumpMap: bump,
    		bumpScale: 0.52
    	});

    	towel1.material = towel1Mat;

    	var towel2 = mesh.children[1];
        towel2Mat = new THREE.MeshPhongMaterial({
        	color: 0x000000,
        	emissive: 0xE6EF76,
        	shininess: 0,
    		map: texture,
    		bumpMap: bump,
    		bumpScale: 0.52
    	});

    	towel2.material = towel2Mat;

    	var holder = mesh.children[2];
        holderMat = new THREE.MeshPhongMaterial({
        	color: 0xFFFFFF,
        	emissive: 0x000000,
        	shininess: 2.46,
    		map: texture2
    	});

    	holder.material = holderMat;

		towels.add(mesh);

      });

	return towels;
}

createMirror = function(mirrorCamera) {
	/* Con questa funzione creo uno  specchio */

	var material = new THREE.MeshLambertMaterial({color:0xffffff})

	var mirrorMaterial = new THREE.MeshPhongMaterial({
		shininess: 200,
		color: 0xffffff,
		//specular: 0x999999,
		envMap: mirrorCamera.renderTarget
	});

	/* Costruisco il faceMaterial */
	var mats = [];
	mats.push(material);
	mats.push(material);
	mats.push(material);
	mats.push(mirrorMaterial);
	mats.push(material);
	mats.push(material);

	var faceMaterial = new THREE.MeshFaceMaterial(mats);


	var mirrorGeometry = new THREE.BoxGeometry(.9,.01,.45);

	var mirror = new THREE.Object3D();

	mirror.add(new THREE.Mesh(mirrorGeometry,faceMaterial));

	return mirror;

}
