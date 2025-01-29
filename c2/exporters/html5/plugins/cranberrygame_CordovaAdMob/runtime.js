// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaAdmob = function(runtime)
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
cr.plugins_.cranberrygame_CordovaAdmob = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaAdmob.prototype;
		
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
	var bannerAdUnit = "";		
	var interstitialAdUnit = "";
	var isOverlap = true;
	var isTest = true;
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        //if (typeof window["admob"] == 'undefined')
        //	return;			
			
		if (this.runtime.isAndroid){
			bannerAdUnit = this.properties[0];
			interstitialAdUnit = this.properties[1];
		}
		else if (this.runtime.isiOS){
			bannerAdUnit = this.properties[2];
			interstitialAdUnit = this.properties[3];
		}
		else if (this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81){		
			bannerAdUnit = this.properties[4];
			interstitialAdUnit = this.properties[5];
		}
		isOverlap = this.properties[6]==0?false:true;
		isTest = this.properties[7]==0?false:true;
		//
		//email = this.properties[8];
		//licenseKey = this.properties[9];
		email = "cranberrygame@yahoo.com";
		licenseKey = "5b4b290b7b56336df0c9837521822164";

		var self = this;		
		
		if (typeof window["admob"] != 'undefined') {
			setUpPlugin();
		}
		//wp8
		else {
			setTimeout(setUpPlugin,600);				
		}
		
		function setUpPlugin() {
			//if (typeof window["admob"] == 'undefined')//
			//	return;

			window["admob"]["setLicenseKey"](email, licenseKey);
			window["admob"]["setUp"](bannerAdUnit, interstitialAdUnit, isOverlap, isTest);
			
			//			
			window["admob"]['onBannerAdPreloaded'] = function() {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.OnBannerAdPreloaded, self);
			};
			window["admob"]['onBannerAdLoaded'] = function() {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.OnBannerAdLoaded, self);
			};
			window["admob"]['onBannerAdShown'] = function() {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.OnBannerAdShown, self);
			};			
			window["admob"]['onBannerAdHidden'] = function() {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.OnBannerAdHidden, self);
			};				
			//
			window["admob"]['onInterstitialAdPreloaded'] = function() {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.OnInterstitialAdPreloaded, self);
			};			
			window["admob"]['onInterstitialAdLoaded'] = function() {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.OnInterstitialAdLoaded, self);
			};
			window["admob"]['onInterstitialAdShown'] = function() {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.OnInterstitialAdShown, self);
			};			
			window["admob"]['onInterstitialAdHidden'] = function() {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.OnInterstitialAdHidden, self);
			};
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
	Cnds.prototype.OnBannerAdPreloaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnBannerAdLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnBannerAdShown = function ()
	{
		return true;
	};
	Cnds.prototype.OnBannerAdHidden = function ()
	{
		return true;
	};
	//
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
	Cnds.prototype.IsShowingBannerAd = function ()
	{
	    if (typeof window["admob"] == 'undefined')
			return false;
			
		return window["admob"]["isShowingBannerAd"]();
	};
	Cnds.prototype.IsShowingInterstitialAd = function ()
	{
	    if (typeof window["admob"] == 'undefined')
			return false;
			
		return window["admob"]["isShowingInterstitialAd"]();
	};	
	//
	Cnds.prototype.LoadedBannerAd = function ()
	{
	    if (typeof window["admob"] == 'undefined')
			return false;
			
		return window["admob"]["loadedBannerAd"]();
	};
	Cnds.prototype.LoadedInterstitialAd = function ()
	{
	    if (typeof window["admob"] == 'undefined')
			return false;
			
		return window["admob"]["loadedInterstitialAd"]();
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAdmob.prototype.cnds.TriggerCondition, self);		
	};	
*/
	
//cranberrygame start
	Acts.prototype.PreloadBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window["admob"] == 'undefined')
            return;
			
		window["admob"]["preloadBannerAd"]();	
	}
	Acts.prototype.ShowBannerAd = function (position, size)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window["admob"] == 'undefined')
            return;
			
		var positionStr = "top-center";
		if (position==0)
			positionStr = "top-left";
		else if (position==1)
			positionStr = "top-center";
		else if (position==2)
			positionStr = "top-right";
		else if (position==3)
			positionStr = "left";
		else if (position==4)
			positionStr = "center";
		else if (position==5)
			positionStr = "right";
		else if (position==6)
			positionStr = "bottom-left";
		else if (position==7)
			positionStr = "bottom-center";
		else if (position==8)
			positionStr = "bottom-right";
	
		var sizeStr = "BANNER";
		if (size==0)
			sizeStr = "BANNER";
		else if (size==1)
			sizeStr = "LARGE_BANNER";
		else if (size==2)
			sizeStr = "MEDIUM_RECTANGLE";
		else if (size==3)
			sizeStr = "FULL_BANNER";
		else if (size==4)
			sizeStr = "LEADERBOARD";
		else if (size==5)
			sizeStr = "SKYSCRAPER";
		else if (size==6)
			sizeStr = "SMART_BANNER";
					
		window["admob"]["showBannerAd"](positionStr, sizeStr);		
	};
	Acts.prototype.ReloadBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window["admob"] == 'undefined')
            return;
			
		window["admob"]["reloadBannerAd"]();		
	}
	Acts.prototype.HideBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window["admob"] == 'undefined')
            return;
			
		window["admob"]["hideBannerAd"]();		
	};
	//
	Acts.prototype.PreloadInterstitialAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window["admob"] == 'undefined')
            return;
			
		window["admob"]["preloadInterstitialAd"]();		
	}
	Acts.prototype.ShowInterstitialAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window["admob"] == 'undefined')
            return;
			
		window["admob"]["showInterstitialAd"]();		
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