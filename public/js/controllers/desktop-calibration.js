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
    main.socket.emit("from-desktop-reset-calibration");
    renderInstructions("do-top-left");
  }

  function movePointer(data){
    pointer.style["top"] = data["pos"].y + "px";
    pointer.style["left"] = data["pos"].x + "px";
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