// the require('setImmediate') adds a setImmediate polyfill to the global
// scope. (this is for backwards and browser compatibility)
require('setimmediate');

function when(condition, code){
  // set immediate to a blank function, I don't want to push the first
  // check condition to a back of a queue
  var immediate = setImmediate(function(){});

  checkCondition(); //do a check straight away.


  function checkCondition(){
    if(condition()){
      clear(); //there might be nothing to clear, but theres no harm calling it.
      code(); //if the condition is true, run the code striaght away.
      
      // in previous releases, I pushed the code() to the back of the io queue again with a setImmediate,
      // but there is no point in doing that, making the program wait longer to execute something
      // which might change the state to fire another when function.
    } else {
      immediate = setImmediate(checkCondition);
    }
  }

  function clear(){
    clearImmediate(immediate);
  }

  function reset(){
    clear();
    immediate = setImmediate(function(){});
    checkCondition(); 
  }

  function setCondition(newCondition){
    condition = newCondition;   
  }

  function setCode(newCode){
    code = newCode;
  }

  return {
    'clear': clear, 
    'reset': reset,
    'setCondition': setCondition,
    'setCode': setCode
  };
};

module.exports = exports = when;
