//Steam4C2 plugin by AJ2DI sasu - copyright 2016
//Based on an original idea by Greenheart games https://github.com/greenheartgames/greenworks

function GetPluginSettings()
{
	return {
		"name":			"Steam4C2",
		"id":			"Steam4C2",
		"version":		"1.9",		
		"description":	"Access the Steamworks API from the node-webkit exporter.",
		"author":		"AJ2DI SAS",
		"help url":		"http://www.scirra.com",
		"category":		"Platform specific",	
		"type":			"object",
		"rotatable":	false,					
		"dependency":	"Steam4C2.js;Steam4C2-win32.node;Steam4C2-win64.node;Steam4C2-linux64.node;Steam4C2-linux32.node;Steam4C2-osx64.node;Steam4C2-osx32.node",
		"flags":		0						
						| pf_singleglobal		
	};
};
				
AddCondition(0, cf_none, "Is available", "Steam - UI", "Is available", "True if successfully initialised the Steam API.", "IsAvailable");
AddCondition(1, cf_trigger, "On Any Unlock Request Success", "Steam - Achievements - General", "On Any Unlock Request Success", "Triggered after 'Unlock Achievement' if ANY activation completed successfully.", "OnAnyUnlockAchievementRequestSuccess");
AddCondition(2, cf_trigger, "On Any Unlock Request Error", "Steam - Achievements - General", "On Any Unlock Request Error", "Triggered after 'Unlock Achievement' if ANY activation failed.", "OnAnyUnlockAchievementRequestError");
AddCondition(3, cf_none, "Is overlay enabled", "Steam - UI", "Is overlay enabled", "True if the Steam game overlay is currently enabled.", "IsOverlayEnabled");
AddCondition(4, cf_trigger, "On Any Reset Achievement Request Success", "Steam - Achievements - General", "On Any Reset Achievement Request Success", "Triggered after 'Clear achievement' if ANY reset action completed successfully.", "OnAnyResetAchievementRequestSuccess");
AddCondition(5, cf_trigger, "On Any Reset Achievement Request Error", "Steam - Achievements - General", "On Any Reset Achievement Request Error", "Triggered after 'Clear achievement' if ANY reset action failed.", "OnAnyResetAchievementRequestError");
AddCondition(6, cf_none, "Is cloud enabled", "Steam - Cloud", "Is cloud enabled", "True if the Steam Cloud is currently enabled for the game.", "IsCloudEnabled");
AddCondition(7, cf_none, "Is cloud enabled By user", "Steam - Cloud", "Is cloud enabled By user", "True if the Steam Cloud is currently allowed by user.", "IsCloudEnabledForUser");
AddCondition(8, cf_trigger, "On Any Achievement Is Already Unlocked", "Steam - Achievements - General", "On Any Achievement Is Already Unlocked", "Triggered after ANY 'Check Achievement State' if the achievement is unlocked.", "OnAnyCheckAchievementRequestSuccess");
AddCondition(9, cf_trigger, "On Any Achievement Is NOT Already Unlocked", "Steam - Achievements - General", "On Any Achievement Is NOT Already Unlocked", "Triggered after ANY 'Check Achievement State' if the achievement is locked.", "OnAnyCheckAchievementRequestError");
AddCondition(10, cf_trigger, "On Overlay Actived", "Steam - UI", "On Overlay actived", "Triggered when Steam overlay is activate.", "OnGameOverlayActivated");
AddCondition(11, cf_trigger, "On Overlay Deactived", "Steam - UI", "On Overlay deactived", "Triggered when Steam overlay is deactivated.", "OnGameOverlayDeactivated");
AddCondition(12, cf_trigger, "On LeaderBoard Error", "Steam - LeaderBoard", "On LeaderBoard Error", "Triggered when Steam send an error when check or update a leaderboard.", "OnStLDBError");
AddCondition(13, cf_trigger, "On LeaderBoard Found", "Steam - LeaderBoard", "On LeaderBoard Found", "Triggered when Steam found the leaderboard.", "OnStLDBFoundSuccess");
AddCondition(14, cf_trigger, "On LeaderBoard Not Found", "Steam - LeaderBoard", "On LeaderBoard Not Found", "Triggered when Steam not found the leaderboard.", "OnStLDBFoundError");
AddCondition(15, cf_trigger, "On LeaderBoard Updated", "Steam - LeaderBoard", "On LeaderBoard Updated", "Triggered when Steam update the leaderboard successfully.", "OnStLDBUpdSuccess");
AddCondition(16, cf_trigger, "On LeaderBoard Not Updated", "Steam - LeaderBoard", "On LeaderBoard Not Updated", "Triggered when Steam fails to update the leaderboard or if the previous score is better than new one.", "OnStLDBUpdError");
AddCondition(17, cf_trigger, "On LeaderBoard Downloaded", "Steam - LeaderBoard", "On LeaderBoard Downloaded", "Triggered when Steam download the leaderboard entry successfully.", "OnStLDBdlSuccess");
AddCondition(18, cf_trigger, "On LeaderBoard Not Downloaded", "Steam - LeaderBoard", "On LeaderBoard Not Downloaded", "Triggered when Steam fails to download the leaderboard entry.", "OnStLDBdlError");
AddCondition(19, cf_trigger, "On Set Stat success", "Steam - Stats", "On Set Stat success", "Triggered if the steam stat is set successfully.", "OnSetStatSuccess");
AddCondition(20, cf_trigger, "On Set Stat error", "Steam - Stats", "On Set Stat error", "Triggered if the steam stat fails to be changed.", "OnSetStatError");
AddCondition(21, cf_trigger, "On Get Stat success", "Steam - Stats", "On Get Stat success", "Triggered if the steam stat is downloaded successfully.", "OnGetStatSuccess");
AddCondition(22, cf_trigger, "On Get Stat error", "Steam - Stats", "On Get Stat error", "Triggered if the steam stat can't be downloaded.", "OnGetStatError");
AddCondition(23, cf_none, "Is Low Violence activated?", "Steam - User info", "Is Low Violence Activated?", "Returns True if Low Violence is enabled.", "IsLV");
AddNumberParam("DLC Steam App ID","(number) The Steam ID of DLC");
AddCondition(24, cf_none, "Is DLC owned by User", "Steam - DLC", "DLC <b>{0}</b> is owned?", "Returns true.", "IsDLCowned");

