var Sound = function ( sources, radius, volume ) {

	var audio = document.createElement( 'audio' );

	for ( var i = 0; i < sources.length; i ++ ) {

		var source = document.createElement( 'source' );
		source.src = sources[ i ];

		audio.appendChild( source );

	}

	this.position = new THREE.Vector3();

	this.play = function () {

		audio.play();

	}

	this.stop = function () {

		audio.pause();
		audio.currentTime = 0;

	}

	this.loop = function (loop) {

		audio.loop = loop;

	}

	this.update = function (cameraOrObject) {

		var distance = this.position.distanceTo( cameraOrObject.position );

		if ( distance <= radius ) {

			audio.volume = volume * ( 1 - distance / radius );

		} else {

			audio.volume = 0;

		}

	}

}

function createSinkSound(position) {
	var sound = new Sound( [ 'sounds/WaterInSink.mp3'], 50, 1 );
	sound.loop(true);
	sound.position.copy(position);
	return sound;
}

function createDoorSound(position) {
	var sound = new Sound( [ 'sounds/DoorSound.mp3' ], 100, 1 );
	sound.position.copy(position);
	return sound;
}
