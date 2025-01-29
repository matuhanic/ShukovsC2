// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaFacebook = function(runtime)
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
cr.plugins_.cranberrygame_CordovaFacebook = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaFacebook.prototype;
		
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
*/
//cranberrygame start
	var appId = "";
	var appName = "";
	var appSecret = "";
	//
	var isLogined = false;
	//
	var userId = "";
	var fullName = "";
	var firstName = "";
	var lastName = "";
	var gender = "";
	var email = "";
//cranberrygame start: contributued by lancel
	var accessToken = "";	
//cranberrygame end	
	//
	var highScore = 0;
	//
	var errorMessage = "";
	//
	var curTag = "";
	var isShowingLeaderboard = false;
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		//
		appId = this.properties[0];
		appName = this.properties[1];
		appSecret = this.properties[2];

		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			var self = this;
		}
		else {
			//https://developers.facebook.com/docs/javascript/quickstart/v2.3
			//https://developers.facebook.com/docs/javascript/reference/v2.3
			
			window.fbAsyncInit = function() {			
				var channelfile = '//' + location.hostname;
				var pname = location.pathname;
				
				if (pname.substr(pname.length - 1) !== '/')
					pname = pname.substr(0, pname.lastIndexOf('/') + 1);
				
				FB.init({
				  "appId"      : appId,
				  "channelURL" : '//' + location.hostname + pname + 'channel.html',
				  "status"     : true,
				  "cookie"     : true,
				  "oauth"      : true,
				  "xfbml"      : false
				});
				
				FB.Event.subscribe('auth.login', function(response) {
					//console.log(JSON.stringify(result)); 
					userId = result["authResponse"]["userID"];
					accessToken = result["authResponse"]["accessToken"];
					isLogined = true;

					FB.api('/me', function(response) {
						//console.log(JSON.stringify(result))
						userId = result["id"];
						fullName = result["name"];
						firstName = result["first_name"];
						lastName = result["last_name"];
						gender = result["gender"];
						email = result["email"];

						self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLoginSucceeded, self);						
					});					
				});
				
				FB.Event.subscribe('auth.logout', function(result) {
					//console.log(JSON.stringify(result)); 
					isLogined = false;
					fullName = "";
					firstName = "";
					lastName = "";
					gender = "";
					email = "";
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLogoutSucceeded, self);					
				});
			};
			
			// Load the SDK asynchronously.  Don't bother if no App ID provided.
			if (appId.length)
			{
				(function(d){
					var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
					js = d.createElement('script'); js.id = id; js.async = true;
					js.src = "//connect.facebook.net/en_US/all.js";
					d.getElementsByTagName('head')[0].appendChild(js);
				}(document));
			}
			else
				log("Facebook object: no App ID provided.  Please enter an App ID before using the object.");		
		}		

		//leaderboard
		var html = "<div id='leaderboard'></div>";
		$("body").append(html);
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
	Cnds.prototype.OnLoginSucceeded = function (tag)
	{
		return cr.equals_nocase(tag, curTag);
	};
	Cnds.prototype.OnLoginFailed = function (tag)
	{
		return cr.equals_nocase(tag, curTag);
	};
	Cnds.prototype.OnLogoutSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnLogoutFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.IsLogined = function ()
	{
		return isLogined;
	};
	//
	Cnds.prototype.OnCheckPermissionsSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnCheckPermissionsFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnRequestPermissionsSucceeded = function (tag)
	{
		return cr.equals_nocase(tag, curTag);
	};
	Cnds.prototype.OnRequestPermissionsFailed = function (tag)
	{
		return cr.equals_nocase(tag, curTag);
	};	
	//
	Cnds.prototype.OnPromptWallPostSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnPromptWallPostFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnPromptWallPostLinkThisAppSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnPromptWallPostLinkThisAppFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnPromptWallPostLinkSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnPromptWallPostLinkFailed = function ()
	{
		return true;
	};
	//
	Cnds.prototype.OnPublishWallPostSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnPublishWallPostFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnPublishWallPostLinkSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnPublishWallPostLinkFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnPublishWallPostLinkThisAppSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnPublishWallPostLinkThisAppFailed = function ()
	{
		return true;
	};
	//
	Cnds.prototype.OnPublishScoreSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnPublishScoreFailed = function ()
	{
		return true;
	};
	//
	Cnds.prototype.IsShowingLeaderboard = function ()
	{
		return isShowingLeaderboard;
	};
	//
	Cnds.prototype.OnRequestHighScoreSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnRequestHighScoreFailed = function ()
	{
		return true;
	};
	//	
	Cnds.prototype.OnInviteSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnInviteFailed = function ()
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.TriggerCondition, self);
	};	