AddCondition(32, cf_trigger, "Low Battery Warning", "Steam - Utils", "On Low Battery Warning", "trigger when running on a laptop and less than 10 minutes of battery is left, fires then every minute.", "OnLowBatWarn");
AddCondition(33, cf_none, "Is Steam running in BP Mode?", "Steam - UI", "Is Steam running in BP Mode?", "Returns True if Steam is running in Big Picture Mode.", "IsSteamInBPM");

AddCondition(34, cf_none, "Is Achivement State loaded in memory", "[Beta]Steam - Achievements - Local", "Is Ach State Loaded", "True if achievements states are loaded in memory.", "IsLocalAchievementStateLoaded");

AddStringParam("Name", "Name of achievement." ,"\"\"");
AddComboParamOption("Unlocked");
AddComboParamOption("Locked");
AddComboParamOption("Error");
AddComboParamOption("Undefined");
AddComboParam("Achievement State", "Achievement State.");
AddCondition(35, cf_none, "Check Achievement State from memory", "[Beta]Steam - Achievements - Local", "Check achievement <b>{0}</b> is in <b>{1}</b> state", "Returns True if the achievement is in selected state.", "LocalCheckAchievementState");

AddCondition(36, cf_trigger, "On Achievements Stored in memory", "[Beta]Steam - Achievements - Local", "On Achievements stored in memory", "True when achievements name and state are stored in memory.", "OnAchievementStoredInMemory");
AddCondition(37, cf_trigger, "On Achievements List Updated", "[Beta]Steam - Achievements - Local", "On Achievements List Updated", "Returns True when achievements list is updated in memory (ie after unlocking an achievement).", "OnAchievementListUpdated");


