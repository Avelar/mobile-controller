var app = app || {};

app.main = (function() {

  var socket;
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
      render("connection");
      // console.log(login);
  };

  function render(section){
    console.log("render: " + section);

    var sections = document.getElementsByTagName("section");
    for(var i = 0; i < sections.length; i++){
      if(sections[i].id.substring(4, sections[i].id.length) === section){
        sections[i].classList.remove("hidden");
      }else{
        sections[i].classList.add("hidden");
      }
    }
  }

  var init = function(){
    console.log('Initializing app.');
    socketSetup();
  };

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);  