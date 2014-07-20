function createFirstBedroom() {

	var bedroom = new THREE.Object3D();

	/* Creo il letto */
	var bed = createObjectFromObj('models/bedroom1/Bed1.obj','models/bedroom1/Bed1.mtl');
	bed.position.set(3,10.5,0.2);
	bed.scale.set(.9,.9,.9);
	bed.rotation.set(Math.PI/2,-Math.PI/2,0);
	bedroom.add(bed);

	/* Creo i comodini */
	var bedsideTable1 = createObjectFromObj('models/bedroom1/BedSideTable.obj','models/bedroom1/BedSideTable.mtl');
	bedsideTable1.position.set(1.5,11.2,0.55);
	bedsideTable1.scale.set(.1,.1,.1);
	bedsideTable1.rotation.set(Math.PI/2,0,0);
	bedroom.add(bedsideTable1);

	var bedsideTable2 = createObjectFromObj('models/bedroom1/BedSideTable.obj','models/bedroom1/BedSideTable.mtl');
	bedsideTable2.position.set(4.2,11.2,0.55);
	bedsideTable2.scale.set(.1,.1,.1);
	bedsideTable2.rotation.set(Math.PI/2,0,0);
	bedroom.add(bedsideTable2);

	/* Creo il comò */
	var drawer = createObjectFromObj('models/bedroom1/Drawer.obj','models/bedroom1/Drawer.mtl');
	drawer.position.set(4.9,9.2,0.52);
	drawer.scale.set(.003,.003,.003);
	drawer.rotation.set(Math.PI/2,Math.PI,0);
	bedroom.add(drawer);

	/* Creo l'armadio */
	var cabinet = createObjectFromObj('models/bedroom1/Bedroom1Cabinet.obj','models/bedroom1/Bedroom1Cabinet.mtl');
	cabinet.position.set(3,7.2,0.2);
	cabinet.scale.set(6,6,6);
	cabinet.rotation.set(Math.PI/2,-Math.PI/2,0);
	bedroom.add(cabinet);

	return bedroom;
	
}