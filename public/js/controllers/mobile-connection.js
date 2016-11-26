var connection = (function(){

  console.log("Loaded module: connection");
  
  var obj = {};
  var socket;

  obj.init = function(_socket){
    socket = _socket;
    socketSetup();
  };

  function socketSetup(){
    
    // Start by asking to be added to th list of users and sending screen dimensions
    socket.emit('add-mobile');
    socket.on('joined-room', function(data) {
      console.log(data);
    });

    attachEvents();
  }

  function attachEvents(){
    
    var matchBt = document.querySelector("#match-bt");
    matchBt.addEventListener("click", function(){
      matchKey();
    });
  }

  function matchKey(){
    var key = document.querySelector("#key-input").value;

    socket.emit("match-key", key, function(data){
      console.log(data);
      if(data === "right-key"){
        location.hash = "calibration";
      }else{
        document.querySelector("#do-wrong-key").classList.remove("hidden");
      }
    });
  }

  return obj;
})();