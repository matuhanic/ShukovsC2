// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.FGLAPI = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.FGLAPI.prototype;
	var fglRuntime = null;
	var fglInstance = null;
	var fglReady = false;
  
  var triggerReady = function()
  {
    if(fglRuntime != null)
    {
      fglRuntime.trigger(pluginProto.cnds.onReadyEvent, fglInstance);
    }
  }
	
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
	// FGL ready function
	typeProto.fglReadyCallback = function()
	{
    fglReady = true;
    
    triggerReady();
	}

	// called on startup for each object type
	typeProto.onCreate = function()
	{
    if(!("fgl" in window))
    {
      window["fgl"] = new window['FGLImplementationTestingSDK']();
    }
    
    fgl["create"](document.body);
    fgl["onReady"](typeProto.fglReadyCallback);
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		fglRuntime = this.runtime;
		fglInstance = this;
    
    if(fglReady == true) //if fgl is already ready, we need to trigger ready functions as the last attempt will have failed
    {
      triggerReady();
    }
		
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
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
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
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.crossPromotionEnabled = function ()
	{
		if("fgl" in window)
		{
			return fgl["crossPromotionEnabled"];
		}
		
		return false;
	};
	
	Cnds.prototype.isPremium = function ()
	{
		if("fgl" in window)
		{
			return fgl["isPremium"]();
		}
		
		return false;
	};
	
	Cnds.prototype.unlockEnabled = function ()
	{
		if("fgl" in window)
		{
			return fgl["unlockEnabled"];
		}
		
		return false;
	};
	
	Cnds.prototype.onUnlockSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.onUnlockFailure = function ()
	{
		return true;
	};
	
	Cnds.prototype.onBrandingEnabled = function ()
	{
		return true;
	};
  
	Cnds.prototype.onReadyEvent = function ()
	{
		return true;
	};
	
	Cnds.prototype.brandingEnabled = function ()
	{
		if("fgl" in window)
		{
			return fgl["brandingEnabled"];
		}
		
		return false;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// showAd - show an FGL ad
	Acts.prototype.showAd = function ()
	{
		if("fgl" in window)
		{
			fgl["showAd"]();
		}
		//else throw new Error("no fgl api def");
	};
	
	// showMoreGames - show FGL cross-promotion page
	Acts.prototype.showMoreGames = function ()
	{
		if("fgl" in window)
		{
			fgl["showMoreGames"]();
		}
		//else throw new Error("no fgl api def");
	};
	
	// initiateUnlockFunction - initiate unlock process
	Acts.prototype.initiateUnlockFunction = function ()
	{
		if("fgl" in window)
		{
			fgl["inApp"]["initiateUnlockFunction"](	function () { fglRuntime.trigger(pluginProto.cnds.onUnlockSuccess, fglInstance); },
													function () { fglRuntime.trigger(pluginProto.cnds.onUnlockFailure, fglInstance); } );
		}
		//else throw new Error("no fgl api def");
	};
	
	// submitScore - submit a score to the leaderboard
	Acts.prototype.submitScore = function (score)
	{
		if("fgl" in window)
		{
			fgl["submitScore"](score);
		}
		//else throw new Error("no fgl api def");
	};
	
	// displayScoreboard - submit a score to the leaderboard
	Acts.prototype.displayScoreboard = function ()
	{
		if("fgl" in window)
		{
			fgl["displayScoreboard"]();
		}
		//else throw new Error("no fgl api def");
	};
	
	// showBrandingLogo - adds the branding logo to the document -- currently does not work!
	Acts.prototype.showBrandingLogo = function (x, y)
	{
		if("fgl" in window)
		{
			if(fgl["brandingEnabled"])
			{
				//if branding is enabled, add the branding logo
			}
		}
		//else throw new Error("no fgl api def");
	};
	
	// hideBrandingLogo - hides the branding logo from the document -- currently does not work!
	Acts.prototype.hideBrandingLogo = function ()
	{
		if("fgl" in window)
		{
			if(fgl["brandingEnabled"])
			{
				//if branding is enabled, hide the branding logo
			}
		}
		//else throw new Error("no fgl api def");
	};
	
	// handleBrandingClick - should be called by the developer when the logo is clicked
	Acts.prototype.handleBrandingClick = function ()
	{
		if("fgl" in window)
		{
			fgl["handleBrandingClick"]();
		}
		//else throw new Error("no fgl api def");
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// BrandingLogo - gets the branding logo url as a string
	Exps.prototype.BrandingLogo = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		if("fgl" in window)
		{
			var logo;
			logo = fgl["getBrandingLogo"]();
			ret.set_string(logo);		// for ef_return_string
		}
		else ret.set_string("fgl branding not enabled!");
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());