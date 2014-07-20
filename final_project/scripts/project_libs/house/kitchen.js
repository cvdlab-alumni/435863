function createKitchen(toIntersect,water,water2,sounds) {

	var kitchen = new THREE.Object3D();

	var kitchenTiles1 = createkitchenTiles(4,0.05,1.5,9,4.4,0.9,4,4,4,4);
	kitchen.add(kitchenTiles1);
	var kitchenTiles2 = createkitchenTiles(4,0.05,1.5,9,2,0.9,4,4,4,4);
	kitchen.add(kitchenTiles2);
	var kitchenTiles3 = createkitchenTiles(0.5,0.9,1.5,11.2,4,0.9,0.5,4,1.5,3);
	kitchen.add(kitchenTiles3);
	var kitchenTiles4 = createkitchenTiles(0.5,.9,1.5,11.2,2.4,0.9,0.5,4,1.5,3);
	kitchen.add(kitchenTiles4);
	var kitchenTiles5 = createkitchenTiles(0.5,.6,1.5,6.8,4.16,0.9,0.5,4,1.5,2);
	kitchenTiles5.rotation.z = Math.PI;
	kitchen.add(kitchenTiles5);
	var kitchenTiles6 = createkitchenTiles(.5,1.1,1.5,6.8,2.43,0.9,0.5,4,1.5,3);
	kitchenTiles6.rotation.z = Math.PI;
	kitchen.add(kitchenTiles6);
	var kitchenTiles7 = createkitchenTiles(0.7,.5,1,11.2,3.2,.62,0.75,3,4,4);
	kitchenTiles7.rotation.z = Math.PI/2;
	kitchen.add(kitchenTiles7);

	/* Creo il rubinetto del lavandino */

	var interact = function() {
		if(sink.waterOpen) {
			sink.waterOpen = false;
			sound.stop();
			water2.visible = false;

			var closeWaterTween = new TWEEN.Tween(water.position)
	        .to({y: -5}, 2000)
	        .easing(TWEEN.Easing.Linear.None)
	        .start();
		} else {

			sink.waterOpen = true;
			sound.play();
			water2.visible = true;

			var openWaterTween = new TWEEN.Tween(water.position)
	        .to({y: 3}, 2000)
	        .easing(TWEEN.Easing.Linear.None)
	        .start();

		}
		
	}


	var sink = createObjectFromObj('models/kitchen/KitchenSink.obj','models/kitchen/KitchenSink.mtl',undefined,undefined,interact);
	sink.position.set(7.885,2.279,0.842);
	sink.scale.set(.023,.023,.023);
	sink.rotation.set(Math.PI/2,-Math.PI/2,0);
	sink.waterOpen = false;
	var sound = createSinkSound(sink.position);
	sounds.push(sound);


	/* Aggiungo l'acqua del lavandino */
	water.position.set(0,-5,0);
	water.scale.set(1,1,1);
	sink.add(water);
	water.interact = interact;
	toIntersect.push(water);

	water2.position.set(-0.75,4.64,0.5);
	water2.scale.set(1,1,1);
	water2.rotation.set(0,Math.PI/2,0);
	sink.add(water2);
	water2.visible = false;
	water2.interact = interact;
	toIntersect.push(water2);

	toIntersect.push(sink);
	kitchen.add(sink);


	/* Creo il mobile */
	var kitchenCabinet = createObjectFromObj('models/kitchen/KitchenCabinet.obj','models/kitchen/KitchenCabinet.mtl');
	kitchenCabinet.position.set(8.35,2.24,0);
	kitchenCabinet.scale.set(.023,.023,.023);
	kitchenCabinet.rotation.set(Math.PI/2,-Math.PI/2,0);
	kitchen.add(kitchenCabinet);

	/* Creo il forno a microonde */
	var microwave = createObjectFromObj('models/kitchen/Microwave.obj','models/kitchen/Microwave.mtl');
	microwave.position.set(8.57,3.8,0.35);
	microwave.scale.set(.01,.01,.01);
	microwave.rotation.set(Math.PI/2,-Math.PI,0);
	kitchen.add(microwave);

	/* Creo il frigorifero */
	var fridge = createObjectFromObj('models/kitchen/Refrigerator.obj','models/kitchen/Refrigerator.mtl');
	fridge.position.set(10.5,2.2,1.2);
	fridge.scale.set(.15,.15,.15);
	fridge.rotation.set(Math.PI/2,-Math.PI,0);
	kitchen.add(fridge);

	/* Creo il tavolo */
	var table = createObjectFromObj('models/kitchen/KitchenTable.obj','models/kitchen/KitchenTable.mtl');
	table.position.set(8.5,3.45,0.2);
	table.scale.set(.023,.023,.023);
	table.rotation.set(Math.PI/2,-Math.PI,0);
	kitchen.add(table);

	return kitchen;
}




createkitchenTiles = function(width,height,thickness,x,y,z,repeatx1,repeaty1,repeatx2,repeaty2) {

	/* Con questa funzione disegno una box Geometry sulla quale andranno le mattonelle */

	var textureFrameImage = 'images/textures/kitchen/KitchenTiles.jpg';

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