/**
 * Object holder for the plugin
 */
cr.plugins_.ATPGooglePlayGames = function(runtime) {
    this.runtime = runtime;
};

/**
 * C2 plugin
 */
(function() {

    var requested_score = 0;
    var user_id = ""; 
    var user_name = "";
    var user_image = ""; 

    var pluginProto = cr.plugins_.ATPGooglePlayGames.prototype;
    pluginProto.Type = function(plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };
    var typeProto = pluginProto.Type.prototype;
    typeProto.onCreate = function() {};

    /**
     * C2 specific behaviour
     */
    pluginProto.Instance = function(type) {
        this.type = type;
        this.runtime = type.runtime;
    };
    var instanceProto = pluginProto.Instance.prototype;
    var self;

    instanceProto.onCreate = function() {

        if (!this.runtime.isAndroid)
            return;
        if (typeof Cocoon == 'undefined')
            return;

        this.GPG = null;
        this.GPGAvailable = false;
        //this.GPGClientID = this.properties[0];

        self = this;

        this.startGooglePlay = function() {
            this.GPG = window.Cocoon && window.Cocoon.Social ? Cocoon.Social.GooglePlayGames : null;
            if (this.GPG) {
                var config = {};
                //if (this.GPGClientID) config.clientId = this.GPGClientID;
                this.GPG.init(config);
                this.GPGInterface = this.GPG.getSocialInterface();
            } else {
                throw new Error("Cannot find Google Play Games service, are you using the latest ATP for Google Play Games?");
            }
        };

        this.startGooglePlay.apply(this, []);

    };

    function Cnds() {};

    /**
     * Conditions
     */
    Cnds.prototype.isLoggedIn = function() {
        return this.GPGInterface ? this.GPGInterface.isLoggedIn() : false;
    };
    Cnds.prototype.onGPGLoginSuccess = function() {
        return true;
    };
    Cnds.prototype.onGPGLoginFail = function() {
        return true;
    };
    Cnds.prototype.onGPGLogoutSuccess = function() {
        return true;
    };
    Cnds.prototype.onGPGLogoutFail = function() {
        return true;
    };

    /**
     * Leaderboards conditions
     */
    Cnds.prototype.onGPGSubmitScoreSuccess = function() {
        return true;
    };
    Cnds.prototype.onGPGSubmitScoreFail = function() {
        return true;
    };
    Cnds.prototype.onGPGRequestScoreSuccess = function() {
        return true;
    };
    Cnds.prototype.onGPGRequestScoreFail = function() {
        return true;
    };
    Cnds.prototype.onGPGOpenLeaderBoardSuccess = function() {
        return true;
    };
    Cnds.prototype.onGPGOpenLeaderBoardClosed = function() {
        return true;
    };

    /**
     * Achievements conditions
     */
    Cnds.prototype.onGPGOpenAchievementsSuccess = function() {
        return true;
    };
    Cnds.prototype.onGPGOpenAchievementsClosed = function() {
        return true;
    };
    Cnds.prototype.onGPGResetAchievementsComplete = function() {
        return true;
    };
    Cnds.prototype.onGPGResetAchievementsFail = function() {
        return true;
    };
    Cnds.prototype.onGPGSubmitAchievementComplete = function() {
        return true;
    };
    Cnds.prototype.onGPGSubmitAchievementFail = function() {
        return true;
    };
    Cnds.prototype.onGPGRequestUserImageComplete = function() {
        return true;
    };
    Cnds.prototype.onGPGRequestUserImageFail = function() {
        return true;
    };

    pluginProto.cnds = new Cnds();
    /**
     * Plugin actions
     */
    function Acts() {};


    /**
     * Social service actions
     */
    Acts.prototype.GPGRequestLogin = function() {
        if (!this.GPGInterface) return;
        if (this.GPGInterface.isLoggedIn()) {
            var user_information = this.GPGInterface.getLoggedInUser();
            user_id = user_information.userID;
            user_name = user_information.userName;
            self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGLoginSuccess, self);

        } else {
            this.GPGInterface.login(function(loggedIn, error) {
                if (loggedIn) {
                    self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGLoginSuccess, self);
                    // Cannot call getLoggedInUser here because the information is not yet available.

                } else {
                    console.log(JSON.stringify(error));
                    self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGLoginFail, self);
                }
            });
        }
    };

    Acts.prototype.GPGRequestLogout = function() {
        if (!this.GPGInterface) return;
        this.GPGInterface.logout(function(error) {
            if (!error) {
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGLogoutSuccess, self);
            } else {
                console.log(JSON.stringify(error));
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGLogoutFail, self);
            }
        });
    };

    /**
     * Social service Leaderboards actions
     */
    Acts.prototype.GPGSubmitScore = function(score_, leaderboard_) {
        if (!this.GPGInterface) return;
        if (this.GPGInterface.isLoggedIn())
            this.GPGInterface.submitScore(
                score_,
                function(err) {
                    if (!err) {
                        self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGSubmitScoreSuccess, self);
                    } else {
                        console.log(JSON.stringify(error));
                        self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGSubmitScoreFail, self);
                    }
                }, {
                    leaderboardID: leaderboard_
                }
            );
    };
    Acts.prototype.GPGRequestScore = function(leaderboard_) {
        if (!this.GPGInterface) return;
        if (this.GPGInterface.isLoggedIn())
            this.GPGInterface.requestScore(
                function(loadedScore, err) {
                    if (!err) {
                        requested_score = loadedScore.score || 0;
                        self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGRequestScoreSuccess, self);
                    } else {
                        console.log(err);
                        self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGRequestScoreFail, self);
                    }
                }, {
                    leaderboardID: leaderboard_
                });
    };
    Acts.prototype.GPGOpenLeaderboard = function(leaderboard_) {
        if (!this.GPGInterface) return;
        if (!this.GPGInterface.isLoggedIn()) return;
        self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGOpenLeaderBoardSuccess, self);
        this.GPGInterface.showLeaderboard(
            function(err) {
                if (err) {
                    console.log(JSON.stringify(error));
                }
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGOpenLeaderBoardClosed, self);
            }, {
                leaderboardID: leaderboard_
            }
        );
    };

    /**
     * Social service Achievements actions
     */
    Acts.prototype.GPGOpenAchievements = function() {
        if (!this.GPGInterface) return;
        if (!this.GPGInterface.isLoggedIn()) return;
        self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGOpenAchievementsSuccess, self);
        this.GPGInterface.showAchievements(function(err) {
            if (err) {
                console.log(JSON.stringify(error));
            }
            self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGOpenAchievementsClosed, self);
        });
    };
    Acts.prototype.GPGResetAchievements = function() {
        if (!this.GPGInterface) return;
        if (!this.GPGInterface.isLoggedIn()) return;
        this.GPGInterface.resetAchievements(function(err) {
            if (err) {
                try {
                    console.log(JSON.stringify(err));
                } catch (e) {
                    for (var prop in err) {
                        console.log(err[prop]);
                    }
                    console.log(e);
                }
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGResetAchievementsFail, self);
            } else {
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGResetAchievementsComplete, self);
            }
        });
    };
    Acts.prototype.GPGSubmitAchievement = function(_achievementId) {
        if (!this.GPGInterface) return;
        if (!this.GPGInterface.isLoggedIn()) return;
        this.GPGInterface.submitAchievement(_achievementId, function(err) {
            if (err) {
                try {
                    console.log(JSON.stringify(err));
                } catch (e) {
                    for (var prop in err) {
                        console.log(err[prop]);
                    }
                    console.log(e);
                }
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGSubmitAchievementFail, self);
            } else {
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGSubmitAchievementComplete, self);
            }
        });
    };

    Acts.prototype.GPGRequestUserImage = function(size) {

        var imageSize; 

        switch (size) {
                case 0:     imageSize = "thumb"; break;
                case 1:     imageSize = "small"; break;
                case 2:     imageSize = "medium"; break;
                case 3:     imageSize = "large"; break;
        }

        if (!this.GPGInterface) return;
        if (!this.GPGInterface.isLoggedIn()) return;

        var user_information = this.GPGInterface.getLoggedInUser();
        user_id = user_information.userID;
        user_name = user_information.userName;

        this.GPGInterface.requestUserImage(function(imageURL, error){
            if (error) {
                try {
                    console.log(JSON.stringify(error));
                } catch (e) {
                    console.log(error);
                }
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGRequestUserImageFail, self);
            } else {
                user_image = imageURL;
                self.runtime.trigger(cr.plugins_.ATPGooglePlayGames.prototype.cnds.onGPGRequestUserImageComplete, self);
            }
  
        }, user_id, imageSize);
    };

    pluginProto.acts = new Acts();

    /**
     * Expressions
     */
    function Exps() {};

    Exps.prototype.PlayerScore = function(ret) {
        ret.set_float(requested_score);
    };
    
    Exps.prototype.UserID = function(ret) {
        var user_information = this.GPGInterface.getLoggedInUser();
        user_id = user_information.userID;
        ret.set_string(user_id);
    };

    Exps.prototype.UserName = function(ret) {
        var user_information = this.GPGInterface.getLoggedInUser();
        user_name = user_information.userName;
        ret.set_string(user_name);
    };

    Exps.prototype.UserImage = function(ret) {
        ret.set_string(user_image);
    };

    pluginProto.exps = new Exps();

}());
