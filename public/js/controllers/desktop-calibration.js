var calibration = (function(){

  console.log("Loaded module: calibration");
  
  var obj = {};
  var socket;

  obj.init = function(_socket){
    socket = _socket;
    socketSetup();
  };

  function socketSetup(){

    socket.on('calibration-top-left', function(data) {
      console.log(data);
      location.hash = "calibration";
    });

    attachEvents();
  }

  function attachEvents(){
    var resetCalibrationBt = document.querySelector("#reset-calibration-bt");
    resetCalibrationBt.addEventListener("click", resetCalibration);
  }

  function calibrate(){
    
  }

  function resetCalibration(){

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