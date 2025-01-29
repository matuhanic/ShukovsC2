// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.Reinarte_Facebook = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Reinarte_Facebook.prototype;

	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	var appId = "";
	var appName = "";
	var appSecret = "";
	var isLogined = false;
	var userId = "";
	var fullName = "";
	var firstName = "";
	var lastName = "";
	var gender = "";
	var locale = "";
	var email = "";
	var pictureURL = "";
	var accessToken = "";
	var myHighScore = 0;
	var errorMessage = "";
	var isShowingLeaderboard = false;

	typeProto.onCreate = function()
	{
		if(this.runtime.isBlackberry10 || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81){
			var scripts=document.getElementsByTagName("script");
			var scriptExist=false;
			for(var i=0;i<scripts.length;i++){
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
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		appId = this.properties[1];
		appName = this.properties[2];
		appSecret = this.properties[0];

		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			var self = this;
		}
		else {
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
			};
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
		var html = "<div id='leaderboard'></div>";
		$("body").append(html);		
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function (glw)
	{
	};
	function Cnds() {};
	Cnds.prototype.OnLoginSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnLoginFailed = function ()
	{
		return true;
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
	Cnds.prototype.OnPromptWallPostLinkSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnPromptWallPostLinkFailed = function ()
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
	Cnds.prototype.OnRequestHighScoreSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnRequestHighScoreFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnInviteSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnInviteFailed = function ()
	{
		return true;
	};	
	
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Login = function (permissions)
	{
		if (isLogined)
			return;

		var self = this;
			
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			if (!window['cordova']) {
				facebookConnectPlugin['browserInit'](appId);
			}
			facebookConnectPlugin['login']( permissions.split(','),
				function (result) { 
					userId = result["authResponse"]["userID"];
					accessToken = result["authResponse"]["accessToken"];
					isLogined = true;
					
					facebookConnectPlugin['api']('/me', [], 
						function (result) {
							userId = result["id"];
							fullName = result["name"];
							firstName = result["first_name"];
							lastName = result["last_name"];
							gender = result["gender"];
							email = result["email"];
							locale = result["locale"];
							self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnLoginSucceeded, self);
						}, 
						function (error) {
							if (typeof error == "string")
								errorMessage = error;				
							else if (error["errorMessage"])
								errorMessage = error["errorMessage"];
							else
								errorMessage = JSON.stringify(error);
							self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnLoginSucceeded, self);
						}
					);					
				},
				function (error) { 
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);					
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnLoginFailed, self);						
				}
			);
		}
		else {
			FB.login(function(result) {
				userId = result["authResponse"]["userID"];
				accessToken = result["authResponse"]["accessToken"];
				isLogined = true;
				FB.api('/me?fields=name,first_name,last_name,email,gender,locale', function(result) {
					fullName = result["name"];
					firstName = result["first_name"];
					lastName = result["last_name"];
					gender = result["gender"];
					email = result["email"];
					locale = result["locale"];
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnLoginSucceeded, self);						
			});	
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
					isLogined = false;
					fullName = "";
					firstName = "";
					lastName = "";
					gender = "";
					email = "";
					locale = "";
					pictureURL = "";
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnLogoutSucceeded, self);
				},
				function (error) { 
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);

					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnLogoutFailed, self);
				}
			);		
		}
		else {
			FB.logout(function(response) {
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
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnPromptWallPostLinkSucceeded, self);				
				}, 
				function(error){
					console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnPromptWallPostLinkFailed, self);				
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
			var serialize = function(obj) {
			  var str = [];
			  for(var p in obj)
				if (obj.hasOwnProperty(p)) {
				  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			  return str.join("&");
			}
			var publish = {
				"message": message_,
				"link": url_,
				"name": name_,
				"description": description_,
				"caption": caption_
			};
			if (picture_.length)
				publish["picture"] = picture_;
			facebookConnectPlugin['api']('/me/feed?method=post&' + serialize(publish), ['publish_actions'], 
				function (result) {
					console.log(JSON.stringify(result));
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnPublishWallPostLinkSucceeded, self);					
				}, 
				function (error) {
					console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnPublishWallPostLinkFailed, self);				
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
			});		
		}
	};

	Acts.prototype.PublishScore = function (score_)
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
			var publish = {
				"score": Math.floor(score_)
			};
			
			facebookConnectPlugin['api']('/me/scores?method=post&' + serialize(publish), ['publish_actions'], 
				function (result) {
					console.log(JSON.stringify(result));				
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnPublishScoreSucceeded, self);				
				}, 
				function (error) {
					console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnPublishScoreFailed, self);				
				}
			);
		}
		else {
			FB.api('/' + userId + '/scores', 'POST', { "score": Math.floor(score_), "access_token": appId + "|" + appSecret }, function(result) {
				self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnPublishScoreSucceeded, self);
		    });		
		}
	};