AddStringParam("Name", "Name of achievement." ,"\"\"");
AddCondition(45, cf_trigger, "On Unlock Achievement Request Success", "Steam - Achievements - By Name", "On achievement <b>{0}</b> unlock success", "Triggered after 'Activate achievement' if the current achievement is successfully unlocked.", "OnAchievementUnlockedSucces");
AddStringParam("Name", "Name of achievement." ,"\"\"");
AddCondition(46, cf_trigger, "On Unlock Achievement Request Error", "Steam - Achievements - By Name", "On achievement <b>{0}</b> unlock error", "Triggered after 'Activate achievement' if the current achievement fails to be unlocked", "OnAchievementUnlockedError");
AddStringParam("Name", "Name of achievement." ,"\"\"");
AddCondition(47, cf_trigger, "On Unlock Achievement Request Error Already unlocked", "Steam - Achievements - By Name", "On achievement <b>{0}</b> unlock error, already unlocked", "Triggered after 'Activate achievement' if the current achievement fails to be unlocked", "OnAchievementUnlockedErrorAlready");


AddStringParam("Name", "Name of achievement." ,"\"\"");
AddCondition(48, cf_trigger, "On Reset Achievement Request Success", "Steam - Achievements - By Name", "On Reset Achievement <b>{0}</b> Success", "Triggered after 'Clear achievement' if the current achievement was cleared.", "OnResetAchievementRequestSuccess");
AddStringParam("Name", "Name of achievement." ,"\"\"");
AddCondition(49, cf_trigger, "On Reset Achievement Request Error", "Steam - Achievements - By Name", "On Reset Achievement <b>{0}</b> Error", "Triggered after 'Clear achievement' if current achievement can't be reset.", "OnResetAchievementRequestError");


AddStringParam("Name", "Name of achievement." ,"\"\"");
AddCondition(50, cf_trigger, "On Achievement is Already Unlocked", "Steam - Achievements - By Name", "On Achievement <b>{0}</b> is Already Unlocked", "Triggered after 'Check Achievement State' if the achievement is unlocked.", "OnCheckAchievementRequestSuccess");
AddStringParam("Name", "Name of achievement." ,"\"\"");
AddCondition(51, cf_trigger, "On Achievement is Locked", "Steam - Achievements - By Name", "On Achievement <b>{0}</b> is Locked", "Triggered after 'Check Achievement State' if the achievement is locked.", "OnCheckAchievementRequestError");

AddCondition(52, cf_trigger, "On Check Achievement State Request Error", "Steam - Achievements - General", "On Any Check Achievement Request Error", "Triggered after ANY 'Check Achievement State' if a error occurs (Wrong name or Steam Server).", "OnCheckAchievementRequestGeneralError");

AddCondition(53, cf_trigger, "On Update Stat Success", "Steam - Stats", "On Update Stat success", "Triggered if the steam stat is updated successfully.", "OnUpdateStatSuccess");
AddCondition(54, cf_trigger, "On Update Stat Error", "Steam - Stats", "On Update Stat error", "Triggered if the steam stat fails to be updated.", "OnUpdateStatError");

AddCondition(60, cf_trigger, "On File submited to Cloud Success", "Steam - Cloud", "On File submited to Cloud Success", "Triggered if the file is uploaded to Steam Cloud.", "OnWritefileToCloudSuccess");
AddCondition(62, cf_trigger, "On File submited to Cloud Error", "Steam - Cloud", "On File submited to Cloud Error", "Triggered if the file is NOT uploaded to Steam Cloud.", "OnWritefileToCloudError");

AddCondition(64, cf_trigger, "On File read from Cloud Success", "Steam - Cloud", "On File read from Cloud Success", "Triggered if the file is read from Steam Cloud.", "OnReadfileFromCloudSuccess");
AddCondition(66, cf_trigger, "On File read from Cloud Error", "Steam - Cloud", "On File read from Cloud Error", "Triggered if the file fails to be read from Steam Cloud.", "OnReadfileFromCloudError");

AddCondition(68, cf_trigger, "On File deleted from Cloud Success", "Steam - Cloud", "On File deleted from Cloud Success", "Triggered if the file is deleted from Steam Cloud.", "OnDeletefileFromCloudSuccess");
AddCondition(70, cf_trigger, "On File deleted from Cloud Error", "Steam - Cloud", "On File deleted from Cloud Error", "Triggered if the file is NOT deleted from Steam Cloud.", "OnDeletefileFromCloudError");

