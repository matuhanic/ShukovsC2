// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaBarcode = function(runtime)
{
	this.runtime = runtime;
	Type
		onCreate
	Instance
		onCreate
		draw
		drawGL		
	cnds
		//MyCondition
		//TriggerCondition
	acts
		//MyAction
		//TriggerAction
	exps
		//MyExpression
};		
//cranberrygame end: structure
*/

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.cranberrygame_CordovaBarcode = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaBarcode.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
		
/*			
		//cranberrygame
		var newScriptTag=document.createElement('script');
		newScriptTag.setAttribute("type","text/javascript");
		newScriptTag.setAttribute("src", "mylib.js");
		document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		//cranberrygame
		var scripts=document.getElementsByTagName("script");
		var scriptExist=false;
		for(var i=0;i<scripts.length;i++){
			//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
			if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
				scriptExist=true;
				break;
			}
		}
		if(!scriptExist){
			var newScriptTag=document.createElement("script");
			newScriptTag.setAttribute("type","text/javascript");
			newScriptTag.setAttribute("src", "cordova.js");
			document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		}
*/		
//cranberrygame start
		if(this.runtime.isBlackberry10 || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81){
			var scripts=document.getElementsByTagName("script");
			var scriptExist=false;
			for(var i=0;i<scripts.length;i++){
				//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
				if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
					scriptExist=true;
					break;
				}
			}
			if(!scriptExist){
				var newScriptTag=document.createElement("script");
				newScriptTag.setAttribute("type","text/javascript");
				newScriptTag.setAttribute("src", "cordova.js");
				document.getElementsByTagName("head")[0].appendChild(newScriptTag);
			}
		}
//cranberrygame end		
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		
/*
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBarcode.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;		
		if (typeof cordova == 'undefined' || typeof cordova["plugins"] == 'undefined' || typeof cordova["plugins"]["barcodeScanner"] == 'undefined')
            return;
						
		this.scanResult = "";
		this.createResult = "";
//cranberrygame end			
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

/*
	instanceProto.at = function (x)
	{
		return this.arr[x];
	};
	
	instanceProto.set = function (x, val)
	{
		this.arr[x] = val;
	};
*/	
//cranberrygame start
//cranberrygame end	
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

/*
	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};

	//cranberrygame
	Cnds.prototype.TriggerCondition = function ()
	{
		return true;
	};
*/
	
//cranberrygame start
	Cnds.prototype.OnScanBarcodeSucceeded = function ()
	{	
		return true;
	};	
	Cnds.prototype.OnScanBarcodeFailed = function ()
	{	
		return true;
	};
	Cnds.prototype.OnCreateBarcodeSucceeded = function ()
	{	
		return true;
	};	
	Cnds.prototype.OnCreateBarcodeFailed = function ()
	{	
		return true;
	};	
//cranberrygame end
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

/*
	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBarcode.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.ScanBarcode = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;		
		if (typeof cordova == 'undefined' || typeof cordova["plugins"] == 'undefined' || typeof cordova["plugins"]["barcodeScanner"] == 'undefined')
            return;
			
		var self=this;
		
		cordova["plugins"]["barcodeScanner"]["scan"](
			function (result) {
				//alert("We got a barcode\n" +
				//	"Result: " + result.text + "\n" +
				//	"Format: " + result.format + "\n" +
				//	"Cancelled: " + result.cancelled);				
				//alert(JSON.stringify(result));				
				self.scanResult = result['text'];
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBarcode.prototype.cnds.OnScanBarcodeSucceeded, self);
			}, 
			function (error) {
				//alert("Scanning failed: " + error);
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBarcode.prototype.cnds.OnScanBarcodeFailed, self); 
			}
		);
	};
	Acts.prototype.CreateBarcode = function (text)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;		
		if (typeof cordova == 'undefined' || typeof cordova["plugins"] == 'undefined' || typeof cordova["plugins"]["barcodeScanner"] == 'undefined')
            return;

		var self=this;

/*
//phonegap cli 3.5
//06-24 03:09:12.468: E/AndroidRuntime(11987): java.lang.NullPointerException
//06-24 03:09:12.468: E/AndroidRuntime(11987): 	at com.google.zxing.client.android.encode.EncodeActivity.onCreateOptionsMenu(EncodeActivity.java:89)
//06-24 03:09:12.468: E/AndroidRuntime(11987): 	at android.app.Activity.onCreatePanelMenu(Activity.java:2476)
alert("a");
		
		//TEXT_TYPE
		//EMAIL_TYPE
		//PHONE_TYPE
		//SMS_TYPE
		
		cordova["plugins"]["barcodeScanner"]["encode"](cordova["plugins"]["barcodeScanner"]["Encode"]["TEXT_TYPE"], text, 
			function(info) {
				alert("encode success: " + info);
				//self.createResult=info;
				//self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBarcode.prototype.cnds.OnCreateBarcodeSucceeded, self);
			}, 
			function(error) {
				alert("encoding failed: " + error);
				//self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBarcode.prototype.cnds.OnCreateBarcodeFailed, self);
			}
		);
		
alert("b");
*/

