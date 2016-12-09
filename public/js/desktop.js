var app = app || {};

app.main = (function(shared, connection, calibration, application) {

  var obj = {};
  obj.socket = {};

  obj.init = function(){
    console.log('Initializing app.');

    location.hash = "";
    localStorage["isConnected"] = 0;
    localStorage["isCalibrated"] = 0;

    initSocket();
  };

  // Initializing socket and adding listener functions
  function initSocket(){

    obj.socket = io.connect();

    obj.socket.on('welcome', function(data){
      console.log('SOCKET: welcome');
      console.log(data.msg);
      console.log(data.users);
      
      attachEvents();
      // Sending main app (obj) to shared, so modules can have access to global vars (socket & controller)
      // Sending the modules too, so they can be executed on hash change
      shared.setModules(obj, {connection, calibration, application});
    });
    
    obj.socket.on('to-all-user-disconnected', function(data){
      console.log(data);
    });

    obj.socket.on('to-all-partner-disconnected', function(data){
      console.log(data);
      shared.disconnect();
    });    
  }

  function attachEvents(){
    window.addEventListener('hashchange', shared.hashRouter);
    // initModules();
    location.hash = "connection";
  }

  return obj;

})(shared, connection, calibration, application);

window.addEventListener('DOMContentLoaded', app.main.init);