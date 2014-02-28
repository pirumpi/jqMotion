# [jqMotion](https://github.com/pirumpi/jqMotion)

jqMotion is a jQuery plugin intended to ease the process of manipulating the DOM utilizing the [Leap Motion controller](https://www.leapmotion.com/). While giving direct access to the leapmotion JavaScript object, jqMotion brings a full set of custamizations that make the construction of interactive application much simpler.

## Getting Started
This plugin requires 
* jQuery `~1.10.x` or `~2.x`
* js.leapmotion `~0.3.x` or `~0.4.x`

```html
<script src="//code.jquery.com/jquery-2.1.0.min.js"></script>
<script src="//js.leapmotion.com/leap-0.4.1.min.js"></script>
<script src="//jss.name/jqmotion.0.1.min.js"></script>
```

### Overview

Let say that you want to move a DOM element with id of pointer, and only be affected by your right hand. 

```js
    //Stantiating jqMotion with default settings
    $.jqMotion();

    $('#pointer').jqMotion({hand:0});
```
If you want to track the position (x,y,z) / (left, top, z) you can listen for the motion event as following:

```js
    //Stantiating jqMotion with default settings
    $.jqMotion();

    $('#pointer').jqMotion()
    .on('motion', function(data){
        console.log('Left, Top, Z', data.left, data.top, data.z);
    });
```

Listening to jqMotion's events

```js
    //Stantiating jqMotion with default settings
    $.jqMotion();
    
    $(document)
    .on('swipeLeft', function(e, gesture){
        console.log('swipeLeft');
    })
    .on('grap', function(e, gesture){
        console.log('grap');
    });
```


### Options

jqMotion provides an extensive configuration both for DOM elements and for the stantiation of the plugin.

For the plugin statiation you have the following options:

```js
   var controller =  jqMotion({
        main: $(document), //A jQuery object that point to a DOM element, by default jqMotion used $(document)
        leap:{ //Leap Motion native configurations
            host: '127.0.0.1',
            port: 6437, 
            enableGestures: true
        }
    });
    
    //JqMotion returns instance of leapmotion controller from which you can listen to the frame event or other loapmotion's events
    controller.on('connect', function(){
       console.log('The client is connected to the websocket'); 
    });
```

For the DOM element object you have the following options:
 
 ```js
    $('#pointer').jqMotion({
        
        pointer: this, //By default jqMotion manipulates the current object but it can be change to any element in the DOM
        
        trackMotion: true, //It will manipulate the top and left of the element unless is set to false
        
        constrain: true, // Restrict the movement of the object to the parent element dimensions 
        
        container: this.parent() //Defines parent element
        
        gestures: true, //Listen for jqMotion gesture events
        
        hand: 0, //Tracks the first hand that enters leap motion frame
        
        action: 'motion' //The name of the event that gets trigger with each motion frame

    });
 ```

##jqMotion's Events

* circle
    * circleLeft
    * circleRight
* swipe
    * swipteLeft
    * swipeRight
* sreenTap
* keyTap
* grap
    * grapRelease
    
Each event passes the gesture object to the function handler as a second parameter

## Controller Events Types
 
 * connect
 * protocol
 * ready
 * disconnect
 * focus
 * blur
 * deviceConnected
 * deviceDisconnected
 * frame
 * animationFrame
 * deviceFrame
 
For a complete list of the leapmotion event please vitis [Leap Motion Events](https://developer.leapmotion.com/leapjs/getting-started)

##Live demos

[Constraining element movement to parent's dimensions](http://plnkr.co/edit/ijSs4PaA3MKisp1c5jQY?p=preview)

[Flip element with jqMotion](http://plnkr.co/edit/um4ZBzawEdkJaDdS4z9R?p=preview)

##Games

Coming soon

## Release History

* 02/26/2014   0.1   Initial Release


## License 

(The BSD License)

Copyright (c) 2013 Carlos Martin &lt;carlos@martinapps.net&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
