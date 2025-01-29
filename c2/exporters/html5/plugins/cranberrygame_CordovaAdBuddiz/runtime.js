// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaAdBuddiz = function(runtime)
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
cr.plugins_.cranberrygame_CordovaAdBuddiz = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype;
		
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
	var publisherKey = "";		
	//license info
	var email = "";
	var licenseKey = "";
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["adbuddiz"] == 'undefined')
            return;
			
		publisherKey = "";		
		if (this.runtime.isAndroid)
			publisherKey = this.properties[0];
		else if (this.runtime.isiOS)
			publisherKey = this.properties[1];			
		//
		//email = this.properties[2];
		//licenseKey = this.properties[3];
		email = "cranberrygame@yahoo.com";
		licenseKey = "f0710ba90da977bea2870986716de110";
		
		window["adbuddiz"]["setLicenseKey"](email, licenseKey);
		window["adbuddiz"]["setUp"](publisherKey);
		
		var self = this;
		
		//
		window["adbuddiz"]['onInterstitialAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnInterstitialAdPreloaded, self);
		};			
		window["adbuddiz"]['onInterstitialAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnInterstitialAdLoaded, self);
		};
		window["adbuddiz"]['onInterstitialAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnInterstitialAdShown, self);
		};			
		window["adbuddiz"]['onInterstitialAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnInterstitialAdHidden, self);
		};
		//
		window["adbuddiz"]["onRewardedVideoAdPreloaded"] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnRewardedVideoAdPreloaded, self);
		};			
		window["adbuddiz"]["onRewardedVideoAdLoaded"] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnRewardedVideoAdLoaded, self);
		};			
		window["adbuddiz"]["onRewardedVideoAdShown"] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnRewardedVideoAdShown, self);
		};			
		window["adbuddiz"]["onRewardedVideoAdHidden"] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnRewardedVideoAdHidden, self);
		};		
		window["adbuddiz"]["onRewardedVideoAdCompleted"] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.OnRewardedVideoAdCompleted, self);
		};		
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
	Cnds.prototype.OnInterstitialAdPreloaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnInterstitialAdLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnInterstitialAdShown = function ()
	{
		return true;
	};
	Cnds.prototype.OnInterstitialAdHidden = function ()
	{
		return true;
	};
	//
	Cnds.prototype.IsShowingInterstitialAd = function ()
	{
	    if (typeof window["adbuddiz"] == 'undefined')
			return false;
			
		return window["adbuddiz"]["isShowingInterstitialAd"]();
	};
	//
	Cnds.prototype.LoadedInterstitialAd = function ()
	{
	    if (typeof window["adbuddiz"] == 'undefined')
			return false;
			
		return window["adbuddiz"]["loadedInterstitialAd"]();
	};	
	//
	Cnds.prototype.OnRewardedVideoAdPreloaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnRewardedVideoAdLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnRewardedVideoAdShown = function ()
	{
		return true;
	};
	Cnds.prototype.OnRewardedVideoAdHidden = function ()
	{
		return true;
	};	
	Cnds.prototype.OnRewardedVideoAdCompleted = function ()
	{
		return true;
	};
	//
	Cnds.prototype.IsShowingRewardedVideoAd = function ()
	{
	    if (typeof window["adbuddiz"] == "undefined")
			return false;

		return window["adbuddiz"]["isShowingRewardedVideoAd"]();
	};	
	//
	Cnds.prototype.LoadedRewardedVideoAd = function ()
	{
	    if (typeof window["adbuddiz"] == "undefined")
			return false;

		return window["adbuddiz"]["loadedRewardedVideoAd"]();
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdBuddiz.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.PreloadInterstitialAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["adbuddiz"] == 'undefined')
            return;
			
		window["adbuddiz"]["preloadInterstitialAd"]();	
	}
	Acts.prototype.ShowInterstitialAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["adbuddiz"] == 'undefined')
            return;
			
		window["adbuddiz"]["showInterstitialAd"]();
	};
	//
	Acts.prototype.PreloadRewardedVideoAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["adbuddiz"] == "undefined")
            return;			
			
		window["adbuddiz"]["preloadRewardedVideoAd"]();	
	}	
	Acts.prototype.ShowRewardedVideoAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["adbuddiz"] == "undefined")
            return;			

		window["adbuddiz"]["showRewardedVideoAd"]();				
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