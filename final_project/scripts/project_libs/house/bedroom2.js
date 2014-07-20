function createSecondBedroom(toIntersect) {

	var bedroom = new THREE.Object3D();

	/* Creo il letto */
	var bed = createObjectFromObj('models/bedroom2/Bed2.obj','models/bedroom2/Bed2.mtl');
	bed.position.set(9,10.5,0.28);
	bed.scale.set(.1,.1,.1);
	bed.rotation.set(Math.PI/2,0,0);
	bedroom.add(bed);

	/* Creo la scrivania */
	var desktop = createObjectFromObj('models/bedroom2/Desktop.obj','models/bedroom2/Desktop.mtl');
	desktop.position.set(9,7.3,0.7);
	desktop.scale.set(.1,.1,.1);
	desktop.rotation.set(Math.PI/2,0,0);
	bedroom.add(desktop);

	/* Creo la libreria */
	var bookcase = createObjectFromObj('models/bedroom2/Bookcase.obj','models/bedroom2/Bookcase.mtl');
	bookcase.position.set(8,7.3,0.2);
	bookcase.scale.set(1,1,1);
	bookcase.rotation.set(Math.PI/2,Math.PI/2,0);
	bedroom.add(bookcase);

	/* Creo l'armadio */
	var cabinet = createObjectFromObj('models/bedroom1/Bedroom1Cabinet.obj','models/bedroom1/Bedroom1Cabinet.mtl');
	cabinet.position.set(7.2,10,0.2);
	cabinet.scale.set(6,6,6);
	cabinet.rotation.set(Math.PI/2,Math.PI,0);
	bedroom.add(cabinet);

	/* Creo la tastiera */
	var keyboard = createObjectFromObj('models/bedroom2/Keyboard.obj','models/bedroom2/Keyboard.mtl');
	keyboard.position.set(9.65,7.5,0.78);
	keyboard.scale.set(.1,.1,.1);
	keyboard.rotation.set(Math.PI/2,Math.PI,0);
	bedroom.add(keyboard);

	/* Creo il mouse */
	var mouse = createObjectFromObj('models/bedroom2/Mouse.obj','models/bedroom2/Mouse.mtl');
	mouse.position.set(9.7,7.3,0.95);
	mouse.scale.set(.04,.04,.04);
	mouse.rotation.set(Math.PI/2,Math.PI/2,0);
	bedroom.add(mouse);

	var monitor = createObjectFromObj('models/bedroom2/monitorLCD.obj','models/bedroom2/monitorLCD.mtl');
	/* Questo oggetto contiene la schermata del sito internet */
	var siteScreen = new THREE.Object3D();


	/* Creo lo schermo in cui visualizzare la pagina web*/

	var planeMaterial   = new THREE.MeshBasicMaterial({color: 0x000000, opacity: .1, side: THREE.DoubleSide });
	var planeWidth = 2*16/9;
	var planeHeight = 2;
	var planeGeometry = new THREE.PlaneGeometry( planeWidth, planeHeight );
	var planeMesh= new THREE.Mesh( planeGeometry, planeMaterial );


	// Creo una scena per contenere il sito
	cssScene = new THREE.Scene();
	// La pagina web è contenuta in un iframe
	var element = document.createElement('iframe')
	element.src = "http://www.dia.uniroma3.it/~paoluzzi/web/did/graficacomp/2014/index.html";
	var elementWidth = 1024;
	// forzo l'iframe ad avere le stesse dimensioni del piano
	var aspectRatio = planeHeight / planeWidth;
	var elementHeight = elementWidth * aspectRatio;
	element.style.width  = elementWidth + "px";
	element.style.height = elementHeight + "px";

	// create un CSS3Dobject per contenere l'elemento
	var cssObject = new THREE.CSS3DObject( element );
	// resize cssObject to same size as planeMesh (plus a border)
	var percentBorder = 0;
	cssObject.scale.y /= (1 + percentBorder) * (elementWidth / planeWidth);
	cssObject.scale.x /= (1 + percentBorder) * (elementHeight / planeHeight);
	
	cssScene.add(cssObject);

	siteScreen.add(cssScene);

	siteScreen.add(planeMesh);

	siteScreen.position.set(0,-0.228,-0.88);
	siteScreen.scale.set(.158,.187,.16);

	/* Adesso compio le trasformazioni sul monitor */
	monitor.add(siteScreen);
	monitor.position.set(10,8,1.42);
	monitor.scale.set(.8,.8,.8);
	monitor.rotation.set(Math.PI/2,Math.PI,0);
	bedroom.add(monitor);

	planeMesh.visible = false;

	var interactFunction = function() {
		if (pc.isOn) {

			pc.isOn = false;

	        /* Spengo il monitor */
			planeMesh.visible = false;
		} else {

			pc.isOn = true;
			
	        /* Accendo il monitor */
			planeMesh.visible = true;
		}
	}

	var pc = createObjectFromObj('models/bedroom2/PC.obj','models/bedroom2/PC.mtl',undefined,undefined,interactFunction);
	
	/* Applico una funzione per accendere e spegnere il pc */
	pc.isOn = false;

	/* Creo il pc */
	//pc.add(createObjectFromObj('models/bedroom2/PC.obj','models/bedroom2/PC.mtl',interactFunction));
	pc.position.set(9.8,7.4,0.36);
	pc.scale.set(.11,.11,.11);
	pc.rotation.set(Math.PI/2,Math.PI,0);
	bedroom.add(pc);
	toIntersect.push(pc);





	return bedroom;	
}