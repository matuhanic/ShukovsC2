// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaRevMob = function(runtime)
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
cr.plugins_.cranberrygame_CordovaRevMob = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaRevMob.prototype;
		
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
	var mediaId;
	var isOverlap;
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
		if (typeof window["revmob"] == 'undefined')//
			return;
					
		if (this.runtime.isAndroid){
			mediaId = this.properties[0];
		}
		else if (this.runtime.isiOS){
			mediaId = this.properties[1];
		}
		isOverlap = this.properties[2]==0?false:true;
		//
		//email = this.properties[3];
		//licenseKey = this.properties[4];
		email = "cranberrygame@yahoo.com";
		licenseKey = "31837c3186265652c8a64758a3cd50aa";
		
		window["revmob"]["setLicenseKey"](email, licenseKey);
		window["revmob"]["setUp"](mediaId, isOverlap);
		
		//			
		var self = this;
		window['revmob']['onBannerAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnBannerAdPreloaded, self);
		};			
		window['revmob']['onBannerAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnBannerAdLoaded, self);
		};
		window['revmob']['onBannerAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnBannerAdShown, self);
		};			
		window['revmob']['onBannerAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnBannerAdHidden, self);
		};		
		//
		window['revmob']['onInterstitialAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnInterstitialAdPreloaded, self);
		};			
		window['revmob']['onInterstitialAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnInterstitialAdLoaded, self);
		};
		window['revmob']['onInterstitialAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnInterstitialAdShown, self);
		};			
		window['revmob']['onInterstitialAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnInterstitialAdHidden, self);
		};
		//
		window['revmob']['onVideoAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnVideoAdPreloaded, self);
		};			
		window['revmob']['onVideoAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnVideoAdLoaded, self);
		};
		window['revmob']['onVideoAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnVideoAdShown, self);
		};			
		window['revmob']['onVideoAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnVideoAdHidden, self);
		};			
		//
		window['revmob']['onRewardedVideoAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnRewardedVideoAdPreloaded, self);
		};			
		window['revmob']['onRewardedVideoAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnRewardedVideoAdLoaded, self);
		};
		window['revmob']['onRewardedVideoAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnRewardedVideoAdShown, self);
		};			
		window['revmob']['onRewardedVideoAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnRewardedVideoAdHidden, self);
		};		
		window['revmob']['onRewardedVideoAdCompleted'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnRewardedVideoAdCompleted, self);
		};		
		//		
		window['revmob']['onPopupAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnPopupAdPreloaded, self);
		};			
		window['revmob']['onPopupAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnPopupAdLoaded, self);
		};
		window['revmob']['onPopupAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnPopupAdShown, self);
		};			
		window['revmob']['onPopupAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnPopupAdHidden, self);
		};
		//
		window['revmob']['onLinkAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnLinkAdPreloaded, self);
		};			
		window['revmob']['onLinkAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnLinkAdLoaded, self);
		};
		window['revmob']['onLinkAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnLinkAdShown, self);
		};			
		window['revmob']['onLinkAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.OnLinkAdHidden, self);
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
	Cnds.prototype.OnVideoAdPreloaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnVideoAdLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnVideoAdShown = function ()
	{
		return true;
	};
	Cnds.prototype.OnVideoAdHidden = function ()
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
	Cnds.prototype.OnPopupAdPreloaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnPopupAdLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnPopupAdShown = function ()
	{
		return true;
	};
	Cnds.prototype.OnPopupAdHidden = function ()
	{
		return true;
	};
	//
	Cnds.prototype.OnLinkAdPreloaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnLinkAdLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnLinkAdShown = function ()
	{
		return true;
	};
	Cnds.prototype.OnLinkAdHidden = function ()
	{
		return true;
	};
	//
	Cnds.prototype.LoadedBannerAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;
			
		return window["revmob"]["loadedBannerAd"]();
	};
	Cnds.prototype.LoadedInterstitialAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["loadedInterstitialAd"]();
	};	
	Cnds.prototype.LoadedVideoAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["loadedVideoAd"]();
	};
	Cnds.prototype.LoadedRewardedVideoAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["loadedRewardedVideoAd"]();
	};	
	Cnds.prototype.LoadedPopupAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["loadedPopupAd"]();
	};	
	Cnds.prototype.LoadedLinkAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["loadedLinkAd"]();
	};	
	//
	Cnds.prototype.IsShowingBannerAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;
			
		return window["revmob"]["isShowingBannerAd"]();
	};
	Cnds.prototype.IsShowingInterstitialAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["isShowingInterstitialAd"]();
	};	
	Cnds.prototype.IsShowingVideoAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["isShowingVideoAd"]();
	};
	Cnds.prototype.IsShowingRewardedVideoAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["isShowingRewardedVideoAd"]();
	};
	Cnds.prototype.IsShowingPopupAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["isShowingPopupAd"]();
	};	
	Cnds.prototype.IsShowingLinkAd = function ()
	{
	    if (typeof window["revmob"] == 'undefined')
			return false;

		return window["revmob"]["isShowingLinkAd"]();
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaRevMob.prototype.cnds.TriggerCondition, self);		
	};	
*/
	
//cranberrygame start
	Acts.prototype.PreloadBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["preloadBannerAd"]();	
	}
	Acts.prototype.ShowBannerAd = function (position)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
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
						
		window["revmob"]["showBannerAd"](positionStr);		
	};
	Acts.prototype.ReloadBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["reloadBannerAd"]();		
	}
	Acts.prototype.HideBannerAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["hideBannerAd"]();		
	};
	//
	Acts.prototype.PreloadInterstitialAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["preloadInterstitialAd"]();		
	}
	Acts.prototype.ShowInterstitialAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["showInterstitialAd"]();		
	};	
	//
	Acts.prototype.PreloadVideoAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["preloadVideoAd"]();		
	}
	Acts.prototype.ShowVideoAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["showVideoAd"]();		
	};	
	//
	Acts.prototype.PreloadRewardedVideoAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["preloadRewardedVideoAd"]();		
	}
	Acts.prototype.ShowRewardedVideoAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["showRewardedVideoAd"]();		
	};
	//
	Acts.prototype.PreloadPopupAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["preloadPopupAd"]();		
	}
	Acts.prototype.ShowPopupAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["showPopupAd"]();		
	};
	//
	Acts.prototype.PreloadLinkAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["preloadLinkAd"]();		
	}
	Acts.prototype.ShowLinkAd = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;
        if (typeof window["revmob"] == 'undefined')
            return;
			
		window["revmob"]["showLinkAd"]();		
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