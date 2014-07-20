function initMotionDetection() {
	/* Setto i controlli per il motion detection */
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	window.URL = window.URL || window.webkitURL;

	var camvideo = document.getElementById('monitor');

	if (!navigator.getUserMedia) {
		console.log("Sorry. navigator.getUserMedia() is not avalaible");
	}
	navigator.getUserMedia({video: true}, gotStream, noStream);

	function gotStream(stream) {
		if (window.URL) {
			camvideo.src = window.URL.createObjectURL(stream);
	    } else { // Opera
			camvideo.src = stream;
		}

		camvideo.onerror = function(e) {
			stream.stop();
		};

		stream.onended = noStream;
	}

	function noStream(e) {
		var msg = 'No camera available.';
		if (e.code == 1) {
			msg = 'User denied access to use camera.';  
		}
		console.log(msg);
	}
}

function videoSetup(videoContext) {

	// these changes are permanent
	videoContext.translate(320, 0);
	videoContext.scale(-1, 1);
		
	// background color if no video present
	videoContext.fillStyle = '#005337';
	videoContext.fillRect( 0, 0, videoCanvas.width, videoCanvas.height );				

	buttons = [];
	
	var button1 = new Image();
	button1.src ="images/textures/videos/bunny.jpg";
	var buttonData1 = { name:"bunny", image:button1, x:320 - 96 - 30, y:10, w:45, h:55 };
	buttons.push( buttonData1 );
	
	var button2 = new Image();
	button2.src ="images/textures/videos/sintel.jpg";
	var buttonData2 = { name:"sintel", image:button2, x:320 - 32 - 20, y:10, w:45, h:55 };
	buttons.push( buttonData2 );

	return buttons;
}


/* Le funzioni che seguono si occupano del motion detection e si riferiscono al seguente articolo: 
 * http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html */



function blend(lastImageData,sourceData,videoContext,blendContext) {
	var width  = videoCanvas.width;
	var height = videoCanvas.height;
	// create a ImageData instance to receive the blended result
	var blendedData = videoContext.createImageData(width, height);
	// blend the 2 images
	differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
	// draw the result in a canvas
	blendContext.putImageData(blendedData, 0, 0);
}

function differenceAccuracy(target, data1, data2) {
	if (data1.length != data2.length) return null;
	var i = 0;
	while (i < (data1.length * 0.25)) {
		var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
		var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
		var diff = threshold(fastAbs(average1 - average2));
		target[4*i]   = diff;
		target[4*i+1] = diff;
		target[4*i+2] = diff;
		target[4*i+3] = 0xFF;
		++i;
	}
}

function fastAbs(value) {
	return (value ^ (value >> 31)) - (value >> 31);
}

function threshold(value) {
	return (value > 0x15) ? 0xFF : 0;
}

// check if white region from blend overlaps area of interest (e.g. triggers)
function checkAreas(buttons, blendContext, video) {
	for (var b = 0; b < buttons.length; b++) {
		// get the pixels in a note area from the blended image
		var blendedData = blendContext.getImageData( buttons[b].x, buttons[b].y, buttons[b].w, buttons[b].h );
			
		// calculate the average lightness of the blended data
		var i = 0;
		var sum = 0;
		var countPixels = blendedData.data.length * 0.25;
		while (i < countPixels) {
			sum += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]);
			++i;
		}
		// calculate an average between of the color values of the note area [0-255]
		var average = Math.round(sum / (3 * countPixels));
		var source;
		if (average > 50) { // more than 20% movement detected
			if (buttons[b].name == "bunny") {
				source = "videos/Big_Buck_Bunny_small.ogv";
			}
			if (buttons[b].name == "sintel") {
				source = "videos/sintel.ogv";
			}
			/* Cambio il video da visualizzare a seconda del pulsante premuto */
			if(video.src.split('/').pop() !==source.split('/').pop()) {
				video.src = source;
			}
		}
	}
}