*/
	
	Acts.prototype.Login = function (permissions, tag) //gizmodude4 - changed parameter to string
	{
		if (isLogined)
			return;

		var self = this;
			
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;

			//Graph API Explorer
			//https://developers.facebook.com/tools/explorer/145634995501895/?method=GET&path=me%3Ffields%3Did%2Cname&version=v2.1
			//https://developers.facebook.com/docs/graph-api/reference/v2.1
			//https://developers.facebook.com/docs/graph-api/reference/user/feed
			//https://developers.facebook.com/docs/graph-api/using-graph-api/v2.1#publishing
			if (!window['cordova']) {
				//NOTE : Developers should call facebookConnectPlugin.browserInit(<appId>) before login - 
				//Web App ONLY (see Web App Guide): https://github.com/Wizcorp/phonegap-facebook-plugin/blob/master/platforms/web/README.md
				//var appId = prompt("Enter FB Application ID", "");
				facebookConnectPlugin['browserInit'](appId);
			}
			
			//permission: https://developers.facebook.com/docs/facebook-login/permissions/v2.2
			facebookConnectPlugin['login']( permissions.split(','), //cranberrygame
				function (result) { 
/*
{
"authResponse":
{
"accessToken": "CAATupo....ZDZD",
"userID": "1599038253641111",
"expiresIn": 6420,
"signedResult": "WeAZ9...3ln0"
},
"status": "connected"
}
*/				
					//console.log(JSON.stringify(result)); 
					userId = result["authResponse"]["userID"];
					accessToken = result["authResponse"]["accessToken"];
					isLogined = true;
					
					facebookConnectPlugin['api']('/me', [], 
						function (result) {
/*
{
"id": "1404109319901111",
"first_name": "Suji",
"timezone": 9,
"email": "xxxx@xxx.com",
"verified": false,
"name": "Suji Kang",
"locale": "ko_KR",
"link": "https://www.facebook.com/app_scoped_user_id/1404109319901111/",
"last_name": "Kang",
"gender": "female",
"updated_time": "2015-03-19T05:13:30+000"
}
*/					
							//console.log(JSON.stringify(result));
							userId = result["id"];
							fullName = result["name"];
							firstName = result["first_name"];
							lastName = result["last_name"];
							gender = result["gender"];
							email = result["email"];
							
							curTag = tag;
							self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLoginSucceeded, self);
						}, 
						function (error) {
							//console.log(JSON.stringify(error));
							if (typeof error == "string")
								errorMessage = error;				
							else if (error["errorMessage"])
								errorMessage = error["errorMessage"];
							else
								errorMessage = JSON.stringify(error);

							curTag = tag;
							self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLoginSucceeded, self);
						}
					);					
				},
				function (error) { 
					//console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
						
					curTag = tag;					
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLoginFailed, self);						
				}
			);
		}
		else {
			FB.login(function(result) {
/*
{
"authResponse":
{
"accessToken": "CAATupo....ZDZD",
"userID": "1599038253641111",
"expiresIn": 6420,
"signedResult": "WeAZ9...3ln0"
},
"status": "connected"
}
*/
				//console.log(JSON.stringify(result));
			
				userId = result["authResponse"]["userID"];
				accessToken = result["authResponse"]["accessToken"];
				isLogined = true;
					
				//if (result["authResponse"])
				//	onFBLogin();
				
				FB.api('/me', function(result) {
/*
{
"id": "1404109319901111",
"first_name": "Suji",
"timezone": 9,
"email": "xxxx@xxx.com",
"verified": false,
"name": "Suji Kang",
"locale": "ko_KR",
"link": "https://www.facebook.com/app_scoped_user_id/1404109319901111/",
"last_name": "Kang",
"gender": "female",
"updated_time": "2015-03-19T05:13:30+000"
}
*/					
						//console.log(JSON.stringify(result));
						userId = result["id"];
						fullName = result["name"];
						firstName = result["first_name"];
						lastName = result["last_name"];
						gender = result["gender"];
						email = result["email"];
						
						curTag = tag;
						self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLoginSucceeded, self);							
					}
/*
					, 
					function (error) {
						//console.log(JSON.stringify(error));
						if (typeof error == "string")
							errorMessage = error;				
						else if (error["errorMessage"])
							errorMessage = error["errorMessage"];
						else
							errorMessage = JSON.stringify(error);

						curTag = tag;
						self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLoginSucceeded, self);
					}
*/					
				);				
			}, {scope: permissions});
		}
	};
	
	Acts.prototype.Logout = function ()
	{
		if (!isLogined)
			return;

		var self = this;

		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;

			facebookConnectPlugin['logout']( 
				function (result) { 
					//console.log(JSON.stringify(result)); 
					isLogined = false;
					fullName = "";
					firstName = "";
					lastName = "";
					gender = "";
					email = "";
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLogoutSucceeded, self);
				},
				function (error) { 
					//console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);

					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnLogoutFailed, self);
				}
			);		
		}
		else {
			FB.logout(function(response) {
			});		
		}			
	};
		
	//
	Acts.prototype.CheckPermissions = function (permissions)
	{
		if (!isLogined)
			return;
			
		var self = this;
		
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;

			facebookConnectPlugin['api']('/me/permissions', [], 
				function(result) {
/*
{"data":[
{"status":"granted", "permission":"user_friends"},
{"status":"granted", "permission":"email"},
{"status":"granted", "permission":"publish_actions"},
{"status":"granted", "permission":"publish_profile"}
]}
*/			
					//console.log(JSON.stringify(result)) 
				
					var arrCheckPermissions = permissions.split(',');
					var resultSuccess = true;
					for (var i = 0; i < arrCheckPermissions.length; i++) {
						var checkPermission = arrCheckPermissions[i].trim();
						var arrPermissions = result['data'];
						var exist = false;
						for (var j = 0; j < arrPermissions.length; j++) {
							if (arrPermissions[j]["status"] == "granted" && arrPermissions[j]["permission"] == checkPermission)
								exist = true;
						}
						
						if (!exist) {
							resultSuccess = false;
							break;
						}
					}
					
					if (resultSuccess) {
						self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnCheckPermissionsSucceeded, self);
					}
					else {
						self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnCheckPermissionsFailed, self);
					}
				},
				function(error) {
					//console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
						
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnCheckPermissionsFailed, self);					
				}			
			);	
		}
		else {
		}
	};
	
	Acts.prototype.RequestPermissions = function (permissions, tag)
	{
		if (!isLogined)
			return;
		
		var self = this;
		
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;

			facebookConnectPlugin['login']( permissions.split(','), //cranberrygame
				function (result) { 
					//console.log(JSON.stringify(result)) 
					accessToken = result["authResponse"]["accessToken"];
					
					curTag = tag;
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnRequestPermissionsSucceeded, self);

				},
				function (error) { 
					//console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);

					curTag = tag;					
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnRequestPermissionsFailed, self);						
				}
			);	
		}
		else {
		}
	}

	//
	Acts.prototype.PromptWallPost = function ()
	{
		if (!isLogined)
			return;

		var self = this;
		
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			facebookConnectPlugin['showDialog']( { 'method': "feed" }, 
				function (result) { 
					console.log(JSON.stringify(result)) 
					//result["post_id"] //ex) 159903825364317_1607631796120296
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPromptWallPostSucceeded, self);				
				},
				function (error) { 
					onsole.log(JSON.stringify(error)) 
					//error["errorMessage"] //ex) User cancelled dialog
					//error["errorCode"] //ex) 4201
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);

					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPromptWallPostFailed, self);				
				}
			);
		}
		else {
			FB.ui({ "method": "feed" }, function(result) {
				//if (!result || result.error)
				//	  console.error(result);
			});		
		}		
	};
	
	Acts.prototype.PromptWallPostLink = function (url_, name_, description_, caption_, picture_)
	{
		if (!isLogined)
			return;
			
		var self = this;
		
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			facebookConnectPlugin['showDialog']({
				"method": "feed",
				"link": url_,
				"name": name_,
				"description": description_,
				"caption": caption_,
				"picture": picture_
				}, 
				function(result) {
					console.log(JSON.stringify(result));
					//result["post_id"] //ex) 159903825364317_1607631796120296				
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPromptWallPostLinkSucceeded, self);				
				}, 
				function(error){
					console.log(JSON.stringify(error));
					//error["errorMessage"] //ex) User cancelled dialog
					//error["errorCode"] //ex) 4201
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
						
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPromptWallPostLinkFailed, self);				
				}
			);
		}
		else {
			FB.ui({
				"method": "feed",
				"link": url_,
				"picture": picture_,
				"name": name_,
				"caption": caption_,
				"description": description_
			}, 
			function(result) {
				//if (!result || result.error)
				//	console.error(result);
			});		
		}
	};
	
	Acts.prototype.PromptWallPostLinkThisApp = function (name_, description_, caption_, picture_)
	{
		if (!isLogined)
			return;
			
		var self = this;	

		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			facebookConnectPlugin['showDialog']({
				"method": "feed",
				"link": "http://apps.facebook.com/" + appId + "/",
				"name": name_,
				"description": description_,
				"caption": caption_,
				"picture": picture_
				}, 
				function(result) {
					console.log(JSON.stringify(result));
					//result["post_id"] //ex) 159903825364317_1607631796120296
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPromptWallPostLinkThisAppSucceeded, self);				
				}, 
				function(error){
					console.log(JSON.stringify(error));
					//error["errorMessage"] //ex) User cancelled dialog
					//error["errorCode"] //ex) 4201
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
				
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPromptWallPostLinkThisAppFailed, self);				
				}
			);
		}
		else {
			FB.ui({
				"method": "feed",
				"link": "http://apps.facebook.com/" + appId + "/",
				"picture": picture_,
				"name": name_,
				"caption": caption_,
				"description": description_
			}, 
			function(result) {
				  //if (!result || result.error)
					//		  console.error(result);
			});		
		}		
	};
	
	//	
	Acts.prototype.PublishWallPost = function (message_)
	{
		if (!isLogined)
			return;
	
		var self = this;
		
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
				
			//http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
			//https://github.com/Wizcorp/phonegap-facebook-plugin/issues/588
			//https://github.com/Wizcorp/phonegap-facebook-plugin/issues/524
			var serialize = function(obj) {
			  var str = [];
			  for(var p in obj)
				if (obj.hasOwnProperty(p)) {
				  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			  return str.join("&");
			}
			//console.log(serialize({foo: "hi there", bar: "100%" })); //foo=hi%20there&bar=100%25		
			
			var publish = {
				"message": message_
			};
			
			facebookConnectPlugin['api']('/me/feed?method=post&' + serialize(publish), ['publish_actions'], 
				function (result) {
					console.log(JSON.stringify(result));
					//result["id"] //ex) "159903825364317_1607631796120296"
					
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishWallPostSucceeded, self);				
				}, 
				function (error) {
					console.log(JSON.stringify(error));
					//error //ex1) "Session: an attempt was made to request new permissions for a session that has a pending request"
							//ex2) {"errorMessage":"Duplicate status message", "errorType":"FacebookApiException", "errorCode":"506"}
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
					
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishWallPostFailed, self);				
				}
			);
		}
		else {
			var publish = {
				"method": 'stream.publish',
				"message": message_
			};

			FB.api('/me/feed', 'POST', publish, function(result) {
				//if (!result || result.error)
				//	console.error(result);
			});		
		}
	};
	
	Acts.prototype.PublishWallPostLink = function (message_, url_, name_, description_, caption_, picture_)
	{
		if (!isLogined)
			return;
	
		var self = this;	
		
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			//http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
			//https://github.com/Wizcorp/phonegap-facebook-plugin/issues/588
			//https://github.com/Wizcorp/phonegap-facebook-plugin/issues/524
			var serialize = function(obj) {
			  var str = [];
			  for(var p in obj)
				if (obj.hasOwnProperty(p)) {
				  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			  return str.join("&");
			}
			//console.log(serialize({foo: "hi there", bar: "100%" })); //foo=hi%20there&bar=100%25		
			
			var publish = {
				"message": message_,
				"link": url_,
				"name": name_,
				"description": description_,
				"caption": caption_
			};
			if (picture_.length)
				publish["picture"] = picture_;

/*
			var publish = {};
			if (message_)
				publish["message"] = message_;
			if (url_)
				publish["link"] = url_;
			if (name_)
				publish["name"] = name_;
			if (description_)
				publish["description"] = description_;
			if (caption_)
				publish["caption"] = caption_;
			if (picture_)
				publish["picture"] = picture_;			
*/				
			
			facebookConnectPlugin['api']('/me/feed?method=post&' + serialize(publish), ['publish_actions'], 
				function (result) {
					console.log(JSON.stringify(result));
					//result["id"] //ex) "159903825364317_1607631796120296"
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishWallPostLinkSucceeded, self);					
				}, 
				function (error) {
					console.log(JSON.stringify(error));
					//error //ex1) "Session: an attempt was made to request new permissions for a session that has a pending request"
							//ex2) {"errorMessage":"Duplicate status message", "errorType":"FacebookApiException", "errorCode":"506"}
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
						
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishWallPostLinkFailed, self);				
				}
			);			
		}
		else {
			var publish = {
					"method": 'stream.publish',
					"message": message_,
					"link": url_,
					"name": name_,
					"caption": caption_,
					"description": description_
				};
			
			if (picture_.length)
				publish["picture"] = picture_;

			FB.api('/me/feed', 'POST', publish, function(result) {
				//if (!result || result.error)
				//	console.error(result);
			});		
		}
	};
	
	Acts.prototype.PublishWallPostLinkThisApp = function (message_, name_, description_, caption_, picture_)
	{
		if (!isLogined)
			return;

		var self = this;
			
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			var serialize = function(obj) {
			  var str = [];
			  for(var p in obj)
				if (obj.hasOwnProperty(p)) {
				  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			  return str.join("&");
			}
			//console.log(serialize({foo: "hi there", bar: "100%" })); //foo=hi%20there&bar=100%25		
			
			var publish = {
				"message": message_,
				"link": "http://apps.facebook.com/" + appId + "/",			
				"name": name_,
				"description": description_,
				"caption": caption_
			};
			if (picture_.length)
				publish["picture"] = picture_;
			
			facebookConnectPlugin['api']('/me/feed?method=post&' + serialize(publish), ['publish_actions'], 
				function (result) {
					console.log(JSON.stringify(result));
					//result["id"] //ex) "159903825364317_1607631796120296"
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishWallPostLinkThisAppSucceeded, self);					
				}, 
				function (error) {
					console.log(JSON.stringify(error));
					//error //ex1) "Session: an attempt was made to request new permissions for a session that has a pending request"
							//ex2) {"errorMessage":"Duplicate status message", "errorType":"FacebookApiException", "errorCode":"506"}
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
						
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishWallPostLinkThisAppFailed, self);				
				}
			);
		}
		else {
		}	
	};
	
	//
	Acts.prototype.PublishScore = function (score_)
	{
		if (!isLogined)
			return;

		var self = this;
			
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			//http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
			//https://github.com/Wizcorp/phonegap-facebook-plugin/issues/588
			//https://github.com/Wizcorp/phonegap-facebook-plugin/issues/524
			var serialize = function(obj) {
			  var str = [];
			  for(var p in obj)
				if (obj.hasOwnProperty(p)) {
				  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			  return str.join("&");
			}
			//console.log(serialize({foo: "hi there", bar: "100%" })); //foo=hi%20there&bar=100%25		
			
			var publish = {
				"score": Math.floor(score_)
			};
			
			facebookConnectPlugin['api']('/me/scores?method=post&' + serialize(publish), ['publish_actions'], 
				function (result) {
					console.log(JSON.stringify(result));
					//result["success"] //ex) true					
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishScoreSucceeded, self);				
				}, 
				function (error) {
					console.log(JSON.stringify(error));
					//error //ex1) "Session: an attempt was made to request new permissions for a session that has a pending request"
							//ex2) {"errorMessage":"Duplicate status message", "errorType":"FacebookApiException", "errorCode":"506"}
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
						
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishScoreFailed, self);				
				}
			);
		}
		else {
			FB.api('/' + userId + '/scores', 'POST', { "score": Math.floor(score_), "access_token": appId + "|" + appSecret }, function(result) {
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnPublishScoreSucceeded, self);
				
				//if (!result || result.error)
				//	console.error(result);
		    });		
		}
	};

