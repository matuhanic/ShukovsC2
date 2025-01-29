// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaAppodeal = function(runtime)
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
cr.plugins_.cranberrygame_CordovaAppodeal = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaAppodeal.prototype;
		
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
	var applicationKey;
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
		if (typeof window["appodeal"] == 'undefined')//
			return;
					
		if (this.runtime.isAndroid){
			applicationKey = this.properties[0];
		}
		else if (this.runtime.isiOS){
			applicationKey = this.properties[1];
		}
		isOverlap = this.properties[2]==0?false:true;
		isTest = this.properties[3]==0?false:true;
		//
		//email = this.properties[4];
		//licenseKey = this.properties[5];
		email = "cranberrygame@yahoo.com";
		licenseKey = "4f497c9e9519e3a4d0470229a8bdb626";
		
		window["appodeal"]["setLicenseKey"](email, licenseKey);
		window["appodeal"]["setUp"](applicationKey, isOverlap, isTest);
		
		//			
		var self = this;
		window["appodeal"]['onBannerAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnBannerAdPreloaded, self);
		};			
		window["appodeal"]['onBannerAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnBannerAdLoaded, self);
		};
		window["appodeal"]['onBannerAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnBannerAdShown, self);
		};			
		window["appodeal"]['onBannerAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnBannerAdHidden, self);
		};			
		//
		window["appodeal"]['onFullScreenAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnFullScreenAdPreloaded, self);
		};			
		window["appodeal"]['onFullScreenAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnFullScreenAdLoaded, self);
		};
		window["appodeal"]['onFullScreenAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnFullScreenAdShown, self);
		};			
		window["appodeal"]['onFullScreenAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnFullScreenAdHidden, self);
		};
		//
		window["appodeal"]['onRewardedVideoAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnRewardedVideoAdPreloaded, self);
		};			
		window["appodeal"]['onRewardedVideoAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnRewardedVideoAdLoaded, self);
		};
		window["appodeal"]['onRewardedVideoAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnRewardedVideoAdShown, self);
		};			
		window["appodeal"]['onRewardedVideoAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnRewardedVideoAdHidden, self);
		};
		window["appodeal"]['onRewardedVideoAdCompleted'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.OnRewardedVideoAdCompleted, self);
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
	Cnds.prototype.OnFullScreenAdPreloaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnFullScreenAdLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnFullScreenAdShown = function ()
	{
		return true;
	};
	Cnds.prototype.OnFullScreenAdHidden = function ()
	{
		return true;
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
	Cnds.prototype.IsShowingBannerAd = function ()
	{
	    if (typeof window["appodeal"] == 'undefined')
			return false;
			
		return window["appodeal"]["isShowingBannerAd"]();
	};
	Cnds.prototype.IsShowingFullScreenAd = function ()
	{
	    if (typeof window["appodeal"] == 'undefined')
			return false;

		return window["appodeal"]["isShowingFullScreenAd"]();
	};	
	Cnds.prototype.IsShowingRewardedVideoAd = function ()
	{
	    if (typeof window["appodeal"] == 'undefined')
			return false;

		return window["appodeal"]["isShowingRewardedVideoAd"]();
	};
	//
	Cnds.prototype.LoadedBannerAd = function ()
	{
	    if (typeof window["appodeal"] == 'undefined')
			return false;
			
		return window["appodeal"]["loadedBannerAd"]();
	};
	Cnds.prototype.LoadedFullScreenAd = function ()
	{
	    if (typeof window["appodeal"] == 'undefined')
			return false;

		return window["appodeal"]["loadedFullScreenAd"]();
	};	
	Cnds.prototype.LoadedRewardedVideoAd = function ()
	{
	    if (typeof window["appodeal"] == 'undefined')
			return false;

		return window["appodeal"]["loadedRewardedVideoAd"]();
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppodeal.prototype.cnds.TriggerCondition, self);		
	};	
*/
	
//cranberrygame start
	Acts.prototype.PreloadBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["appodeal"] == 'undefined')
            return;
			
		window["appodeal"]["preloadBannerAd"]();	
	}
	Acts.prototype.ShowBannerAd = function (position)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["appodeal"] == 'undefined')
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
						
		window["appodeal"]["showBannerAd"](positionStr);		
	};
	Acts.prototype.ReloadBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["appodeal"] == 'undefined')
            return;
			
		window["appodeal"]["reloadBannerAd"]();		
	}
	Acts.prototype.HideBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["appodeal"] == 'undefined')
            return;
			
		window["appodeal"]["hideBannerAd"]();		
	};
	//
	Acts.prototype.PreloadFullScreenAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["appodeal"] == 'undefined')
            return;
			
		window["appodeal"]["preloadFullScreenAd"]();		
	}
	Acts.prototype.ShowFullScreenAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["appodeal"] == 'undefined')
            return;
			
		window["appodeal"]["showFullScreenAd"]();		
	};	
	Acts.prototype.PreloadRewardedVideoAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["appodeal"] == 'undefined')
            return;
			
		window["appodeal"]["preloadRewardedVideoAd"]();		
	}
	Acts.prototype.ShowRewardedVideoAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["appodeal"] == 'undefined')
            return;
			
		window["appodeal"]["showRewardedVideoAd"]();		
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