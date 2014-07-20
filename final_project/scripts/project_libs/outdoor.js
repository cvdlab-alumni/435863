function createSkybox(dim) {
	/* Questa funzione crea e restituisce una skybox per rappresentare l'orizzonte */
	var imagePrefix = "images/textures/skybox/skybox-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.BoxGeometry( dim, dim, dim );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++) {
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide,
			fog: false
		}));
	}
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	return skyBox;
}


function createNightDayCycle() {
	/* Questa funzione utilizza la libreria threex.daynight per realizzare un ciclo giorno/notte.
	 * In particolare verranno restituiti tutti gli oggetti da aggiungere alla scena */

	/* Il codice che segue è rielaborato da https://github.com/jeromeetienne/threex.daynight/blob/master/examples/basic.html */


	var onRenderFcts= []; // Questo array contiene le funzioni che andranno aggiornate all'interno del renderer

	var result = {onRenderFcts: onRenderFcts}; // Oggetto che contiene i valori da restituire

	var sunAngle = Math.PI/4;
	result.sunAngle = sunAngle;
	onRenderFcts.push(function(step){
		sunAngle+= step
	});

	// Cielo stellato
	var starField = new THREEx.DayNight.StarField();
	starField.object3d.material.fog = false;
	onRenderFcts.push(starField.update);

	result.starField = starField.object3d;

	// Sole
	var sunSphere = new THREEx.DayNight.SunSphere();
	onRenderFcts.push(sunSphere.update);

	result.sunSphere = sunSphere.object3d;

	// Directional Light per simulare il sole
	var sunLight = new THREEx.DayNight.SunLight();
	onRenderFcts.push(sunLight.update);

	result.sunLight = sunLight.object3d;


	/* Aggiungo una flare light per rendere più realistico il sole */
	var textureFlare0 = THREE.ImageUtils.loadTexture("images/textures/lensflare0.png");
    var flareColor = new THREE.Color(0xffaacc);
    var lensFlare = new THREE.LensFlare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);
    lensFlare.update = function() {
    	lensFlare.position = result.sunSphere.position;
    }
    onRenderFcts.push(lensFlare.update);

    result.lensFlare = lensFlare;


	return result;

}

function createGround(groundDimension) {
	/* Questa funzione crea il terreno su cui poggia l'abitazione sfruttando la libreria threex.grass */
	var result =  new THREE.Object3D();

	// Creo il piano con l'erba
	var textureUrl	= 'images/textures/ground/grasslight-small.jpg';
	var normalUrl = 'images/textures/ground/grasslight-smallNormal.png';
	var texture	= THREE.ImageUtils.loadTexture(textureUrl);
 	var normal = THREE.ImageUtils.loadTexture(normalUrl);

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.x = 10;
	texture.repeat.y = 10;

	normal.wrapS = THREE.RepeatWrapping;
	normal.wrapT = THREE.RepeatWrapping;
	normal.repeat.x = 10;
	normal.repeat.y = 10;
	//normal.normalScale.set(3,3);

	var groundGeometry = new THREE.BoxGeometry(groundDimension, groundDimension,2.4);
	var groundMaterial = new THREE.MeshPhongMaterial({
		map	: texture,
		normalMap: normal,
		emissive: 'green',
		side: THREE.DoubleSide
	});
	var ground	= new THREE.Mesh(groundGeometry, groundMaterial);
	return ground;


}