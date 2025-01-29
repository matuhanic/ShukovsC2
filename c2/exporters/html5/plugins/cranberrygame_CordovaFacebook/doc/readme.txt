[Plugin] Cordova Facebook

1.Overview

facebook login, prompt wall post, publish wall post, publish score, show leaderboard and invite.

[android, ios] [crodova cli] [xdk] [cocoon]

requires facebook developer account https://developers.facebook.com/apps

You can also use this plugin's AccessToken with lanceal's various facebook related plugins: https://www.scirra.com/forum/facebook_t111941

2.Change log

2.0.2
	Modified capx example
2.0.3
	Modified capx example
2.0.4
	Updated readme.txt
2.0.5
	Added Request Permission function and modified login to take string parameter of permissions (contributed by gizmodude4)
2.0.5.1
	Cleaned capx example
2.0.7.1
    1. fixed android-support-v4.jar build conflict with Phonegap Game problem. (so no need to use Phonegap FacebookPB (just use Phonegap Facebook))
    2.Added facebook share auto time line posting marketing example (example_phonegapfacebook_advanced_facebookshare_auto_requires id.capx)
2.0.22
	Changed plugin name "Phonegap Facebook" to Cordova Facebook.
	Added Show leaderboard and Invite actions.
	
3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

[android]

https://developers.facebook.com/apps - Add a New App - ... - Skip Quick Start

Put your app id and your app name to Phonegap Facebook plugin's c2 property.

cf)How to get Key Hashes (facebook)

cd /d D:\sign\android
keytool -list -v -keystore mykey.keystore -alias mykeystore

SHA1: 90:2F:37:48:~~~~~~:09:2D:61:52:E6

convert upper SHA1 to base64 string for facebook from following site.
http://tomeko.net/online_tools/hex_to_base64.php?lang=en

==> Key Hashes: kC83~~~~~~~~~1hUuY=

5.API

//actions
Login
Logout
Check permissions: (publish_actions: need to be reviewed by facebook)
Request permissions: (publish_actions: need to be reviewed by facebook)
Prompt wall post
Prompt wall post link
Prompt wall post link this app
Publish wall post: (publish_actions)
Publish wall post link: (publish_actions)
Publish wall post link this app: (publish_actions)
Publish score: (publish_actions)
Show leaderboard: (publish_actions)
Hide leaderboard: (publish_actions)
Request high score: (publish_actions)
Invite

//events
On login succeeded
On login failed
On logout succeeded
On logout failed
On check permissions succeeded
On check permissions failed
On request permissions succeeded
On request permissions failed
On prompt wall post succeeded
On prompt wall post failed
On prompt wall post link succeeded
On prompt wall post link failed
On prompt wall post link this app succeeded
On prompt wall post link this app failed
On publish wall post succeeded
On publish wall post failed
On publish wall post link succeeded
On publish wall post link failed
On publish wall post link this app succeeded
On publish wall post link this app failed
On publish score succeeded
On publish score failed
On request high score succeeded
On request high score failed
On invite succeeded
On invite failed

//conditions
Is logined
Is showing leaderboard

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
