// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_ReviewApp = function(runtime)
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
cr.plugins_.cranberrygame_ReviewApp = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_ReviewApp.prototype;
		
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
	var autoShowReviewAppDialog;
	var showReviewAppDialogPer;
	var title;
	var message;
	var reviewAppUrl = "";
	var reviewAppCount = 0;
	var REVIEW_APP_KEY_RUN_COUNT ="ReviewKeyRunCount";
	var REVIEW_APP_KEY_ALREADY_REVIEWED ="ReviewKeyAlreadyReviewed";
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
		var self = this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_ReviewApp.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if ((typeof window['reviewapp'] == 'undefined'))
				return;
				
			var self = this;
			window['reviewapp']['onGetReviewAppCount'] = function() {
				reviewAppCount = window['reviewapp']['reviewAppCount'];
				curTag = window['reviewapp']['tag'];
				self.runtime.trigger(cr.plugins_.cranberrygame_ReviewApp.prototype.cnds.OnGetReviewAppCount, self);
			};					
		}
		else {
		}
		
		autoShowReviewAppDialog = this.properties[0]==0?false:true;
		showReviewAppDialogPer = this.properties[1];
		title = this.properties[2];
		message = this.properties[3];
		reviewAppUrl = '';
		if (this.runtime.isAndroid) {
			reviewAppUrl = this.properties[5];
		}
		else if (this.runtime.isBlackberry10) {
			reviewAppUrl = this.properties[6];
		}
		else if (this.runtime.isiOS) {
			reviewAppUrl = this.properties[7];
		}
		else if (this.runtime.isWindows8App) {
			reviewAppUrl = this.properties[8];
		}		
		else {
			reviewAppUrl = this.properties[4];
		}
		//
		if(this.runtime.isCordova){
			if(reviewAppUrl.indexOf("?")==-1){
				reviewAppUrl += "?platform=cordova";
			}
			else{
				reviewAppUrl += "&platform=cordova";
			}
			
		}		

		if (reviewAppUrl == '')
			return;

		if (localStorage.getItem(REVIEW_APP_KEY_RUN_COUNT) == null)
		{
			localStorage.setItem(REVIEW_APP_KEY_RUN_COUNT, 0);
		}
		localStorage.setItem(REVIEW_APP_KEY_RUN_COUNT, parseInt(localStorage.getItem(REVIEW_APP_KEY_RUN_COUNT))+1);
			
		if (autoShowReviewAppDialog) {
			if (localStorage.getItem(REVIEW_APP_KEY_ALREADY_REVIEWED) == null)
			{
				localStorage.setItem(REVIEW_APP_KEY_ALREADY_REVIEWED, 0);
			}
	
			if ( (parseInt(localStorage.getItem(REVIEW_APP_KEY_RUN_COUNT)) % showReviewAppDialogPer == 0) && (parseInt(localStorage.getItem(REVIEW_APP_KEY_ALREADY_REVIEWED)) == 0) ) {
				this.showReviewAppDialog(true);
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
	instanceProto.showReviewAppDialog = function (auto)
	{
		if (reviewAppUrl == '')
			return;
		
		var self = this;

		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window['reviewapp'] == 'undefined')
				return;

			navigator["notification"]["confirm"](
				message,
				function (buttonIndex){
					if (auto)
						localStorage.setItem(REVIEW_APP_KEY_ALREADY_REVIEWED, 1);
				
					if (buttonIndex == 1) 
					{
						self.openReviewAppUrlDirectly();
					}
					else if (buttonIndex == 2) {
					};             	
				},
				title,
				//['OK','Cancel']
				['Yes','No']
			);
		}
		else {
			if (auto && this.runtime.isAmazonWebApp) {
				//not supported yet
				return;
			}
			
			var r = confirm(title + '\r\n' + message);
			if (r == true) {
				if (auto)
					localStorage.setItem(REVIEW_APP_KEY_ALREADY_REVIEWED, 1);

				//window.open(reviewAppUrl);
				this.openReviewAppUrlDirectly();
			} 
			else {
			}
		}				
	};

	instanceProto.resetAutoShowReviewAppDialog = function ()
	{
		if (reviewAppUrl == '')
			return;
		
		/*
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81)) {
			if (typeof window['reviewapp'] == 'undefined')
				return;
		}
		else {
		}
		*/
		
		var self = this;	
		localStorage.setItem(REVIEW_APP_KEY_RUN_COUNT, 0);
		localStorage.setItem(REVIEW_APP_KEY_ALREADY_REVIEWED, 0);			
	}
	
	instanceProto.openReviewAppUrlDirectly = function ()
	{
		if (reviewAppUrl == '')
			return;
			
		var self = this;		
						
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81) && !this.runtime.isAmazonWebApp) {
			if (typeof window['reviewapp'] == 'undefined')
				return;

			if (self.runtime.isAndroid) {
				if(reviewAppUrl.indexOf("market://")!=-1 || reviewAppUrl.indexOf("http://play.google.com")!=-1 || reviewAppUrl.indexOf("https://play.google.com")!=-1)
					//http://stackoverflow.com/questions/16431258/android-wont-open-google-play-links-from-javascript-in-web-app
					//window.location = reviewAppUrl; //x
					//window.open(reviewAppUrl, "_blank"); //x
					window.open(reviewAppUrl,"_system");
				else{
					window.open(reviewAppUrl, "_blank");
				}
			}
			else if (self.runtime.isBlackberry10) {
				window.location = reviewAppUrl;
			}
			else if (self.runtime.isiOS) {
				window.open(reviewAppUrl,"_system");
			}
			else if (self.runtime.isWindows8App) {
				//window.location = "ms-windows-store:REVIEW?PFN="+value;//privilege error
				//http://stackoverflow.com/questions/18311836/winjs-implenting-rate-and-review-in-windows-store-apps
				var uriToLaunch = reviewAppUrl;
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
				window['reviewapp']['openReviewAppUrlDirectly']('');
			}			
		}
		else {
			window.open(reviewAppUrl);
		}
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
	Cnds.prototype.OnGetReviewAppCount = function (tag)
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
		self.runtime.trigger(cr.plugins_.cranberrygame_ReviewApp.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.ShowReviewAppDialogByForce = function ()
	{
		this.showReviewAppDialog(false);		
	};
	
	Acts.prototype.ResetAutoShowReviewAppDialog = function ()
	{
		this.resetAutoShowReviewAppDialog();	
	};

	Acts.prototype.OpenReviewAppUrlDirectlyByForce = function ()
	{
		this.openReviewAppUrlDirectly();		
	};

	Acts.prototype.GetReviewAppCount = function (tag)
	{
		if (reviewAppUrl == '')
			return;
			
		if ((this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81)) {
			if (typeof window['reviewapp'] == 'undefined')
				return;
		}
		else {
		}
		
		var self = this;

		if (self.runtime.isAndroid) {
			window['reviewapp']['getReviewAppCount'](reviewAppUrl, tag);
		}
	};
	
	//
	Acts.prototype.ShowReviewAppDialog = function ()
	{
		if (!autoShowReviewAppDialog) {
			if (localStorage.getItem(REVIEW_APP_KEY_ALREADY_REVIEWED) == null)
			{
				localStorage.setItem(REVIEW_APP_KEY_ALREADY_REVIEWED, 0);
			}
	
			if ( (parseInt(localStorage.getItem(REVIEW_APP_KEY_RUN_COUNT)) % showReviewAppDialogPer == 0) && (parseInt(localStorage.getItem(REVIEW_APP_KEY_ALREADY_REVIEWED)) == 0) ) {
				this.showReviewAppDialog(true);
			}
		}		
	};	
	
	Acts.prototype.OpenReviewAppUrlDirectly = function ()
	{
		if (!autoShowReviewAppDialog) {
			if (localStorage.getItem(REVIEW_APP_KEY_ALREADY_REVIEWED) == null)
			{
				localStorage.setItem(REVIEW_APP_KEY_ALREADY_REVIEWED, 0);
			}
	
			if ( (parseInt(localStorage.getItem(REVIEW_APP_KEY_RUN_COUNT)) % showReviewAppDialogPer == 0) && (parseInt(localStorage.getItem(REVIEW_APP_KEY_ALREADY_REVIEWED)) == 0) ) {
				if (true)
					localStorage.setItem(REVIEW_APP_KEY_ALREADY_REVIEWED, 1);

				self.openReviewAppUrlDirectly();				
			}
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
	Exps.prototype.ReviewAppCount = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(reviewAppCount);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.RunCount = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var runCount = localStorage.getItem(REVIEW_APP_KEY_RUN_COUNT);
		ret.set_int(parseInt(runCount));				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());