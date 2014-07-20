$(function () {

  /* Per prima cosa inizializzo le variabili utilizzate nel resto del progetto */

  var pointerNavigationEnabled = false; // Abilito o disabilito il pointer lock
  var showRoof = true; // Mostro o nascondo il tetto
  var enableMirror = false; // Abilito o disabilito lo specchio
  var updateTrackballControl = true; // Abilito o disabilito il trackball control
  var enableDayNightCycle = false; // Abilito o disabilito il ciclo giorno/notte

  // Coordinate della camera
  var camera_x = 120;
  var camera_y = 150;
  var camera_z = 200;

  var houseScaleFactor = 15; // Fattore di scala per la casa

  var dayDurationSec = 60; // Durata della giornata

  var skyboxDim = 1500; // Dimensione del lato della skybox
  var fogDensity = 0.001; // Densità della nebbia

  // Colori
  var fogColor = 0xafd1ff; // Colore della nebbia


  var toIntersect = []; // Qui memorizzo gli oggetti di cui voglio fare il picking
  var sounds = []; // Qui memorizzo i suoni da aggiornare

  window.addEventListener( 'resize', onWindowResize, false ); // Gestisco il resize della pagina
  var stats = initStats(); // Inizializzo le statistiche



  /*****************************************************************************/
  /************************** CAMERA RENDERER E SCENA **************************/
  /*****************************************************************************/


  /* Creo la scena */
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(fogColor , fogDensity); // Aggiungo la nebbia

  /* Creo due camere, una principale e una per lo specchio */
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 4000);
  camera.position.set(camera_x,camera_y,camera_z);
  camera.up.set( 0, 1, 0 );
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var mirrorCamera = new THREE.CubeCamera( 0.1, 100, 512 );
  mirrorCamera.position.set(130,20,-97);
  scene.add(mirrorCamera);

  /* Creo il renderer principale */
  var webGLRenderer = new THREE.WebGLRenderer({alpha: true, antialias:true});
  webGLRenderer.shadowMapEnabled = false;
  webGLRenderer.setClearColor(new THREE.Color(0xeeeeee, 1.0));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  $('body').append(webGLRenderer.domElement);



  /* Creo un secondo renderer (sarà utile per visualizzare una pagina internet) */ 

  rendererCSS = new THREE.CSS3DRenderer();
  rendererCSS.setSize( window.innerWidth, window.innerHeight );
  rendererCSS.domElement.style.position = 'absolute';
  rendererCSS.domElement.style.top    = 0;
  rendererCSS.domElement.style.margin   = 0;
  rendererCSS.domElement.style.padding  = 0;
  document.body.appendChild( rendererCSS.domElement );

  webGLRenderer.domElement.style.position = 'absolute';
  webGLRenderer.domElement.style.top      = 0;
  // Il WebGLRenderer deve apparire sopra il css renderer
  webGLRenderer.domElement.style.zIndex   = 1;
  rendererCSS.domElement.appendChild( webGLRenderer.domElement );

  /* Aggiungo una hemisphere light per rendere la scena più realistica */
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
  scene.add( hemiLight );




  /*****************************************************************************/
  /**************************** GESTIONE DEL VIDEO *****************************/
  /*****************************************************************************/

  /* Creo la texture per il video della televisione */

  var $video = $('#video');
  $video.hide();
  var video = $video[0];
  
  var videoTexture = new THREE.Texture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;
  videoTexture.generateMipmaps = false;

  // Inizializzo gli strumenti per il motion detection

  var monitor = document.getElementById( 'monitor' );
  var videoCanvas = document.getElementById( 'videoCanvas' );
  var videoContext = videoCanvas.getContext( '2d' );
  
  var layer2Canvas = document.getElementById( 'layer2' );
  var layer2Context = layer2Canvas.getContext( '2d' );
  
  var blendCanvas  = document.getElementById( "blendCanvas" );
  var blendContext = blendCanvas.getContext('2d');

  var lastImageData;

  initMotionDetection();
  var buttons = videoSetup(videoContext);


  /*****************************************************************************/
  /**************************** CREAZIONE DELL'ACQUA ***************************/
  /*****************************************************************************/

  // Creo l'acqua da mostrare all'interno della casa (la creo qui perchè servono renderer, camera e scena)

  function drawEllipse(centerX,centerY,width,height) {

    var shape = new THREE.Shape();

    shape.moveTo(centerX, centerY - height/2); // A1
  
    shape.bezierCurveTo(
      centerX + width/2, centerY - height/2, // C1
      centerX + width/2, centerY + height/2, // C2
      centerX, centerY + height/2); // A2

    shape.bezierCurveTo(
      centerX - width/2, centerY + height/2, // C3
      centerX - width/2, centerY - height/2, // C4
      centerX, centerY - height/2); // A1

    return shape

  }

  var waterGeometry = new THREE.ShapeGeometry(drawEllipse(0,0,24,24.5));

  objWaterSink = createWater(webGLRenderer,camera,scene,waterGeometry);

  /* Creo il cilindro di acqua che esce dal lavandino */
  var waterGeometry2 = new THREE.CylinderGeometry(0.25,0.25,15);
  objWaterSink2 = createWater(webGLRenderer,camera,scene,waterGeometry2);

  /*****************************************************************************/
  /**************************** CREAZIONE DELLA CASA ***************************/
  /*****************************************************************************/

  var house = createHouse(toIntersect,videoTexture,objWaterSink.mesh,objWaterSink2.mesh,mirrorCamera,sounds);

  house.scale.set(houseScaleFactor,houseScaleFactor,houseScaleFactor);

  /* Riscalo anche le posizioni dei suoni e le traslo */
  for(var i = 0; i<sounds.length; i++) {
    sounds[i].position.x = sounds[i].position.x * houseScaleFactor;
    var temp = sounds[i].position.y * houseScaleFactor;
    sounds[i].position.y = sounds[i].position.z * houseScaleFactor;
    sounds[i].position.z = - temp;
  }

  house.rotation.x = - Math.PI/2;

  scene.add(house);


  /*****************************************************************************/
  /********************************** ESTERNI **********************************/
  /*****************************************************************************/

  // Orizzonte
  var skybox = createSkybox(skyboxDim);
  scene.add(skybox);

  //terreno
  var ground = createGround(skyboxDim);
  ground.rotation.x = Math.PI/2;
  scene.add(ground);

  // Ciclo notte/giorno
  var step;

  var nightDayCycle = createNightDayCycle();
  starField = nightDayCycle.starField;
  starField.scale.set(14,14,14);
  starField.material.opacity = 0.9;
  starField.material.transparent = true;
  scene.add(nightDayCycle.starField);

  var sunSphere = nightDayCycle.sunSphere;
  sunSphere.scale.set(0.5,0.5,0.5);
  sunSphere.position.y += 200;
  scene.add(nightDayCycle.sunSphere);
  scene.add(nightDayCycle.sunLight);

  var lensFlare =  nightDayCycle.lensFlare;
  scene.add(lensFlare);

  
  /*****************************************************************************/
  /************************************ GUI ************************************/
  /*****************************************************************************/

  /* Creo la gui */
  var gui = createGui(pointerNavigationEnabled, showRoof, enableMirror, updateTrackballControl, enableDayNightCycle, dayDurationSec, fogDensity);
  // Porto la gui in primo piano
  gui.domElement.style.zIndex = 1;
  var ray = new THREE.Raycaster();
  ray.ray.direction.set( 0, -1, 0 );

  

  /*****************************************************************************/
  /********************************** UTILITA' *********************************/
  /*****************************************************************************/

  var trackballControls = new THREE.TrackballControls(camera);
  var controls;
 
  axisHelper = new THREE.AxisHelper();
  scene.add(axisHelper);

  /* Gestisco il picking degli oggetti */
  var projector = new THREE.Projector();
  var onDocumentMouseDownTrackball = initPickingTrackball(camera,projector,toIntersect);
  document.addEventListener('mousedown', onDocumentMouseDownTrackball, false);


  /*****************************************************************************/
  /********************************** RENDERING ********************************/
  /*****************************************************************************/

  updateNightDayCycle(); // Un aggiornamento del ciclo lo faccio comunque
  render();

  function render() {
    stats.update();

    updateCollisionDetection();
    TWEEN.update();
    updateGUIControls();
    videoControlUpdate();
    soundsUpdate(sounds);

    /* Muovo l'acqua */
    objWaterSink.water.material.uniforms.time.value += 1 / 60.0;
    objWaterSink2.water.material.uniforms.time.value += 1 / 60.0;


    // render using requestAnimationFrame
    requestAnimationFrame(render);
    rendererCSS.render(cssScene, camera );
    webGLRenderer.render(scene, camera);
  }

  function updateCollisionDetection() {
    /* Controllo il pointerLock */
    if(pointerNavigationEnabled) {
      unlockAllDirection(controls); // Sblocco il movimento in tutte le direzioni

      /* Verifico la collisione solo per i muri, le finestre e le porte */
      if(collision(controls,[house])) {
        lockDirection(controls);
      }

      /* Fermo l'oggetto se mi trovo sopra un oggetto */
      translateY(controls,ray,[house,ground]);

      controls.update();
    } else {
      trackballControls.update();
    }
  }

  function updateGUIControls() {
    /* Prendo i valori dei controlli e li riutilizzo nel ciclo di rendering */

    /* Controllo il pointer lock */
    if(gui.controls.enablePointLocker !== pointerNavigationEnabled) {
      if(gui.controls.enablePointLocker) {
        /* Porto il secondo renderer in secondo piano rispetto al resto */
        rendererCSS.domElement.style.zIndex = -1;
        document.removeEventListener('mousedown',onDocumentMouseDownTrackball,false);
        /* prendo il nuovo listener */
        var onDocumentMouseDown = initPickingPointLocker(camera,projector,toIntersect);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        trackballControls.reset();
        pointerNavigationEnabled = true;
        camera.position.set(0,0,0);
        var blocker = document.getElementById( 'blocker' );
        blocker.style.display = "block";
        controls = initPointerLock(camera);
        controls.getObject().position.set(50, 25, 100);
        scene.add( controls.getObject() );
        var pointer = document.getElementById( 'pointer' );
        pointer.style.display = "block";
        gui.controls.updateTrackballControl = false;
      } else {
        window.location.reload(false); // Ricarico la pagina
      }
      pointerNavigationEnabled = gui.controls.enablePointLocker;


    }

    /* Abilito o disabilito il trackball controller */
    trackballControls.enabled = gui.controls.updateTrackBallControl;

    /* Mostro o nascondo il tetto */
    house.children[4].traverse( function ( child ) {
      child.visible = gui.controls.showRoof;
    });

    /* Abilito o disabilito lo specchio */
    if(gui.controls.enableMirror) {
      /* Aggiorno lo specchio */
      mirrorCamera.updateCubeMap(webGLRenderer, scene);
    }

    /* Abilito o disabilito il ciclo giorno/notte */
    if(gui.controls.nightDayCycle) {
      updateNightDayCycle();
    }


    /* Cambio l'intensità della nebbia */
    if(gui.controls.fogDensity !== fogDensity) {
      scene.fog.density = gui.controls.fogDensity;
      fogDensity = gui.controls.fogDensity;
    }

  }


  /* Questa funzione viene chiamata durante il rendering e si occupa di aggiornare il ciclo giorno/notte */
  function updateNightDayCycle() {
    step = (2* Math.PI/gui.controls.dayDuration) / 30; // Radianti da incrementare ogni volta che chiamo la funzione di rendering (ad occhio ho 30 fps)
    nightDayCycle.sunAngle += step;
    /* Eseguo tutte le funzioni per aggiornare  */
    for (key in nightDayCycle.onRenderFcts) {
      nightDayCycle.onRenderFcts[key](nightDayCycle.sunAngle);
    }
    
  }

  function initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Porto in primo piano le statistiche
    stats.domElement.style.zIndex = 1;
    $('body').append(stats.domElement);
    return stats;
  }

  function videoControlUpdate() {
    /* Questa funzione si occupa di tutti gli aggiornamenti per il controller del video */

     /* Necessario per la riproduzione del video */
     if (video.readyState === video.HAVE_ENOUGH_DATA) {
       if (videoTexture) {
         videoTexture.needsUpdate = true;
       }
     }

     /* Se sto riproducendo il video mostro i controlli per cambiare canale della tv */
     if(!video.paused && monitor.src!=="") {
      monitor.style.display = 'box';
      videoCanvas.style.display = 'block';
      layer2Canvas.style.display = 'block';

      /* Faccio partire la webcam */
        if ( monitor.readyState === monitor.HAVE_ENOUGH_DATA ) {
          // mirror video
          videoContext.drawImage( monitor, 0, 0, videoCanvas.width, videoCanvas.height );
          for ( var i = 0; i < buttons.length; i++ )
            layer2Context.drawImage( buttons[i].image, buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h );    
        }


        if (!lastImageData) {
           lastImageData = videoContext.getImageData(0, 0, videoCanvas.width, videoCanvas.height);
        }
        var sourceData = videoContext.getImageData(0, 0, videoCanvas.width, videoCanvas.height);
        blend(lastImageData,sourceData, videoContext, blendContext);  
        checkAreas(buttons, blendContext, video);
        lastImageData = sourceData;

    } else {
      monitor.style.display = 'none';
      videoCanvas.style.display = 'none';
      layer2Canvas.style.display = 'none';
    }
  }

  function soundsUpdate(sounds) {

    for ( var i = 0; i < sounds.length; i++ ) {
      if(gui.controls.enablePointLocker) {
        sounds[i].update(controls.getObject());
      } else {
        sounds[i].update(camera);
      }
    }

  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    webGLRenderer.setSize( window.innerWidth, window.innerHeight );
    rendererCSS.setSize( window.innerWidth, window.innerHeight );
  }

});