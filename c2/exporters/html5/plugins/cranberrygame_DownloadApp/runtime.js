// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_DownloadApp = function(runtime)
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
cr.plugins_.cranberrygame_DownloadApp = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_DownloadApp.prototype;
		
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
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_DownloadApp.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
/*
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81)) {
			if (typeof window['downloadapp'] == 'undefined')
				return;
		}
		else {		
		}
*/
			
		this.downloadAppUrl = '';
		if (this.runtime.isAndroid) {
			this.downloadAppUrl = this.properties[1];
		}
		else if (this.runtime.isBlackberry10) {
			this.downloadAppUrl = this.properties[2];
		}
		else if (this.runtime.isiOS) {
			this.downloadAppUrl = this.properties[3];
		}
		else if (this.runtime.isWindows8App) {
			this.downloadAppUrl = this.properties[4];
		}
		else if (this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) {
			this.downloadAppUrl = this.properties[5];
		}
		else {
			this.downloadAppUrl = this.properties[0];
		}
		//
		if(this.runtime.isCordova){
			if(this.downloadAppUrl.indexOf("?")==-1){
				this.downloadAppUrl += "?platform=cordova";
			}
			else{
				this.downloadAppUrl += "&platform=cordova";
			}
			
		}		
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
	instanceProto.openDownloadAppUrl = function ()
	{

	}
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
		self.runtime.trigger(cr.plugins_.cranberrygame_DownloadApp.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.OpenDownloadAppUrl = function ()
	{
		var self = this;	
		
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window['downloadapp'] == 'undefined')
				return;
				
			if (self.runtime.isAndroid) {
				if(self.downloadAppUrl.indexOf("market://")!=-1 || self.downloadAppUrl.indexOf("http://play.google.com")!=-1 || self.downloadAppUrl.indexOf("https://play.google.com")!=-1)
					//http://stackoverflow.com/questions/16431258/android-wont-open-google-play-links-from-javascript-in-web-app
					//window.location = self.downloadAppUrl; //x
					//window.open(self.downloadAppUrl, "_blank"); //x
					window.open(self.downloadAppUrl,"_system");
				else{
					window.open(self.downloadAppUrl, "_blank");
				}				
			}
			else if (self.runtime.isBlackberry10) {
				window.location = self.downloadAppUrl;
			}
			else if (self.runtime.isiOS) {
				window.location = self.downloadAppUrl;
			}
			else if (self.runtime.isWindows8App) {
				//window.location = "ms-windows-store:REVIEW?PFN="+value;//privilege error
				//http://stackoverflow.com/questions/18311836/winjs-implenting-rate-and-review-in-windows-store-apps
				var uriToLaunch = self.downloadAppUrl;
				var uri = new Windows["Foundation"]["Uri"](uriToLaunch);
				var options = new Windows["System"]["LauncherOptions"]();
				options.treatAsUntrusted = true;
				Windows["System"]["Launcher"]["launchUriAsync"](uri, options).then(
					function (success) {
						if (success) {
						} 
						else {
						}
					}
				);	
			}
			else if (self.runtime.isWindowsPhone8 || self.runtime.isWindowsPhone81) {
				window['downloadapp']['openDownloadAppUrl'](self.downloadAppUrl);
			}			
		}
		else {
			window.open(self.downloadAppUrl, "_blank");	
		}
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
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());