// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaAppsFlyer = function(runtime)
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
cr.plugins_.cranberrygame_CordovaAppsFlyer = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaAppsFlyer.prototype;
		
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
	var devKey = '';
	var iosItunesAppId = '';
	//
	var appsFlyerUid;
	var installConversionDataAfStatus;
	var installConversionDataAfMessage;		
	var installConversionDataMediaSource;
	var installConversionDataCampaign;
	var installConversionDataClickid;
	var installConversionDataAfSiteid;
	var installConversionDataAfSub1;
	var installConversionDataAfSub2;
	var installConversionDataAfSub3;
	var installConversionDataAfSub4;
	var installConversionDataAfSub5;
	var installConversionDataClickTime;
	var installConversionDataInstallTime;
	var installConversionDataAgency;
	var installConversionDataIsFb;
	var installConversionDataAdgroup;
	var installConversionDataAdgroupId;
	var installConversionDataCampaignId;
	var installConversionDataAdset;
	var installConversionDataAdsetId;
	var installConversionDataAdId;
			
	var installConversionDataLoadedAlreadyTriggered = false;
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
		
		var self = this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppsFlyer.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["appsFlyer"] == 'undefined')
        	return;
			
		devKey = this.properties[0];
		if (this.runtime.isiOS){
			iosItunesAppId = this.properties[1];
		}
		
		var args = [];
		//var devKey = "xxXXXXXxXxXXXXxXXxxxx8";  // your AppsFlyer devKey
		args.push(devKey);
		if (this.runtime.isiOS) {
		//	var iosItunesAppId = "123456789";            // your ios app id in app store
			args.push(iosItunesAppId);
		}
		window['plugins']['appsFlyer']['initSdk'](args);
		
		var self = this;
		window['plugins']['appsFlyer']['getAppsFlyerUID'](function(appsFlyerDeviceUid_) {
			appsFlyerUid = appsFlyerDeviceUid_;
		
			window['plugins']['appsFlyer']['onInstallConversionDataLoaded'] = function(conversionData) {		
				//var data = conversionData;
				if (typeof conversionData === "string") {//android
					conversionData = JSON.parse(conversionData);
				}
				//alert("debug consumeProduct0: "+JSON.stringify(conversionData));

				//var event = new CustomEvent('onInstallConversionDataLoaded', {'detail': data});
				//global.document.dispatchEvent(event);
				
				//https://support.appsflyer.com/entries/69768413-Accessing-AppsFlyer-Attribution-Conversion-Data-from-the-SDK-Deferred-Deep-linking-
				installConversionDataAdgroup = conversionData["adgroup"];
				if (!installConversionDataAdgroup)
					installConversionDataAdgroup ='';
				installConversionDataAdgroupId = conversionData["adgroup_id"];
				if (!installConversionDataAdgroupId)
					installConversionDataAdgroupId ='';
				installConversionDataAdId = conversionData["ad_id"];			
				if (!installConversionDataAdId)
					installConversionDataAdId ='';
				installConversionDataAdset = conversionData["Adset"];
				if (!installConversionDataAdset)
					installConversionDataAdset ='';
				installConversionDataAdsetId = conversionData["adset_id"];
				if (!installConversionDataAdsetId)
					installConversionDataAdsetId ='';
				installConversionDataAfMessage = conversionData["af_message"]; //organic install			
				if (!installConversionDataAfMessage)
					installConversionDataAfMessage ='';
				installConversionDataAfSiteid = conversionData["af_siteid"];
				if (!installConversionDataAfSiteid)
					installConversionDataAfSiteid ='';
				installConversionDataAfStatus = conversionData["af_status"]; //Organic
				if (!installConversionDataAfStatus)
					installConversionDataAfStatus ='';
				installConversionDataAfSub1 = conversionData["af_sub1"];
				if (!installConversionDataAfSub1)
					installConversionDataAfSub1 ='';
				installConversionDataAfSub2 = conversionData["af_sub2"];
				if (!installConversionDataAfSub2)
					installConversionDataAfSub2 ='';
				installConversionDataAfSub3 = conversionData["af_sub3"];
				if (!installConversionDataAfSub3)
					installConversionDataAfSub3 ='';
				installConversionDataAfSub4 = conversionData["af_sub4"];
				if (!installConversionDataAfSub4)
					installConversionDataAfSub4 ='';
				installConversionDataAfSub5 = conversionData["af_sub5"];
				if (!installConversionDataAfSub5)
					installConversionDataAfSub5 ='';
				installConversionDataAgency = conversionData["agency"];
				if (!installConversionDataAgency)
					installConversionDataAgency ='';
				installConversionDataCampaign = conversionData["campaign"];
				if (!installConversionDataCampaign)
					installConversionDataCampaign ='';
				installConversionDataCampaignId = conversionData["campaign_id"];
				if (!installConversionDataCampaignId)
					installConversionDataCampaignId ='';
				installConversionDataClickid = conversionData["clickid"];
				if (!installConversionDataClickid)
					installConversionDataClickid ='';
				installConversionDataClickTime = conversionData["click_time"];
				if (!installConversionDataClickTime)
					installConversionDataClickTime ='';
				installConversionDataInstallTime = conversionData["install_time"];
				if (!installConversionDataInstallTime)
					installConversionDataInstallTime ='';
				installConversionDataIsFb = conversionData["is_fb"];
				if (!installConversionDataIsFb)
					installConversionDataIsFb ='';
				installConversionDataMediaSource = conversionData["media_source"];
				if (!installConversionDataMediaSource)
					installConversionDataMediaSource ='';
				
				if (!installConversionDataLoadedAlreadyTriggered) {//for ios
					installConversionDataLoadedAlreadyTriggered = true;
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppsFlyer.prototype.cnds.OnInstallConversionDataLoaded, self);
				}			
			};
		});	
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
	
	//
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
	Cnds.prototype.OnInstallConversionDataLoaded = function ()
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
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
        if (typeof navigator["camera"] == 'undefined')
            return;
			
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
        if (typeof navigator["camera"] == 'undefined')
            return;
			
		var self = this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaAppsFlyer.prototype.cnds.TriggerCondition, self);
	};	
	
	Acts.prototype.Open = function (URL, locationBar)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
        if (typeof navigator["camera"] == 'undefined')
            return;	
		
	};	
*/
	
//cranberrygame start
	Acts.prototype.TrackEvent = function (eventName, eventValue)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["appsFlyer"] == 'undefined')
        	return;
			
		//eventName = "purchase";
		//eventValue = "0.99";
		window['plugins']['appsFlyer']['sendTrackingWithEvent'](eventName, eventValue);
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
	//
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
	Exps.prototype.AppsFlyerUid = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(appsFlyerUid);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAdgroup = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAdgroup);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAdgroupId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAdgroupId);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAdId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAdId);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};	
	Exps.prototype.InstallConversionDataAdset = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAdset);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAdsetId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAdsetId);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAfMessage = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAfMessage);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAfSiteid = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAfSiteid);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAfStatus = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAfStatus);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};	
	Exps.prototype.InstallConversionDataAfSub1 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAfSub1);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAfSub2 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAfSub2);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAfSub3 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAfSub3);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAfSub4 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAfSub4);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAfSub5 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAfSub5);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataAgency = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataAgency);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataCampaign = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataCampaign);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataCampaignId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataCampaignId);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataClickid = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataClickid);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataClickTime = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataClickTime);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataInstallTime = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataInstallTime);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataIsFb = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataIsFb);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.InstallConversionDataMediaSource = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(installConversionDataMediaSource);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());