function leaderboard_html(ranks, names, scores) {
	//http://www.smashingmagazine.com/2014/09/15/making-modal-windows-better-for-everyone/
	//http://media.mediatemple.netdna-cdn.com/wp-content/uploads/2014/accessible.html
	//http://codepen.io/scottohara/pen/lIdfv

	var html = "<div class='modal-overlay' id='modal_window' aria-hidden='true' role='dialog' aria-labelledby='modal_title'>";
	html += "<div class='modal-content' id='modal_holder' role='document'>";
	html += "<button class='btn-close' id='modal_close' type='button' aria-label='close'>";
	html += "  &times;";
	html += "</button>";
	html += "<h3 id='modal_title'>Facebook Leaderboard</h3>";
	//
	html += "<table>";
	html += "<!-- cranberrygame start: line -->";
	html += "<tr>";
	html += "<td style='width: 10%; min-width: 20px;'>";
	html += "<span>";
	html += "<span>";
	html += "Rank";
	html += "</span>";
	html += "</span>";
	html += "</td>";
	html += "<td style='width: 65%;'>";
	html += "<div>";
	html += "Name"
	html += "</div>";
	html += "</td>";
	html += "<td style='width: 25%;'>";
	html += "<div>";
	html += "Score";
	html += "</div>";
	html += "</td>";
	html += "</tr>";
	html += "<!-- cranberrygame end -->";	
	for (var i = 0 ; i < ranks.length ; i++){
		var rank = ranks[i];
		var name = names[i];
		var score = scores[i];
		html += "<!-- cranberrygame start: line -->";
		html += "<tr>";
		html += "<td style='width: 10%; min-width: 20px;'>";
		html += "<span>";
		html += "<span>";
		html += rank;
		html += "</span>";
		html += "</span>";
		html += "</td>";
		html += "<td style='width: 65%;'>";
		html += "<div>";
		html += name
		html += "</div>";
		html += "</td>";
		html += "<td style='width: 25%;'>";
		html += "<div>";
		html += score;
		html += "</div>";
		html += "</td>";
		html += "</tr>";
		html += "<!-- cranberrygame end -->";
	}
	html += "</table>";
	//
	html += "</div>";
	html += "</div>";
	html += "<div id='modal_close'></div>";		
	$("#leaderboard").append(html);

	var mOverlay = document.getElementById('modal_window');
	var mClose = document.getElementById('modal_close');
	var modal = document.getElementById('modal_holder');
	var allNodes = document.querySelectorAll("*");
	var modalOpen = false;
	var lastFocus;
	var i;

	lastFocus = document.activeElement;
	mOverlay.setAttribute('aria-hidden', 'false');
	modalOpen = true;
	modal.setAttribute('tabindex', '0');
	modal.focus();
	  
	mClose.addEventListener('click', _HideLeaderboard);

	// Close modal window by clicking on the overlay
	mOverlay.addEventListener('click', function( e ) {
		if (e.target == modal.parentNode) {
			_HideLeaderboard()
		}
	}, false);

	// Restrict focus to the modal window when it's open.
	// Tabbing will just loop through the whole modal.
	// Shift + Tab will allow backup to the top of the modal,
	// and then stop.
	function focusRestrict ( event ) {
		if ( modalOpen && !modal.contains( event.target ) ) {
			event.stopPropagation();
			modal.focus();
		}
	}

	// restrict tab focus on elements only inside modal window
	for (i = 0; i < allNodes.length; i++) {
		allNodes.item(i).addEventListener('focus', focusRestrict);
	}
}
	
