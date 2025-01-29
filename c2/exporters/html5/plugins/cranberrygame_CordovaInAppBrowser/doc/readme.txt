[Plugin] Cordova InAppBrowser

1.Overview

open and handle in app browser (child browser).

[android, blackberry10, ios, windows8, wp8] [crodova cli] [xdk] [phonegap build service]

2.Change log

1.0.3
	Updated native plugin to org.apache.cordova.inappbrowser@0.5.4

3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

not needed

5.API

//actions
Open: Opens a URL in a new InAppBrowser instance, the current browser instance, or the system browser.
Close: Closes the InAppBrowser window.
Execute script: Injects JavaScript code into the InAppBrowser window
Insert CSS: Injects CSS into the InAppBrowser window.

//events
On load start: event fires when the InAppBrowser starts to load a URL.
On load stop: event fires when the InAppBrowser finishes loading a URL.
On load error: event fires when the InAppBrowser encounters an error when loading a URL.
On exit: event fires when the InAppBrowser window is closed.

//expressions
URL

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