function leaderboard_html(ranks, names, scores) {

	var html = "<div class='modal-overlay' id='modal_window' aria-hidden='true' role='dialog' aria-labelledby='modal_title'>";
	html += "<div class='modal-content' id='modal_holder' role='document'>";
	html += "<button class='btn-close' id='modal_close' type='button' aria-label='close'>";
	html += "  &times;";
	html += "</button>";
	html += "<h3 id='modal_title'>Facebook Leaderboard</h3>";
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
	mOverlay.addEventListener('click', function( e ) {
		if (e.target == modal.parentNode) {
			_HideLeaderboard()
		}
	}, false);
	function focusRestrict ( event ) {
		if ( modalOpen && !modal.contains( event.target ) ) {
			event.stopPropagation();
			modal.focus();
		}
	}

	for (i = 0; i < allNodes.length; i++) {
		allNodes.item(i).addEventListener('focus', focusRestrict);
	}
}
	
function _HideLeaderboard() {
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
		if (!isLogined)
			return;
			
		var self = this;
		
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;
			facebookConnectPlugin['api']('/' + appId + '/scores', [], 
				function(result) {
					console.log(JSON.stringify(result));
					var arr = result["data"];
					
					if (!arr) {
						console.error("Hi-scores request failed: " + result);
						return;
					}
					var ranks = [];
					var names = [];
					var scores = [];
					var n = 10;
					arr.sort(function(a, b) {
						return b["score"] - a["score"];
					});				
					var i = 0, len = Math.min(arr.length, n);				
					for ( ; i < len; i++) {					
						var rank = i + 1;
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
			facebookConnectPlugin['api']('/me/scores', [], 
				function(result) {
					console.log(JSON.stringify(result));
					myHighScore = 0;
					var arr = result["data"];				
					for (var i = 0; i < arr.length; i++)
					{
						if (arr[i]["score"] > myHighScore)
							myHighScore = arr[i]["score"];
					}
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnRequestHighScoreSucceeded, self);		
				},
				function (error) {
					console.log(JSON.stringify(error));
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnRequestHighScoreFailed, self);
				}
			);
		}
		else {
			FB.api('/me/scores', 'GET', {}, function(result) {
				myHighScore = 0;
				var arr = result["data"];
				for (var i = 0; i < arr.length; i++)
				{
					if (arr[i]["score"] > myHighScore)
						myHighScore = arr[i]["score"];
				}
				self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnRequestHighScoreSucceeded, self);
			});		
		}
	};

	Acts.prototype.Invite = function ()
	{
		if (!isLogined)
			return;

		var self = this;

		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof facebookConnectPlugin == 'undefined')
				return;		
			facebookConnectPlugin['showDialog']( { 'method': "apprequests", 'message': "Come on man, check out my app!." }, 
				function (result) { 
					console.log(JSON.stringify(result)); 
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnInviteSucceeded, self);				
				},
				function (error) { 
					onsole.log(JSON.stringify(error)) 
					if (typeof error == "string")
						errorMessage = error;				
					else if (error["errorMessage"])
						errorMessage = error["errorMessage"];
					else
						errorMessage = JSON.stringify(error);
					self.runtime.trigger(cr.plugins_.Reinarte_Facebook.prototype.cnds.OnInviteFailed, self);				
				}
			);
		}
		else {
		}
	};	
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Meu_ID = function (ret)
	{
		ret.set_string(userId);
	};

	Exps.prototype.Nome_Todo = function (ret)
	{
		ret.set_string(fullName);
	};
	
	Exps.prototype.Primeiro_Nome = function (ret)
	{
		ret.set_string(firstName);
	};
	
	Exps.prototype.Ultimo_Nome = function (ret)
	{
		ret.set_string(lastName);
	};

	Exps.prototype.Genero = function (ret)
	{
		ret.set_string(gender);
	};
	
	Exps.prototype.Email = function (ret)
	{
		ret.set_string(email);
	};

	Exps.prototype.Token_Acesso = function (ret)
	{
		ret.set_string(accessToken);
	};
	
	Exps.prototype.Recorde = function (ret)
	{
		ret.set_int(myHighScore);
	};
	
	Exps.prototype.Erro_Mensagem = function (ret)
	{
		ret.set_string(errorMessage);
	};
	
	Exps.prototype.Localidade = function (ret)
	{
		ret.set_string(locale);
	};
	
	Exps.prototype.URL_Imagem = function (ret,id)
	{
		pictureURL = "https://graph.facebook.com/" + id + "/picture?type=large";
		ret.set_string(pictureURL);
	};
	
	pluginProto.exps = new Exps();

}());