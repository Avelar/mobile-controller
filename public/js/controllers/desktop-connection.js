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

    console.log("addSocketListeners");

    // Start by asking to be added to the list of users and sending screen dimensions
    main.socket.emit('from-desktop-add', {
      width: window.innerWidth,
      height: window.innerHeight
    }, function(data){
      console.log(data);
      document.querySelector("#key").innerHTML = data;
    });

    main.socket.on('to-desktop-confirm-connection', function(data) {
      console.log(data);
      localStorage["isConnected"] = 1;
      location.hash = "calibration";
    });
  }

  function attachEvents(){

  }

  return obj;
})();