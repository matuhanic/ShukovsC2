// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.AzureForWin8 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.AzureForWin8.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	var azureRuntime = null;
	var azureInst = null;

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.lastData = "";

		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.isWindows8 = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);

		if (this.isWindows8) {

			// Load mobile services script asynchronously

			var s = document.createElement("script");
			s.src = "/MobileServicesJavaScriptClient/MobileServices.js";
			document.getElementsByTagName("head")[0].appendChild(s);

			// Throw error when correct references aren't included
			if (typeof Microsoft == "undefined") {
			    throw new WinJS["ErrorFromName"]("NoReference", "You need to add the Azure Mobile Services JavaScript Client to your references. Please refer to the documentation provided with the Azure Mobile Services plugin for Construct 2");
			}

			// Instantiate runtime

			azureRuntime = this.runtime;
			azureInst = this;

			// Get plugin properties and assign

			this.appURL = this.properties[0];
			this.appKey = this.properties[1];

			// Throw error when App URL is left blank
			if (this.appURL === "") {
			    throw new WinJS["ErrorFromName"]("NoAppURL", "You need to add the App URL to the AzureForWindows8 object in Construct 2. Please refer to the documentation provided with the Azure Mobile Services plugin for Construct 2");
			}

			// Throw error when App key is left blank
			if (this.appURL === "") {
			    throw new WinJS["ErrorFromName"]("NoAppKey", "You need to add the App Key to the AzureForWindows8 object in Construct 2. Please refer to the documentation provided with the Azure Mobile Services plugin for Construct 2");
			}

	        this.mobileService = new Microsoft["WindowsAzure"]["MobileServices"]["MobileServiceClient"](
	            this.appURL,
	            this.appKey
	        );

	        // Retrieve previous login details from the vault

            this.vault = new Windows["Security"]["Credentials"]["PasswordVault"]();

		    try {
		        var stored = this.vault["findAllByResource"]("userData");
		        stored = stored[0];
		        this.cred = this.vault["retrieve"]("userData", stored["userName"]);
		        this.LastUserID = this.cred["userName"];

		        this.mobileService["currentUser"] = {
				    userId: this.cred["userName"],
				    mobileServiceAuthenticationToken: this.cred["password"]
				};
		    } catch (e) {
		        // No stored details
		    }
    	}

	};
		
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnComplete = function ()
	{
		return true;
	};

	Cnds.prototype.OnInsert = function ()
	{
		return true;
	};

	Cnds.prototype.OnUpdate = function ()
	{
		return true;
	};

	Cnds.prototype.OnDelete = function ()
	{
		return true;
	};

	Cnds.prototype.AuthSuccess = function ()
	{
		return true;
	};

	Cnds.prototype.AuthError = function ()
	{
		return true;
	};

	Cnds.prototype.IsAuthenticated = function ()
	{
	    if (this.isWindows8) {
	        if (this.LastUserID) {
	            return true;
	        } else {
	            return false;
	        }
		} else {
			return false;
		}
	};

	Cnds.prototype.LoggedOut = function ()
	{
		return true;
	};

	Cnds.prototype.ConnectionError = function ()
	{
		return true;
	};

	Cnds.prototype.OnInsertError = function ()
	{
		return true;
	};

	Cnds.prototype.OnUpdateError = function ()
	{
		return true;
	};

	Cnds.prototype.OnDeleteError = function ()
	{
		return true;
	};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	function mapObjectToC2Json(object) {

		if (object.length === 0) return null;

	    var height = Object.keys(object).length;
	    var width = Object.keys(object[0]).length;

	    var array = []

        // Map object to array
	    for (var i in object) {
	        for (var e in object[i]) {
	            object[i][e] === null ? object[i][e] = 0 : object[i][e] = '"' + object[i][e] + '"';
	            array.push(object[i][e]);
	        }
	    }

        // Reorder array for easy JSON stringification
	    var sortedArray = [];
	    for (var e = 0; e < width; e++) {
	        for (var i = 0; i < width*height; i += width) {
	            sortedArray.push(array[i + e]);
	        }
	    }

        // Create string in C2 format
	    var c2ArrayData = "[";
	    for (var i = 0; i < sortedArray.length; i++) {
	        if (i < sortedArray.length && i > 0) c2ArrayData += ",";
	        if (i % height === 0) c2ArrayData += "[";
	        c2ArrayData += "[" + sortedArray[i] + "]";
	        if ((i + 1) % height === 0) c2ArrayData += "]";
	    }
	    c2ArrayData += "]";

	    var c2Array = '{"c2array":true,"size":[' + width + ',' + height + ',1],"data":' + c2ArrayData + "}";

	    return c2Array;

	}

	var whereComparison = ["eq", "ne", "lt", "le", "gt", "ge"];
	var AscDesc = ["asc", "desc"];

	Acts.prototype.QueryTable = function (name_, count_, skip_, orderByColName_, ordeerAscDesc_, whereCol_, whereCompare_, whereVal_)
	{
		if (this.isWindows8) {
			var self = this;
	        var table = this.mobileService["getTable"](name_);
	        table["read"]("$filter=" + whereCol_ + " " + whereComparison[whereCompare_] + " '" + whereVal_ + "'" +
                      	 "&$orderby=" + orderByColName_ + " " + AscDesc[ordeerAscDesc_] +
                      	 "&$top=" + Math.max(0, count_) +
                      	 "&$skip=" + Math.max(0, skip_), null,
	                      function (error, response) {
	                          if (error !== null) {
	                              azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.ConnectionError, azureInst);
	                          } else {
	                              self["lastData"] = mapObjectToC2Json(response);
	                              azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.OnComplete, azureInst);
	                          }
	                      })
    	}
	};

	Acts.prototype.InsertRecord = function (name_, json_)
	{
		if (this.isWindows8) {
		    var table = this.mobileService["getTable"](name_);
		    var object = JSON.parse(json_);
		    var data = object["data"];
		    table["insert"](data, null, function (error, response) {
		        if (error !== null) {
		            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.OnInsertError, azureInst);
		        } else {
		            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.OnInsert, azureInst);
		        }
            });
	    }
	};

	Acts.prototype.UpdateRecord = function (name_, json_, id_)
	{
		if (this.isWindows8) {
		    var table = this.mobileService["getTable"](name_);
		    var object = JSON.parse(json_);
		    var data = object["data"];
		    data["id"] = id_;

            table["update"](data, null, function (error, response) {
		        if (error !== null) {
		            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.OnUpdateError, azureInst);
		        } else {
		            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.OnUpdate, azureInst);
		        }
            });
	    }
	};

	Acts.prototype.DeleteRecord = function (name_, id_)
	{
		if (this.isWindows8) {
		    var table = this.mobileService["getTable"](name_);
		    var data = { "id": id_ };
		    table["del"](data, null, function (error, response) {
		        if (error !== null) {
		            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.OnDeleteError, azureInst);
		        } else {
		            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.OnDelete, azureInst);
		        }
            });
		}
	};

	var identProvider = ["microsoftaccount",
						 "facebook",
						 "twitter",
						 "google"];

	Acts.prototype.Authenticate = function (identProvider_)
	{
		if (this.isWindows8) {
			var self = this;
	        new WinJS["Promise"](function (complete) {
	            self.mobileService["login"](identProvider[identProvider_]).done(function (results) {
	            	self.LastUserID = results["userId"];
	            	self.LastAuthToken = results["mobileServiceAuthenticationToken"];

	            	// Save sensitive data to the vault
					self.cred = new Windows["Security"]["Credentials"]["PasswordCredential"](
						"userData",
					    self.LastUserID,
					    self.LastAuthToken
				    );

				    self.vault["add"](self.cred);

				    // Retrieve full name from various identity providers
					var table = self.mobileService["getTable"]("Identities");
					table["read"]().then(function (data) {
					    var identities = data[0]["identities"];
					    if (identities["facebook"]) {
					        var fbAccessToken = identities["facebook"]["accessToken"];
					        jQuery.getJSON("https://graph.facebook.com/me?access_token=" + fbAccessToken, function (data) {
					            localStorage["azureFullName"] = data["name"];
					            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.AuthSuccess, azureInst);
			                });
					    } else if (identities["google"]) {
					        var googleAccessToken = identities["google"]["accessToken"];
					        jQuery.getJSON("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + googleAccessToken, function (data) {
					            localStorage["azureFullName"] = data["name"];
					            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.AuthSuccess, azureInst);
					        });
					    } else if (identities["twitter"]) {
					        var twitterUserID = identities["twitter"]["userId"]["split"](":")[1];
                            // Deprecated API
					        jQuery.getJSON("https://api.twitter.com/1/users/show.json?user_id=" + twitterUserID, function (data) {
					            localStorage["azureFullName"] = data["name"];
					            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.AuthSuccess, azureInst);
					        });
					    } else if (identities["microsoft"]) {
					        var liveAccessToken = identities["microsoft"]["accessToken"];
					        jQuery.getJSON("https://apis.live.net/v5.0/me/?method=GET&access_token=" + liveAccessToken, function (data) {
					            localStorage["azureFullName"] = data["name"];
					            azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.AuthSuccess, azureInst);
					        });
					    }
					});
	            }, function (error) {
	            	localStorage.removeItem("azureFullName");
	            	azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.AuthFail, azureInst);
	            });
	        });
    	}
	};

	Acts.prototype.LogOut = function ()
	{
		if (this.isWindows8) {
			var self = this;
			try {
		        var creds = this.vault["retrieveAll"]();
		        for (var i = 0; i < creds["size"]; i++) {
		            try {
		                this.vault["remove"](creds["getAt"](i));
		                self.LastUserID = null;
		                azureRuntime.trigger(cr.plugins_.AzureForWin8.prototype.cnds.LoggedOut, azureInst);
		            }
		            catch (e) { // Remove is best effort
		            }
		        }
		    }
		    catch (e) { // No credentials to remove
		    }
		}
	};

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.LastData = function (ret)
	{
		if (this.isWindows8) {
			ret.set_string(this["lastData"]);
		} else {
			ret.set_string("");
		}
	};

	Exps.prototype.LastFullName = function (ret)
	{
		if (this.isWindows8) {
			ret.set_string(localStorage["azureFullName"]);
		} else {
			ret.set_string("");
		}
	};

	pluginProto.exps = new Exps();

}());