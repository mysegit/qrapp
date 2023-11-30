let scanListener = null;

async function createUser() {
	$(".loader").show();
	const uid_val = new Date().valueOf();
	$("#qr1").ClassyQR({
		type: 'text',
		text: uid_val
	});
	$("#do-register").hide();
	createData(uid_val);
		
	setTimeout(() => {
		$("#qr-generate").show();
		$(".loader").hide();
	}, 2000)
}

function readQR() {
	$("#update").hide();
	$("#qr-scan").show();
	$("#new-scan").show();
	$("#qr-generate").hide();
	$("#games-list").html("")
	var video = document.createElement("video");
	var canvasElement = document.getElementById("canvas");
	var canvas = canvasElement.getContext("2d");
	var loadingMessage = document.getElementById("loadingMessage");

	function drawLine(begin, end, color) {
		canvas.beginPath();
		canvas.moveTo(begin.x, begin.y);
		canvas.lineTo(end.x, end.y);
		canvas.lineWidth = 4;
		canvas.strokeStyle = color;
		canvas.stroke();
	}

	// Use facingMode: environment to attemt to get the front camera on phones
	navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
		video.srcObject = stream;
		video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
		video.play();
		scanListener = window.requestAnimationFrame(tick);
	});

	function tick() {
		loadingMessage.innerText = "⌛ Loading video...";
		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			loadingMessage.hidden = true;
			canvasElement.hidden = false;

			canvasElement.height = video.videoHeight;
			canvasElement.width = video.videoWidth;
			canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
			var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
			var code = jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: "dontInvert",
			});
			if (code) {
				drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
				drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
				drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
				drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

				$("#qr-scan").hide();
				console.log("Scan code is " + code.data)
				window.cancelAnimationFrame(scanListener);
				uid = code.data;
				readData(code.data);
				scanListener = 'unset';
				$("#new-scan").hide();
			} else {
				window.cancelAnimationFrame(scanListener)
			}
		}
		if (scanListener != 'unset') {
			scanListener = requestAnimationFrame(tick);
		}
	}
}