AddCondition(82, cf_trigger, "On Get number of player Success", "[Beta] Steam - Game info", "On Get number of player Success", "Triggered when the request for number of player in game is done.", "OnPlayerIngameRefreshDone");
AddCondition(83, cf_trigger, "On Get number of player Fail", "[Beta] Steam - Game info", "On Get number of player Fail", "Triggered when the request for number of player in game fails.", "OnPlayerIngameRefreshFail");

AddStringParam("Achievement Name", "API name of the achievement.", "\"\"");
AddAction(0, af_none, "Unlock Achievement", "Steam - Achievements", "Unlock Achievement <b>{0}</b>", "Unlock a Steam achievement.", "UnlockSteamAchievement");
AddComboParamOption("Friends");
AddComboParamOption("Community");
AddComboParamOption("Players");
AddComboParamOption("Settings");
AddComboParamOption("Official Game Group");
AddComboParamOption("Stats");
AddComboParamOption("Achievements");
AddComboParam("Option", "The overlay section to display.");
AddAction(1, af_none, "Activate overlay", "Steam - UI", "Activate overlay for <b>{0}</b>", "Activate the Steam game overlay.", "ActivateOverlay");
AddStringParam("Achievement Name", "API name of the achievement you want to Reset.", "\"\"");
AddAction(2, af_none, "Reset Achievement", "Steam - Achievements", "Reset Steam Achievement: <b>{0}</b>", "Reset a Steam Achievement.", "ResetSteamAchievement");
AddComboParamOption("Enabled");
AddComboParamOption("Disabled");
AddComboParam("Steam Cloud","Whether to enable or disable Steam Cloud");
AddAction(3, af_none, "Enable/Disable Steam Cloud", "Steam - Cloud","Steam Cloud is <b>{0}</b>","Enable/Disable Steam Cloud","enableCloud");
AddStringParam("Achievement Name", "API name of the achievement you want to check.", "\"\"");
AddAction(4, af_none, "Check Achievement State", "Steam - Achievements", "Check the State of Achievement <b>{0}</b> .", "Send a request for an achievement's state", "CheckSteamAchievement");
AddStringParam("Leaderboard Name", "API name of the leaderboard you want to Check.", "\"\"");
AddAction(5, af_none, "Is leaderboard exist?", "Steam - Leaderboard", "Is Leaderboard: <b>{0}</b> exist?", "Check if leaderboard exist.", "StLeaderboardExist");
AddStringParam("Leaderboard Name", "API name of the leaderboard you want to Update.", "\"\"");
AddNumberParam("Score", "Score you want to update.");
AddComboParamOption("Keep best score");
AddComboParamOption("Force update");
AddComboParam("Upload Score Method","Method used, when uploading leaderboard score");
AddAction(6, af_none, "Upload score Leaderboard", "Steam - Leaderboard", "Update Leaderboard <b>{0}</b> to <b>{1}</b> param : <b>{2}</b>", "Update a Leaderboard.", "StUpdateLeaderboard");
AddStringParam("Leaderboard Name", "API name of the leaderboard you want to download.", "\"\"");
AddComboParamOption("Global Top 10");
AddComboParamOption("Arround User");
AddComboParamOption("Top 10 - Friends");
AddComboParamOption("User");
AddComboParam("Data request","Type of data request, when downloading leaderboard entries");
AddAction(7, af_none, "Download Score", "Steam - Leaderboard", "Download Score <b>{1}</b> for leaderboard: <b>{0}</b> .", "Request download entries for current leaderboard.", "StDlLeaderboard");
AddStringParam("Stat Name", "API name of the Stat you want to Set.", "\"\"");
AddNumberParam("Stat Value", "Value you want to set in Stat.");
AddAction(8, af_none, "Set Steam Stat", "Steam - Stats", "Set Steam Stat <b>{0}</b> to <b>{1}</b>", "Set a SteamStat.", "SetSteamStat");
AddStringParam("Stat Name", "API name of the Stat you want to Get.", "\"\"");
AddAction(9, af_none, "Get Steam Stat", "Steam - Stats", "Get Steam Stat <b>{0}</b> ", "(asynch)Get a SteamStat.", "DLSteamStat");
AddStringParam("URL to open", "Url you want to open.", "\"http://\"");
AddAction(10, af_none, "Activate overlay to Web Page", "Steam - UI", "Activate overlay to Web page <b>{0}</b>", "Open Web Page.", "ActivateOverlayforWebpage");
AddNumberParam("App ID", "App ID of DLC or Game.");
AddComboParamOption("Open Store Page to App ");
AddComboParamOption("Open Store Page and add to cart the App ");
AddComboParamOption("Open cart and add in cart the App ");
AddComboParam("Store Option", "The Store section to display.");
AddAction(11, af_none, "Activate overlay to Store Page", "Steam - UI", "Activate overlay and <b>{1}</b> <b>{0}</b>", "Open Store Page.", "ActivateOverlayforStorepage");
AddStringParam("Stat Name", "API name of the Stat you want to Update.", "\"\"");
AddNumberParam("Value", "Value you want to set in Stat.");
AddAction(12, af_none, "Update Steam Stat", "Steam - Stats", "Add <b>{1}</b> to Steam Stat <b>{0}</b>", "Update a SteamStat.", "UpdateSteamStat");

