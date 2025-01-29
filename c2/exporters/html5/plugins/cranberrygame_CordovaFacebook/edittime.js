function GetPluginSettings()
{
	return {
		"name":			"Cordova Facebook",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"cranberrygame_CordovaFacebook",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.0.28",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"facebook login, prompt wall post, publish wall post, publish score, show leaderboard and invite.",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Cordova extension: share",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
/*
//cranberrygame start
cordova-plugin-share-facebook
phonegap build service: 
cordova registry: 
github: https://github.com/cranberrygame/cordova-plugin-share-facebook
//cranberrygame end
*/
		"cordova-plugins":	"https://github.com/cranberrygame/cordova-plugin-share-facebook --variable APP_ID='YOUR_FACEBOOK_APP_ID' --variable APP_NAME='YOUR_FACEBOOK_APP_NAME'",
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
/*
		// example
		,"dependency": "three.min.js;OBJLoader.js"
*/
//cranberrygame start
		,"dependency": "modal.css;channel.html"//channel.html: for web
//cranberrygame start												
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name

/*				
// example				
AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");
AddCondition(1, cf_trigger, "Trigger Condition", "My category", "Trigger Condition", "Triggered when TriggerAction", "TriggerCondition");//cranberrygame
*/
//cranberrygame start
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different login.", "\"\"");
AddCondition(0, cf_trigger, "On login succeeded", "Login", "On login (tag <b>{0}</b>) succeeded", "Triggered when the user successfully logs in.", "OnLoginSucceeded");
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different login.", "\"\"");
AddCondition(1, cf_trigger, "On login failed", "Login", "On login (tag <b>{0}</b>) failed", "Triggered when the user successfully logs in.", "OnLoginFailed");
AddCondition(2, cf_trigger, "On logout succeeded", "Login", "On logout succeeded", "Triggered when the user logs out.", "OnLogoutSucceeded");
AddCondition(3, cf_trigger, "On logout failed", "Login", "On logout failed", "Triggered when the user logs out.", "OnLogoutFailed");
AddCondition(4,	0, "Is logined", "Login", "Is logined", "True if currently being viewed inside Facebook by a logged in user.", "IsLogined");
//
AddCondition(5, cf_trigger, "On check permissions succeeded", "Permissions (publish_actions: need to be reviewed by facebook)", "On check permissions succeeded", "Triggered when TriggerAction", "OnCheckPermissionsSucceeded");
AddCondition(6, cf_trigger, "On check permissions failed", "Permissions (publish_actions: need to be reviewed by facebook)", "On check permissions failed", "Triggered when TriggerAction", "OnCheckPermissionsFailed");
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different request permissions.", "\"\"");
AddCondition(7, cf_trigger, "On request permissions succeeded", "Permissions (publish_actions: need to be reviewed by facebook)", "On request permissions (tag <b>{0}</b>) succeeded", "Triggered when TriggerAction.", "OnRequestPermissionsSucceeded");
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different request permissions.", "\"\"");
AddCondition(8, cf_trigger, "On request permissions failed", "Permissions (publish_actions: need to be reviewed by facebook)", "On request permissions (tag <b>{0}</b>) failed", "Triggered when TriggerAction.", "OnRequestPermissionsFailed");
//
AddCondition(9, cf_trigger, "On prompt wall post succeeded", "Prompt wall post", "On prompt wall post succeeded", "Triggered when TriggerAction", "OnPromptWallPostSucceeded");//cranberrygame
AddCondition(10, cf_trigger, "On prompt wall post failed", "Prompt wall post", "On prompt wall post failed", "Triggered when TriggerAction", "OnPromptWallPostFailed");//cranberrygame
AddCondition(11, cf_trigger, "On prompt wall post link succeeded", "Prompt wall post", "On prompt wall post link succeeded", "Triggered when TriggerAction", "OnPromptWallPostLinkSucceeded");//cranberrygame
AddCondition(12, cf_trigger, "On prompt wall post link failed", "Prompt wall post", "On prompt wall post link failed", "Triggered when TriggerAction", "OnPromptWallPostLinkFailed");//cranberrygame
AddCondition(13, cf_trigger, "On prompt wall post link this app succeeded", "Prompt wall post", "On prompt wall post link this app succeeded", "Triggered when TriggerAction", "OnPromptWallPostLinkThisAppSucceeded");//cranberrygame
AddCondition(14, cf_trigger, "On prompt wall post link this app failed", "Prompt wall post", "On prompt wall post link this app failed", "Triggered when TriggerAction", "OnPromptWallPostLinkThisAppFailed");//cranberrygame
//
AddCondition(15, cf_trigger, "On publish wall post succeeded", "Publish wall post (publish_actions)", "On publish wall post succeeded", "Triggered when TriggerAction", "OnPublishWallPostSucceeded");//cranberrygame
AddCondition(16, cf_trigger, "On publish wall post failed", "Publish wall post (publish_actions)", "On publish wall post failed", "Triggered when TriggerAction", "OnPublishWallPostFailed");//cranberrygame
AddCondition(17, cf_trigger, "On publish wall post link succeeded", "Publish wall post (publish_actions)", "On publish wall post link succeeded", "Triggered when TriggerAction", "OnPublishWallPostLinkSucceeded");//cranberrygame
AddCondition(18, cf_trigger, "On publish wall post link failed", "Publish wall post (publish_actions)", "On publish wall post link failed", "Triggered when TriggerAction", "OnPublishWallPostLinkFailed");//cranberrygame
AddCondition(19, cf_trigger, "On publish wall post link this app succeeded", "Publish wall post (publish_actions)", "On publish wall post link this app succeeded", "Triggered when TriggerAction", "OnPublishWallPostLinkThisAppSucceeded");//cranberrygame
AddCondition(20, cf_trigger, "On publish wall post link this app failed", "Publish wall post (publish_actions)", "On publish wall post link this app failed", "Triggered when TriggerAction", "OnPublishWallPostLinkThisAppFailed");//cranberrygame
//
AddCondition(21, cf_trigger, "On publish score succeeded", "Leaderboard (publish_actions)", "On publish score succeeded", "Triggered when TriggerAction", "OnPublishScoreSucceeded");//cranberrygame
AddCondition(22, cf_trigger, "On publish score failed", "Leaderboard (publish_actions)", "On publish score failed", "Triggered when TriggerAction", "OnPublishScoreFailed");//cranberrygame
AddCondition(23, cf_none, "Is showing leaderboard", "Leaderboard (publish_actions)", "Is showing leaderboard", "Description for my condition!", "IsShowingLeaderboard");
AddCondition(24, cf_trigger, "On request high score succeeded", "Leaderboard (publish_actions)", "On request high score succeeded", "Triggered when TriggerAction", "OnRequestHighScoreSucceeded");
AddCondition(25, cf_trigger, "On request high score failed", "Leaderboard (publish_actions)", "On request high score failed", "Triggered when TriggerAction", "OnRequestHighScoreFailed");
//
AddCondition(26, cf_trigger, "On invite succeeded", "Invite", "On invite succeeded", "Triggered when TriggerAction", "OnInviteSucceeded");
AddCondition(27, cf_trigger, "On invite failed", "Invite", "On invite failed", "Triggered when TriggerAction", "OnInviteFailed");
//cranberrygame end
	
