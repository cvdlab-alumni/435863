createObjectFromObj = function (objName,mtlName,material,normalMapImage,interactFunction) {

	var object = new THREE.Object3D();

	if (mtlName) {

		var loader = new THREE.OBJMTLLoader();

		loader.addEventListener('load', function (event) {

	        var mesh = event.content;

	        if(normalMapImage) {
	        	/* Specifico una normal map per l'oggetto che ho caricato */
	        	mesh.traverse( function ( child ) {
	        		var normal = THREE.ImageUtils.loadTexture(normalMapImage);
					if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial && child.material.map) {
						child.material.normalMap = normal;
						child.material.normalScale.set(.1,.1);
						child.material.normalMap.wrapS = THREE.RepeatWrapping;
						child.material.normalMap.wrapT = THREE.RepeatWrapping;
						child.material.normalMap.repeat.set(1000,1000);

					}
       			 });
	        }

	        if (interactFunction) {
	        	applyInteract(mesh,interactFunction);
	        }
			object.add(mesh);

	      });

		loader.load(
			objName, 
			mtlName, 
			{side: THREE.DoubleSide}
			);
	} else {
		/* Devo caricare solo un file obj senza materiali */
		var loader = new THREE.OBJLoader();

		loader.load(objName, function (obj) {

	        obj.children[0].material = material;
	        if (interactFunction) {
	        	obj.children[0].interact = interactFunction;
	        }
			object.add(obj);

	      });
	}

	return object;
}