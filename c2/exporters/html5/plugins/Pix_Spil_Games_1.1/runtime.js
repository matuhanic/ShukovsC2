// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.pix_spilgames = function(runtime) {
    this.runtime = runtime;
};

(function (w) {
    var self,
        typeProto,
        pluginProto,
        instanceProto;

    /**
     * Proto
     */
    pluginProto = cr.plugins_.pix_spilgames.prototype;
        
    pluginProto.Type = function(plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    typeProto = pluginProto.Type.prototype;

    typeProto.onCreate = function() {};

    pluginProto.Instance = function(type) {
        this.type = type;
        this.runtime = type.runtime;
    };
    
    instanceProto = pluginProto.Instance.prototype;

    instanceProto.onCreate = function() {
        self = this;
        self.API = null;
        self.apiReady = false;
        self.apiVersion = null;
        self.branding = {};
        self.gamePaused = false;

        if(w && w["GameAPI"]) {
            w["GameAPI"]["loadAPI"](function(instance) {
                self.API = instance;
                self.apiReady = self.API["isReady"];
                self.apiVersion = self.API["version"];
				
				self.API["Game"]["on"]("pause", _triggerPause);
				self.API["Game"]["on"]("resume", _triggerResume);

                self.runtime.trigger(cr.plugins_.pix_spilgames.prototype.cnds.apiReady, self);
            });
        }
		
    };


    /**
     * Conditions
     */
    function Cnds() {};

	Cnds.prototype.apiLoaded = function() {
        return (self.API) ? true : false;
    };

    Cnds.prototype.apiReady = function() {
        return self.apiReady;
    };
    
    Cnds.prototype.isPaused = function() {
        return self.gamePaused;
    };

    Cnds.prototype.isSplashScreenEnabled = function() {
        // Hi Stephane! I think this one hasn't been working previously. Should be fixed now.  
		if(self.apiReady) {
            if (!self.branding["splashScreen"]) {
				_getSplashScreen();
			}
			return (self.branding["splashScreen"] && self.branding["splashScreen"]["show"]) ? self.branding["splashScreen"]["show"] : false;
        }
    };
	
	Cnds.prototype.pauseGame = function() {
		return true;
	};
	
	Cnds.prototype.resumeGame = function() {
		return true;
	};
	
    pluginProto.cnds = new Cnds();
    
    /**
     * Actions
     */
    
	function _isLinkAvailable(type) {
        if(self.apiReady) {
			return (self.API["Branding"]["getLinks"]() && self.API["Branding"]["getLinks"]()[type]) ? true : false;
        }
    }

    function _getOutgoingLink(type) {
        
		if(self.apiReady) {
            if(!self.branding[type]) {
                switch(type) {
                    case "logo":
                        _getLogo();
						//console.log("logo!");
						
                    break;
                    case "splashScreen":
                        _getSplashScreen();
						//console.log("splash!");
						
                    break;
                    default:
                        //console.log(type);
						if(_isLinkAvailable(type)) {
                            self.branding[type] = self.API["Branding"]["getLink"](type);
							
                        }
                    break; 
                }
            }

            return (self.branding[type] && self.branding[type]["action"]) ? self.branding[type]["action"] : false;
			
        }
    }

    function _getLogo() {
        if(self.apiReady) {
            if(!self.branding["logo"]) {
                self.branding["logo"] = self.API["Branding"]["getLogo"]();
            }

            //return self.branding.logo;
        }
    }

    function _getSplashScreen() {
        if(self.apiReady) {
            if(!self.branding["splashScreen"]) {
                self.branding["splashScreen"] = self.API["Branding"]["getSplashScreen"]();
            }

            //return self.branding.splashScreen;
        }
    }
	
	function _triggerPause() {
		//console.log("PAUSE!");
		self.gamePaused = 1;
		self.runtime.trigger(cr.plugins_.pix_spilgames.prototype.cnds.pauseGame, self);
	}
	
	function _triggerResume() {
		//console.log("RESUME!");
		self.gamePaused = 0;
		self.runtime.trigger(cr.plugins_.pix_spilgames.prototype.cnds.resumeGame, self);
	}

    function Acts() {};
    
    Acts.prototype.openOutgoingLink = function(type) {
        if(_getOutgoingLink(type)) {
            _getOutgoingLink(type).call(this);
        } else {
            // if no link action is available, just execute an empty function
            (function() {}).call(this);
        }
    };

    Acts.prototype.requestGameBreak = function() {
        if(self.apiReady) {
            self.API["GameBreak"]["request"](
			function() {
                    // pause

					_triggerPause();
              },
              function() {
                    // resume

					_triggerResume();
              }
          );
        }
    };

    pluginProto.acts = new Acts();
    
    /**
     * Expressions
     */
    function Exps() {};
    
    Exps.prototype.logoImage = function(ret) {
        // fix
		if (!self.branding["logo"]){
			_getLogo();
		}
		var src = (self.branding["logo"] && self.branding["logo"]["image"]) ? self.branding["logo"]["image"] : '';
        ret.set_string(src);
    };
	
	Exps.prototype.version = function(ret) {
        ret.set_string(self.apiVersion);
    };
    
    pluginProto.exps = new Exps();

}(window));