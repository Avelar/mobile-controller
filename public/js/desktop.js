var app = app || {};

app.main = (function(shared, connection, calibration, application) {

  var socket;
  localStorage["isConnected"] = false;
  localStorage["isCalibrated"] = false;

  function init(){
    console.log('Initializing app.');
    location.hash = "";
    socketSetup();
  }

  // Initializing socket and adding listener functions
  function socketSetup(){

    socket = io.connect();

    socket.on('welcome', function(data){
      console.log('SOCKET: welcome');
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
    window.addEventListener('hashchange', shared.hashRouter);
    initModules();
  }

  function initModules(){
    console.log("initModules");
    connection.init(socket);
    calibration.init(socket);
    application.init(socket);
    location.hash = "connection";
  }

  return {
    init: init
  };

})(shared, connection, calibration, application);

window.addEventListener('DOMContentLoaded', app.main.init);