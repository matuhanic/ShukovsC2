//Steam4C2 plugin by AJ2DI sasu - copyright 2016
//Based on an original idea by Greenheart games https://github.com/greenheartgames/greenworks
// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.Steam4C2 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Steam4C2.prototype;
		
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};


	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		this.ach_data = [];
		this.ach_loop=-1;
		this.ach_local_loaded = false;
		this.ach_number = 0;
		this.ach_name_list = [];
		
	};

	var instanceProto = pluginProto.Instance.prototype;
	
	var Steam4C2 = null;
	var isAvailable = false;
	var steamId = null;
	var AccountValid = null;
	var isdebug = false;
	var intPlayerCount = -1;

	var friendlist;

	var steam_cloud_total_byte = -1;
	var steam_cloud_total_available = -1;
	var steam_cloud_data;

	var intLDentry= 0;
	var intLDBpreviousrank = 0;
	var intLDBnewrank = 0;
	var arrLDBentry = 0;
	var intLDB_Dl_Entry = 0;
	var intLDB_Dl_Entry_count = 0;
	var strarrLDB_Dl_Entry_str = "empty";
	var LDB_loading = false;
	
	var b_IsLowViolence = false;

	var int_STstatValue = -1;

	var ach_request_unlock_current_name = "";
	var ach_request_clear_current_name = "";
	var ach_request_check_current_name = "";
	
	instanceProto.onCreate = function()
	{
		
		isdebug = (this.properties[0] === 1);
		
		if (!this.runtime.isNodeWebkit)
		{
			console.log("Steam4C2 require NodeWebkit. Plugin disable");
			return;
		}
		
		if (typeof cr_is_preview !== "undefined")
		{
			console.log("Steam4C2 can't run in preview. Plugin disable");
			return;
		}
		
		Steam4C2 = require("./Steam4C2");
		
		if (Steam4C2)
		{
			this.printlog("Steam4C2 loaded.");
			if (Steam4C2["initAPI"]())
			{
				this.printlog("Steam API loaded.");
				isAvailable = true;
				steamId = Steam4C2["getSteamId"]();
				//AccountValid =(steamId["isValid"]);
				if (Steam4C2["IsLowViolence"]())
				{
					b_IsLowViolence = true;
				}
				this.ach_number = Steam4C2["getNumberOfAchievements"]();
				if (this.ach_number > 0)
				{
					this.ach_name_list = Steam4C2["getAchievementNames"]();
					
					for (var i=0;i<this.ach_number;i++)
					{
						var data = {};
						data["ID"]= this.ach_name_list[i];
						data["state"] = "undefined";
						this.ach_data.push(data);
						
					}
					
					this.ach_loop = 0;
					this.checkachivementstateforlocal(this.ach_data[this.ach_loop]["ID"]);
					
				}
				friendlist = Steam4C2["getFriendsByStID"]();
				var self = this;
				if (Steam4C2.on)
				{
					Steam4C2.on("game-overlay-activated", function (isActive)
					{
						if (isActive)
							self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnGameOverlayActivated, self);
						else
							self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnGameOverlayDeactivated, self);
					});
					Steam4C2.on("low-battery", function ()
					{
						self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnLowBatWarn, self);
					});
				}
				Steam4C2["getNumberOfCurrentPlayers"](function(intn_player)
				{
					intPlayerCount = intn_player;
				}, function(err)
				{
					intPlayerCount = -1;
					this.printlog(err);
				});
				Steam4C2["getCloudQuota"](function(stcdtotal,stcdavailable)
				{
					steam_cloud_total_byte = stcdtotal;
					steam_cloud_total_available = stcdavailable;
				}, function(err)
				{
					this.printlog(err);
				});
			} else 
			{
				this.printlog("Steam API is not loaded.");
				this.printlog("DLL are missing/corrupted or not found.");
				return ;
			}
		} else {
			this.printlog("Error: Steam4C2 is not loaded.");
			this.printlog("Files are missing/corrupted or not found.");
			this.printlog("Plugin disabled.");
			return;
		}
	};
	
	instanceProto.printlog = function(err)
	{
		if (isdebug)
			console.log(err);
	};
	
	instanceProto.localachievementstateprocess = function ()
	{
		if (this.ach_local_loaded == false)
		{
			if (this.ach_loop < this.ach_number)
			{
				this.checkachivementstateforlocal(this.ach_data[this.ach_loop]["ID"]);
			} else {
				this.ach_local_loaded = true;
				this.ach_loop = 0;
				var self = this;
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAchievementStoredInMemory, self);
			}
		}
	};
	
	instanceProto.checkachivementstateforlocal = function (achid)
	{
		var self = this;
		Steam4C2["getAchievement"](achid , function (is_achieved)
		{
			if(!is_achieved)
			{
				self.ach_data[self.ach_loop]["state"] = "locked";
			} else {
				self.ach_data[self.ach_loop]["state"] = "unlocked";
			}
			self.ach_loop++;
			self.localachievementstateprocess();	
		},function (err)
		{
			self.ach_data[self.ach_loop]["state"] = "error";
			self.ach_loop++;
			self.localachievementstateprocess();
		});
	};
	
	instanceProto.onDestroy = function ()
	{
	};
	
	instanceProto.saveToJSON = function ()
	{

		return {

		};
	};
	
	instanceProto.loadFromJSON = function (o)
	{

	};
	
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function (glw)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{

	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{

	};
	/**END-PREVIEWONLY**/

	function Cnds() {};

	Cnds.prototype.IsAvailable = function ()
	{
		return isAvailable;
	};
	
	Cnds.prototype.IsLocalAchievementStateLoaded = function ()
	{
		return this.ach_local_loaded;
	};
	
	Cnds.prototype.OnAchievementListUpdated = function ()
	{
		return true;
	};
	
	var ach_state_filter = [
		"unlocked",
		"locked",
		"error",
		"undefined"
	];
	
	Cnds.prototype.LocalCheckAchievementState = function (achname,achstateselct)
	{
		if (!isAvailable || this.ach_number === 0)
			return false;
		
		for (var i=0;i<this.ach_data.length;i++)
		{
			if (this.ach_data[i]["ID"] === achname)
			{
				if (this.ach_data[i]["state"] === ach_state_filter[achstateselct])
					return true;
			}
		}
		
		return false;
	};
	
	Cnds.prototype.OnAchievementStoredInMemory = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAnyUnlockAchievementRequestSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAnyUnlockAchievementRequestError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementUnlockedSucces = function (achname)
	{
		return ach_request_unlock_current_name === achname;
	};
	
	Cnds.prototype.OnAchievementUnlockedError = function (achname)
	{
		return ach_request_unlock_current_name === achname;
	};
	
	Cnds.prototype.OnAchievementUnlockedErrorAlready = function (achname)
	{
		return ach_request_unlock_current_name === achname;
	};
	
	Cnds.prototype.OnAnyResetAchievementRequestSuccess = function ()
	{
		return true;
	};

	Cnds.prototype.OnAnyResetAchievementRequestError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnResetAchievementRequestSuccess = function (achname)
	{
		return ach_request_clear_current_name === achname;
	};

	Cnds.prototype.OnResetAchievementRequestError = function (achname)
	{
		return ach_request_clear_current_name === achname;
	};
	
	Cnds.prototype.OnAnyCheckAchievementRequestSuccess = function ()
	{
		return true;
	};

	Cnds.prototype.OnAnyCheckAchievementRequestError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnCheckAchievementRequestGeneralError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnCheckAchievementRequestSuccess = function (achname)
	{
		return ach_request_check_current_name === achname;
	};

	Cnds.prototype.OnCheckAchievementRequestError = function (achname)
	{
		return ach_request_check_current_name === achname;
	};
	
	Cnds.prototype.OnGameOverlayActivated = function()
	{
		return true;
	};
	
	Cnds.prototype.OnGameOverlayDeactivated = function()
	{
		return true;
	};
	
	Cnds.prototype.IsOverlayEnabled = function ()
	{
		if (!isAvailable)
		{
			return false;
		} else {
			if(Steam4C2["isGameOverlayEnabled"]())
			{
				return true;
			}else{
				return false;
			}
		}
	};
	
	Cnds.prototype.IsCloudEnabled = function ()
	{
		if (!isAvailable)
		{
			return false;
		} else {
			if(Steam4C2["isCloudEnabled"]())
			{
				return true;
			}else{
				return false;
			}
		}
	};
	
	Cnds.prototype.IsCloudEnabledForUser = function ()
	{
		if (!isAvailable)
		{
			return false;
		} else {
			if(Steam4C2["isCloudEnabledForUser"]())
			{
				return true;
			}else{
				return false;
			}
		}
	};

	Cnds.prototype.OnStLDBError = function()
	{
		return true;
	};
	
	Cnds.prototype.OnStLDBFoundSuccess = function()
	{
		return true;
	};

	Cnds.prototype.OnStLDBFoundError = function()
	{
		return true;
	};

	Cnds.prototype.OnStLDBUpdSuccess = function()
	{
		return true;
	};

	Cnds.prototype.OnStLDBUpdError = function()
	{
		return true;
	};

	Cnds.prototype.OnStLDBdlSuccess = function()
	{
		return true;
	};

	Cnds.prototype.OnStLDBdlError = function()
	{
		return true;
	};

	Cnds.prototype.OnSetStatSuccess = function()
	{
		return true;
	};
	
	Cnds.prototype.OnSetStatError = function()
	{
		return true;
	};
	
	Cnds.prototype.OnGetStatSuccess = function()
	{
		return true;
	};
	
	Cnds.prototype.OnGetStatError = function()
	{
		return true;
	};
	
	Cnds.prototype.OnUpdateStatSuccess = function()
	{
		return true;
	};
	
	Cnds.prototype.OnUpdateStatError = function()
	{
		return true;
	};
	
	Cnds.prototype.OnLowBatWarn = function()
	{
		return true;
	};
	
	Cnds.prototype.IsDLCowned = function (stdlcid)
	{
		return (Steam4C2["DlcVerif"](stdlcid));
	};
	
	Cnds.prototype.IsLV = function()
	{
		return b_IsLowViolence;
	};
	
	//Steam Big Picture
	
	Cnds.prototype.IsSteamInBPM = function ()
	{
		return (Steam4C2["IsBPMode"]());
	};
	
	//////////////////////////////////// Steam Cloud file operations cnds ///////////////////////////////////////////////
	
	Cnds.prototype.OnWritefileToCloudSuccess = function()
	{
		return true;
	};
	
	Cnds.prototype.OnWritefileToCloudError = function()
	{
		return true;
	};
	
	Cnds.prototype.OnReadfileFromCloudSuccess = function()
	{
		return true;
	};
	
	Cnds.prototype.OnReadfileFromCloudError = function()
	{
		return true;
	};
	
	Cnds.prototype.OnDeletefileFromCloudSuccess = function()
	{
		return true;
	};
	
	Cnds.prototype.OnDeletefileFromCloudError = function()
	{
		return true;
	};
	
	//////////////////////////////////// Player Ingame triggers ///////////////////////////////////////////////
	
	Cnds.prototype.OnPlayerIngameRefreshDone = function()
	{
		return true;
	};
	
	Cnds.prototype.OnPlayerIngameRefreshFail = function()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();

	function Acts() {};

	Acts.prototype.UnlockSteamAchievement = function (ach_name)
	{
		if (!isAvailable)
			return;
		
		var self = this;
		
		Steam4C2["activateAchievement"](ach_name, function ()
		{
			ach_request_unlock_current_name = ach_name;
			if (self.ach_number > 0)
			{
				for (var i=0;i<self.ach_data.length;i++)
				{
					if (self.ach_data[i]["ID"] === ach_name)
					{
						self.ach_data[i]["state"] = "unlocked";
						self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAchievementListUpdated, self);
						break;
					}
				}
			}
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAchievementUnlockedSucces, self);
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAnyUnlockAchievementRequestSuccess, self);
			
			ach_request_unlock_current_name = "";
			
		}, function (err)
		{
			
			self.printlog(err);
			
			ach_request_unlock_current_name = ach_name;
			
			if (err === "Achievement is already achieved.")
			{
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAchievementUnlockedErrorAlready, self);
			} else {
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAchievementUnlockedError, self);
			}
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAnyUnlockAchievementRequestError, self);
			
			ach_request_unlock_current_name = "";
			
		});
	};
	
	Acts.prototype.ResetSteamAchievement = function (clrachievement)
	{
		if (!isAvailable)
			return;

		var self = this;
		
		Steam4C2["clearAchievement"](clrachievement, function ()
		{
			ach_request_clear_current_name = clrachievement;
			
			if (self.ach_number > 0)
			{
				for (var i=0;i<self.ach_data.length;i++)
				{
					if (self.ach_data[i]["ID"] === ach_name)
					{
						self.ach_data[i]["state"] = "locked";
						self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAchievementListUpdated, self);
						break;
					}
				}
			}
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnResetAchievementRequestSuccess, self);
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAnyResetAchievementRequestSuccess, self);
			
			ach_request_clear_current_name = "";
			
		}, function (err)
		{
			ach_request_clear_current_name = clrachievement;
			
			self.printlog(err);
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnResetAchievementRequestError, self);
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAnyResetAchievementRequestError, self);
			
			ach_request_clear_current_name = "";
			
		});
	};	
		
	Acts.prototype.CheckSteamAchievement = function (achievement)
	{	
		if (!isAvailable)
			return;

		var self = this;
			
		Steam4C2["getAchievement"](achievement , function (is_achieved)
		{
			ach_request_check_current_name = achievement;
			
			if (is_achieved){
				
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnCheckAchievementRequestSuccess, self);
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAnyCheckAchievementRequestSuccess, self);
				
				ach_request_check_current_name = "";
				
			} else {
				
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnAnyCheckAchievementRequestError, self);
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnCheckAchievementRequestError, self);
				
				ach_request_check_current_name = "";
				
			}
		}, function (err){
			
				self.printlog(err);
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnCheckAchievementRequestGeneralError, self);
		});
	};
	
	Acts.prototype.SetSteamStat = function (namstat , statvalue)
	{
		if (!isAvailable)
			return;
		
		var self = this;
		
		Steam4C2["SetStat"](namstat, statvalue, function ()
		{
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnSetStatSuccess, self);
		}, function (err)
		{
			self.printlog(err);
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnSetStatError, self);
		});
	};
	
	Acts.prototype.UpdateSteamStat = function (namstat , statvalue)
	{
		if (!isAvailable)
			return;
		
		var self = this;
		
		Steam4C2["UpdateStat"](namstat, statvalue, function ()
		{
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnUpdateStatSuccess, self);
		}, function (err)
		{
			self.printlog(err);
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnUpdateStatError, self);
		});
	};
	
	Acts.prototype.DLSteamStat = function (namstat)
	{
		if (!isAvailable)
			return;
		
		var self = this;
		
		Steam4C2["GetStat"](namstat, function (DLSteamstatvalue)
		{
			int_STstatValue = DLSteamstatvalue;
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnGetStatSuccess, self);
			
		}, function (err)
		{
			self.printlog(err);
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnGetStatError, self);
		});
	};
	
	var overlay_options = [
		"Friends",
		"Community",
		"Players",
		"Settings",
		"OfficialGameGroup",
		"Stats",
		"Achievements"
	];
	
	Acts.prototype.ActivateOverlay = function (option)
	{
		if (!isAvailable)
			return;
		
		Steam4C2["activateGameOverlay"](overlay_options[option]);
	};
	
	var CloudFlag = [
		true,
		false
	];
	
	Acts.prototype.enableCloud = function (enable_flag)
	{
		if (!isAvailable)
			return;
		
		Steam4C2["enableCloud"](CloudFlag[enable_flag]);
	};

	Acts.prototype.StLeaderboardExist = function (leaderboardname)
	{
				
		if (!isAvailable)
			return;

		if(LDB_loading)
			return;
		
		var self = this;
		
		intLDentry = 0;
		
		Steam4C2["LeaderboardInitObj"](leaderboardname, function (is_found,LDEntry)
		{
			
			if (is_found)
			{
				intLDentry = LDEntry;				
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBFoundSuccess, self);	
			} else
			{
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBFoundError, self);
			}
		},function()
		{
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBError, self);
		});
	};	

	var UpdtmetFlag = [
		1,
		2
	];
	
	Acts.prototype.StUpdateLeaderboard = function (leaderboardname ,score ,updtmet)
	{
				
		if (!isAvailable)
			return;

		if(LDB_loading)
			return;
		
		var self = this;
		
		intLDBnewrank = 0;
		intLDBpreviousrank = 0;
		
		Steam4C2["UpdateLeaderboard"](leaderboardname, score, UpdtmetFlag[updtmet], function ( ldb_up_is_found , is_updated , ldbnewrank , ldbprevrank)
		{
			
			if (ldb_up_is_found)
			{
				
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBFoundSuccess, self);
			
				if (is_updated)
				{
					intLDBnewrank = ldbnewrank;
					intLDBpreviousrank = ldbprevrank;					
					self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBUpdSuccess, self);
				} else 
				{				
					self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBUpdError, self);
				}
				
			} else
			{	
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBFoundError, self);
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBUpdError, self);
			}
			
		},function()
		{
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBError, self);
		});
	};		

	var DataSortFlag = [
		1,
		2,
		3,
		4
	];
	
	Acts.prototype.StDlLeaderboard = function (leaderboardname ,sorttype)
	{
			
		if (!isAvailable)
			return;

		if(LDB_loading)
			return;
		
		var self = this;
		
		intLDB_Dl_Entry = 0;
		intLDB_Dl_Entry_count = 0;
		strarrLDB_Dl_Entry_str = "empty";
		
		Steam4C2["LeaderboardDLEnt"](leaderboardname, DataSortFlag[sorttype], function (ldb_up_is_found , is_dlsucs , LDB_dl_entry_ , LDB_dl_entry_count_ , LDB_dl_arr_entry)
		{	
			
			if (ldb_up_is_found)
			{
				intLDB_Dl_Entry = LDB_dl_entry_;
				
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBFoundSuccess, self);
				
				if (is_dlsucs)
				{
					intLDB_Dl_Entry_count = LDB_dl_entry_count_;
					strarrLDB_Dl_Entry_str = LDB_dl_arr_entry;
					
					self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBdlSuccess, self);
				} else
				{
					self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBdlError, self);
				}
			} else
			{
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBFoundError, self);
				self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBdlError, self);
			}
			
		},function()
		{
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnStLDBError, self);
		});
	};
	
	Acts.prototype.ActivateOverlayforWebpage = function (lnkstr)
	{
		if (!isAvailable)
			return;
		
		Steam4C2["activateGameOverlayToWebPage"](lnkstr);
	};
	
	var StoreFlag = [
		0,
		1,
		2
	];

	Acts.prototype.ActivateOverlayforStorepage = function (lnkappid, flagstore)
	{
		if (!isAvailable)
			return;
		
		Steam4C2["activateGameOverlayToStorePage"](lnkappid, StoreFlag[flagstore]);
	};

	Acts.prototype.SendtoStCl = function (flname, flcontent)
	{
			
		if (!isAvailable)
			return;
		
		var self = this;
		
		
		Steam4C2["savedatatoCloud"]( flname, flcontent, function ()
		{	
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnWritefileToCloudSuccess, self);
				
		}, function (err)
		{
			self.printlog(err);
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnWritefileToCloudError, self);
		}
		);
	};
	
	Acts.prototype.ReadfromStCl = function (flname)
	{
			
		if (!isAvailable)
			return;
		
		var self = this;
		
		
		Steam4C2["readfilecontentfromcloud"]( flname, function (flcontent)
		{	
			steam_cloud_data = flcontent;
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnReadfileFromCloudSuccess, self);
				
		}, function (err)
		{
			self.printlog(err);
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnReadfileFromCloudError, self);
		}
		);
	};
	
	Acts.prototype.DeletefromStCl = function (flname)
	{
			
		if (!isAvailable)
			return;
		
		var self = this;
		
		
		Steam4C2["deleteFileFromCloud"]( flname, function ()
		{	
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnDeletefileFromCloudSuccess, self);
				
		}, function (err)
		{
			self.printlog(err);
			
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnDeletefileFromCloudError, self);
		}
		);
	};
	
	Acts.prototype.RequestNumberOfPlayerIG = function ()
	{
		if (!isAvailable)
			return;
		
		var self = this;
		Steam4C2["getNumberOfCurrentPlayers"](function(numcurplayer)
		{
			intPlayerCount = numcurplayer;
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnPlayerIngameRefreshDone, self);
		},function (err)
		{
			self.printlog(err);
			self.runtime.trigger(cr.plugins_.Steam4C2.prototype.cnds.OnPlayerIngameRefreshFail, self);
		});
	};
	
	pluginProto.acts = new Acts();
	
	function Exps() {};
	
	Exps.prototype.AccountID = function (ret)
	{
		ret.set_int(steamId ? (steamId["accountId"] || 0) : 0);
	};
	
	Exps.prototype.StaticAccountID = function (ret)
	{
		ret.set_int(steamId ? (steamId["staticAccountId"] || 0) : 0);
	};
	
	Exps.prototype.ScreenName = function (ret)
	{
		ret.set_string(steamId ? (steamId["screenName"] || "") : "");
	};
	
	Exps.prototype.UserLevel = function (ret)
	{
		ret.set_int(steamId ? (steamId["level"] || 0) : 0);
	};

	Exps.prototype.getNumberOfAchievements = function (ret)	
	{	
		ret.set_int(this.ach_number);
	};
	
	Exps.prototype.getCurrentGameLanguage = function (ret)	
	{	
		ret.set_string((Steam4C2["getCurrentGameLanguage"]()));
	};
	
	Exps.prototype.getCurrentUILanguage = function (ret)	
	{	
		ret.set_string((Steam4C2["getCurrentUILanguage"]()));
	};
	
	Exps.prototype.getAchievementNames = function (ret)	
	{	
		var temp = Steam4C2["getAchievementNames"]();
		
		ret.set_string((temp.toString()));
	};
	
	Exps.prototype.getAchievementNameAtIndex = function (ret, idx)	
	{	
		if (!isAvailable || this.ach_number === 0)
		{
			ret.set_string("NULL");
			return;
		}
		
		var idx = idx;
		var len = this.ach_data.length;
		
		
		if ( (len > 0) && (idx >= 0) && (idx < len) )
		{
			idx = Math.floor(idx);
			ret.set_string(this.ach_data[idx]["ID"]);
			return;
		}
		
		ret.set_string("NULL");
	};
	
	Exps.prototype.getAchievementStateAtIndex = function (ret, idx)	
	{	
		if (!isAvailable || this.ach_number === 0)
		{
			ret.set_string("NULL");
			return;
		}
		
		var idx = idx;
		var len = this.ach_data.length;
		
		
		if ( (len > 0) && (idx >= 0) && (idx < len) )
		{
			idx = Math.floor(idx);
			ret.set_string(this.ach_data[idx]["state"]);
			return;
		}
		
		ret.set_string("NULL");
	};
	
	Exps.prototype.getEntryCount = function (ret)	
	{	
		ret.set_int(intLDentry);
	};
	
	Exps.prototype.getLDBnewrank = function (ret)	
	{	
		ret.set_int(intLDBnewrank);
	};
	
	Exps.prototype.getLDBprevrank = function (ret)	
	{	
		ret.set_int(intLDBpreviousrank);
	};
	
	Exps.prototype.getLDBentry = function (ret)	
	{	
		ret.set_int(arrLDBentry);
	};
	
	Exps.prototype.getLDBdlentry = function (ret)	
	{	
		ret.set_int(intLDB_Dl_Entry);
	};

	Exps.prototype.getLDBdlentrycount = function (ret)	
	{	
		ret.set_int(intLDB_Dl_Entry_count);
	};
	
	Exps.prototype.getLDBdlEntryStr = function (ret)	
	{	
		ret.set_string(strarrLDB_Dl_Entry_str);
	};
	
	Exps.prototype.getSteamstatvalue = function (ret)	
	{	
		ret.set_any( int_STstatValue );
	};
	
	Exps.prototype.getfriendnumb = function (ret)	
	{	
		ret.set_int((Steam4C2["getFriendCount"]()) );
	};	
	
	Exps.prototype.getfriendname = function (ret)	
	{	
		var temp = Steam4C2["getFriendsNames"]();
		
		ret.set_string((temp.toString()));
	};
	
	Exps.prototype.getBatPower = function (ret)	
	{	
		ret.set_int((Steam4C2["GetCurPowerLaptop"]()));
	};
	
	Exps.prototype.getSteamTimeServ = function (ret)	
	{	
		ret.set_int((Steam4C2["GetSteamTimeServ"]()));
	};
	
	Exps.prototype.getAppIDSteam = function (ret)	
	{	
		ret.set_int((Steam4C2["GetAppID"]()));
	};
	
	Exps.prototype.getSeparatorValue = function (ret)	
	{	
		ret.set_string( " &,& " );
	};

	Exps.prototype.GetStatSynch = function (ret , statnametst)	
	{	
		var tststeamstat = (Steam4C2["GetStatSynch"](statnametst));
		ret.set_any(tststeamstat);
	};	
	
	Exps.prototype.GetCloudTotal = function (ret)	
	{	
		ret.set_any(steam_cloud_total_byte);
	};	

	Exps.prototype.GetCloudAvailable = function (ret)	
	{	
		ret.set_any(steam_cloud_total_available);
	};
	
	Exps.prototype.getCloudDATAst = function (ret)	
	{	
		ret.set_any(steam_cloud_data);
	};
	
	Exps.prototype.getNumberOfCurrentPlayers = function (ret)	
	{		
		ret.set_any(intPlayerCount);
	};
	
	Exps.prototype.getfriendCSteamIDat = function (ret, index)	
	{	
		index = Math.floor(index);
		ret.set_string(friendlist[index]);
	};
	
	Exps.prototype.getSteamUserName = function (ret, usersteamidraw)	
	{	
		ret.set_string(Steam4C2["getUserName"](usersteamidraw));
	};
	
	pluginProto.exps = new Exps();

}());