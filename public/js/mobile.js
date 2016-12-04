var app = app || {};

app.main = (function(shared, connection, calibration, application) {

  var obj = {};
  obj.socket = {};
  obj.controller = {
    orientation: {
      x: "",
      y: ""
    }
  };

  obj.init = function(){
    console.log('Initializing app.');

    location.hash = "";
    localStorage["isConnected"] = 0;
    localStorage["isCalibrated"] = 0;

    initSocket();
  };

  // Initializing socket and adding listener functions
  function initSocket(){
  
    console.log("socketSetup");
  
    obj.socket = io.connect();

    obj.socket.on('welcome', function(data) {
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
    window.removeEventListener('hashchange', shared.hashRouter);
    window.addEventListener('hashchange', shared.hashRouter);
    if(window.DeviceOrientationEvent){
      location.hash = "connection";      
    }else{
      location.hash = "unsupported";
    }
  }

  return obj;

})(shared, connection, calibration, application); // Pass our external modules to the local scope

window.addEventListener('DOMContentLoaded', app.main.init);