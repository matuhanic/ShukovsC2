var screencapture = { //cranberrygame 
    
/*	
    saveScreenCaptureToImageFile: function (canvasId, successCallback, failureCallback) { //cranberrygame
        // successCallback required
        if (typeof successCallback != "function") {
            console.log("Canvas2ImagePlugin Error: successCallback is not a function");
        }
        else if (typeof failureCallback != "function") {
            console.log("Canvas2ImagePlugin Error: failureCallback is not a function");
        }
        else {
            var canvas = (typeof canvasId === "string") ? document.getElementById(canvasId) : canvasId;
            var base64 = canvas.toDataURL().replace(/data:image\/png;base64,/,'');
            return cordova.exec(successCallback, failureCallback, "Canvas2ImagePlugin","saveImageDataToLibrary",[base64]);
        }
    },
*/	
//cranberrygame start
    base64ToImageFile: function (base64, successCallback, failureCallback) { 
		var base64 = base64.replace(/data:image\/png;base64,/,'');
		cordova.exec(successCallback, failureCallback, "Canvas2ImagePlugin","saveImageDataToLibrary",[base64]);
    },
    captureCanvasToImageFile: function (canvas, successCallback, failureCallback) {
		var base64 = canvas.toDataURL();
		screencapture.base64ToImageFile(base64, successCallback, failureCallback);
    },
    captureCanvasIdToImageFile: function (canvasId, successCallback, failureCallback) {
		var canvas = (typeof canvasId === "string") ? document.getElementById(canvasId) : canvasId;	
		var base64 = canvas.toDataURL();		
		screencapture.base64ToImageFile(base64, successCallback, failureCallback);
    },	
    captureImgToImageFile: function (img, successCallback, failureCallback) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);

		var base64 = canvas.toDataURL();
		screencapture.base64ToImageFile(base64, successCallback, failureCallback);
    }
//cranberrygame end	
};
  