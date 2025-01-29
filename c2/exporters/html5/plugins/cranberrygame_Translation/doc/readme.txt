[Plugin] Translation

1.Overview

provide simple translation text from JSON

[HTML5 website] [android, blackberry10, ios, wp8, windows8] [crodova cli] [xdk] [phonegap build service]

Translation.Add from JSON string
then use local language text like this according to selected language: Translation.Text("home_title")

2.Change log

3.Install plugin

Now all the native plugins are installed automatically
https://plus.google.com/102658703990850475314/posts/XS5jjEApJYV

4.Server setting

not needed

5.API

//actions
Add texts from JSON
Language is: Check language code
Language is detected: Language code is detected
Change language: Change language code

//expressions
Text: expression to get text according to the language.
Language: expression to get language code

cf) JSON string format:
"{
 	""en"":{
     ""home_title"":""Block Puzzle"",
     ""play"":""Play""
  }, 
 	""ko"":{
     ""home_title"":""∫Ì∑œ ∆€¡Ò"",
     ""play"":""≥Ó¿Ã""
  }   
}"

6.Examples

example capx are included in doc folder

7.Test

8.Useful links

Plugins For Cordova
http://cranberrygame.github.io?referrer=readme.txt
