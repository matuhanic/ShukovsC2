[Plugin] Cordova InstallApp

1.Overview

check installed apps count.

[android] [crodova cli] [xdk]

cf) 

<android app url>
android_google: market://details?id=com.mydomain.myapp
android_amazon: amzn://apps/android?p=com.mydomain.myapp
android_lgworld: http://www.lgworld.com/applicationId=PID14021816111
android_naver: appstore://store?packageName=com.mydomain.myapp
android_olleh: http://market.olleh.com/appDetail?ptype=C&pid=51200017002111
android_opera: http://apps.opera.com/badge.php?a=c&v=dark_v2&did=79711&pid=363111
android_samsungapps: samsungapps://ProductDetail/com.mydomain.myapp
android_slideme: sam://details?id=com.mydomain.myapp
android_t: http://tsto.re/0000646111

2.Change log

2.0.2
	Updated native plugin
2.0.3
	Changed DownloadApp plugin name to InstallApp
	Added Get installed apps action
2.0.8
	Restored DownloadApp plugin
	Renamed from InstallApp to CordovaInstallApp	
	
3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

not needed

5.API

//actions
Get installed apps

//events
On get installed apps succeeded
On get installed apps failed

//expressions
InstalledAppsCount
InstalledAppPackageAt
InstalledAppVersionCodeAt
InstalledAppVersionNameAt

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