///*
		//---------------------------------------------------------------------
		// JavaScript-HTML5 QRCode Generator
		//
		// Copyright (c) 2011 Amanuel Tewolde
		//
		// Licensed under the MIT license:
		//   http://www.opensource.org/licenses/mit-license.php
		//
		//---------------------------------------------------------------------

		// Generates a QRCode of text provided.
		// First QRCode is rendered to a canvas.
		// The canvas is then turned to an image PNG
		// before being returned as an <img> tag.
		var dotsize = 5;  // size of box drawn on canvas
		var padding = 10; // (white area around your QRCode)
		var black = "rgb(0,0,0)";
		var white = "rgb(255,255,255)";
		var QRCodeVersion = 15; // 1-40 see http://www.denso-wave.com/qrcode/qrgene2-e.html

		var canvas=document.createElement('canvas');
		var qrCanvasContext = canvas.getContext('2d');
		try {
			// QR Code Error Correction Capability 
			// Higher levels improves error correction capability while decreasing the amount of data QR Code size.
			// QRErrorCorrectLevel.L (5%) QRErrorCorrectLevel.M (15%) QRErrorCorrectLevel.Q (25%) QRErrorCorrectLevel.H (30%)
			// eg. L can survive approx 5% damage...etc.
			var qr = new QRCode(QRCodeVersion, QRErrorCorrectLevel['L']); 
			qr['addData'](text);
			qr['make']();
		}
		catch(err) {
			var errorChild = document.createElement("p");
			var errorMSG = document.createTextNode("QR Code FAIL! " + err);
			errorChild.appendChild(errorMSG);
			//return errorChild;//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBarcode.prototype.cnds.OnCreateBarcodeFailed, self);//cranberrygame
			return;
		}

		var qrsize = qr['getModuleCount']();
		canvas.setAttribute('height',(qrsize * dotsize) + padding);
		canvas.setAttribute('width',(qrsize * dotsize) + padding);
		var shiftForPadding = padding/2;
		if (canvas.getContext){
			for (var r = 0; r < qrsize; r++) {
				for (var c = 0; c < qrsize; c++) {
					if (qr['isDark'](r, c))
						qrCanvasContext.fillStyle = black;  
					else
						qrCanvasContext.fillStyle = white;  
					qrCanvasContext.fillRect ((c*dotsize) +shiftForPadding,(r*dotsize) + shiftForPadding,dotsize,dotsize);   // x, y, w, h
				}	
			}
		}

		//var imgElement = document.createElement("img");//cranberrygame
		//imgElement.src = canvas.toDataURL("image/png");//cranberrygame
		//return imgElement;//cranberrygame		
		this.createResult = canvas.toDataURL("image/png");//cranberrygame
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBarcode.prototype.cnds.OnCreateBarcodeSucceeded, self);//cranberrygame		
//*/		
	};	
//cranberrygame end
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
/*	
	// the example expression
	Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.Text = function (ret, param) //cranberrygame
	{     
		ret.set_string("Hello");		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};	
*/
	
//cranberrygame start
	Exps.prototype.LastScanResult = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.scanResult);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.LastcreateResult = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.createResult);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.ScanResult = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.scanResult);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.CreateResult = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.createResult);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};	
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());