function createHouse(toIntersect,videoTexture,water,water2,mirrorCamera,sounds) {

	/* Questa funzione restituisce un unico oggetto contenente la casa */

	var house = new THREE.Object3D(); // Oggetto che voglio restituire


	/* Importo i muri */
	var walls = createObjectFromObj('models/Homework3.obj','models/Homework3.mtl',undefined,"images/textures/house/TextureCasaNormal.png");

	/* Importo i pavimenti */

	/* Creo un materiale per il pavimento */
	
	var basementMaterial = new THREE.MeshLambertMaterial()
	basementMaterial.side = THREE.DoubleSide;
  	var texture = THREE.ImageUtils.loadTexture('images/textures/house/parquet.jpg');
	basementMaterial.map = texture;
	basementMaterial.needsUpdate = true;
	basementMaterial.map.wrapS = THREE.RepeatWrapping;
  	basementMaterial.map.wrapT = THREE.RepeatWrapping;
  	basementMaterial.map.repeat.set(10, 10);
	
	var basement = createObjectFromObj('models/basement.obj',undefined,basementMaterial);

  	/* Scalo l'oggetto appena creato */
	scaleFact = .64;
	basement.scale.x=scaleFact;
	basement.scale.y=scaleFact;
	basement.scale.z=scaleFact;


	/* Importo le finestre della casa */
	var windows = createWindows(toIntersect);

	/* Costruisco le porte */
	var doors = createDoors(toIntersect, sounds);

	/* Costruisco il tetto */
	var roof = createRoof();

	/* Aggiungo le luci */
	var lights =  createLights(toIntersect);

	/* Arredo il bagno */
	var bathroom = createBathroom(mirrorCamera);

	/* Arredo la cucina */
	var kitchen = createKitchen(toIntersect,water,water2,sounds);

	/* Arredo il salotto */
	var livingroom = createLivingroom(toIntersect,videoTexture);

	/* Arredo la camera */
	var bedroom1 = createFirstBedroom();

	/* Arredo la cameretta */
	var bedroom2 = createSecondBedroom(toIntersect);


	house.add(walls);
	house.add(basement);
	house.add(windows);
	house.add(doors);
	house.add(roof);
	house.add(bathroom);
	house.add(kitchen);
	house.add(livingroom);
	house.add(bedroom1);
	house.add(bedroom2);
	house.add(lights);
	return house;
}


function createWindows(toIntersect) {

	var windows = new THREE.Object3D();

	/* Salotto */
	var livingRoomWindow1 = createDoubleWindow(0.85,0.1,1.50,1.9,0,1.85);
	toIntersect.push(livingRoomWindow1);
	windows.add(livingRoomWindow1);
	var livingRoomGlass = createSingleWindow(0.9,0.1,1.50,3.5,0,1.85,false);
	toIntersect.push(livingRoomGlass);
	windows.add(livingRoomGlass);
	var livingRoomWindow2 = createDoubleWindow(0.65,0.1,1.50,0,3.472,1.85);
	livingRoomWindow2.rotation.z = -Math.PI/2;
	toIntersect.push(livingRoomWindow2);
	windows.add(livingRoomWindow2);

	/* Prima camera da letto */
	var bedRoom1Window = createDoubleWindow(0.795,0.1,1.50,0,10.47,1.85);
	bedRoom1Window.rotation.z = -Math.PI/2;
	toIntersect.push(bedRoom1Window);
	windows.add(bedRoom1Window);

	/* Seconda camera da letto */
	var bedRoom2Window = createDoubleWindow(0.69,0.1,1.50,11.5,9.82,1.85);
	bedRoom2Window.rotation.z = Math.PI/2;
	toIntersect.push(bedRoom2Window);
	windows.add(bedRoom2Window);

	/* Cucina */
	var kitchenWindow = createSingleWindow(0.85,0.1,1.50,11.5,3.2,1.85,true);
	kitchenWindow.rotation.z = Math.PI/2;
	toIntersect.push(kitchenWindow);
	windows.add(kitchenWindow);

	/* Bagno */
	var bathroomWindow = createSingleWindow(0.85,0.1,1.50,11.5,5.55,1.85,true);
	bathroomWindow.rotation.z = Math.PI/2;
	toIntersect.push(bathroomWindow);
	windows.add(bathroomWindow);

	/* Ripostiglio */
	var closetWindow = createSingleWindow(0.55,0.1,1.50,6,12.1,1.85,true);
	closetWindow.rotation.z = Math.PI;
	toIntersect.push(closetWindow);
	windows.add(closetWindow);

	return windows;
}

