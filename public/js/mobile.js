var app = app || {};

app.main = (function(shared, connection, calibration, application) {

  var obj = {};
  obj.socket = {};
  obj.controller = {
    orientation: {
      tiltLeftToRight: "",
      tiltFrontToBack: "",
      direction: ""
    },
    isTouching: false,
    emitOrientation: emitOrientation,
    handleStart: handleStart,
    handleEnd: handleEnd
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

    // Let's remove all window event listeners that may have been added in further steps
    window.removeEventListener('hashchange', shared.hashRouter);
    window.removeEventListener('deviceorientation', obj.controller.emitOrientation);

    // Now adding hash router    
    window.addEventListener('hashchange', shared.hashRouter);

    // if(window.DeviceOrientationEvent){
      location.hash = "connection";
    // }else{
    //   location.hash = "unsupported";
    // }
  }

  function handleStart(event) {
    event.preventDefault();
    obj.controller["isTouching"] = true;
  }

  function handleEnd(event) {
    event.preventDefault();
    obj.controller["isTouching"] = false;
  }

  function emitOrientation(event){
    obj.controller["orientation"] = {
      tiltLeftToRight: event.gamma, // GAMMA: left-to-right tilt in degrees, where right is positive
      tiltFrontToBack: event.beta,  // BETA: front-to-back tilt in degrees, where front is positive
      direction: event.alpha        // ALPHA: compass direction the device is facing in degrees;
                                    // if deviceorientation is false, 0 is the angle the device
                                    // was pointing at when the listener was added;
                                    // increases counter-clockwise
    };

    obj.socket.emit('orientation', {
      orientation: obj.controller["orientation"],
      isTouching: obj.controller["isTouching"]
    });

    if(obj.controller["isTouching"]) obj.controller["isTouching"] = false;
  }

  return obj;

})(shared, connection, calibration, application); // Pass our external modules to the local scope

window.addEventListener('DOMContentLoaded', app.main.init);