# When-conditional
-----------------------

A utility library for asyncronous conditional checking, and then running a callback when the condition is true.

To get started, type the following:

`npm install when-conditional`

## Syntax
------------------------

```
when(logicStatement, callback)
```

#### Parameters

###### logicStatement
A function which should `return` a `truthy` statement. The return is equivalent to what you would put in an `if` statement.

###### callback
A function which is called when the logicStatement function returns a truthy value.

#### Returns a when object with 4 functions:
###### `whenObj.clear()`: A function to clear the when statement, if you don't want to wait for the condition to be true anymore.
###### `whenObj.reset()`: This is for when you need reset the whenObj after it fired the code, and wait for the same condition again.
###### `whenObj.setCondition(newCondition)`: Overwrite the `condition` function you passed in on creation.
###### `whenObj.setCode(newCode)`: Overwrite the `code` function you passed in on creation.

## Examples
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

### Removing the when listener
---------------------

You might feel that you no longer need to wait for something to happen. if this is the case, you can call a `.clear()` function on the return value of `when(condition, code)`.

The following example is very similar to the one above, but will never print `someVar is now true, and this was only triggered when it became true!` as it is no longer waiting for `when` someVar is true!

```javascript
var when = require('when-conditional');
var someVar = false;

var interval = setInterval(function(){
  console.log("someVar is " + someVar);
  if(someVar === true) clearInterval(interval);
}, 1000);

var whenObj = when(function condition(){
	return (someVar === true);
}, function code(){
	console.log("someVar is now true, and this was only triggered when it became true!");
});

setTimeout(function(){
	someVar = true;
}, 10000);

setTimeout(function(){
  whenObj.clear();
}, 5000);
```

### reseting the when listener and changing the code callback.

```javascript
var when = require('when-conditional');
var someVar = false;

var interval = setInterval(function(){
  console.log("someVar is " + someVar);
  if(someVar === true) clearInterval(interval);
}, 1000);

var whenObj = when(function condition(){
	return (someVar === true);
}, function code(){
	console.log("someVar is now true, and this was only triggered when it became true!");
});

setTimeout(function(){
	someVar = true;
}, 10000);

setTimeout(function(){
  whenObj.clear();
}, 5000);

setTimeout(function(){
  whenObj.reset();
  whenObj.setCode(function newCodeCB(){
	  console.log("someVar is now true, and this was only triggered when it became true, AND after the when was reset AND after the code callback was changed!");
  });
}, 8000);
```

## Contributing
--------------------

If you feel there is a feature missing you would like to see, or an issue, feel free to log an issue on Github, or even better, send a PR! :D

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
