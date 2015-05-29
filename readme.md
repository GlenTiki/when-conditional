# When-conditional
-----------------------

A utility library for asyncronous conditional checking, and then running a callback when the condition is true.

To get started, type the following:

`npm install when-conditional`

## Syntax
------------------------

```when(logicStatement, callback)```

#### Parameters

###### logicStatement
A function which should `return` a `truthy` statement. The return is equivalent to what you would put in an `if` statement.

###### callback
A function which is called when the logicStatement function returns a truthy value.

## Example
------------------------
The example code shown below will print out someVar is false a number of times until it becomes true, then will tell you its true and exit.

```javascript
var when = require('when-conditional');
var someVar = false;

var interval = setInterval(function(){
  console.log("someVar is " + someVar);
  if(someVar === true) clearInterval(interval);
}, 1000);

when(function condition(){
	return (someVar === true);
}, function code(){
	console.log("someVar is now true, and this was only triggered when it became true!");
});

setTimeout(function(){
	someVar = true;
}, 10000);

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

The when-method module is expected to be more efficient than an interval.

## See you when-ever!
Copyright Glen Keane - 2015 - MIT Licence
