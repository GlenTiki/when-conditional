function when(condition, code){
	if(condition()){
	  return code();
	} else {
	  setImmediate(function(){
	  	when(condition, code);
	  });
	}
};

module.exports = exports = when;
