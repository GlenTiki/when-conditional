// the require('setImmediate') adds a setImmediate polyfill to the global
// scope. (this is for backwards and browser compatibility)
require('setimmediate');

function when(condition, code){
	if(condition()){
	  setImmediate(code);
	  return;
	} else {
	  setImmediate(function(){
	  	when(condition, code);
	  });
          return;
	}
};

module.exports = exports = when;
