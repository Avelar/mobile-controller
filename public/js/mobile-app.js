var app = app || {};

app.main = (function(connection) {

  var socket;
  var body = document.querySelector("body");

  // Initializing socket and adding listener functions
  function socketSetup(){
  
    console.log("socketSetup");
  
    socket = io.connect();

    // Assigning function to the 'start' event on that socket
    socket.on('welcome', function(data) { //when we get data from socket
      console.log(data.msg);
      console.log(data.users);
      socket.emit('add-me', 'I\'m mobile!');
    });

    attachEvents();
  }

  function attachEvents(){
    window.addEventListener('hashchange', hashRouter);

    initModules();
  }

  function initModules(){

    console.log("initModules");

    // We have to send the local socket object to the external modules,
    // so that they can communicate with the server
    connection.init(socket);

    // Now let's call our first "page", connection
    location.hash = "connection";
  }

  // A function where we detect the change of '#' on the browser address field
  function hashRouter(){
    var currentPage = location.hash.substring(1, location.hash.length);
    console.log('Current hash is ' + currentPage);
    render("tpl-" + currentPage);
  }

  function render(section){
    console.log("render: " + section);

    var sections = document.getElementsByTagName("section");
    for(var i = 0; i < sections.length; i++){
      if(sections[i].id === section){
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

})(connection); // Pass our external modules to the local scope

window.addEventListener('DOMContentLoaded', app.main.init);