AddAction(20, af_none, "Request number of current players", "[Beta] Steam - Game Info", "Request a refresh of the current number of players", "Request a refresh of the current number of players", "RequestNumberOfPlayerIG");

AddStringParam("File Name", "Name of the file you want to upload to Cloud.", "\"\"");
AddStringParam("Content", "Value you want to store on file uploaded in cloud.");
AddAction(40, af_none, "Upload a file to Cloud", "Steam - Cloud", "Write the text content in a file named <b>{0}</b> and send it to cloud.", "Write in Cloud.", "SendtoStCl");

AddStringParam("File Name", "Name of the file you want to read from Cloud.", "\"\"");
AddAction(42, af_none, "Read a file from Cloud", "Steam - Cloud", "Read the content of the file named <b>{0}</b> from Cloud.", "Read from in Cloud.", "ReadfromStCl");

AddStringParam("File Name", "Name of the file you want to delete from Cloud.", "\"\"");
AddAction(44, af_none, "Delete a file to Cloud", "Steam - Cloud", "Delete file named <b>{0}</b> from cloud.", "Write in Cloud.", "DeletefromStCl");


AddExpression(0, ef_return_number, "", "User info", "AccountID", "The current user's Steam account ID.");
AddExpression(1, ef_return_number, "", "User info", "StaticAccountID", "The current user's Steam static account ID.");
AddExpression(2, ef_return_string, "", "User info", "ScreenName", "The current user's Steam screen name.");
AddExpression(3, ef_return_number, "", "User info", "UserLevel", "The current user's Steam level.");
AddExpression(4, ef_return_number, "", "Game info", "getNumberOfAchievements", "The number of achievements.");
AddExpression(5, ef_return_string, "", "Game info", "getCurrentGameLanguage", "Returns a String represents the current language from Steam specifically set for the game.");
AddExpression(6, ef_return_string, "", "Game info", "getCurrentUILanguage", "Returns a String represents the current language from Steam set in UI.");
AddExpression(7, ef_return_string, "", "Game info", "getAchievementNames", "Returns a String with the name of achievements (eg: for 'x' achievements, return string='achievement_01,achievement_02,...x time').");
AddExpression(8, ef_return_number, "", "Leaderboard info", "getEntryCount", "Returns number of entry for current leaderboard, returns 0 if leaderboard isn't initialized or leaderbaord not found.");
AddExpression(9, ef_return_number, "", "Leaderboard info", "getLDBnewrank", "Returns new rank of player for current leaderboard, returns 0 on error or if leaderboard was not updated.");
AddExpression(10,ef_return_number, "", "Leaderboard info", "getLDBprevrank", "Returns previous rank of player for current leaderboard, returns 0 if player doesn't have entry before or if leaderboard isn't updated.");
AddExpression(11,ef_deprecated | ef_return_number, "", "Leaderboard info", "getLDBentry", "Returns score for current leaderboard.");
AddExpression(12,ef_return_number, "", "Leaderboard info", "getLDBdlentry", "Returns number of total entries by download function for current leaderboard.");
AddExpression(13,ef_return_number, "", "Leaderboard info", "getLDBdlentrycount", "Returns number of entries used by download function for current leaderboard.");
AddExpression(14,ef_return_string, "", "Leaderboard info", "getLDBdlEntryStr", "Returns a string with the current leaderboard. (sort type (top10/around user)[separator= &,& ]rank[separator= &,& ]player_name[separator= &,& ]score[separator= &,& ]rank[separator= &,& ]playername....).");
AddExpression(15,ef_return_any, "", "Steam - Stats", "getSteamstatvalue","(asynch)Returns the Steam stat value");
AddExpression(16,ef_return_number, "", "User info", "getBatPower", "returns the amount of battery power left in the current system in % [0..100], 255 for being on AC power.");
AddExpression(17,ef_return_number, "", "User info", "getfriendnumb","returns the number of user's friends");
AddExpression(18,ef_return_string, "", "User info", "getfriendname","returns the Steam name of user's friends");
AddExpression(19,ef_return_number, "", "Steam - Utils", "getSteamTimeServ", "Returns Steam server time in seconds since January 1, 1970 (i.e unix time).");
AddExpression(20,ef_return_number, "", "Steam - Game info", "getAppIDSteam", "Returns the steam App ID.");
AddExpression(21,ef_return_string, "", "Steam - Utils", "getSeparatorValue", "Returns the separator used for Leaderboard entries.");
AddStringParam("Stat Name", "API name of the Stat you want to Get.", "\"\"");
AddExpression(22,ef_return_any, "", "Steam - Stats", "GetStatSynch","(synch)Returns the Current Steam Stat Value.");
AddExpression(23,ef_return_any, "", "Steam - Cloud", "GetCloudTotal","Returns the amount of total byte on Steam Cloud.");
AddExpression(24,ef_return_any, "", "Steam - Cloud", "GetCloudAvailable","Returns the amount of available byte on Steam Cloud.");