function _HideLeaderboard() {
	//http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
	var myNode = document.getElementById('leaderboard');
	var fc = myNode.firstChild;
	while( fc ) {
		myNode.removeChild( fc );
		fc = myNode.firstChild;
	}

	isShowingLeaderboard = false;
}
	
	Acts.prototype.ShowLeaderboard = function ()
	{
		//leaderboard_html(["1", "2"], ["name1", "name2"], ["score1", "score2"]);//
			
		if (!isLogined)
			return;
			
		var self = this;
		
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			//friends' high scores for specific app
			//The user_friends permission is required 
			//https://developers.facebook.com/docs/games/scores
			facebookConnectPlugin['api']('/' + appId + '/scores', [], 
				function(result) {
					console.log(JSON.stringify(result));
/*
{"data":[
{
"score":5, "user":{"id":"1401934583460016", "name":"Betty Amicjdfchchd Martinazzisky"}, "application": {"id":"1288298811490896", "name":"Avoid Bird"}
},
{
"score":4, "user":{"id":"1401934581110022", "name":"Jack Agfgfgchchd Hdffinazzisky"}, "application": {"id":"1288298811490896", "name":"Avoid Bird"}
}
]}
*/		
					var arr = result["data"];
					
					if (!arr) {
						console.error("Hi-scores request failed: " + result);
						return;
					}
						
					var ranks = [];
					var names = [];
					var scores = [];
					
					//
					var n = 10;//
					
					//
					arr.sort(function(a, b) {
						// descending order
						return b["score"] - a["score"];
					});				
					var i = 0, len = Math.min(arr.length, n);				
					for ( ; i < len; i++) {					
						var rank = i + 1;
						//arr[i]["user"]["name"]
						//arr[i]["score"];
						//arr[i]["user"]["id"];
						
						ranks.push(rank);
						names.push(arr[i]["user"]["name"]);
						scores.push(arr[i]["score"]);
					}
						
					leaderboard_html(ranks, names, scores);//				
					isShowingLeaderboard = true;
					
					if (!result || result.error) {
						console.error(result);
					} 
					else {
						log(result);
					}				
				},
				function (error) {
					console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
				}
			);
		}
		else {
		}
	};	

	Acts.prototype.HideLeaderboard = function ()
	{
		if (!isLogined)
			return;
			
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
				
			_HideLeaderboard();
		}
		else {
		}			
	}
	
	Acts.prototype.RequestHighScore = function ()
	{
		if (!isLogined)
			return;
		
		var self = this;

		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			//my high scores for all apps
			facebookConnectPlugin['api']('/me/scores', [], 
				function(result) {
					console.log(JSON.stringify(result));
	/*
	{"data":[
	{
	"score":5, "user":{"id":"1401934583460016", "name":"Betty Amicjdfchchd Martinazzisky"}, "application": {"id":"1288298811490896", "name":"Avoid Bird"}
	}
	]}
	*/		
					highScore = 0;
					var arr = result["data"];				
					for (var i = 0; i < arr.length; i++)
					{
						if (arr[i]["score"] > highScore)
							highScore = arr[i]["score"];
					}
					
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnRequestHighScoreSucceeded, self);		
				},
				function (error) {
					console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
						
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnRequestHighScoreFailed, self);
				}
			);
		}
		else {
			FB.api('/me/scores', 'GET', {}, function(result) {
				highScore = 0;
				var arr = result["data"];
				for (var i = 0; i < arr.length; i++)
				{
					if (arr[i]["score"] > highScore)
						highScore = arr[i]["score"];
				}
				
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnRequestHighScoreSucceeded, self);
			});		
		}
	};

	//
	Acts.prototype.Invite = function ()
	{
		if (!isLogined)
			return;

		var self = this;

		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			
			//Facebook plugin : showDialog apprequests new issue
			//I have the same issue. facebookConnectPlugin.showDialog works perfectly but doesn't actually create a notification.
			//https://github.com/Wizcorp/phonegap-facebook-plugin/issues/908		
			
			//http://quabr.com/28156272/cordova-facebook-plugin-showdialog-apprequests
			//http://stackoverflow.com/questions/28064953/cordova-invite-facebook-friends-to-app
			//http://whitenode.tistory.com/m/post/52		
			facebookConnectPlugin['showDialog']( { 'method': "apprequests", 'message': "Come on man, check out my app!." }, 
				function (result) { 
					console.log(JSON.stringify(result)); 
/*
{
"to": ["10200794491820809", "1439269706387371"],
"request": "485126918304157"
}
*/
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnInviteSucceeded, self);				
				},
				function (error) { 
					onsole.log(JSON.stringify(error)) 
					//error["errorMessage"] //ex) User cancelled dialog
					//error["errorCode"] //ex) 4201
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);

					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFacebook.prototype.cnds.OnInviteFailed, self);				
				}
			);
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
	Exps.prototype.UserId = function (ret)
	{
		// Float because these numbers are insanely huge now!
		ret.set_float(parseFloat(userId));
	};

	Exps.prototype.FullName = function (ret)
	{
		ret.set_string(fullName);
	};
	
	Exps.prototype.FirstName = function (ret)
	{
		ret.set_string(firstName);
	};
	
	Exps.prototype.LastName = function (ret)
	{
		ret.set_string(lastName);
	};

	Exps.prototype.Gender = function (ret)
	{
		ret.set_string(gender);
	};
	
	Exps.prototype.Email = function (ret)
	{
		ret.set_string(email);
	};

	Exps.prototype.AccessToken = function (ret)
	{
		ret.set_string(accessToken);
	};
	
	//
	Exps.prototype.Score = function (ret)
	{
		ret.set_int(highScore);
	};
	
	//
	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(errorMessage);
	};
//cranberrygame end
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());