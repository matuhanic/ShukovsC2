// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_MoreApps = function(runtime)
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
cr.plugins_.cranberrygame_MoreApps = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_MoreApps.prototype;
		
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
			self.runtime.trigger(cr.plugins_.cranberrygame_MoreApps.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81)) {
			if (typeof window['moreapps'] == 'undefined' && !this.runtime.isAmazonWebApp)
				return;		
		}
		else {		
		}
		
		this.moreAppsUrl = '';
		if (this.runtime.isAndroid) {
			this.moreAppsUrl = this.properties[1];
		}
		else if (this.runtime.isBlackberry10) {
			this.moreAppsUrl = this.properties[2];
		}
		else if (this.runtime.isiOS) {
			this.moreAppsUrl = this.properties[3];
		}
		else if (this.runtime.isWindows8App) {
			this.moreAppsUrl = this.properties[4];
		}
		else if (this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) {
			this.moreAppsUrl = this.properties[5];
		}
		else  {
			this.moreAppsUrl = this.properties[0];
		}
		//
		if(this.runtime.isCordova){
			if(this.moreAppsUrl.indexOf("?")==-1){
				this.moreAppsUrl += "?platform=cordova";
			}
			else{
				this.moreAppsUrl += "&platform=cordova";
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
	instanceProto.openMoreApps = function (preload)
	{			
		this.preloadedWin = null;
			
		var self = this;	

		
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81 || this.runtime.isNWjs)) {
			//if (typeof window['moreapps'] == 'undefined' && !this.runtime.isAmazonWebApp)
			//	return;
				
			if (self.runtime.isAndroid) {
			
				if (typeof samsung != 'undefined' && typeof samsung['multiwindow'] != 'undefined' && !preload) {
					samsung['multiwindow']['isSupported']('freestyle', function(result){
						//alert('supported');
						var inputOptions = {};
						inputOptions.action = 'action_view';//action_main, action_view
						inputOptions.windowType = 'freestyle';//freestyle, splitstyle
						//inputOptions.scaleInfo = '60';
						//inputOptions.scaleInfo = '80';
						inputOptions.scaleInfo = '100';
						inputOptions.dataUri = self.moreAppsUrl;		
						//inputOptions.packageName = 'com.sec.android.app.sbrowser';
						//inputOptions.activity = 'com.sec.android.app.sbrowser.SBrowserMainActivity';
						samsung['multiwindow']['createMultiWindow'](inputOptions, function(result){}, function(error){});
					}, function(error){
						//alert('not supported');
						if(self.moreAppsUrl.indexOf("market://")!=-1 || self.moreAppsUrl.indexOf("http://play.google.com")!=-1 || self.moreAppsUrl.indexOf("https://play.google.com")!=-1)
							//http://stackoverflow.com/questions/16431258/android-wont-open-google-play-links-from-javascript-in-web-app
							//window.location = self.moreAppsUrl; //x
							//window.open(self.moreAppsUrl, "_blank"); //x
							if(preload)
								self.preloadedWin = window.open(self.moreAppsUrl,"_system","location=yes,hidden=yes");
							else
								window.open(self.moreAppsUrl,"_system","location=yes");
						else{
							if(preload)
								self.preloadedWin = window.open(self.moreAppsUrl, "_blank","location=yes,hidden=yes");
							else
								window.open(self.moreAppsUrl, "_blank","location=yes");
						}						
					});
				}
				else {
					if(self.moreAppsUrl.indexOf("market://")!=-1 || self.moreAppsUrl.indexOf("http://play.google.com")!=-1 || self.moreAppsUrl.indexOf("https://play.google.com")!=-1)
						//http://stackoverflow.com/questions/16431258/android-wont-open-google-play-links-from-javascript-in-web-app
						//window.location = self.moreAppsUrl; //x
						//window.open(self.moreAppsUrl, "_blank"); //x
						if(preload)
							self.preloadedWin = window.open(self.moreAppsUrl,"_system","location=yes,hidden=yes");
						else
							window.open(self.moreAppsUrl,"_system","location=yes");
					else{
						if(preload)
							self.preloadedWin = window.open(self.moreAppsUrl,"_blank","location=yes,hidden=yes");
						else
							window.open(self.moreAppsUrl, "_blank","location=yes");
					}
				}
			}
			else if (self.runtime.isBlackberry10) {
				window.location = self.moreAppsUrl;
			}
			else if (self.runtime.isiOS) {
				if(preload)
					self.preloadedWin = window.open(self.moreAppsUrl, "_blank", "location=yes,hidden=yes");
				else
					window.open(self.moreAppsUrl, "_blank","location=yes");
			}
			else if (self.runtime.isWindows8App) {
				//window.location = "ms-windows-store:REVIEW?PFN="+value;//privilege error
				//http://stackoverflow.com/questions/18311836/winjs-implenting-rate-and-review-in-windows-store-apps
				var uriToLaunch = self.moreAppsUrl;
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
				//window.open(self.moreAppsUrl, "_blank");//works
				window['moreapps']['openMoreAppsUrl'](self.moreAppsUrl);//works, more good method
			}
			else if(self.runtime.isNWjs){

				var child_process = require("child_process");				
				var process = window["process"] || nw["process"];
				var path = require("path");
					
				////////////
				var opener;
				
				switch (process.platform) {
				case "win32":
					opener = 'start ""';
					break;
				case "darwin":
					opener = 'open';
					break;
				default:
					opener = path["join"](__dirname, "../vendor/xdg-open");
					break;
				}

				child_process["exec"](opener + ' "' + self.moreAppsUrl.replace(/"/, '\\\"') + '"');					
				//////////
			}			
		}
		else {
			if(preload)
				self.preloadedWin = window.open(self.moreAppsUrl, "_blank", "location=yes,hidden=yes");	
			else
				window.open(self.moreAppsUrl, "_blank","location=yes");	
		}
	};	
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
		self.runtime.trigger(cr.plugins_.cranberrygame_MoreApps.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.PreloadMoreApps = function ()
	{
		this.openMoreApps(true);			
	}
	Acts.prototype.ShowMoreApps = function ()
	{
		if(this.preloadedWin)
			this.preloadedWin.show();	
		else
			this.openMoreApps(false);			
	}

	Acts.prototype.SetMoreAppsUrl = function (platform, moreAppsUrl_)
	{
		if (this.runtime.isAndroid) {
			if(platform == 1)
				this.moreAppsUrl = moreAppsUrl_;
		}
		else if (this.runtime.isBlackberry10) {
			if(platform == 2)
				this.moreAppsUrl = moreAppsUrl_;
		}
		else if (this.runtime.isiOS) {
			if(platform == 3)
				this.moreAppsUrl = moreAppsUrl_;
		}
		else if (this.runtime.isWindows8App) {
			if(platform == 4)
				this.moreAppsUrl = moreAppsUrl_;
		}
		else if (this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) {
			if(platform == 5)		
				this.moreAppsUrl = moreAppsUrl_;
		}
		else  {
			if(platform == 0)
				this.moreAppsUrl = moreAppsUrl_;
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
	Exps.prototype.HTML5WebsiteMoreAppsUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.properties[0]);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.AndroidMoreAppsUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.properties[1]);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.Blackberry10MoreAppsUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.properties[2]);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.iOSMoreAppsUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.properties[3]);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.Windows8MoreAppsUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.properties[4]);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.Wp8MoreAppsUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.properties[5]);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());