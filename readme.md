# When-conditional
-----------------------

A utility library for asyncronous conditional checking, and then code running.

To get started, type the following:

`npm install when-conditional`

## Example
------------------------

```javascript

var when = require('when-conditional');
var someVar = false;

when(function condition(){
	return (someVar === true);
}, function code(){
	console.log("someVar is now true, and this was only triggered when it became true!");
});

setTimeout(function(){
	someVar = true;
}, 10000)

```

## Inspiration
---------------------

I wanted an asyncronous if statement that only fired once the condition became true, but I couldn't extend the engine natively.

The example code above should similar to something like:

```javascript
var someVar = false;

when(someVar === true){
	console.log("someVar is now true, and this was only triggered when it became true!");
}

setTimeout(function(){
	someVar = true;
}, 10000)
```

To get my little shim working, I check the condition every tick. this is not ideal. ideally, I want to Object.observe the conditions, and only fire the `when` check once when the conditions have been observed to change

## See you when-ever!
Copyright Glen Keane - 2015 - MIT Licence