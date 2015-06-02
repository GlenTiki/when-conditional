// the require('setImmediate') adds a setImmediate polyfill to the global
// scope. (this is for backwards and browser compatibility)
require('setimmediate');

function when(condition, code){
	if(condition()){
	  return setImmediate(code);
	} else {
	  return setImmediate(function(){
	  	return when(condition, code);
	  });
	}
};

module.exports = exports = when;
