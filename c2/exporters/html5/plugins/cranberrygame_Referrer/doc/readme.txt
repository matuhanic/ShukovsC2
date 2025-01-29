[Plugin] Referrer

1.Overview

check referrer, especially check Google Play Store Campaign code.

[HTML5 website] [android] [crodova cli] [xdk]

ex) url including referrer code example1 (see: https://developers.google.com/analytics/devguides/collection/android/v2/campaigns#google-play-url-builder)

https://play.google.com/store/apps/details?id=com.cranberrygame.avoidshit&referrer=utm_source%3Dfreecoinsfacebookshareapp

market://details?id=com.cranberrygame.avoidshit&referrer=utm_source%3Dfreecoinsfacebookshareapp

http://mydomain.com/avoidshit/index.html?referrer=utm_source%3Dfreecoinsfacebookshareapp
http://localhost:50000/?referrer=utm_source%3Dfreecoinsfacebookshareapp

ex) url including referrer code example2

https://play.google.com/store/apps/details?id=com.cranberrygame.avoidshit&referrer=freecoinsfacebookshareapp

market://details?id=com.cranberrygame.avoidshit&referrer=freecoinsfacebookshareapp

http://mydomain.com/avoidshit/index.html?referrer=freecoinsfacebookshareapp
http://localhost:50000/?referrer=freecoinsfacebookshareapp

2.Change log

1.0.5
	Added ReferrerSubParameter expression

3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

5.API

//actions
Check referrer

//events
On check referrer succeeded
On check referrer failed

//expressions
Referrer
ReferrerSubParameter

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
