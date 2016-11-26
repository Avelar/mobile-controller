var connection = (function(){

  console.log("Loaded module: connection");
  
  var obj = {};
  var socket;

  obj.init = function(_socket){
    console.log("init");
    socket = _socket;
    socketSetup();
  };

  function socketSetup(){

    console.log("socketSetup");

    // Start by asking to be added to the list of users and sending screen dimensions
    socket.emit('add-desktop', {
      width: window.innerWidth,
      height: window.innerHeight
    }, function(data){
      console.log(data);
      document.querySelector("#key").innerHTML = data;
    });

    socket.on('joined-room', function(data) {
      console.log(data);
      location.hash = "calibration";
    });

    attachEvents();
  }

  function attachEvents(){

  }

  return obj;
})();