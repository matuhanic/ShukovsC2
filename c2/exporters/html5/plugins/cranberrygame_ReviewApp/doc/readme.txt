[Plugin] ReviewApp

1.Overview

show review dialog automatically per 5 run. So people who ran your app 5 times will be notified to review your app.

[HTML5 website] [android, blackberry10, ios, windows8, wp8] [crodova cli] [xdk]

if you set auto show rate dialog = Yes, 
popup will be shown until you click Yes. (if you click No, popup will be show after next 5 run)

cf) 

<android rate url>
android_google: market://details?id=com.mydomain.myapp&write_review=true
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
	Modified c2 default property value
2.0.4
	Skip if rate url property is blank
2.0.5
	revised wrong native plugin url
2.0.6
	changed native plugin url
2.0.7
	Fixed ios8 bug
	
3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

not needed

5.API

//actions
Show review app dialog
Reset auto review app dialog
Open review app url directly
Get review app count: (supports only android)

//events
On get review app count: (supports only android)

//expressions
ReviewAppCount
RunCount

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
