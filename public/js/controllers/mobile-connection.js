var connection = (function(){

  console.log("Loaded module: connection");
  
  var obj = {};             // This module
  var main;                 // Main app, shared across modules

  obj.init = function(){
    console.log("init connection");
    addSocketListeners();
    attachEvents();
  };

  obj.setMainApp = function(_main){
    main = _main;
  };

  function addSocketListeners(){
    // Start by asking to be added to the list of users and sending screen dimensions
    main.socket.emit('from-mobile-add');
    main.socket.on('to-mobile-confirm-connection', function(data) {
      console.log(data);
    });
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

    main.socket.emit("from-mobile-match-key", key, function(data){
      console.log(data);
      localStorage["isConnected"] = 1;
      if(data === "right-key"){
        location.hash = "calibration";
      }else{
        document.querySelector("#do-wrong-key").classList.remove("hidden");
      }
    });
  }

  return obj;
})();