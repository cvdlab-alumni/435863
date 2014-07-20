function createCeilingLamp() {

	var ceilingLamp = new THREE.Object3D();

	/* Aggiungo la luce della lampadina */
	var spotLight = new THREE.SpotLight(0xffffff);
	/* Aggiungo un target per la spotlight */
	var target = new THREE.Object3D();
	ceilingLamp.add(target);
	target.position.y-=1000;

	spotLight.target = target;
	spotLight.intensity = 0;

	ceilingLamp.add(spotLight);

	/* Aggiungo una pointLight per illuminare l'interno della lampada */
	var pointLight = new THREE.PointLight(0xffff00);
	pointLight.position.y = -4;
	pointLight.distance = 3;
	pointLight.intensity = 0;
	ceilingLamp.add(pointLight);

	/* Applico una funzione per accendere e spegnere la luce */
	ceilingLamp.isOn = false;

	interactFunction = function() {

		if (ceilingLamp.isOn) {

			ceilingLamp.isOn = false;

	        /* Spengo la luce */

			spotLight.intensity = 0;
			pointLight.intensity = 0;
		} else {

			ceilingLamp.isOn = true;
			
	        /* Accendo la luce */

			spotLight.intensity = 5.5;
			pointLight.intensity = 50;
		}
	}

	ceilingLamp.add(createObjectFromObj('models/ceilingLamp.obj','models/ceilingLamp.mtl',undefined,undefined,interactFunction));

	return ceilingLamp;
}