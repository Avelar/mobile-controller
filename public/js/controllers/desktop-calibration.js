var calibration = (function(){

  console.log("Loaded module: calibration");
  
  var obj = {};             // This module
  var main;                 // Main app, shared across modules

  obj.init = function(){
    console.log("init calibration");
    resetCalibration();    
    addSocketlisteners();
    attachEvents();
  };

  obj.setMainApp = function(_main){
    main = _main;
  };

  function addSocketlisteners(){

    main.socket.on("to-desktop-center-confirmation", function(data) {
      console.log(data);
      renderInstructions("do-top-left");
    });
    main.socket.on("to-desktop-top-left-confirmation", function(data) {
      console.log(data);
      renderInstructions("do-bottom-right");
    });
    main.socket.on("to-desktop-bottom-right-confirmation", function(data) {
      console.log(data);
      localStorage["isCalibrated"] = 1;
      main.pointer.classList.remove("hidden");
      renderInstructions("do-done");
    });

    main.socket.on('to-desktop-coordinates', function(data) {
      console.log(data);
      movePointer(data);
    });
  }

  function attachEvents(){
    var resetCalibrationBt = document.querySelector("#reset-calibration-bt");
    resetCalibrationBt.addEventListener("click", resetCalibration);

    var continueBt = document.querySelector("#continue-bt");
    continueBt.addEventListener("click", function(){
      location.hash = "application";
      main.socket.emit("from-desktop-start-application");
    });
  }

  function renderInstructions(id){
    var instructions = document.querySelectorAll(".instructions");
    for(var i = 0; i < instructions.length; i++){
      instructions[i].classList.add("hidden");
    }
    document.querySelector("#"+id).classList.remove("hidden");
  }

  function resetCalibration(){
    localStorage["isCalibrated"] = 0;
    main.pointer.classList.add("hidden");
    main.socket.emit("from-desktop-reset-calibration");
    renderInstructions("do-center");
  }

  function movePointer(data){
    main.pointer.style["top"] = data["pos"].y + "px";
    main.pointer.style["left"] = data["pos"].x + "px";
  }

  // DEBUG: use this to check if the gyroscope and magnetometer are working correctly
  function displayOrientation(){
    
    document.querySelector("#do-results").classList.remove("hidden");

    var tiltLeftToRight = event.gamma;  // left-to-right tilt in degrees, where right is positive
    var tiltFrontToBack = event.beta;   // front-to-back tilt in degrees, where front is positive
    var direction = event.alpha;        // compass direction the device is facing in degrees

    // rotate image using CSS3 transform
    var cube = document.getElementById('cube');
    cube.style.webkitTransform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';
    cube.style.MozTransform = 'rotate(' + tiltLeftToRight + 'deg)';
    cube.style.transform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';

    // set HTML content = tilt OR direction degree (rounded to nearest integer)
    document.getElementById('doTiltFrontToBack').innerHTML = "beta: " + Math.round(tiltFrontToBack);
    document.getElementById('doTiltLeftToRight').innerHTML = "gamma: " + Math.round(tiltLeftToRight);
    document.getElementById('doDirection').innerHTML = "alpha: " + Math.round(direction);
    document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";
  }  

  return obj;
})();

// var app = app || {};

// app.main = (function() {

//   var socket;
//   var canvas, context;
//   var width, height;
//   var localUsers = {};
//   var pointer = document.querySelector("#pointer");

//   // Initializing socket and adding listener functions
//   function socketSetup(){

//     socket = io.connect();
//     socket.on('welcome', function(data){
//       console.log('SOCKET: welcome');
//       console.log(data.msg);
      
//       socket.emit('add-desktop', {
//         width: window.innerWidth,
//         height: window.innerHeight
//       }, function(data){
//         console.log(data);
//         document.querySelector("#key").innerHTML = data;
//       });
//     });

//     socket.on('render', function(data) {
//       console.log(data);
//       movePointer(data);
//     });

//     // socket.on('debug', function(data) {
//     //   console.log(data);
//     // });
//     pointerSetup();
//   }

//   function pointerSetup(){
//     pointer.style["width"] = "40px";
//     pointer.style["height"] = "40px";
//     pointer.style["border-radius"] = "20px";
//     pointer.style["position"] = "absolute";
//     pointer.style["background-color"] = "red";
//   }

//   function movePointer(data){
//     pointer.style["top"] = data[user]['pos']['y'] + "px";
//     pointer.style["left"] = data[user]['pos']['x'] + "px";
//   }

//   function init(){
//     console.log('Initializing app.');
//     socketSetup();
//   }

//   return {
//     init: init
//   };

// })();

// window.addEventListener('DOMContentLoaded', app.main.init);
// var app = app || {};

// app.main = (function() {

//   var socket;
//   var canvas, context;
//   var width, height;
//   var localUsers = {};
//   var pointer = document.querySelector("#pointer");

//   // Initializing socket and adding listener functions
//   function socketSetup(){

//     socket = io.connect();
//     socket.on('welcome', function(data){
//       console.log('SOCKET: welcome');
//       console.log(data.msg);
      
//       socket.emit('add-desktop', {
//         width: window.innerWidth,
//         height: window.innerHeight
//       }, function(data){
//         console.log(data);
//         document.querySelector("#key").innerHTML = data;
//       });
//     });

//     socket.on('render', function(data) {
//       console.log(data);
//       movePointer(data);
//     });

//     // socket.on('debug', function(data) {
//     //   console.log(data);
//     // });
//     pointerSetup();
//   }

//   function pointerSetup(){
//     pointer.style["width"] = "40px";
//     pointer.style["height"] = "40px";
//     pointer.style["border-radius"] = "20px";
//     pointer.style["position"] = "absolute";
//     pointer.style["background-color"] = "red";
//   }

//   function movePointer(data){
//     pointer.style["top"] = data[user]['pos']['y'] + "px";
//     pointer.style["left"] = data[user]['pos']['x'] + "px";
//   }

//   function init(){
//     console.log('Initializing app.');
//     socketSetup();
//   }

//   return {
//     init: init
//   };

// })();

// window.addEventListener('DOMContentLoaded', app.main.init);