// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.CordovaAdmobPro = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{	

	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.CordovaAdmobPro.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	var admobid = {};
	var rewVidId = "";

	// called on startup for each object type
	typeProto.onCreate = function()
	{
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

	admobid = { banner: this.properties[0], interstitial: this.properties[1]};
	rewVidId = this.properties[2];


	};

	function indexToSize(index) {

		switch (index) {
		case 0:		return "SMART_BANNER";
		case 1:		return "BANNER";
		case 2:		return "MEDIUM_RECTANGLE";
		case 3:		return "FULL_BANNER";
		case 4:		return "LEADERBOARD";
		case 5:		return "SKYSCRAPER";
		}

	};

	function indexToBoolean(index){

		switch (index) {
		case 0:		return true;
		case 1:		return false;
		}

	}

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	//Banners
	
	Acts.prototype.removeBanner = function ()
	{
		if (typeof window['AdMob'] == 'undefined') {return;}else{
		window['AdMob'].removeBanner();}
	}

	Acts.prototype.loadBanner = function (pos, size, overlp, test)
	{
		if (typeof window['AdMob'] == 'undefined') {return;}else{
		window['AdMob'].createBanner({adId: admobid.banner, adSize: indexToSize(size), position: pos+1, overlap: indexToBoolean(overlp), isTesting: indexToBoolean(test), autoShow: true});}
	}

	Acts.prototype.onlyLoadBanner = function (size, overlp, test)
	{
		if (typeof window['AdMob'] == 'undefined') {return;}else{
		window['AdMob'].createBanner({adId: admobid.banner, adSize: indexToSize(size), 
			overlap: indexToBoolean(overlp), isTesting: indexToBoolean(test), autoShow: false});}
	}

	Acts.prototype.showBanner = function (pos)
	{
		if (typeof window['AdMob'] == 'undefined') {return;}else{
		window['AdMob'].showBanner(pos+1);}
	}

	//Inters

	Acts.prototype.loadInterstitial = function (overlp, test)
	{
		if (typeof window['AdMob'] == 'undefined') {return;}else{
		window['AdMob'].prepareInterstitial({adId: admobid.interstitial, isTesting: indexToBoolean(test), overlap: indexToBoolean(overlp), autoShow: true});}
	}

	Acts.prototype.onlyLoadInterstitial = function (overlp, test)
	{
		if (typeof window['AdMob'] == 'undefined') {return;}else{
		window['AdMob'].prepareInterstitial({adId: admobid.interstitial, isTesting: indexToBoolean(test), overlap: indexToBoolean(overlp), autoShow: false});}
	}

	Acts.prototype.showInterstitial = function ()
	{
		if (typeof window['AdMob'] == 'undefined') {return;}else{
		window['AdMob'].showInterstitial();}
	}

	//Reward videos

	Acts.prototype.loadShowRewVid = function (overlp, test)
	{
		if (typeof window['AdMob'] == 'undefined') {return;}else{
		window['AdMob'].prepareRewardVideoAd({adId: rewVidId, isTesting: indexToBoolean(test), overlap: indexToBoolean(overlp), autoShow: true});}
	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

}());