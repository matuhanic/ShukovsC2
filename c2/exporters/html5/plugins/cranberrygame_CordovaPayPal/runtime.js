// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaPayPal = function(runtime)
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
cr.plugins_.cranberrygame_CordovaPayPal = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaPayPal.prototype;
		
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
	var sandboxClientId;
	var liveClientId;
	var sandboxMode;	
	var merchantName;
	var merchantPrivacyPolicyURL;
	var merchantUserAgreementURL;
	//
	var paymentId;
	var paymentCreateTime;
	var paymentAmount;
	var paymentCurrency;
	var paymentShortDescription;
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
		
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaPayPal.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof PayPalMobile == 'undefined')
            return;
	
		//Credentials (client id)
		//https://github.com/paypal/PayPal-Android-SDK#credentials
		//https://github.com/paypal/PayPal-iOS-SDK#credentials	
/*		
		sandboxClientId = this.properties[0];
		liveClientId = this.properties[1];
		merchantName = this.properties[2];
		merchantPrivacyPolicyURL = this.properties[3];
		merchantUserAgreementURL = this.properties[4];
		sandboxMode = this.properties[5];
*/
///*
		sandboxClientId = this.properties[0];
		liveClientId = this.properties[1];
		merchantName = "My test shop";
		merchantPrivacyPolicyURL = "http://www.yourserver.com/privacypolicy.html";
		merchantUserAgreementURL = "http://www.yourserver.com/useragreement.html";
		sandboxMode = this.properties[2];		
//*/		

		document.addEventListener('deviceready', function(){
			var clientIDs = {"PayPalEnvironmentProduction": liveClientId, "PayPalEnvironmentSandbox": sandboxClientId};
			PayPalMobile['init'](clientIDs, function() {
				var config = new PayPalConfiguration({'merchantName': merchantName, 'merchantPrivacyPolicyURL': merchantPrivacyPolicyURL, 'merchantUserAgreementURL': merchantUserAgreementURL});
				PayPalMobile['prepareToRender'](sandboxMode==0?'PayPalEnvironmentProduction':'PayPalEnvironmentSandbox', config,
				function() {
				});				
			});
		}, false);		
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
	Cnds.prototype.OnBuyNowSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnBuyNowFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnBuyInFutureSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnBuyInFutureFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnShareProfileSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnShareProfileFailed = function ()
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
		if (this.runtime.isAndroid && navigator.platform == 'Win32')//crosswalk emulator
			return;
			
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (this.runtime.isAndroid && navigator.platform == 'Win32')//crosswalk emulator
			return;
			
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaPayPal.prototype.cnds.TriggerCondition, self);
	};	
	
	Acts.prototype.Open = function (URL, locationBar)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (this.runtime.isAndroid && navigator.platform == 'Win32')//crosswalk emulator
			return;		
		
	};	
*/
	
//cranberrygame start
	Acts.prototype.BuyNow = function (amount, currency, shortDescription)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof PayPalMobile == 'undefined')
            return;
		
		var self = this;
	
		// single payment
		//https://github.com/paypal/PayPal-Android-SDK#single-payment
		//https://github.com/paypal/PayPal-iOS-SDK#single-payment
		//payment's amount should match subtotal+shipping+tax. subtotal is also mandatory when paymentDetails are used. Hope it helps!
		//https://github.com/paypal/PayPal-Cordova-Plugin/issues/7
		//var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
		//var payment = new PayPalPayment("50.00", "SGD", "Awesome Sauce", "Sale", paymentDetails);
		//var paymentDetails = new PayPalPaymentDetails(subtotal, shipping, tax);
		//var payment = new PayPalPayment(amount, currency, shortDescription, "Sale", paymentDetails);
		var payment = new PayPalPayment(amount, currency, shortDescription, "Sale");
		PayPalMobile['renderSinglePaymentUI'](payment,
		function(payment) {
			console.log("payment success: " + JSON.stringify(payment, null, 4));
			//payment['response']['state'] //approved
			//payment['response']['id'] //PAY-5UV89626C0126483AKRHCQJQ
			//payment['response']['create_time'] //2014-10-27T11:10:30Z
			//payment['response']['intent'] //sale			
			paymentId = payment['response']['id'];
			paymentCreateTime = payment['response']['create_time'];			
			paymentAmount = amount;
			paymentCurrency = currency;
			paymentShortDescription = shortDescription;		
			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaPayPal.prototype.cnds.OnBuyNowSucceeded, self);			
		}, 
		function(error) {
			console.log(error);
			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaPayPal.prototype.cnds.OnBuyNowFailed, self);			
		});		
	};
	
	Acts.prototype.BuyInFuture = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof PayPalMobile == 'undefined')
            return;
			
		var self = this;
		
        // future payment
		//https://github.com/paypal/PayPal-Android-SDK#future-payments
		//https://github.com/paypal/PayPal-iOS-SDK#future-payments
        PayPalMobile['renderFuturePaymentUI'](function(authorization) {
			console.log("authorization: " + JSON.stringify(authorization, null, 4));
			authorization['response']['code'] //ELqQrklopbu-7XQn_oqsy67oT6B9EHnBRvZHN5YIGWSyv7IcFm4EZ-3FLbmRuU_hui6hyfR7H2Elid3Nqn6qX8KHya4cLh1rAZweSUtcehnR-9nTlqYaae0lWQ5jJl1Qe-2Ll_B929dBWKmlK9kZyk
			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaPayPal.prototype.cnds.OnBuyInFutureSucceeded, self);			
		},
		function(error) {
			console.log(error);
			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaPayPal.prototype.cnds.OnBuyInFutureFailed, self);			
		});      		
	};

	Acts.prototype.ShareProfile = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof PayPalMobile == 'undefined')
            return;

		var self = this;
		
		// profile sharing
		//https://github.com/paypal/PayPal-Android-SDK#profile-sharing
		//https://github.com/paypal/PayPal-iOS-SDK#profile-sharing
		//https://developer.paypal.com/docs/integration/direct/identity/attributes/
        PayPalMobile['renderProfileSharingUI'](["profile", "email", "phone", "address", "futurepayments", "paypalattributes"], 
		function(authorization) {
			console.log("authorization: " + JSON.stringify(authorization, null, 4));
			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaPayPal.prototype.cnds.OnShareProfileSucceeded, self);			
		}, 
		function(error) {
			console.log(error);
			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaPayPal.prototype.cnds.OnShareProfileFailed, self);			
		}); 
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
	Exps.prototype.PaymentId = function (ret) //cranberrygame
	{     
		ret.set_string(paymentId);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	
	Exps.prototype.PaymentCreateTime = function (ret) //cranberrygame
	{     
		ret.set_string(paymentCreateTime);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	
	Exps.prototype.PaymentAmount = function (ret) //cranberrygame
	{     
		ret.set_string(paymentAmount);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};

	Exps.prototype.PaymentCurrency = function (ret) //cranberrygame
	{     
		ret.set_string(paymentCurrency);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};

	Exps.prototype.PaymentShortDescription = function (ret) //cranberrygame
	{     
		ret.set_string(paymentShortDescription);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());