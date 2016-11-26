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
    socket.emit('from-mobile-add');
    socket.on('to-mobile-confirm-connection', function(data) {
      console.log(data);
    });

    attachEvents();
  }

  function attachEvents(){
    
    var matchBt = document.querySelector("#match-bt");
    matchBt.removeEventListener("click", matchKey);
    matchBt.addEventListener("click", matchKey);

    // keyboard event for desktop debugging
    var keyInput = document.querySelector("#key-input");
    keyInput.addEventListener("keyup", function(event){
      if (event.keyCode == 13) {
        matchKey();
      }
    });
  }

  function matchKey(){
    var key = document.querySelector("#key-input").value;

    socket.emit("from-mobile-match-key", key, function(data){
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