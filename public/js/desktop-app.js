var app = app || {};

app.main = (function() {

  var socket;

  function init(){
    console.log('Initializing app.');
    socketSetup();
  }

  // Initializing socket and adding listener functions
  function socketSetup(){

    socket = io.connect();

    socket.on('welcome', function(data){
      console.log('SOCKET: welcome');
      console.log(data.msg);
      
      socket.emit('add-desktop', {
        width: window.innerWidth,
        height: window.innerHeight
      }, function(data){
        console.log(data);
        document.querySelector("#key").innerHTML = data;
      });
    });

    socket.on('joined-room', function(data) { //when we get data from socket
      console.log(data);
    });
  }

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);