AddNumberParam("Index","Number based on number of achievement (0-based)");
AddExpression(28, ef_return_string, "", "[Beta] Steam - Achievements", "getAchievementNameAtIndex", "[String]Returns the achievement name at current index.");

AddNumberParam("Index","Number based on number of achievement (0-based)");
AddExpression(29, ef_return_string, "", "[Beta] Steam - Achievements", "getAchievementStateAtIndex", "[String]Returns the achievement state stored in memory at current index.");


AddNumberParam("Index","Steam ID of friend number (0-based)");
AddExpression(30,ef_return_string, "", "[Beta] Steam - Friends", "getfriendCSteamIDat","Returns the Steam ID as uint64-string of user's friends (at index).");
AddStringParam("Steam ID", "Steam ID of the player (uint64-string).", "\"\"");
AddExpression(31,ef_return_string, "", "[Beta] Steam - Utils", "getSteamUserName","Returns user's Steam name.");

AddExpression(40,ef_return_any, "", "[Beta] Steam - Game Info", "getNumberOfCurrentPlayers","Returns current number of players in the game.");

AddExpression(50,ef_return_any, "", "Steam - Cloud", "getCloudDATAst","Returns the last data read from Steam Cloud.");

ACESDone();


var property_list = [
	new cr.Property(ept_combo,"Debug Mode","No","Enable/Disable Console Log", "No|Yes")
	];
	
function CreateIDEObjectType()
{
	return new IDEObjectType();
};

function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
};

IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
};

function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	this.instance = instance;
	this.type = type;
	
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
};

IDEInstance.prototype.OnInserted = function()
{
};

IDEInstance.prototype.OnDoubleClicked = function()
{
};

IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};

IDEInstance.prototype.OnRendererInit = function(renderer)
{
};

IDEInstance.prototype.Draw = function(renderer)
{
};

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
};