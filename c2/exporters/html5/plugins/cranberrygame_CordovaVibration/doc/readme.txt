[Plugin] Cordova Vibration

1.Overview

vibrate device.

[android, blackberry10, ios, wp8] [crodova cli] [xdk] [phonegap build service]

2.Change log

1.0.6
	Removed Repeat parameter
	Added Vibrate action
	Fixed ios bug

3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

not needed

5.API

//actions
Vibrate: Vibrate during specified miliseconds.
Vibrate with pattern: vibrate with specified pattern (android and wp8 only)
Cancel vibration: (not supported in ios)

cf)Vibrate

iOS Quirks
time: Ignores the specified time and vibrates for a pre-set amount of time.
navigator.vibrate(3000); // 3000 is ignored

Windows and Blackberry Quirks
time: Max time is 5000ms (5s) and min time is 1ms
navigator.vibrate(8000); // will be truncated to 5000

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
