[Plugin] Cordova BluetoothSerial

1.Overview

enables serial communication over bluetooth.

[android, ios] [crodova cli] [xdk] [phonegap build service]

NOTE:
Android uses Classic Bluetooth. iOS uses Bluetooth Low Energy.
iOS Bluetooth Low Energy requires iPhone 4S, iPhone5, iPod 5, or iPad3+
Currently iOS only works with RedBear Labs Hardware and Adafruit Bluefruit LE
Will not connect Android to Android
Will not connect iOS to iOS*

2.Change log

3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

[android]

System settings - Bluetooth - ON

[ios]

Settings - Bluetooth - On

5.API

//actions
Check bluetooth enabled
Paired device list
Connect
Connect insecure: works like connect, but creates an insecure connection to a Bluetooth device. 
                  See the Android docs for more information. http://developer.android.com/reference/android/bluetooth/BluetoothDevice.html#createInsecureRfcommSocketToServiceRecord(java.util.UUID)
                  (not supported on iOS.) 
Disconnect
Check connected
Write: Function write data to the serial port. Data must be a String.
Read: Function read reads the data from the buffer. 
      The data is passed to the success callback as a String. 
      Calling read when no data is available will pass an empty String to the callback.
ReadUntil: Function readUntil reads the data from the buffer until it reaches a delimiter. 
           The data is passed to the success callback as a String. 
		   If the buffer does not contain the delimiter, an empty String is passed to the callback. 
Subscribe: Function subscribe registers a callback that is called when data is received. 
           A delimiter must be specified. 
           The callback is called with the data as soon as the delimiter string is read. 
           The callback is a long running callback and will exist until unsubscribe is called.
Unsubscribe
Clear: removes any data from the receive buffer.

//events
On check bluetooth enabled enabled
On check bluetooth enabled disabled
On paired device list found
On paired device list not found
On connect succeeded
On connect failed
On connect insecure succeeded
On connect insecure failed
On disconnect succeeded
On disconnect failed
On check connected connected
On check connected disconnected
On write succeeded
On write failed
On read data
On read until data
On subscribe data
On unsubscribe succeeded
On unsubscribe failed

//expressions
PairedDeviceCount
PairedDeviceNameAt
PairedDeviceMacaddressAt
AvailableByte
ReadData
ReadUntilData
SubscribeData

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
