function createLivingroom(toIntersect, videoTexture) {

	var livingroom = new THREE.Object3D();

	/* Creo il divano */
	var sofa = createObjectFromObj('models/livingroom/Sofa.obj','models/livingroom/Sofa.mtl');
	sofa.position.set(4.5,1.95,0.2);
	sofa.scale.set(.013,.013,.013);
	sofa.rotation.set(Math.PI/2,-Math.PI/2,0);
	livingroom.add(sofa);

	/* Creo la poltrona */
	var armchair = createObjectFromObj('models/livingroom/Armchair.obj','models/livingroom/Armchair.mtl');
	armchair.position.set(2.5,3,0.07);
	armchair.scale.set(.016,.016,.016);
	armchair.rotation.set(Math.PI/2,0,0);
	livingroom.add(armchair);

	/* Creo il primo mobile */
	var livingFurniture1 = createObjectFromObj('models/livingroom/LivingFurniture1.obj','models/livingroom/LivingFurniture1.mtl');
	livingFurniture1.position.set(0.4,1.7,0.2);
	livingFurniture1.scale.set(.01,.01,.01);
	livingFurniture1.rotation.set(Math.PI/2,Math.PI/2,0);
	livingroom.add(livingFurniture1);

	/* Creo il secondo mobile */
	var livingFurniture2 = createObjectFromObj('models/livingroom/LivingFurniture2.obj','models/livingroom/LivingFurniture2.mtl');
	livingFurniture2.position.set(1.2,5.3,0.2);
	livingFurniture2.scale.set(.01,.01,.01);
	livingFurniture2.rotation.set(Math.PI/2,-Math.PI/2,0);
	livingroom.add(livingFurniture2);

	/* Creo il tavolo */
	var table = createObjectFromObj('models/livingroom/LivingTable.obj','models/livingroom/LivingTable.mtl');
	table.position.set(3.2,5.3,0.2);
	table.scale.set(.01,.01,.01);
	table.rotation.set(Math.PI/2,-Math.PI/2,0);
	livingroom.add(table);

	/* Creo la tv */
	var tv = createObjectFromObj('models/livingroom/TV.obj','models/livingroom/TV.mtl');


	/* Creo uno schermo in cui visualizzare il video */

    var screenGeometry = new THREE.PlaneGeometry(1.58, 0.8505);
	var screenMaterial = new THREE.MeshBasicMaterial({map:videoTexture});
	var tvScreen = new THREE.Mesh(screenGeometry,screenMaterial);
	tvScreen.position.set(0,0.08,0.1)
    tv.add(tvScreen);
    tvScreen.isOn = false;
    tvScreen.visible = false;
    video.pause(); // Metto in pausa il video in riproduzione

    tvScreen.interact = function() {
    	if (tvScreen.isOn) {
    		tvScreen.isOn = false;
    		video.pause();
    		tvScreen.visible = false;
    	} else {
    		tvScreen.isOn = true;
    		video.play();
    		tvScreen.visible = true;
    	}
    }
 
	tv.position.set(0.7,1.7,1.18);
	tv.scale.set(.5,.5,.5);
	tv.rotation.set(Math.PI/2,Math.PI/2,0);
	toIntersect.push(tvScreen);
	livingroom.add(tv);

	var picture = createPicture('images/textures/livingroom/LivingPicture.jpg');
	picture.position.set(3.2,6.55,1.7);
	picture.scale.set(.1,.1,.1);
	livingroom.add(picture);

	var picture2 = createPicture('images/textures/livingroom/LivingPicture2.jpg');
	picture2.rotation.z = -Math.PI/2;
	picture2.position.set(5.25,5.5,1.7);
	picture2.scale.set(.1,.1,.1);
	livingroom.add(picture2);

	return livingroom;

}

function createPicture(textureImage) {

    var bumpImage = 'images/textures/livingroom/Livingroom-Frame-Bump.png';

    var texture = THREE.ImageUtils.loadTexture(textureImage);
	var bump = THREE.ImageUtils.loadTexture(bumpImage);

    var pictureMat = new THREE.MeshPhongMaterial({
    		map: texture,
    		bumpMap: bump,
    		bumpScale: 0.3
    	});

    var pictureGeom = new THREE.BoxGeometry(8,.2,10);

    var picture = new THREE.Mesh(pictureGeom, pictureMat);

    return picture;
}