function createDoors(toIntersect, sounds) {

	var doors = new THREE.Object3D();

	var mainDoor = createDoor(0.75,0.1,1.95,6,1.55,1.175,sounds);
	toIntersect.push(mainDoor);
	doors.add(mainDoor);

	var corridorDoor = createDoor(0.75,0.1,1.95,6,4.45,1.175,sounds);
	toIntersect.push(corridorDoor);
	doors.add(corridorDoor);

	var closetDoor = createDoor(0.75,0.1,1.95,6,8.55,1.175,sounds);
	toIntersect.push(closetDoor);
	doors.add(closetDoor);

	var kitchenDoor = createDoor(0.925,0.1,1.95,6.55,3.422,1.175,sounds);
	kitchenDoor.rotation.z = -Math.PI/2;
	toIntersect.push(kitchenDoor);
	doors.add(kitchenDoor);

	var bathroomDoor = createDoor(0.76,0.1,1.95,6.55,5.56,1.175,sounds);
	bathroomDoor.rotation.z = -Math.PI/2;
	toIntersect.push(bathroomDoor);
	doors.add(bathroomDoor);

	var bedroom1Door = createDoor(0.926,0.1,1.95,5.45,7.793,1.175,sounds);
	bedroom1Door.rotation.z = Math.PI/2;
	toIntersect.push(bedroom1Door);
	doors.add(bedroom1Door);

	var bedroom2Door = createDoor(0.926,0.1,1.95,6.55,7.794,1.175,sounds);
	bedroom2Door.rotation.z = -Math.PI/2;
	toIntersect.push(bedroom2Door);
	doors.add(bedroom2Door);

	return doors;

}

function createLights(toIntersect) {
	var lights = new THREE.Object3D();

	/* Creo la luce del salotto */
	var livingroomLamp = createCeilingLamp();	
	livingroomLamp.position.set(4,3.5,2.8);
	livingroomLamp.scale.set(.023,.023,.023);
	livingroomLamp.rotation.set(Math.PI/2,0,0);
	toIntersect.push(livingroomLamp);
	lights.add(livingroomLamp);

	/* Creo la luce della cucina */
	var kitchenLamp = createCeilingLamp();	
	kitchenLamp.position.set(9,3.5,2.8);
	kitchenLamp.scale.set(.023,.023,.023);
	kitchenLamp.rotation.set(Math.PI/2,0,0);
	toIntersect.push(kitchenLamp);
	lights.add(kitchenLamp);

	/* Creo la luce del bagno */
	var bathroomLamp = createCeilingLamp();	
	bathroomLamp.position.set(9,5.5,2.8);
	bathroomLamp.scale.set(.023,.023,.023);
	bathroomLamp.rotation.set(Math.PI/2,0,0);
	toIntersect.push(bathroomLamp);
	lights.add(bathroomLamp);

	/* Creo la luce della camera da letto */
	var bedroom1Lamp = createCeilingLamp();	
	bedroom1Lamp.position.set(3,9.5,2.8);
	bedroom1Lamp.scale.set(.023,.023,.023);
	bedroom1Lamp.rotation.set(Math.PI/2,0,0);
	toIntersect.push(bedroom1Lamp);
	lights.add(bedroom1Lamp);

	/* Creo la luce della cameretta */
	var bedroom2Lamp = createCeilingLamp();	
	bedroom2Lamp.position.set(9,9.5,2.8);
	bedroom2Lamp.scale.set(.023,.023,.023);
	bedroom2Lamp.rotation.set(Math.PI/2,0,0);
	toIntersect.push(bedroom2Lamp);
	lights.add(bedroom2Lamp);




	return lights;
}

