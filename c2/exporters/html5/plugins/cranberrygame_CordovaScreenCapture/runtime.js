// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaScreenCapture = function(runtime)
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
cr.plugins_.cranberrygame_CordovaScreenCapture = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaScreenCapture.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

/*
	//for example
	var fbAppID = "";
	var fbAppSecret = "";
*/
//cranberrygame start
//cranberrygame end
	
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
		this.arr = [];
		this.forX = 0;
		
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaScreenCapture.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['canvas2ImagePlugin'] == 'undefined')
            return;
			
		this.capturedImage = "";
		this.curTag = "";
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
	
	instanceProto.doForEachTrigger = function (current_event)
	{
		this.runtime.pushCopySol(current_event.solModifiers);
		current_event.retrigger();
		this.runtime.popSol(current_event.solModifiers);
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
	
	Cnds.prototype.ArrForEach = function ()
	{
        var current_event = this.runtime.getCurrentEventStack().current_event;
		
		this.forX = 0;

		for (this.forX = 0; this.forX < this.arr.length; this.forX++)
		{
			this.doForEachTrigger(current_event);
		}

		this.forX = 0;

		return false;
	};	
*/
	
//cranberrygame start
	Cnds.prototype.OnSaveScreenCaptureSucceeded = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnSaveScreenCaptureFailed = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnSaveSpriteCaptureSucceeded = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnSaveSpriteCaptureFailed = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
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
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (this.runtime.isAndroid && navigator.platform == 'Win32')//crosswalk emulator
			return;
			
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (this.runtime.isAndroid && navigator.platform == 'Win32')//crosswalk emulator
			return;
			
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaScreenCapture.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.SaveScreenCaptureToImageFile = function (tag)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['canvas2ImagePlugin'] == 'undefined')
            return;
			
		var self = this;
		
		if (this.runtime.isCrosswalk) {
			cr.system_object.prototype.acts.SnapshotCanvas.apply( self, [0, 75] );
			setTimeout( function() { 
				var ret = { 
					set_string: function( str ) {
						//data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABTAAAACTCAYAAAC53TaFAAAdiklEQVR4Xu3dadCeVXkH8OtdsxFC2AmLIQQS9oQ1QZawy9awFeoyzkhdZhzsMOPo1KlitU47taX9wNR2nGrVat2AURBQymLYEgIoSUgCQQFZZTEL2d+117nDG/Jml/LhYH73gCTPcz/Pc92/c/zyn+uc09KfV7gIECBAgAABAgQIECBAgAABAgQIECBQoUCLALPCUVESAQIECBAgQIAAAQIECBAgQIAAAQKNgADTRCBAgAABAgQIECBAgAABAgQIECBAoFoBAWa1Q6MwAgQIECBAgAABAgQIECBAgAABAgQEmOYAAQIECBAgQIAAAQIECBAgQIAAAQLVCggwqx0ahREgQIAAAQIECBAgQIAAAQIECBAgIMA0BwgQIECAAAECBAgQIECAAAECBAgQqFZAgFnt0CiMAAECBAgQIECAAAECBAgQIECAAAEBpjlAgAABAgQIECBAgAABAgQIECBAgEC1AgLMaodGYQQIECBAgAABAgQIECBAgAABAgQICDDNAQIECBAgQIAAAQIECBAgQIAAAQIEqhUQYFY7NAojQIAAAQIECBAgQIAAAQIECBAgQECAaQ4QIECAAAECBAgQIECAAAECBAgQIFCtgACz2qFRGAECBAgQIECAAAECBAgQIECAAAECAkxzgAABAgQIECBAgAABAgQIECBAgACBagUEmNUOjcIIECBAgAABAgQIECBAgAABAgQIEBBgmgMECBAgQIAAAQIECBAgQIAAAQIECFQrIMCsdmgURoAAAQIECBAgQIAAAQIECBAgQICAANMcIECAAAECBAgQIECAAAECBAgQIECgWgEBZrVDozACBAgQIECAAAECBAgQIECAAAECBASY5gABAgQIECBAgAABAgQIECBAgAABAtUKCDCrHRqFESBAgAABAgQIECBAgAABAgQIECAgwDQHCBAgQIAAAQIECBAgQIAAAQIECBCoVkCAWe3QKIwAAQIECBAgQIAAAQIECBAgQIAAAQGmOUCAAAECBAgQIECAAAECBAgQIECAQLUCAsxqh0ZhBAgQIECAAAECBAgQIECAAAECBAgIMM0BAgQIECBAgAABAgQIECBAgAABAgSqFRBgVjs0CiNAgAABAgQIECBAgAABAgQIECBAQIBpDhAgQIAAAQIECBAgQIAAAQIECBAgUK2AALPaoVEYAQIECBAgQIAAAQIECBAgQIAAAQICTHOAAAECBAgQIECAAAECBAgQIECAAIFqBQSY1Q6NwggQIECAAAECBAgQIECAAAECBAgQEGCaAwQIECBAgAABAgQIECBAgAABAgQIVCsgwKx2aBRGgAABAgQIECBAgAABAgQIECBAgIAA0xwgQIAAAQIECBAgQIAAAQIECBAgQKBaAQFmtUOjMAIECBAgQIAAAQIECBAgQIAAAQIEBJjmAAECBAgQIECAAAECBAgQIECAAAEC1QoIMKsdGoURIECAAAECBAgQIECAAAECBAgQICDANAcIECBAgAABAgQIECBAgAABAgQIEKhWQIBZ7dAojAABAgQIECBAgAABAgQIECBAgAABAaY5QIAAAQIECBAgQIAAAQIECBAgQIBAtQICzGqHRmEECBAgQIAAAQIECBAgQIAAAQIECAgwzQECBAgQIECAAAECBAgQIECAAAECBKoVEGBWOzQKI0CAAAECBAgQIECAAAECBAgQIEBAgGkOECBAgAABAgQIECBAgAABAgQIECBQrYAAs9qhURgBAgQIECBAgAABAgQIECBAgAABAgJMc4AAAQIECBAgQIAAAQIECBAgQIAAgWoFBJjVDo3CCBAgQIAAAQIECBAgQIAAAQIECBAQYJoDBAgQIECAAAECBAgQIECAAAECBAhUKyDArHZoFEaAAAECBAgQIECAAAECBAgQIECAgADTHCBAgAABAgQIECBAgAABAgQIECBAoFoBAWa1Q6MwAgQIECBAgAABAgQIECBAgAABAgQEmOYAAQIECBAgQIAAAQIECBAgQIAAAQLVCggwqx0ahREgQIAAAQIECBAgQIAAAQIECBAgIMA0BwgQIECAAAECBAgQIECAAAECBAgQqFZguwPM7r6++N4z8+PGxS/F68uWRuuQzhg3bKe4ar9D4vS931PtAyqMAAECBAgQIECAAAECBAgQIECAAIF3r8A2A8ynly+Oj86ZEc92rYn+1raIlpaI3t5ozz/3RX9EX3/539irszNmnnzJu1dC5QQIECBAgAABAgQIECBAgAABAgQIVCew1QDz5Bk3xku9PZlRNlFlE1pGf3/0ZYbZHi3RWyLM/pb8U3m3/DfiugnHxsX7jq/uQRVEgAABAgQIECBAgAABAgQIECBAgMC7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ECBAgAABAgQIECBAgIAA0xwgQIAAAQIECBAgQIAAAQIECBAgQKBaAQFmtUOjMAIECBAgQIAAAQIECBAgQIAAAQIEBJjmAAECBAgQIECAAAECBAgQIECAAAEC1QoIMKsdGoURIECAAAECBAgQIECAAAECBAgQICDANAcIECBAgAABAgQIECBAgAABAgQIEKhWQIBZ7dAojAABAgQIECBAgAABAgQIECBAgAABAaY5QIAAAQIECBAgQIAAAQIECBAgQIBAtQICzGqHRmEECBAgQIAAAQIECBAgQIAAAQIECAgwzQECBAgQIECAAAECBAgQIECAAAECBKoVEGBWOzQKI0CAAAECBAgQIECAAAECBAgQIEBAgGkOECBAgAABAgQIECBAgAABAgQIECBQrYAAs9qhURgBAgQIECBAgAABAgQIECBAgAABAgJMc4AAAQIECBAgQIAAAQIECBAgQIAAgWoFBJjVDo3CCBAgQIAAAQIECBAgQIAAAQIECBAQYJoDBAgQIECAAAECBAgQIECAAAECBAhUKyDArHZoFEaAAAECBAgQIECAAAECBAgQIECAgADTHCBAgAABAgQIECBAgAABAgQIECBAoFoBAWa1Q6MwAgQIECBAgAABAgQIECBAgAABAgQEmOYAAQIECBAgQIAAAQIECBAgQIAAAQLVCggwqx0ahREgQIAAAQIECBAgQIAAAQIECBAgIMA0BwgQIECAAAECBAgQIECAAAECBAgQqFZAgFnt0CiMAAECBAgQIECAAAECBAgQIECAAAEBpjlAgAABAgQIECBAgAABAgQIECBAgEC1AgLMaodGYQQIECBAgAABAgQIECBAgAABAgQICDDNAQIECBAgQIAAAQIECBAgQIAAAQIEqhUQYFY7NAojQIAAAQIECBAgQIAAAQIECBAgQECAaQ4QIECAAAECBAgQIECAAAECBAgQIFCtgACz2qFRGAECBAgQIECAAAECBAgQIECAAAECAkxzgAABAgQIECBAgAABAgQIECBAgACBagUEmNUOjcIIECBAgAABAgQIECBAgAABAgQIEBBgmgMECBAgQIAAAQIECBAgQIAAAQIECFQrIMCsdmgURoAAAQIECBAgQIAAAQIECBAgQICAANMcIECAAAECBAgQIECAAAECBAgQIECgWgEBZrVDozACBAgQIECAAAECBAgQIECAAAECBASY5gABAgQIECBAgAABAgQIECBAgAABAtUKCDCrHRqFESBAgAABAgQIECBAgAABAgQIECAgwDQHCBAgQIAAAQIECBAgQIAAAQIECBCoVkCAWe3QKIwAAQIECBAgQIAAAQIECBAgQIAAAQGmOUCAAAECBAgQIECAAAECBAgQIECAQLUCAsxqh0ZhBAgQIECAAAECBAgQIECAAAECBAgIMM0BAgQIECBAgAABAgQIECBAgAABAgSqFRBgVjs0CiNAgAABAgQIECBAgAABAgQIECBAQIBpDhAgQIAAAQIECBAgQIAAAQIECBAgUK2AALPaoVEYAQIECBAgQIAAAQIECBAgQIAAAQICTHOAAAECBAgQIECAAAECBAgQIECAAIFqBQSY1Q6NwggQIECAAAECBAgQIECAAAECBAgQEGCaAwQIECBAgAABAgQIECBAgAABAgQIVCsgwKx2aBRGgAABAgQIECBAgAABAgQIECBAgIAA0xwgQIAAAQIECBAgQIAAAQIECBAgQKBagf8DNsR+sVCMG4YAAAAASUVORK5CYII=
						//window.open( str );
						screencapture['base64ToImageFile'](str, function(result){
							//self.capturedImage = result;
							self.capturedImage = 'file://'+result;
							self.curTag = tag;
							self.runtime.trigger(cr.plugins_.cranberrygame_CordovaScreenCapture.prototype.cnds.OnSaveScreenCaptureSucceeded, self);		
						}, function(error){
							self.curTag = tag;
							self.runtime.trigger(cr.plugins_.cranberrygame_CordovaScreenCapture.prototype.cnds.OnSaveScreenCaptureFailed, self);		
						});
					} 
				};
				cr.system_object.prototype.exps.canvassnapshot.apply( self, [ret] );
			}, 500 );
		}
		else {
			screencapture['captureCanvasIdToImageFile']('c2canvas', function(result){ //screencapture['captureCanvasToImageFile'](self.runtime.canvas, function(result){
				//self.capturedImage = result;
				self.capturedImage = 'file://'+result;
				self.curTag = tag;					
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaScreenCapture.prototype.cnds.OnSaveScreenCaptureSucceeded, self);		
			}, function(error){
				self.curTag = tag;
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaScreenCapture.prototype.cnds.OnSaveScreenCaptureFailed, self);		
			});
		}
	};	

	Acts.prototype.SaveSpriteCaptureToImageFile = function (objtype, tag)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['canvas2ImagePlugin'] == 'undefined')
            return;
			
		var self=this;
		var img = null;

		var sol = objtype.getCurrentSol();  
		sol.select_all = true;   
		var insts = sol.getObjects();
		var insts_length = insts.length;
			
		var i, inst;
		for (i=0; i < insts_length; i++)
		{
			inst = insts[i];
		  
			img = inst.cur_animation.frames[inst.cur_frame].texture_img;
			
			break;
		}
		
		screencapture['captureImgToImageFile'](img, function(result){
			//self.capturedImage = result;
			self.capturedImage = 'file://'+result;
			self.curTag = tag;				
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaScreenCapture.prototype.cnds.OnSaveSpriteCaptureSucceeded, self);		
		}, function(error){
			self.curTag = tag;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaScreenCapture.prototype.cnds.OnSaveSpriteCaptureFailed, self);		
		});
	};
//cranberrygame end
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
/*	
	// the example expression
	Exps.prototype.CellXCount = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
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

	Exps.prototype.CurValue = function (ret)
	{
		ret.set_any(this.at(this.forX));
	};	
	Exps.prototype.At = function (ret, x_)
	{
		ret.set_any(this.at(x));
	};	
	Exps.prototype.Width = function (ret)
	{
		ret.set_int(this.cx);
	};
*/
	
//cranberrygame start
	Exps.prototype.CapturedImage = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.capturedImage);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.CapturedImageFileName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	
		var arr = this.capturedImage.split("/");
		var filename = '';
		if (arr.length > 0)
			filename = arr[arr.length-1];
			
		ret.set_string(filename);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());