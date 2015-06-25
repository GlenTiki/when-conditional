var when = require('../');
var someVar = false;

var interval = setInterval(function(){
  console.log('someVar is ' + someVar);
  if(someVar === true) clearInterval(interval);
}, 1000);

var when = when(function condition(){
	return (someVar === true);
}, function code(){
	console.log("someVar is now true, and this was only triggered when it became true!");
});

setTimeout(function(){
	someVar = true;
}, 10000);

setTimeout(function(){
  when.clear();
}, 5000);

setTimeout(function(){
  when.reset();
  when.setCode(function setNewCode(){
    console.log("someVar is now true, and this was only triggered when it became true AND after it was reset AND after the 'code' CB was changed! \\0/");
  })
}, 8000);
