var app = app || {};

app.main = (function(shared, connection, calibration, application) {

  var socket;
  var controller = {
    orientation: {
      x: "",
      y: ""
    }
  };
  localStorage["isConnected"] = false;
  localStorage["isCalibrated"] = false;

  function init(){
    console.log('Initializing app.');
    location.hash = "";
    socketSetup();
  }

  // Initializing socket and adding listener functions
  function socketSetup(){
  
    console.log("socketSetup");
  
    socket = io.connect();

    socket.on('welcome', function(data) {
      console.log(data.msg);
      console.log(data.users);
      attachEvents();
    });

    // socket.on('to-all-user-disconnected', function(data){
    //   console.log(data);
    // });
    socket.on('to-all-partner-disconnected', function(data){
      console.log(data);
      shared.disconnect();
    });
  }

  function attachEvents(){
    window.removeEventListener('hashchange', shared.hashRouter);
    window.addEventListener('hashchange', shared.hashRouter);
    // if(window.DeviceOrientationEvent){
      initModules();
    // }else{
    //   location.hash = "unsupported";
    // }
  }

  function initModules(){

    console.log("initModules");

    // We have to send the local socket object to the external modules,
    // so that they can communicate with the server
    connection.init(socket, controller);
    calibration.init(socket, controller);

    // Now let's call our first "page", connection
    location.hash = "connection";
  }

  return {
    init: init
  };

})(shared, connection, calibration, application); // Pass our external modules to the local scope

window.addEventListener('DOMContentLoaded', app.main.init);