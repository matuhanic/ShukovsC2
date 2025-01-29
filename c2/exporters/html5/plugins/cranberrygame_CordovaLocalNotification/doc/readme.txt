[Plugin] Cordova LocalNotification

1.Overview

send local notification even if app exits, usually suited for time-based apps such as calendar and to-do list apps.

[android, ios, wp8] [crodova cli] [xdk] [phonegap build service]

On android, Normal app and backgrounded app can schedule local notification.

On ios, Normal app, backgrounded app and ran-and-exited app can schedule local notification.

2.Change log

1.0.19
	Added On conditions (On local notification arrived, On local notification clicked) and expressions (LocalNotificationId, LocalNotificationData)

3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

not needed

5.API

//actions
Send local notification
Cancel local notification
Cancel all local notifications

//conditions
On local notification arrived
On local notification clicked
On cancel local notification succeeded

//expressions
LocalNotificationId
LocalNotificationData

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
