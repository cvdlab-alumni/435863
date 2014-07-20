/* Definisco tutte le funzioni per selezionare gli oggetti */

function initPickingTrackball(camera,projector,toIntersect) {

	/* Creo un listener da utilizzare ogni volta che clicco nel document */
	function onDocumentMouseDownTrackball (event) {
		event.preventDefault();

		var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
		projector.unprojectVector(vector, camera);

		var raycaster = new THREE.Raycaster(camera.position, 
		  vector.sub(camera.position).normalize());

		var intersects = raycaster.intersectObjects(toIntersect,true);
		if (intersects.length > 0) {
	  		intersects[0].object.interact && intersects[ 0 ].object.interact();
		}
	}

	return onDocumentMouseDownTrackball;
}

function initPickingPointLocker(camera,projector,toIntersect) {


	/* Creo un listener da utilizzare ogni volta che clicco nel document */
	function onDocumentMouseDown (event) {
		event.preventDefault();

		var vector = new THREE.Vector3(0, 0, 0.5);
		projector.unprojectVector(vector, camera);

		/* Per avere la direzione da assegnare al raycaster, chiamo il metodo getDirection di PointerLockControls,
		 * che restituisce una funzione che a sua volta prende un vettore, vi scrive i valori degli oggetti
		 * pitch e yaw e lo restituisce */

		var raycaster = new THREE.Raycaster(vector, 
		  controls.getDirection(new THREE.Vector3(0, 0, 0)).clone());

		var intersects = raycaster.intersectObjects(toIntersect,true);
		if (intersects.length > 0) {
	  		intersects[0].object.interact && intersects[0].object.interact();
		}
	}

	return onDocumentMouseDown;
}

/* Questa funzione applica la funzione interact a tutti i figli di un object3D */
function applyInteract(object, interactFunction) {

	object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.interact = interactFunction;
        } else if (child instanceof THREE.Object3D) {
        	//applyInteract(child, interactFunction);
        }
      });

}