# jQuery Vintage Text

Slap a vintage looking text terminal on your webpage. Have it type something. Then type back!

## Quick start

### Get the Plugin:
Get these two files:
* jquery.vintageTxt.js
* jquery.vintageTxt.css

Load them up in your project. Make sure you have jQuery 1.7 or later, as well.

### Create a container div:
`<div id="foo"></div>`

### Call the vintageTxt() function
`$('#foo').vintageTxt();`

## Features

* Green Scanlines
* Optional image overlay/border
* Blinking cursor with 'enter key' input
* Self-typing text effect

## Documentation

### Options:
 * text: An array of text. One line per array element.
 * overlayImage: The path to an image file to overlay the sreen
 * txtSpeed: The speed at which each letter is drawn (30ms)
 * linePause: The duration of the pause between each line (800ms)
 * maxRows: The maximum number of text lines shown at once (10)
 * promptEnabled: Show an input prompt underneath text
 * autoStart: Begin typing the text as soon as the plugin loads
 * onEnterKey: Callback function for the enter keypress
 * onFinishedTyping: Callback for when all the text has been typed

A more robust example:

```javascript
$('#foo').vintageTxt({
  text: ["And I think to myself,","what a wonderful world.","Oooh, yeah..."],
  textSpeed: 150,
  linePause: 500,
  promptEnabled: false,
  onFinishedTyping: function() {
    $('#foo').delay(500).fadeOut(2000);
  }
});
```

## Credits

http://www.wittworksproductions.com/2012/12/scan-lines-with-javascript/

http://www.websanova.com/tutorials/jquery/the-ultimate-guide-to-writing-jquery-plugins#.UTPqr4e4bVN