var calibration = (function(){

  console.log("Loaded module: calibration");
  
  var obj = {};
  var socket;

  obj.init = function(_socket){
    socket = _socket;
    socketSetup();
  };

  function socketSetup(){
    attachEvents();
  }

  function attachEvents(){

  }

  function matchKey(socket){

  }

  return obj;  
})();