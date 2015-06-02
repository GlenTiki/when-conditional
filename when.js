// the require('setImmediate') adds a setImmediate polyfill to the global
// scope. (this is for backwards and browser compatibility)
require('setimmediate');

function when(condition, code){
  var immediate = setImmediate(checkCondition);

  function checkCondition(){
    if(condition()){
      immediate = setImmediate(code);
    } else {
      immediate = setImmediate(checkCondition);
    }
  }

  immediate.clear = function(){
    console.log(immediate);
    clearImmediate(immediate);
  }

  return immediate;
};

module.exports = exports = when;
