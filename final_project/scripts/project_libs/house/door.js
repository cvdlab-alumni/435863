createDoor = function(width,height,thickness,x,y,z,sounds) {
	/* Utilizzo questo script per creare un modello della porta ed animarlo */

	/* Per prima cosa devo creare il telaio della porta */

	var frame1_width = 0.1;
	var frame2_thickness = 0.1;

	/* Definisco il telaio della porta con la relativa texture */

	var frame1Geom = new THREE.BoxGeometry(frame1_width,height,thickness);
	var frame2Geom = new THREE.BoxGeometry(width-2*frame1_width,height,frame2_thickness);

	var textureFrameImage = 'images/textures/house/frameDoor.jpg';

	frame1Geom.computeVertexNormals();

	var texture = THREE.ImageUtils.loadTexture(textureFrameImage);
	var frame1Material = new THREE.MeshPhongMaterial();
	frame1Material.map = texture;


	var frame1 = new THREE.Mesh(frame1Geom, frame1Material);

	var frame2 = new THREE.Mesh(frame2Geom, frame1Material);

	var frame3 = new THREE.Mesh(frame1Geom, frame1Material);

    frame1.castShadow = true;
    frame1.receiveShadow = true;

    frame2.castShadow = true;
    frame2.receiveShadow = true;

    frame3.castShadow = true;
    frame3.receiveShadow = true;

	var doorGeometry = new THREE.BoxGeometry(width-frame1_width*2,height/2,thickness-frame2_thickness);


	/* Definisco la porta con la relativa texture */
	var imageFile = 'images/textures/house/mainDoor.JPG';
	var imageFile2 = 'images/textures/house/mainDoor2.JPG';
	var normal1 = THREE.ImageUtils.loadTexture("images/textures/house/mainDoorNormal.png");
	var normal2 = THREE.ImageUtils.loadTexture("images/textures/house/mainDoor2Normal.png");

	doorGeometry.computeVertexNormals();

	var texture = THREE.ImageUtils.loadTexture(imageFile);
	var doorMaterial1 = new THREE.MeshPhongMaterial();
	doorMaterial1.map = texture;
	doorMaterial1.normalMap = normal1;
	doorMaterial1.normalScale.set(3,3);

	var texture2 = THREE.ImageUtils.loadTexture(imageFile2);
	var doorMaterial2 = new THREE.MeshPhongMaterial();
	doorMaterial2.map = texture2;
	doorMaterial2.normalMap = normal2;
	doorMaterial2.normalScale.set(3,3);

	/* Costruisco il faceMaterial per la porta (così inserisco la giusta texture per il retro) */

	var mats = [];
	mats.push(doorMaterial1);
	mats.push(doorMaterial1);
	mats.push(doorMaterial2);
	mats.push(doorMaterial2);
	mats.push(doorMaterial1);
	mats.push(doorMaterial1);

	var faceMaterial = new THREE.MeshFaceMaterial(mats);


	var door = new THREE.Mesh(doorGeometry,faceMaterial);

    door.castShadow = true;
    door.receiveShadow = true;
    door.geometry.computeFaceNormals();

	var object = new THREE.Object3D();
	/* Creo un perno intorno al quale la porta può girare */
	var pivot = new THREE.Object3D();
	object.add(frame1);
	object.add(frame2);
	object.add(frame3);
	pivot.add(door);
	object.add(pivot);

	object.position.x = x;
	object.position.y = y;
	object.position.z = z;

	pivot.position.x= -width/2 + frame1_width;
	pivot.position.z= - thickness/2 + frame2_thickness/2;

	frame1.position.x -= width/2 - frame1_width/2;
	frame1.position.y -= 0.01;
	frame2.position.z += thickness/2 - frame2_thickness/2;
	frame2.position.y -= 0.01;
	frame3.position.x += width/2 - frame1_width/2;
	frame3.position.y -= 0.01;

	door.position.x= width/2 - frame1_width;
	door.position.z = thickness/2 - frame2_thickness;

	/* Applico una funzione per aprire la porta */
	object.isOpen = false;
	var sound = createDoorSound(object.position);
	sounds.push(sound);

	interactFunction = function() {
		if (object.isOpen) {
			object.isOpen = false;
	        sound.play();

	        /* Chiudo la porta */
			var doorCloseTween = new TWEEN.Tween(pivot.rotation)
	        .to({z: 0}, 2000)
	        .easing(TWEEN.Easing.Linear.None)
	        .start();

		} else {

			object.isOpen = true;
			sound.play();

	        /* Apro la porta */
			var doorOpenTween = new TWEEN.Tween(pivot.rotation)
	        .to({z: Math.PI/2}, 2000)
	        .easing(TWEEN.Easing.Linear.None)
	        .start();
		}
	}

	applyInteract(object,interactFunction);

	return object;




}