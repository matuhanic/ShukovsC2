[Plugin] Cordova FileTransfer

1.Overview

download or upload file to your server. (http file download and upload)

[android, blackberry10, ios, windows8, wp8] [crodova cli] [xdk] [phonegap build service]

you can also upload screen captured image file to your server by using PhonegapScreenCapture together. (example capx is included)
and if you want to share uploaded image file, you can use CordovaFacebook, ShareApp together. (example capx is included)

2.Change log

1.0.13
	Modified example capx
1.0.14
	Modified example capx
	
3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

[android, blackberry10, ios, windows8, wp8]

upload upload.php file in doc/upload folder to your web server's upload folder.

if the upload.php url is http://www.yourserver.com/upload/upload.php then you can put "http://www.yourserver.com/upload/upload.php" into Server cgi URL field in Upload file to server action.

5.API

//actions
Download file from URL
Upload file to server
Abort: (only supported on android, ios)

//events
On download file from URL succeeded
On download file from URL failed
On upload file to server succeeded
On upload file to server failed
On progress: (only supported on android, ios)

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
