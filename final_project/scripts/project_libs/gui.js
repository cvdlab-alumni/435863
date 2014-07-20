function createGui(enablePointLocker, showRoof, enableMirror, updateTrackBallControl, nightDayCycle, dayDuration, fogDensity) {
	/* Creo la gui per controllare l'applicazione quando si utilizza il trackBall controller */
	var controls = new function () {
		this.enablePointLocker = enablePointLocker;
		this.showRoof = showRoof;
		this.enableMirror = enableMirror;
		this.updateTrackBallControl = updateTrackBallControl;
		this.nightDayCycle = nightDayCycle;
		this.dayDuration = dayDuration;
		this.fogDensity = fogDensity;
	};

	// Aggiungo il widget dei controlli alla pagina
	var gui = new dat.GUI();

	/* Aggiungo i vari controlli */

	var pointLockerControl = gui.add(controls, 'enablePointLocker');
	var roofControl = gui.add(controls, 'showRoof');
	var mirrorControl = gui.add(controls,'enableMirror');
	var trackBallControl = gui.add(controls, 'updateTrackBallControl');
	var nightDayCycleControl = gui.add(controls, 'nightDayCycle');
	var dayDurationControl = gui.add(controls, 'dayDuration', 1, 100);
	var fogDensityControl = gui.add(controls, 'fogDensity', 0, 0.01);

	pointLockerControl.onChange(function(value) {
		pointerNavigationEnabled = value;
	});

	roofControl.onChange(function(value) {
		controls.showRoof = value;
	});

	mirrorControl.onChange(function(value) {
		controls.enableMirror = value;
	});

	trackBallControl.onChange(function(value) {
		updateTrackBallControl = value;
	});

	nightDayCycleControl.onChange(function(value) {
		nightDayCycle = value;
	});

	dayDurationControl.onChange(function(value) {
		controls.dayDuration = value;
	});

	fogDensityControl.onChange(function(value) {
		controls.fogDensity = value;
	});

	
	gui.controls = controls; // Esporto i valori di controls


	return gui;
}