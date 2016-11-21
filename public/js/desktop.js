var app = app || {};

app.main = (function() {

  var socket;
  var canvas, context;
  var width, height;
  var localUsers = {};

  // Initializing socket and adding listener functions
  function socketSetup(){

    socket = io.connect();
    socket.on('welcome', function(data){
      console.log('SOCKET: welcome');
      console.log(data.msg);
      socket.emit('dimensions', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    });

    socket.on('render', function(data) {
      console.log(data);
      draw(data);
    });

    // socket.on('debug', function(data) {
    //   console.log(data);
    // });
    pointerSetup();
  }

  function pointerSetup(){
    var pointer = document.querySelector("#pointer");
    pointer.style["width"] = "40px";
    pointer.style["height"] = "40px";
    pointer.style["border-radius"] = "20px";
    pointer.style["position"] = "absolute";
    pointer.style["background-color"] = "red";
  }

  function init(){
    console.log('Initializing app.');
    socketSetup();
  }

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);