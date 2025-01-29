// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_ShareApp = function(runtime)
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
cr.plugins_.cranberrygame_ShareApp = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_ShareApp.prototype;
		
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
	var shareAppUrl = '';
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
			self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		shareAppUrl = '';
		if (this.runtime.isAndroid) {
			shareAppUrl = this.properties[1];
		}
		else if (this.runtime.isBlackberry10) {
			shareAppUrl = this.properties[2];
		}
		else if (this.runtime.isiOS) {
			shareAppUrl = this.properties[3];
		}
		else if (this.runtime.isWindows8App) {
			shareAppUrl = this.properties[4];
		}		
		else if (this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) {
			shareAppUrl = this.properties[5];
		}
		else {
			shareAppUrl = this.properties[0];
		}
		//
		if(this.runtime.isCordova){
			if(shareAppUrl.indexOf("?")==-1){
				shareAppUrl += "?platform=cordova";
			}
			else{
				shareAppUrl += "&platform=cordova";
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
	Cnds.prototype.OnShareAppSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaFacebookSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaFacebookFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaTwitterSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaTwitterFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaWhatsappSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaWhatsappFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaSMSSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaSMSFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaEmailSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaEmailFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaGooglePlusSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaGooglePlusFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaLineSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareAppViaLineFailed = function ()
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
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		var self = this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.ShareApp = function (title, message)
	{
		if ((this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["socialsharing"] == 'undefined')
				return;
			var tempMessage = message;
			if(tempMessage == '')
				tempMessage = null;
			var tempTitle = title;
			if(tempTitle == '')
				tempTitle = null;
			var tempFile = null;
			var tempShareAppUrl = shareAppUrl;
			//var tempShareAppUrl = 'http://yahoo.com'; //o
			//var tempShareAppUrl = 'http://yahoo.com<>'; //x
			if(tempShareAppUrl == '')
				tempShareAppUrl = null;
 
			var self = this;
			window["plugins"]["socialsharing"]["share"](tempMessage, tempTitle, tempFile, tempShareAppUrl,
			function(result){
				console.log(result);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppSucceeded, self);
			},
			function(error){
				console.log(error);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppFailed, self);
			});
		}
		else {
		}
	};
	Acts.prototype.ShareAppViaFacebook = function (message)
	{
		if ((this.runtime.isiOS && typeof Ejecta != 'undefined')) {
			//https://github.com/samejack/SnsShare/blob/master/jquery.snsShare.js
			var link = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(shareAppUrl) + '&t=' + encodeURIComponent(message);
			//window.open(link, "_blank"); //not work on ejecta
			ejecta['openURL'](link);
		}
		else if ((this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["socialsharing"] == 'undefined')
				return;

			var tempMessage = message;
			if(tempMessage == '')
				tempMessage = null;
			var tempFile = null;
			var tempShareAppUrl = shareAppUrl;			
			if(tempShareAppUrl == '')
				tempShareAppUrl = null;

			var self = this;
			window["plugins"]["socialsharing"]["shareViaFacebook"](tempMessage, tempFile, tempShareAppUrl, 
			function(result){
				console.log(result);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaFacebookSucceeded, self);
			}, 
			function(error){
				console.log(error);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaFacebookFailed, self);

				var link = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(shareAppUrl) + '&t=' + encodeURIComponent(message);
				window.open(link, "_blank");
			});
		}
		else if((this.runtime.isBlackberry10 || this.runtime.isWindows8App)){
			//https://github.com/samejack/SnsShare/blob/master/jquery.snsShare.js
			var link = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(shareAppUrl) + '&t=' + encodeURIComponent(message);
			window.open(link, "_system");
		}
		else if(this.runtime.isNWjs){

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

			var link = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(shareAppUrl) + '&t=' + encodeURIComponent(message);
			child_process["exec"](opener + ' "' + link.replace(/"/, '\\\"') + '"');					
			//////////
		}		
		else {
			//https://github.com/samejack/SnsShare/blob/master/jquery.snsShare.js
			var link = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(shareAppUrl) + '&t=' + encodeURIComponent(message);
			window.open(link, "_blank");
		}
	};
	Acts.prototype.ShareAppViaTwitter = function (message)
	{
		if ((this.runtime.isiOS && typeof Ejecta != 'undefined')) {
			var link = 'http://twitter.com/home/?status=' + encodeURIComponent(message + ' ' + shareAppUrl);
			//window.open(link, "_blank"); //not work on ejecta
			ejecta['openURL'](link);
		}	
		else if ((this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["socialsharing"] == 'undefined')
				return;
				
			var tempMessage = message;
			if(tempMessage == '')
				tempMessage = null;
			var tempFile = null;
			var tempShareAppUrl = shareAppUrl;			
			if(tempShareAppUrl == '')
				tempShareAppUrl = null;
			
			if (this.runtime.isAndroid) {
				var self = this;
				window["plugins"]["socialsharing"]["shareViaTwitter"](tempMessage, tempFile, tempShareAppUrl, 
				function(result){
					console.log(result);
					self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaTwitterSucceeded, self);
				}, 
				function(error){
					console.log(error);
					self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaTwitterFailed, self);
					
					//http://stackoverflow.com/questions/7187016/facebook-and-twitter-share-for-mobile-web
					var link = 'https://mobile.twitter.com/compose/tweet?status=' + encodeURIComponent(message + ' ' + shareAppUrl);
					window.open(link, "_system");				
				});			
			}
			else {
				var self = this;
				window["plugins"]["socialsharing"]["shareViaTwitter"](tempMessage, tempFile, tempShareAppUrl, 
				function(result){
					console.log(result);
					self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaTwitterSucceeded, self);
				}, 
				function(error){
					console.log(error);
					self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaTwitterFailed, self);
					
					//http://stackoverflow.com/questions/7187016/facebook-and-twitter-share-for-mobile-web
					var link = 'https://mobile.twitter.com/compose/tweet?status=' + encodeURIComponent(message + ' ' + shareAppUrl);
					window.open(link, "_blank");				
				});			
			}			
		}
