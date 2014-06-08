/* In questo script costruisco il mio oggetto lampada, in modo che possa essere importato nel progetto principale */
function create_lamp() {

	// Angoli di interesse per la lampada
	var alpha = 0.0;
	var beta = 0.26;
	var gamma = 1.0;
	var delta = 0.0;
	var epsilon = 1.0;


	var r_sphere = 2; //raggio della sfera

	var r_cylinder = r_sphere; //raggio del cilindro
	var h_cylinder = 10; // altezza del cilindro
	var h_cylinder2 = 8; // altezza del secondo cilindro

	var length_basement = 100;
	var width_basement = 120; // Dimensioni del piano di base

	var length_base = 12;
	var width_base = 14;
	var h_base = 1; // Dimensioni della base della lampada

	var r_bulbHolder = 6; // Raggio del portalampada

	var r_bulb = 1.5; // Raggio della lampadina

	var x_lamp = 0.47;
	var y_lamp = 0.47; // Posizione della lampada

	var pointLightIntensity = 10;
	var spotLightIntensity = 5; // Intensità delle luci


	var lamp_color = 0xCCCCCC; // Colore della lampada
	var spheres_color = 0x666666; // Colore dei giunti sferici
	var basement_color = 0xBF6430; // Colore del piano di base
	var bulb_color = 0xFFFF00;
	var light_color = 0xFFFF00; // Colore della luce;
	
	/* Funzione di utilità che costruisce un signolo braccio della lampada dati raggio e altezza del cilindro */
	function createArm(radius,height) {

		var sphereGeometry = new THREE.SphereGeometry(radius);
		var sphere = new THREE.Mesh(sphereGeometry,new THREE.MeshPhongMaterial({
			color: spheres_color
		}));

		sphere.receiveShadow = true;
		sphere.castShadow = true;

		//var cylinderGeometry = new THREE.CylinderGeometry(radius,radius,height);
		var cylinderGeometry = new THREE.CylinderGeometry(radius/3,radius/3,height+1.5);
		//var cylinder = new THREE.Mesh(cylinderGeometry,new THREE.MeshPhongMaterial({
		//	color: lamp_color
		//}));

		var cylinder1 = new THREE.Mesh(cylinderGeometry,new THREE.MeshPhongMaterial({
			color: lamp_color
		}));
		var cylinder2 = new THREE.Mesh(cylinderGeometry,new THREE.MeshPhongMaterial({
			color: lamp_color
		}));

		/*
		cylinder.rotation.x = Math.PI/2;
		cylinder.position.z = height/2 + r_sphere;
		cylinder.receiveShadow = true;
		cylinder.castShadow = true;
		*/

		cylinder1.rotation.x = Math.PI/2;
		cylinder1.position.z = (height)/2 + radius;
		cylinder1.position.x = -radius/3;
		cylinder1.receiveShadow = true;
		cylinder1.castShadow = true;

		cylinder2.rotation.x = Math.PI/2;
		cylinder2.position.z = (height)/2 + radius;
		cylinder2.position.x = radius/3;
		cylinder2.receiveShadow = true;
		cylinder2.castShadow = true;
	
		var arm = new THREE.Object3D();
		arm.add(sphere);
		//arm.add(cylinder);
		arm.add(cylinder1);
		arm.add(cylinder2);
		return arm;
	}

	/* Definisco un oggetto che contenga l'intera lampada */
	var lamp = new THREE.Object3D();

	// Costruisco la base della lampada

	var baseGeometry = new THREE.BoxGeometry(length_base,width_base,h_base);
	var base = new THREE.Mesh(baseGeometry, new THREE.MeshPhongMaterial({
		color : lamp_color
	}));
	base.position.z = -r_sphere;
	base.receiveShadow = true;
	base.castShadow = true;

	lamp.add(base);

	/* Costruisco il primo braccio */
	var arm = createArm(r_sphere,h_cylinder);
	var pivot = new THREE.Object3D();
	pivot.add(arm);
	pivot.position.set(0,0,0);
	lamp.add(pivot);
	pivot.rotation.z = alpha;
	pivot.rotation.x = beta;


	/* Costruisco il secondo braccio */
	var arm2 = createArm(r_sphere,h_cylinder2);
	var pivot2 = new THREE.Object3D();
	pivot2.add(arm2);
	pivot2.position.set(0,0, h_cylinder + r_sphere*2);
	pivot.add(pivot2);
	pivot2.rotation.z = delta;
	pivot2.rotation.x = gamma;

	/* Disegno il portalampada */
	var sphereGeometry = new THREE.SphereGeometry(r_sphere);
	var sphere3 = new THREE.Mesh(sphereGeometry, new THREE.MeshPhongMaterial({
		color : spheres_color
	}));
	sphere3.receiveShadow = true;
	sphere3.castShadow = true;

	var lampHolderGeometry = new THREE.SphereGeometry(r_bulbHolder,50,50,Math.PI,Math.PI);
	var lampHolder = new THREE.Mesh(lampHolderGeometry, new THREE.MeshPhongMaterial({
		color : spheres_color,
		side: THREE.DoubleSide
	}));

	lampHolder.receiveShadow = true;
	lampHolder.castShadow = true;

	pivot3 = new THREE.Object3D();
	pivot3.add(sphere3);
	pivot3.add(lampHolder);
	pivot3.position.set(0,0,h_cylinder2 + r_sphere*2);
	lampHolder.position.z+=r_bulbHolder + r_sphere/2;
	pivot3.rotation.x = epsilon;
	pivot2.add(pivot3);


	pivot3.add(sphere3);
	pivot3.add(lampHolder);


	/* Disegno la lampadina */
	var bulbGeometry = new THREE.SphereGeometry(r_bulb);
	var bulb = new THREE.Mesh(bulbGeometry, new THREE.MeshPhongMaterial({
		color : bulb_color
	})); 

	bulb.position.z+=r_sphere;

	pivot3.add(bulb);


	/* Aggiungo un target per la luce della lampadina.
	* L'idea è creare un Object3D che sia in asse con la lampadina stessa */

	var target = new THREE.Object3D();
	pivot3.add(target);
	target.position.z+=1000;

	/* Aggiungo la luce della lampadina */
	var spotLight = new THREE.SpotLight(light_color);
	spotLight.position.z = bulb.position.z - r_sphere/2 + 1;
	spotLight.target = target;
	spotLight.castShadow = true;
	spotLight.intensity = spotLightIntensity;
	spotLight.shadowCameraNear = 1;
	spotLight.position.z+=0;

	pivot3.add(spotLight);

	/* Aggiungo una pointLight per illuminare l'interno della lampada */
	var pointLight = new THREE.PointLight(light_color);
	pointLight.position.z = bulb.position.z + r_bulb + r_bulbHolder;
	pointLight.distance = 9;
	pointLight.intensity = pointLightIntensity;
	pivot3.add(pointLight);

	/* Mostro alcuni parametri verso l'esterno */
	lamp.alpha = alpha;
	lamp.beta = beta;
	lamp.gamma = gamma;
	lamp.delta = delta;
	lamp.epsilon = epsilon;

	lamp.spotLightIntensity = spotLightIntensity;
	lamp.pointLightIntensity = pointLightIntensity;

	lamp.length_base = length_base;
	lamp.width_base = width_base;
	lamp.height_base = h_base;
	lamp.r_sphere = r_sphere;

	lamp.pivot = pivot;
	lamp.pivot2 = pivot2;
	lamp.pivot3 = pivot3;

	lamp.spotLight = spotLight;
	lamp.pointLight = pointLight;

	return lamp;

}