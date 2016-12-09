var calibration = (function(){

  console.log("Loaded module: calibration");

  var obj = {};           // This module
  var main;               // Main app, shared across modules

  var debug;              // Local to this module
  var touches;
  var isTouching;

  obj.init = function(){
    console.log("init calibration");

    debug = false;
    touches = 0;
    isTouching = false;

    resetCalibration();
    addSocketListeners();
    attachEvents();
  };

  obj.setMainApp = function(_main){
    main = _main;
  };

  function addSocketListeners(){
    main.socket.on("to-mobile-reset-calibration", function(){
      resetCalibration();
    });
    main.socket.on("to-mobile-start-application", function(){
      location.hash = "application";
    });
  }

  function attachEvents(){
    //listen for event and handle DeviceOrientationEvent object
    window.removeEventListener('deviceorientation', main.controller.emitOrientation);
    window.removeEventListener('deviceorientation', function(){
      shared.displayOrientation(main.controller.orientation);
    });

    window.addEventListener('deviceorientation', main.controller.emitOrientation);
    if(debug){
      window.addEventListener('deviceorientation', function(){
        displayOrientation(main.controller.orientation);
      });      
    }

    var calibrateBt = document.querySelector("#calibrate-bt");
    calibrateBt.removeEventListener("click", calibrate);
    calibrateBt.addEventListener("click", calibrate);

    var hitBt = document.querySelector('#hit-bt');
    hitBt.addEventListener('touchstart', main.controller.handleStart, false);
    hitBt.addEventListener('touchend', main.controller.handleEnd, false);
    hitBt.addEventListener('touchcancel', main.controller.handleEnd, false);
  }

  function calibrate(){
    
    var data, msg;

    // 0: not calibrated; 1: center, 2: top-left, 3: bottom-right
    if(touches < 3){
      touches ++;
      msg = document.getElementById("calibrate-msg");

      if(touches === 1) {
        main.socket.emit('from-mobile-calibrate-center', "User aimed at center");
        msg.innerHTML = "TOP-LEFT";
       
      }else if(touches === 2) {
        
        main.socket.emit('from-mobile-calibrate-top-left', {orientation: main.controller.orientation});
        msg.innerHTML = "BOTTOM-RIGHT";

      }else if(touches === 3) {

        main.socket.emit('from-mobile-calibrate-bottom-right', {orientation: main.controller.orientation});
        localStorage["isCalibrated"] = true;        
        document.querySelector("#calibrate-bt").classList.add("hidden");
        document.querySelector("#hit-bt").classList.remove("hidden");
      }
    }
  }

  function resetCalibration(){
    touches = 0;
    localStorage["isCalibrated"] = 0;
    document.getElementById("calibrate-msg").innerHTML = "CENTER";
    document.querySelector("#calibrate-bt").classList.remove("hidden");
    document.querySelector("#hit-bt").classList.add("hidden");
  }

  // DEBUG: use this to check if the gyroscope and magnetometer are working correctly
  function displayOrientation(data){
    
    document.querySelector("#do-results").classList.remove("hidden");

    var tiltLeftToRight = data.tiltLeftToRight;  // left-to-right tilt in degrees, where right is positive
    var tiltFrontToBack = data.tiltFrontToBack;  // front-to-back tilt in degrees, where front is positive
    var direction = data.direction;              // compass direction the device is facing in degrees

    // rotate image using CSS3 transform
    var cube = document.getElementById('cube');
    // cube.style.webkitTransform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';
    // cube.style.MozTransform = 'rotate(' + tiltLeftToRight + 'deg)';
    // cube.style.transform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';
    cube.style.webkitTransform = 'rotate(' + (direction * -1) + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';
    cube.style.MozTransform = 'rotate(' + (direction * -1) + 'deg)';
    cube.style.transform = 'rotate(' + (direction * -1) + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';

    // set HTML content = tilt OR direction degree (rounded to nearest integer)
    document.getElementById('doTiltFrontToBack').innerHTML = "beta: " + Math.round(tiltFrontToBack);
    document.getElementById('doTiltLeftToRight').innerHTML = "gamma: " + Math.round(tiltLeftToRight);
    document.getElementById('doDirection').innerHTML = "alpha: " + Math.round(direction);
    document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";
  }

  return obj;
})();