////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

/*
// example
AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");
AddAction(1, af_none, "Trigger Action", "My category", "Trigger Action", "Trigger TriggerCondition", "TriggerAction");//cranberrygame
*/
//cranberrygame start
AddStringParam("Permissions", "The permissions to ask for (read-only) ex) \"email, public_profile, user_friends\"", "\"email, public_profile, user_friends\""); //gizmodude4
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different login.", "\"\"");
AddAction(0, 0, "Login", "Login", "Login {0} (tag <i>{1}</i>)", "Log the user in to the application so their details can be accessed.", "Login");
AddAction(1, 0, "Logout", "Login", "Logout", "Log the user out.", "Logout");
//
AddStringParam("Permissions", "The permissions you want to check", "\"publish_actions\"");
AddAction(2, 0, "Check permissions", "Permissions (publish_actions: need to be reviewed by facebook)", "Check permissions {0}", "Check permissions.", "CheckPermissions");
AddStringParam("Permissions", "The permissions you want to get", "\"publish_actions\"");
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different request permissions.", "\"\"");
AddAction(3, 0, "Request permissions", "Permissions (publish_actions: need to be reviewed by facebook)", "Request permissions {0} (tag <i>{1}</i>)", "Request permissions.", "RequestPermissions");
//
AddAction(4, 0, "Prompt wall post", "Prompt wall post", "Prompt wall post", "Bring up a dialog where the user can share some text on their wall or choose to cancel.", "PromptWallPost");
AddStringParam("URL", "The link to share. ex1) \"https://play.google.com/store/apps/details?id=com.cranberrygame.avoidbird\" ex2) \"https://itunes.apple.com/app/id738268111\"", "\"https://play.google.com/store/apps/details?id=com.cranberrygame.avoidbird\"");
AddStringParam("Name (optional)", "The link text. ex) \"Block Puzzle\"", "\"\"");
AddStringParam("Description (optional)", "The description appearing beneath the caption in the Share dialog. ex) \"Filling and fitting various block shapes. Block puzzle's features 1: Filling and fitting simple 4x4 5x5 6x6 center gray rectangle with square block shapes. 2: All block shapes are unique 3: No rotate of blocks is allowed.\"", "\"\"");
AddStringParam("Caption (optional)", "The caption appearing beneath the name in the Share dialog. ex) \"Filling and fitting various block shapes\"", "\"\"");
AddStringParam("Picture URL (optional)", "The URL of an image on your server to use on the Share dialog. ex) \"http://www.yourserver.com/upload/c2i_139201420123.png\"", "\"\"");
AddAction(6, 0, "Prompt wall post link", "Prompt wall post", "Prompt wall post link {0}", "Bring up a dialog where the user can share a link on their wall or choose to cancel.", "PromptWallPostLink");
AddStringParam("Name (optional)", "The link text. ex) \"Block Puzzle\"", "\"\"");
AddStringParam("Description (optional)", "The description appearing beneath the caption in the Share dialog. ex) \"Filling and fitting various block shapes. Block puzzle's features 1: Filling and fitting simple 4x4 5x5 6x6 center gray rectangle with square block shapes. 2: All block shapes are unique 3: No rotate of blocks is allowed.\"", "\"\"");
AddStringParam("Caption (optional)", "The caption appearing beneath the name in the Share dialog. ex) \"Filling and fitting various block shapes\"", "\"\"");
AddStringParam("Picture URL (optional)", "The URL of an image on your server to use on the Share dialog. ex) \"http://www.yourserver.com/upload/c2i_139201420123.png\"", "\"\"");
AddAction(5, 0, "Prompt wall post link this app", "Prompt wall post", "Prompt wall post link this app", "Bring up a dialog where the user can share a link to the app on their wall or choose to cancel.", "PromptWallPostLinkThisApp");
//
AddStringParam("Message", "The text to publish to the user's feed.  It is recommended to only do this when the user initiates the action. ex1) \"Hey friend, I want to share Pick Up Sticks game with you.\" ex2) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"", "\"Hey friend, I want to share Pick Up Sticks game with you.\"");
AddAction(7, 0, "Publish wall post", "Publish wall post (publish_actions)", "Publish wall post {0}", "Publish a message to the user's wall.  The user should explicitly initiate this.", "PublishWallPost");
AddStringParam("Message", "The text to publish to the user's feed.  It is recommended to only do this when the user initiates the action. ex1) \"Hey friend, I want to share Pick Up Sticks game with you.\" ex2) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"", "\"Hey friend, I want to share Pick Up Sticks game with you.\"");
AddStringParam("URL", "The link to share. ex1) \"https://play.google.com/store/apps/details?id=com.cranberrygame.avoidbird\" ex2) \"https://itunes.apple.com/app/id738268111\"", "\"https://play.google.com/store/apps/details?id=com.cranberrygame.avoidbird\"");
AddStringParam("Name (optional)", "The link text. ex) \"Block Puzzle\"", "\"\"");
AddStringParam("Description (optional)", "The description appearing beneath the caption in the Share dialog. ex) \"Filling and fitting various block shapes. Block puzzle's features 1: Filling and fitting simple 4x4 5x5 6x6 center gray rectangle with square block shapes. 2: All block shapes are unique 3: No rotate of blocks is allowed.\"", "\"\"");
AddStringParam("Caption (optional)", "The caption appearing beneath the name in the Share dialog. ex) \"Filling and fitting various block shapes\"", "\"\"");
AddStringParam("Picture URL (optional)", "The URL of an image on your server to use on the Share dialog. ex) \"http://www.yourserver.com/upload/c2i_139201420123.png\"", "\"\"");
AddAction(8, 0, "Publish wall post link", "Publish wall post (publish_actions)", "Publish wall post link {0} {1}", "Publish a link to the user's wall.  The user should explicitly initiate this.", "PublishWallPostLink");
AddStringParam("Message", "The text to publish to the user's feed.  It is recommended to only do this when the user initiates the action. ex1) \"Hey friend, I want to share Pick Up Sticks game with you.\" ex2) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"", "\"Hey friend, I want to share Pick Up Sticks game with you.\"");
AddStringParam("Name (optional)", "The link text. ex) \"Block Puzzle\"", "\"\"");
AddStringParam("Description (optional)", "The description appearing beneath the caption in the Share dialog. ex) \"Filling and fitting various block shapes. Block puzzle's features 1: Filling and fitting simple 4x4 5x5 6x6 center gray rectangle with square block shapes. 2: All block shapes are unique 3: No rotate of blocks is allowed.\"", "\"\"");
AddStringParam("Caption (optional)", "The caption appearing beneath the name in the Share dialog. ex) \"Filling and fitting various block shapes\"", "\"\"");
AddStringParam("Picture URL (optional)", "The URL of an image on your server to use on the Share dialog. ex) \"http://www.yourserver.com/upload/c2i_139201420123.png\"", "\"\"");
AddAction(9, 0, "Publish wall post link this app", "Publish wall post (publish_actions)", "Publish wall post link this app {0}", "Publish a link to the user's wall.  The user should explicitly initiate this.", "PublishWallPostLinkThisApp");
//
AddNumberParam("Score", "The user's score for this game to publish.");
AddAction(10, 0, "Publish score", "Leaderboard (publish_actions)", "Publish score <b>{0}</b>", "Publish a score for this user.", "PublishScore");
AddAction(11, af_none, "Show leaderboard", "Leaderboard (publish_actions)", "Show leaderboard", "Show leaderboard.", "ShowLeaderboard");
AddAction(12, af_none, "Hide leaderboard", "Leaderboard (publish_actions)", "Hide leaderboard", "Hide leaderboard.", "HideLeaderboard");
AddAction(13, 0, "Request high score", "Leaderboard (publish_actions)", "Request high score", "Request high score.", "RequestHighScore");
//
AddAction(14, 0, "Invite", "Invite", "Invite", "Invite.", "Invite");
//cranberrygame end
//
////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

