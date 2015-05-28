function when(condition, code){
	if(condition()){
	  return code();
	} else {
	  process.nextTick(function(){
	  	when(condition, code);
	  });
	}
};

module.exports = exports = when;