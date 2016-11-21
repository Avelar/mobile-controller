var app = app || {};

app.main = (function() {

  var socket;
  var orientation = {};
  var isCalibrated = false;
  var isDrawing = false;
  var body = document.querySelector("body");

  // Initializing socket and adding listener functions
  var socketSetup = function(callback){
      socket = io.connect();

      // Assigning function to the 'start' event on that socket
      socket.on('welcome', function(data) { //when we get data from socket
        console.log(data.msg);
        console.log(data.users);
        socket.emit('add-me', 'I\'m mobile!');
      });
  };

  var attachEvents = function(){

    var calibrateBt = document.querySelector("#calibrate-bt");
    calibrateBt.removeEventListener("click", calibrate);
    calibrateBt.addEventListener("click", calibrate);

    var el = document.getElementById('cube');
    el.addEventListener('touchstart', handleStart, false);
    el.addEventListener('touchend', handleEnd, false);
    el.addEventListener('touchcancel', handleEnd, false);

    // check if DeviceOrientationEvent is supported
    if (!window.DeviceOrientationEvent) {
      var unsupported = document.createElement("span");
      unsupported.innerHTML = "deviceorientation event not supported";
      body.append(unsupported);
    } else {
      //listen for event and handle DeviceOrientationEvent object
      window.addEventListener('deviceorientation', function(event) {
        orientation = getOrientation(event);
        displayOrientation(event);
        if(isCalibrated){
          emitOrientation();
        }
      });
    }
  };

  var touches = 0;
  var calibration = {
    alpha: {
      min: "",
      max: ""
    },
    beta: {
      min: "",
      max: ""
    }
  };

  function calibrate(){
    touches ++;
     // 1: center, 2: left, 3: right, 4: bottom, 5: top
    if(touches === 1) {
      console.log("started calibrating...");
    }else if(touches === 2) {
      calibration["alpha"]["min"] = orientation.x;
    }else if(touches === 3) {
      calibration["alpha"]["max"] = orientation.x;
    }else if(touches === 4) {
      calibration["beta"]["min"] = orientation.y;
    }else if(touches === 5) {
      calibration["beta"]["max"] = orientation.y;
      socket.emit('new-calibration', calibration);
      isCalibrated = true;
    }
  }

  function handleStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");
    isDrawing = true;
  }

  function handleEnd(evt) {
    evt.preventDefault();
    console.log("touchend.");
    isDrawing = false;
  }

  function getOrientation(){
    // var tiltFrontToBack = Math.round(event.beta);
    // var direction = Math.round(event.alpha);
    var tiltFrontToBack = event.beta;
    var direction = event.alpha;
    return {
      x: direction, y: -tiltFrontToBack
    };
  }

  function emitOrientation(){
    socket.emit('orientation', {
      orientation: orientation,
      isDrawing: isDrawing
    });
    if(isDrawing) isDrawing = false;
  }

  function displayOrientation(){
    // rotate image using CSS3 transform
    var cube = document.getElementById('cube');

    // gamma is the left-to-right tilt in degrees, where right is positive
    var tiltLeftToRight = event.gamma;
    // beta is the front-to-back tilt in degrees, where front is positive
    var tiltFrontToBack = event.beta;
    // alpha is the compass direction the device is facing in degrees
    var direction = event.alpha;

    cube.style.webkitTransform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';
    cube.style.MozTransform = 'rotate(' + tiltLeftToRight + 'deg)';
    cube.style.transform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';

    // // set HTML content = tilt OR direction degree (rounded to nearest integer)
    // document.getElementById('doTiltFrontToBack').innerHTML = Math.round(tiltFrontToBack);
    // document.getElementById('doTiltLeftToRight').innerHTML = Math.round(tiltLeftToRight);
    // document.getElementById('doDirection').innerHTML = Math.round(direction);
    // document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";
  }

  var init = function(){
    console.log('Initializing app.');
    socketSetup();
    attachEvents();
  };

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);  