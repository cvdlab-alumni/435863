/* In questo script costruisco l'animazione per la mia scena nel parametro vengono immessi la scena e gli oggetti
* che non si vogliono visualizzare durante l'animazione */
function create_animation(scene,toHide) {

	var initialAlpha = 2 * Math.PI;
	var initialBeta = 0;
	var initialGamma = 0.7;
	var initialDelta = 1;
	var initialEpsilon = Math.PI/2;

	var textColor = 0xFF0000;

	// Per prima cosa creo la mia lampada
	var lamp = create_lamp();

	/* Ruoto la lampada */
	lamp.pivot.rotation.z = initialAlpha;
	lamp.pivot.rotation.x = initialBeta;
	lamp.pivot2.rotation.x = initialGamma;
	lamp.pivot2.rotation.z = initialDelta;
	lamp.pivot3.rotation.x = initialEpsilon;


	lamp.position.y = 80;



	scene.add(lamp);

	/* Creo le scritte sullo schermo */		

	var options = {
		size: 30,
		height: 4,
		weight: "normal",
		font: "helvetiker",
		bevelThickness: .2,
		bevelSize: 0.1,
		bevelSegments: 3,
		bevelEnabled: true,
		curveSegments: 24,
		steps: 1
	};



	/* Aggiungo il testo (costruisco la stringa con caratteri separati per poter usufruire delle animazioni) */

	cvdGeom = new THREE.TextGeometry("cvd",options);

	textCVD = new THREE.Mesh(cvdGeom, new THREE.MeshPhongMaterial({
		color : textColor
	}));

	textCVD.receiveShadow = true;
	textCVD.castShadow = true;

	lGeom = new THREE.TextGeometry("l",options);

	textL = new THREE.Mesh(lGeom, new THREE.MeshPhongMaterial({
		color : textColor
	}));

	textL.castShadow = true;
	textL.receiveShadow = true;
	textL.position.x = 73;

	abGeom = new THREE.TextGeometry("ab",options);

	textAB = new THREE.Mesh(abGeom, new THREE.MeshPhongMaterial({
		color : textColor
	}));

	textAB.castShadow = true;
	textAB.receiveShadow = true;
	textAB.position.x = 83;

	text = new THREE.Object3D();
	text.add(textCVD);
	text.add(textL);
	text.add(textAB);

	text.rotation.x = Math.PI/2;
	text.rotation.y = -Math.PI/2;
	text.position.y = 60;
	text.position.x = 20;
	text.position.z = -lamp.height_base - 1.2;
	scene.add(text);


	var options2 = {
		size: 10,
		height: 1,
		weight: "normal",
		font: "helvetiker",
		bevelThickness: .2,
		bevelSize: 0.1,
		bevelSegments: 3,
		bevelEnabled: true,
		curveSegments: 24,
		steps: 1
	};


	/* Costruisco una seconda stringa */
	text2Geom = new THREE.TextGeometry("presents",options2);
	text2 = new THREE.Mesh(text2Geom, new THREE.MeshPhongMaterial({
		color:textColor,
	}));

	text2.rotation.x = Math.PI/2;
	text2.rotation.y = -Math.PI/2;
	text2.position.y = 3000;
	text2.position.x = -30;

	text2.castShadow = true;
	text2.receiveShadow = true;
	scene.add(text);


	scene.add(text2);

	/* Unisco gli oggetti da rimuovere al termine dell'animazione */
	var toRemove =  new THREE.Object3D();
	toRemove.add(text);
	toRemove.add(text2);
	toRemove.add(lamp);
	scene.add(toRemove);



	// Definisco le animazioni utilizzando i KeyFrames
	var animator = null;
 	var duration = 16; // sec
 	var loopAnimation = false;



 	function buildAnimations() {

 		jumpLength = 20;
		jumpHeight = 10; // Dimensioni del salto della lampada

		var lampX = lamp.position.x;
		var lampY = lamp.position.y;
		var lampZ = lamp.position.z; // Memorizzo la posizione iniziale della lampada

		pos = toHide.position.y;

		animator = new KF.KeyFrameAnimator();
		animator.init({
			interps:
			[
			/* Primo salto */
			{
				keys:[0,.0625,.065, 0.125],
				values:[
				{ z : lampZ, y: lampY},
				{ z : lampZ + jumpHeight, y : lampY - jumpLength},
				{ z : lampZ + jumpHeight, y : lampY - jumpLength - 0.2 },
				{ z : lampZ, y: lampY - 2 * jumpLength},
				],
				target: lamp.position
			},
			/* Ruoto la lampada durante il primo salto */
			{
				keys:[0,.04,.0625,.066, 0.125],
				values:[
				{x: initialBeta + 0.2},
				{x: initialBeta + 0.4},
				{x: initialBeta + 0.1},
				{x: initialBeta - 0.1},
				{x: initialBeta},
				],
				target: lamp.pivot.rotation
			},
			/* Secondo salto */
			{
				keys:[0.15,0.1875,0.19, 0.25],
				values:[
				{ z : lampZ, y: lampY - 2 * jumpLength},
				{ z : lampZ + jumpHeight, y : lampY - 3 * jumpLength},
				{ z : lampZ + jumpHeight, y : lampY - 3 * jumpLength - 0.2 },
				{ z : lampZ, y: lampY - 4 * jumpLength},
				],
				target: lamp.position
			},
			/* Ruoto la lampada durante il secondo salto */
			{
				keys:[0.14,0.17,0.20, 0.25],
				values:[
				{x: initialBeta + 0.1},
				{x: initialBeta + 0.4},
				{x: initialBeta + 0.2},
				{x: initialBeta - 0.2},
				{x: initialBeta},
				],
				target: lamp.pivot.rotation
			},
			/* Salto sulla lettera */
			{
				keys:[0.4,0.41,0.42,0.53,0.531,0.54,0.57,0.571,0.58,0.61,0.611,0.62],
				values:[
				{ z : lampZ + 7, y: lampY - 4 * jumpLength - 4 , x:12},
				{ z : lampZ + 15, y: lampY - 4 * jumpLength - 8 , x:15},
				{ z : lampZ + 30, y : lampY - 4 * jumpLength - 16, x:17},

				{ z : lampZ + 38, y : lampY - 4 * jumpLength - 16, x:17},
				{ z : lampZ + 38, y : lampY - 4 * jumpLength - 16, x:17},
				{ z : lampZ + 28, y : lampY - 4 * jumpLength - 16, x:17},

				{ z : lampZ + 38, y : lampY - 4 * jumpLength - 16, x:17},
				{ z : lampZ + 38, y : lampY - 4 * jumpLength - 16, x:17},
				{ z : lampZ + 18, y : lampY - 4 * jumpLength - 16, x:17},

				{ z : lampZ + 30, y : lampY - 4 * jumpLength - 16, x:17},
				{ z : lampZ + 30, y : lampY - 4 * jumpLength - 16, x:17},
				{ z : lampZ, y : lampY - 4 * jumpLength - 16, x:17},
				],
				target: lamp.position
			},
			/* Abbasso la lettera sulla quale sta saltando la lampada */
			{
				keys:[0.54,0.57,0.58,0.596,0.61,0.62],
				values:[
				{ y : .65},
				{ y : .65},
				{ y : .65},
				{ y : .55},
				{ y : .55},
				{ y : 0},
				],
				target: textL.scale
			},
			/* Giro la lampada */
			{
				keys:[0.62,0.7,0.8],
				values:[
				{ z : 6, x: 0},
				{ z : 4.5, x: 0},
				{ z : 3.5, x: 0.1},
				],
				target: lamp.pivot.rotation
			},
			{
				keys:[0.62,0.7,0.8],
				values:[
				{ z : 1, x: 0.7},
				{ z : 1, x: 0.36},
				{ z : 1, x: 0.3},
				],
				target: lamp.pivot2.rotation
			},
			{
				keys:[0.62,0.7,0.8],
				values:[
				{ z : 1, x: 0.7},
				{ z : 1, x: 0.4},
				{ z : 1, x: 0.3},
				],
				target: lamp.pivot2.rotation
			},
			/* Creo l'animazione per la seconda scritta */
			{
				keys:[0.85,0.86,0.88],
				values:[
				{ y : 60},
				{ y : 45},
				{ y : 30},
				],
				target: text2.position
			},
			/* Rimuovo gli oggetti dalla scena */
			{
				keys:[1],
				values:[
				{ y : 60000},
				],
				target: toRemove.position
			},
			/* Muovo gli oggetti che voglio nascondere durante l'animazione */
			{
				keys:[0],
				values:[
				{ y : 6000},
				],
				target: toHide.position
			},
			{
				keys:[1],
				values:[
				{ y : pos},
				],
				target: toHide.position
			},
			],
			loop: loopAnimation,
			duration: duration * 1000,
			easing: TWEEN.Easing.Linear.None
		});
}
buildAnimations();
return animator;

}