// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_Leadbolt = function(runtime)
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
cr.plugins_.cranberrygame_Leadbolt = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_Leadbolt.prototype;
		
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
	var appBannerSectionId;
	var appOverlaySectionId;	
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
			self.runtime.trigger(cr.plugins_.cranberrygame_Leadbolt.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		//if (!(this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
		//	return;
			
		if (this.runtime.isBlackberry10) {
			appBannerSectionId = this.properties[2];
			appOverlaySectionId = this.properties[3];
		}
		else if (this.runtime.isWindows8App) {
			appBannerSectionId = this.properties[4];
			appOverlaySectionId = this.properties[5];
		}
		else {
			appBannerSectionId = this.properties[0];
			appOverlaySectionId = this.properties[1];
		}
			
		//
		//email = this.properties[6];
		//licenseKey = this.properties[7];
				
		//
		//
		//windows8 security: no remote js (<script>) script
		//<iframe id="ap_iframe" name="ap_iframe" style="width:768px;height:95px;margin:0 0px;" frameborder="0" src="http://ad.leadboltads.net/show_app_ad?section_id=332779467&lang=ko-KR&scr_w=768&scr_h=1366&referer=ms-appx%3A%2F%2Fcom.cranberrygame.leadbolthtml3%2Fwww%2Findex.html&w=768&h=95" allowtransparency="true" scrolling="no"></iframe>
		this.newDivTag = document.createElement('iframe');			
		var language = window.navigator.userLanguage || window.navigator.language;//IE//firefox/opera/safari
		//var left = this.layer.layerToCanvas(this.x, this.y, true);
		//var top = this.layer.layerToCanvas(this.x, this.y, false);
		//var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		//var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		//var w = Math.round(right - left);
		//var h = Math.round(bottom - top);
		//this.newDivTag.setAttribute("src", "http://ad.leadboltads.net/show_app_ad?section_id="+appBannerSectionId+"&lang=ko-KR&scr_w=768&scr_h=1366&referer=ms-appx%3A%2F%2Fcom.cranberrygame.leadbolthtml3%2Fwww%2Findex.html&w=320&h=50");			
		this.newDivTag.setAttribute("src", "http://ad.leadboltads.net/show_app_ad?section_id="+appBannerSectionId+"&lang="+language+"&scr_w="+screen.width+"&scr_h="+screen.height+"&referer="+encodeURIComponent(window.location.href)+"&w=320&h=50");
		//this.newDivTag.setAttribute("src", "http://ad.leadboltads.net/show_app_ad?section_id="+appBannerSectionId+"&lang="+language+"&scr_w="+screen.width+"&scr_h="+screen.height+"&referer="+encodeURIComponent(window.location.href)+"&w="+w+"&h="+h);
		this.newDivTag.setAttribute("id", "ap_iframe");
		this.newDivTag.setAttribute("name", "ap_iframe");
		this.newDivTag.setAttribute("frameborder", "0");
		this.newDivTag.setAttribute("allowtransparency", "true");
		this.newDivTag.setAttribute("scrolling", "no");
		this.newDivTag.setAttribute("style","left: 0px; top: 0px; position: absolute; z-index: 1; width: 320px; height: 50px;");
		document.getElementsByTagName("body")[0].appendChild(this.newDivTag);
		
/*
alert("0:");				
		var self = this;
		$(self.newDivTag).load(function () {
alert("1:");			
//			if (!self.runtime.isNWjs)
//				return;
alert("2:");				
//			var child_process = require("child_process");				
//			var process = window["process"] || nw["process"];
//			var path = require("path");
				
			//Failed to read the 'contentDocument' property from 'HTMLIFrameElement': Blocked a frame with origin "http://cranberrygame.com" from accessing a cross-origin frame.
			try{			
				var iframe = this.contentDocument.getElementsByTagName("iframe")[0];
alert("3:"+iframe);				
				$(iframe).load(function () {
alert("a:"+iframe);
					var itemAd = jQuery(this.contentDocument.getElementsByTagName("div")[0]).find('a');
alert("b:"+itemAd);					
					itemAd.click(function() { //ok
						var url = $(this).attr('href');
						console.log("url:" +url);
						//window.open(url, '_blank', 'location=no');
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
		
						child_process["exec"](opener + ' "' + url.replace(/"/, '\\\"') + '"');					
						//////////
						return false;
					});				
				});
			}
			catch(e){			
				console.log(e.message);	//Failed to read the 'contentDocument' property from 'HTMLIFramenewDivTagent': Blocked a frame with origin "http://localhost:50000" from accessing a cross-origin frame.
alert(e.message);				
			}
		});
*/
		
		// the banner does not seem to load if we default it to invisible.
		// so we default to displaying it, but position it to -1000,-1000 so it does not appear.
		this.newDivTagent_hidden = false;
		this.visible = true;
		
		this.x = -1000;
		this.y = -1000;
		this.width = 160;
		this.height = 600;
		
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		
		this.loadedBannerAd = false;//
		this.isShowingBannerAd = false;
			
		this.updatePosition(true);
		
		this.runtime.tickMe(this);
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
	instanceProto.tick = function ()
	{
		//if (!(this.runtime.isWindows8App))
		//	return;
			
		this.updatePosition();
	};
	
	var last_canvas_offset = null;
	var last_checked_tick = -1;
	
	instanceProto.updatePosition = function (first)
	{
		//if (!(this.runtime.isWindows8App))
		//	return;
			
		if (this.runtime.isDomFree || !this.newDivTag)
			return;
		
		// default to screen co-ords
		var left = this.x;
		var top = this.y;
		var right = this.x + this.width;
		var bottom = this.y + this.height;
		
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
		
		// Is invisible: hide
		if (!this.visible)
		{
			if (!this.newDivTagent_hidden)
				jQuery(this.newDivTag).hide();
			
			this.newDivTagent_hidden = true;
			return;
		}
			
		// Avoid redundant updates
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.newDivTagent_hidden)
			{
				jQuery(this.newDivTag).show();
				this.newDivTagent_hidden = false;
			}
			
			return;
		}
			
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		
		if (this.newDivTagent_hidden)
		{
			jQuery(this.newDivTag).show();
			this.newDivTagent_hidden = false;
		}
		
		var offx = Math.round(left);
		var offy = Math.round(top);
		jQuery(this.newDivTag).css("position", "absolute");
		jQuery(this.newDivTag).offset({left: offx, top: offy});
		jQuery(this.newDivTag).width(Math.round(right - left));
		jQuery(this.newDivTag).height(Math.round(bottom - top));
	};
	
	instanceProto.onDestroy = function ()
	{
		//if (!(this.runtime.isWindows8App))
		//	return;
			
		if (this.runtime.isDomFree || !this.newDivTag)
			return;
		
		jQuery(this.newDivTag).remove();
		this.newDivTag = null;
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
	Cnds.prototype.LoadedBannerAd = function ()
	{
		return this.loadedBannerAd;
	};
	Cnds.prototype.LoadedInterstitialAd = function ()
	{
	    return this.loadedInterstitialAd;
	};	
	//
	Cnds.prototype.IsShowingBannerAd = function ()
	{
		return this.isShowingBannerAd;
	};
	Cnds.prototype.IsShowingInterstitialAd = function ()
	{
		return this.isShowingInterstitialAd;
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
		self.runtime.trigger(cr.plugins_.cranberrygame_Leadbolt.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.PreloadBannerAd = function ()
	{

	}
	Acts.prototype.ShowBannerAd = function (position, size)
	{
		if (this.runtime.isDomFree || !this.newDivTag)
			return;

		switch (size) {
			case 0:
				this.width = 320;
				this.height = 50;
				break;
			case 1:
				this.width = 468;
				this.height = 60;
				break;
			case 2:
				this.width = 300;
				this.height = 250;
				break;
			case 3:
				this.width = 728;
				this.height = 90;
				break;
			case 4:
				this.width = 320;
				this.height = 480;
				break;
			case 5:
				this.width = 768;
				this.height = 1024;
				break;
			case 6:
				this.width = 480;
				this.height = 320;
				break;
			case 7:
				this.width = 1024;
				this.height = 768;
				break;
			case 8:
				this.width = 320;
				this.height = 568;
				break;
			case 9:
				this.width = 568;
				this.height = 320;
				break;
		}
		
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;
		var x = 0;
		var y = 0;
		var myWidth = this.width;
		var myHeight = this.height;
		
		switch (position) {
		case 0:		// top-left
			x = 0;
			y = 0;
			break;
		case 1:		// top-center
			x = winWidth / 2 - myWidth / 2;
			y = 0;
			break;
		case 2:		// top-right
			x = winWidth - myWidth;
			y = 0;
			break;
		case 3:		// left
			x = 0;
			y = winHeight / 2 - myHeight / 2;
			break;
		case 4:		// center
			x = winWidth / 2 - myWidth / 2;
			y = winHeight / 2 - myHeight / 2;
			break;
		case 5:		// right
			x = winWidth - myWidth;
			y = winHeight / 2 - myHeight / 2;
			break;
		case 6:		// bottom left
			x = 0;
			y = winHeight - myHeight;
			break;
		case 7:		// bottom center
			x = winWidth / 2 - myWidth / 2;
			y = winHeight - myHeight;
			break;
		case 8:		// bottom right
			x = winWidth - myWidth;
			y = winHeight - myHeight;
			break;
		}
		
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.visible = true;
		this.loadedBannerAd = false;//
		this.isShowingBannerAd = true;	
	};
	Acts.prototype.ReloadBannerAd = function ()
	{
	
	}	
	Acts.prototype.HideBannerAd = function ()
	{
		this.visible = false;
		this.isShowingBannerAd = false;
	};
	//
	Acts.prototype.PreloadInterstitialAd = function ()
	{
	}
	Acts.prototype.ShowInterstitialAd = function ()
	{
		//if (!(this.runtime.isBlackberry10 || this.runtime.isWindows8App))
		//	return;
		
		if (appOverlaySectionId == "")
			return;
			
		var url = "http://ad.leadboltads.net/show_app_wall?section_id=" + appOverlaySectionId;
			
		if (this.runtime.isBlackberry10) 
		{
			blackberry["invoke"]["invoke"]({
				'target': "sys.browser",
				'uri': url
			}, function(result){}, function(error){});
		}
		else if(this.runtime.isWindows8App){
			var childWindow = window.open(url, '_system', 'location=yes');
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

			child_process["exec"](opener + ' "' + url.replace(/"/, '\\\"') + '"');					
			//////////
		}		
		else
		{
			var childWindow = window.open(url, '_blank', 'location=yes');
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