/*		
		if ((this.runtime.isBlackberry10)) 
		{
			var link = 'http://twitter.com/home/?status=' + encodeURIComponent(message + ' ' + shareAppUrl);	
			blackberry["invoke"]["invoke"]({
				'target': "sys.browser",
				'uri': link
			}, function(result){}, function(error){});
		}		
*/
		else if((this.runtime.isBlackberry10 || this.runtime.isWindows8App)){
			var link = 'http://twitter.com/home/?status=' + encodeURIComponent(message + ' ' + shareAppUrl);
			window.open(link, "_system");
		}
		else if(this.runtime.isNWjs){

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

			var link = 'http://twitter.com/home/?status=' + encodeURIComponent(message + ' ' + shareAppUrl);
			child_process["exec"](opener + ' "' + link.replace(/"/, '\\\"') + '"');					
			//////////
		}
		else {
			var link = 'http://twitter.com/home/?status=' + encodeURIComponent(message + ' ' + shareAppUrl);
			window.open(link, "_blank");		
		}
	};
	Acts.prototype.ShareAppViaWhatsapp = function (message)
	{
		if ((this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["socialsharing"] == 'undefined')
				return;
				
			var tempMessage = message;
			if(tempMessage == '')
				tempMessage = null;
			var tempFile = null;
			var tempShareAppUrl = shareAppUrl;			
			if(tempShareAppUrl == '')
				tempShareAppUrl = null;
			
			var self = this;
			window["plugins"]["socialsharing"]["shareViaWhatsApp"](tempMessage, tempFile, tempShareAppUrl, 
			function(result){
				console.log(result);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaWhatsappSucceeded, self);
			}, 
			function(error){
				console.log(error);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaWhatsappFailed, self);
			});
		}
		else {		
		}
	};
		
	Acts.prototype.ShareAppViaSMS = function (message)
	{
		if ((this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["socialsharing"] == 'undefined')
				return;
				
			var tempMessage = message + ' ' + shareAppUrl;
			if(tempMessage == '')
				tempMessage = null;
				
			var self = this;	
			window["plugins"]["socialsharing"]["shareViaSMS"](tempMessage, null, 
			function(result){
				console.log(result);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaSMSSucceeded, self);
			}, 
			function(error){
				console.log(error);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaSMSFailed, self);
			});
		}
		else {
		}
	};
	Acts.prototype.ShareAppViaEmail = function (title, message)
	{
		if ((this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["socialsharing"] == 'undefined')
				return;
				
			var tempMessage = message + ' ' + shareAppUrl;
			if(tempMessage == '')
				tempMessage = null;
			var tempTitle = title;
			if(tempTitle == '')
				tempTitle = null;
			var tempFiles = null;
					
			var self = this;					
			window["plugins"]["socialsharing"]["shareViaEmail"](tempMessage, tempTitle, null, null, null, tempFiles, 
			function(result){
				console.log(result);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaEmailSucceeded, self);
			}, 
			function(error){
				console.log(error);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaEmailFailed, self);
			});
		}
		else {
		}
	};
	Acts.prototype.ShareAppViaGooglePlus = function (message)
	{
		if ((this.runtime.isiOS && typeof Ejecta != 'undefined')) {
			//var link = 'https://plus.google.com/share?url=' + encodeURIComponent(message + ' ' + link);
			var link = 'https://plus.google.com/share?url=' + encodeURIComponent(link);
			//window.open(link, "_blank"); //not work on ejecta
			ejecta['openURL'](link);
		}	
		else if ((this.runtime.isAndroid) && !this.runtime.isAmazonWebApp) {
			if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["socialsharing"] == 'undefined')
				return;
				
			var tempMessage = message;
			if(tempMessage == '')
				tempMessage = null;
			var tempTitle = null;
			var tempFile = null;
			var tempShareAppUrl = shareAppUrl;			
			if(tempShareAppUrl == '')
				tempShareAppUrl = null;

			var self = this;
			window["plugins"]["socialsharing"]["shareVia"]('com.google.android.apps.plus', tempMessage, tempTitle, tempFile, tempShareAppUrl, 
			function(result){
				console.log(result);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaGooglePlusSucceeded, self);
			}, 
			function(error){
				console.log(error);
				self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaGooglePlusFailed, self);
				
				//var link = 'https://plus.google.com/share?url=' + encodeURIComponent(message + ' ' + shareAppUrl);
				//https://developers.google.com/+/web/share/#example-async-defer
				var link = 'https://plus.google.com/share?url=' + encodeURIComponent(shareAppUrl);
				window.open(link, "_blank");				
			});
		}
		else if((this.runtime.isBlackberry10 || this.runtime.isWindows8App)){
			//var link = 'https://plus.google.com/share?url=' + encodeURIComponent(message + ' ' + shareAppUrl);
			var link = 'https://plus.google.com/share?url=' + encodeURIComponent(shareAppUrl);
			window.open(link, "_system");		
		}
		else if(this.runtime.isNWjs){

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

			var link = 'https://plus.google.com/share?url=' + encodeURIComponent(shareAppUrl);
			child_process["exec"](opener + ' "' + link.replace(/"/, '\\\"') + '"');					
			//////////
		}		
		else {
			//var link = 'https://plus.google.com/share?url=' + encodeURIComponent(message + ' ' + shareAppUrl);
			var link = 'https://plus.google.com/share?url=' + encodeURIComponent(shareAppUrl);
			window.open(link, "_blank");		
		}
	};
	Acts.prototype.ShareAppViaLine = function (message)
	{
		if ((this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window["plugins"] == 'undefined' || typeof window["plugins"]["socialsharing"] == 'undefined')
				return;
				
			var tempMessage = message;
			if(tempMessage == '')
				tempMessage = null;
			var tempTitle = null;
			var tempFile = null;
			var tempShareAppUrl = shareAppUrl;			
			if(tempShareAppUrl == '')
				tempShareAppUrl = null;
			
			if (this.runtime.isAndroid) {
				var self = this;
				window["plugins"]["socialsharing"]["shareVia"]('jp.naver.line.android', tempMessage, tempTitle, tempFile, tempShareAppUrl, 
				function(result){
					console.log(result);
					self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaLineSucceeded, self);
				}, 
				function(error){
					console.log(error);
					self.runtime.trigger(cr.plugins_.cranberrygame_ShareApp.prototype.cnds.OnShareAppViaLineFailed, self);
				});
			}				
		}
		else {		
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