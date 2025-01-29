// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaInstallApp = function(runtime)
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
cr.plugins_.cranberrygame_CordovaInstallApp = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaInstallApp.prototype;
		
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
	var packagePrefixes = [];
	var installedApps = [];
	var curTag = "";	
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaInstallApp.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
/*
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81)) {
			if (typeof window['installapp'] == 'undefined')
				return;
		}
		else {		
		}
			
		this.installAppUrl = '';
		if (this.runtime.isAndroid) {
			this.installAppUrl = this.properties[1];
		}
		else if (this.runtime.isBlackberry10) {
			this.installAppUrl = this.properties[2];
		}
		else if (this.runtime.isiOS) {
			this.installAppUrl = this.properties[3];
		}
		else if (this.runtime.isWindows8App) {
			this.installAppUrl = this.properties[4];
		}
		else if (this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) {
			this.installAppUrl = this.properties[5];
		}
		else {
			this.installAppUrl = this.properties[0];
		}
*/		
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
	Cnds.prototype.OnGetInstalledAppsSucceeded = function (tag)
	{
		return cr.equals_nocase(tag, curTag);
	};	
	Cnds.prototype.OnGetInstalledAppsFailed = function (tag)
	{
		return cr.equals_nocase(tag, curTag);
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaInstallApp.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	//deprecated
	Acts.prototype.AddPackagePrefix = function (packagePrefix)
	{
		if (!(this.runtime.isAndroid))
			return;			
        if (typeof window["installapp"] == 'undefined')
            return;
			
		//if (packagePrefixes.indexOf(packagePrefix) == -1)
			packagePrefixes.push(packagePrefix);
	};

	function StartWithPackagePrefix(installedAppPackage) {
		if (packagePrefixes.length == 0)
			return true;
	
		for (var i = 0 ; i < packagePrefixes.length ; i++) {
			if (installedAppPackage.indexOf(packagePrefixes[i]) == 0) {
				return true;
			}			
		}
		return false;
	}
	Acts.prototype.GetInstalledApps = function (tag)
	{
		if (!(this.runtime.isAndroid))
			return;			
        if (typeof window["installapp"] == 'undefined')
            return;
			
		var self = this;		
		window["installapp"]["getInstalledApps"](function(result){
			var arr = result;

			installedApps = [];			
			for (var i = 0 ; i < arr.length ; i++) {
				var installedAppPackage = arr[i]["packageName"];
				if(StartWithPackagePrefix(installedAppPackage)) {
					installedApps.push(arr[i]);	
				}
			}			
			
			curTag = tag;			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaInstallApp.prototype.cnds.OnGetInstalledAppsSucceeded, self);		
		}, function(error){
			installedApps = [];
			
			curTag = tag;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaInstallApp.prototype.cnds.OnGetInstalledAppsFailed, self);		
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
	Exps.prototype.InstalledAppsCount = function (ret)
	{
		if (this.runtime.isAndroid)
			ret.set_int(installedApps.length);
		else
			ret.set_int(0);
	};
	Exps.prototype.InstalledAppPackageAt = function (ret, i)
	{
		if (this.runtime.isAndroid)
			ret.set_string(installedApps[i]["packageName"]);
		else
			ret.set_string("");
	};
	Exps.prototype.InstalledAppVersionCodeAt = function (ret, i)
	{
		if (this.runtime.isAndroid)
			ret.set_string(installedApps[i]["versionCode"]);
		else
			ret.set_string("");
	};
	Exps.prototype.InstalledAppVersionNameAt = function (ret, i)
	{
		if (this.runtime.isAndroid)
			ret.set_string(installedApps[i]["versionName"]);
		else
			ret.set_string("");
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());