// app.main = (function() {

//   var main.socket;
//   var orientation = {};
//   var isCalibrated = false;
//   var isDrawing = false;
  
//   var body = document.querySelector("body");
//   var debug = false;

//   // Initializing socket and adding listener functions
//   var socketSetup = function(callback){
//       socket = io.connect();

//       // Assigning function to the 'start' event on that socket
//       socket.on('welcome', function(data) { //when we get data from socket
//         console.log(data.msg);
//         console.log(data.users);
//         socket.emit('add-me', 'I\'m mobile!');
//       });
//   };

//   var attachEvents = function(){

//     var calibrateBt = document.querySelector("#calibrate-bt");
//     calibrateBt.removeEventListener("click", calibrate);
//     calibrateBt.addEventListener("click", calibrate);

//     var el = document.getElementById('cube');
//     el.addEventListener('touchstart', handleStart, false);
//     el.addEventListener('touchend', handleEnd, false);
//     el.addEventListener('touchcancel', handleEnd, false);

//     console.log(window.DeviceOrientationEvent);

//     //listen for event and handle DeviceOrientationEvent object
//     window.addEventListener('deviceorientation', function(event) {

//       // check if DeviceOrientationEvent is supported
//       if(event.alpha || event.beta || event.gamma){
//         orientation = getOrientation(event);
//         if(isCalibrated) emitOrientation();
//         if(debug) displayOrientation(event);
//       }else{
//         console.log("deviceorientation event not supported");
//         var unsupported = document.createElement("span");
//         unsupported.innerHTML = "deviceorientation event not supported";
//         body.append(unsupported);
//       }
//     });
//   };

//   var touches = 0;
//   var calibration = {
//     alpha: {
//       min: "",
//       max: ""
//     },
//     beta: {
//       min: "",
//       max: ""
//     }
//   };

//   function calibrate(){
//     touches ++;
//     isCalibrated = false;
//     var msg = document.getElementById("calibrate-msg");
//      // 0: top-left, 2: left, 3: right, 4: bottom, 5: top
//     if(touches === 1) {
//       console.log("started calibrating...");
//       calibration["alpha"]["min"] = orientation.x;
//       calibration["beta"]["max"] = orientation.y;
//       msg.innerHTML = "BOTTOM-RIGHT";
//     }else if(touches === 2) {
//       calibration["alpha"]["max"] = orientation.x;
//       calibration["beta"]["min"] = orientation.y;
//       socket.emit('new-calibration', calibration);
//       isCalibrated = true;
//       msg.innerHTML = "Reset Calibration";
//     }else if(touches > 2){
//       isCalibrated = false;
//       touches = 0;
//       msg.innerHTML = "TOP-LEFT";
//     }
//   }

//   function handleStart(evt) {
//     evt.preventDefault();
//     console.log("touchstart.");
//     isDrawing = true;
//   }

//   function handleEnd(evt) {
//     evt.preventDefault();
//     console.log("touchend.");
//     isDrawing = false;
//   }

//   function getOrientation(){
//     // var tiltFrontToBack = Math.round(event.beta);
//     // var direction = Math.round(event.alpha);
//     var tiltFrontToBack = event.beta;
//     var direction = event.alpha;
//     return {
//       x: direction, y: -tiltFrontToBack
//     };
//   }

//   function emitOrientation(){
//     socket.emit('orientation', {
//       orientation: orientation,
//       isDrawing: isDrawing
//     });
//     if(isDrawing) isDrawing = false;
//   }