/*
// example
AddExpression(0, ef_return_number, "Get cell x count", "My category", "MyExpression", "Get cell x count."); //cranberrygame
AddExpression(1, ef_return_string, "Get text.", "My category", "TextWithNoParam", "Get text."); //cranberrygame
AddStringParam("StringParam", "Enter string param");
AddExpression(2, ef_return_string, "Get text.", "My category", "Text", "Get text."); //cranberrygame
*/
//cranberrygame start
AddExpression(0, ef_return_number, "Get user Id", "Login", "UserId", "Get the user's Id, which is different even for users with the same name.");
AddExpression(1, ef_return_string, "Get full name", "Login", "FullName", "Get the user's full name, if they are logged in.");
AddExpression(2, ef_return_string, "Get first name", "Login", "FirstName", "Get the user's first name, if they are logged in.");
AddExpression(3, ef_return_string, "Get last name", "Login", "LastName", "Get the user's last name, if they are logged in.");
AddExpression(4, ef_return_string, "Get gender", "Login", "Gender", "Get the user's genders, if they are logged in.");
AddExpression(5, ef_return_string, "Get email", "Login", "Email", "Get the user's email, if they are logged in.");
//cranberrygame start: contributued by lancel
AddExpression(6, ef_return_string, "Get Access Token", "Login", "AccessToken", "Get a user access token for making graph API calls.");
//cranberrygame end
//
AddExpression(7, ef_return_number, "Get score", "Leaderboard", "Score", "Get the score, when in a 'on user top score' or 'on hi-score' event.");
//
AddExpression(8, ef_return_string, "Get error message", "Error", "ErrorMessage", "Get error message.");
//cranberrygame end
////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
/*
	new cr.Property(ept_integer, 	"My property",		77,		"An example property.") //cranberrygame , this.properties[0] from runtime.js
*/
//cranberrygame start
	new cr.Property(ept_text,		"App Id",		"",			"The App Id, set also in the native plugin install command."),
	new cr.Property(ept_text,		"App Name",		"",			"The App Name, set also in the native plugin install command."),
	new cr.Property(ept_section, 	"HTML5 website", "",	""),
	new cr.Property(ept_text,		"App secret",	"",			"The App Secret Facebook gives you after creating an app.  Only necessary for submitting scores!")
//cranberrygame emd
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}

//cranberrygame start
//cranberrygame end
