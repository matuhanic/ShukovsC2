[Plugin] Cordova SplashScreen

1.Overview

auto hide splash screen right now or after 3 seconds

[android, blackberry10, ios, windows8, wp8] [crodova cli] [xdk] [phonegap build service]

cf)phonegap cli

To use auto hide splash screen = Yes, first you must set congif.xml as the following.

//android
//edit your_phonegapcli_project\config.xml
...
<preference name="SplashScreen" value="screen" />
<preference name="SplashScreenDelay" value="10000" />
</widget>

//ios
//edit your_phonegapcli_project\platforms\ios\Project Name\config.xml
...
    <preference name="AutoHideSplashScreen" value="false" />
...
</widget>

cf)phonegap build service

To use auto hide splash screen = Yes, first you must set congif.xml as the following.

//android
//edit config.xml
...
<preference name="SplashScreen" value="screen" />//need to check if this is required
<preference name="SplashScreenDelay" value="10000" />
</widget>

//ios
//edit config.xml
...
<preference name="AutoHideSplashScreen" value="false" />
</widget>

cf)splash screen

//android
command.add "copy /Y "+splash_dir+"\\splash_800x480.png platforms\\android\\res\\drawable-land-hdpi\\screen.png"
command.add "copy /Y "+splash_dir+"\\splash_320x200.png platforms\\android\\res\\drawable-land-ldpi\\screen.png"
command.add "copy /Y "+splash_dir+"\\splash_480x320.png platforms\\android\\res\\drawable-land-mdpi\\screen.png"
command.add "copy /Y "+splash_dir+"\\splash_1280x720.png platforms\\android\\res\\drawable-land-xhdpi\\screen.png"
command.add "copy /Y "+splash_dir+"\\splash_480x800.png platforms\\android\\res\\drawable-port-hdpi\\screen.png"
command.add "copy /Y "+splash_dir+"\\splash_200x320.png platforms\\android\\res\\drawable-port-ldpi\\screen.png"
command.add "copy /Y "+splash_dir+"\\splash_320x480.png platforms\\android\\res\\drawable-port-mdpi\\screen.png"
command.add "copy /Y "+splash_dir+"\\splash_720x1280.png platforms\\android\\res\\drawable-port-xhdpi\\screen.png"

xlarge (xhdpi): at least 960 × 720
large (hdpi): at least 640 × 480
medium (mdpi): at least 470 × 320
small (ldpi): at least 426 × 320

//ios
command.add "cp "+splash_dir+"/splash_640x960.png platforms/ios/"+project_name_real+"/Resources/splash/Default@2x~iphone.png"
command.add "cp "+splash_dir+"/splash_320x480.png platforms/ios/"+project_name_real+"/Resources/splash/Default~iphone.png"
command.add "cp "+splash_dir+"/splash_640x1136.png platforms/ios/"+project_name_real+"/Resources/splash/Default-568h@2x~iphone.png"
command.add "cp "+splash_dir+"/splash_2048x1536.png platforms/ios/"+project_name_real+"/Resources/splash/Default-Landscape@2x~ipad.png"
command.add "cp "+splash_dir+"/splash_1024x768.png platforms/ios/"+project_name_real+"/Resources/splash/Default-Landscape~ipad.png"
command.add "cp "+splash_dir+"/splash_1536x2048.png platforms/ios/"+project_name_real+"/Resources/splash/Default-Portrait@2x~ipad.png"
command.add "cp "+splash_dir+"/splash_768x1024.png platforms/ios/"+project_name_real+"/Resources/splash/Default-Portrait~ipad.png"
	
platforms\ios\Slide Puzzle\Resources\splash\Default-568h@2x~iphone.png (640x1136 pixels)
platforms\ios\Slide Puzzle\Resources\splash\Default-Landscape@2x~ipad.png (2048x1496 pixels)
platforms\ios\Slide Puzzle\Resources\splash\Default-Landscape~ipad.png (1024x748 pixels)
platforms\ios\Slide Puzzle\Resources\splash\Default-Portrait@2x~ipad.png (1536x2008 pixels)
platforms\ios\Slide Puzzle\Resources\splash\Default-Portrait~ipad.png (768x1004 pixels)
platforms\ios\Slide Puzzle\Resources\splash\Default@2x~iphone.png (640x960 pixels)
platforms\ios\Slide Puzzle\Resources\splash\Default~iphone.png (320x480 pixels)

//windows8
command.add "copy /Y "+splash_dir+"\\splash_620x300.png platforms\\windows8\\images\\splashscreen.png"

//wp8
command.add "convert.exe -resize 480x800 "+splash_dir+"\\splash_480x800.png platforms\\wp8\\SplashScreenImage.jpg"

cf)icon

//android
command.add "convert.exe -resize 96x96 "+icon_dir+"\\icon.png platforms\\android\\res\\drawable\\icon.png"
command.add "convert.exe -resize 36x36 "+icon_dir+"\\icon.png platforms\\android\\res\\drawable-ldpi\\icon.png"
command.add "convert.exe -resize 48x48 "+icon_dir+"\\icon.png platforms\\android\\res\\drawable-mdpi\\icon.png"
command.add "convert.exe -resize 72x72 "+icon_dir+"\\icon.png platforms\\android\\res\\drawable-hdpi\\icon.png"
command.add "convert.exe -resize 96x96 "+icon_dir+"\\icon.png platforms\\android\\res\\drawable-xhdpi\\icon.png"

//blackberry10
command.add "convert.exe -resize 80x80 "+icon_dir+"\\icon.png platforms\\blackberry10\\cordova\\default-icon.png"

//ios
command.add "convert -resize 57x57 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon.png"
command.add "convert -resize 114x114 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon@2x.png"
command.add "convert -resize 40x40 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-40.png"
command.add "convert -resize 80x80 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-40@2x.png"
command.add "convert -resize 50x50 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-50.png"
command.add "convert -resize 100x100 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-50@2x.png"
command.add "convert -resize 60x60 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-60.png"
command.add "convert -resize 120x120 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-60@2x.png"
command.add "convert -resize 72x72 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-72.png"
command.add "convert -resize 144x144 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-72@2x.png"
command.add "convert -resize 76x76 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-76.png"
command.add "convert -resize 152x152 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-76@2x.png"
command.add "convert -resize 29x29 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-small.png"
command.add "convert -resize 58x58 "+icon_dir+"/icon.png platforms/ios/"+project_name_real+"/Resources/icons/icon-small@2x.png"

//windows8
command.add "convert.exe -resize 150x150 "+icon_dir+"\\icon_windows8.png platforms\\windows8\\images\\logo.png"
command.add "convert.exe -resize 30x30 "+icon_dir+"\\icon_windows8.png platforms\\windows8\\images\\smalllogo.png"
command.add "convert.exe -resize 50x50 "+icon_dir+"\\icon_windows8.png platforms\\windows8\\images\\storelogo.png"
	
//wp8	
command.add "convert.exe -resize 62x62 "+icon_dir+"\\icon.png platforms\\wp8\\ApplicationIcon.png"
command.add "convert.exe -resize 173x173 "+icon_dir+"\\icon.png platforms\\wp8\\Background.png"

2.Change log

3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

not needed

5.API
	
6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
