var when = require('../');
var someVar = false;

var interval = setInterval(function(){
  console.log('someVar is ' + someVar);
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
