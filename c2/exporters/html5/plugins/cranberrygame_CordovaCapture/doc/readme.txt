[Plugin] Phonegap Capture

1.Overview

capture audio, image, and video

[android, ios, blackberry10, wp8] [crodova cli] [xdk] [phonegap build service]

2.Change log

1.0.10
	Changed event name from success to succeeded
	
3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

not needed

5.API

//actions
Capture audio
Capture image
Capture video

//events
On audio capture succeeded
On audio capture failed
On image capture succeeded
On image capture failed
On video capture succeeded
On video capture failed

//expressions
CapturedAudio: get captured audio's file uri (ex file:/storage/sdcard0/recording-2002902927.3gpp)
CapturedImage: get captured image's file uri (file:/storage/sdcard0/DCIM/Camera/1413245043796.jpg)
CapturedVideo: get captured video's file uri (file:/storage/sdcard0/DCIM/Camera/VID_20141014_090836.mp4)

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
