var app = app || {};

app.main = (function(connection) {

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
      console.log(data.users);
      attachEvents();
    });
  }

  function attachEvents(){
    window.addEventListener('hashchange', hashRouter);
    initModules();
  }

  function initModules(){
    console.log("initModules");
    connection.init(socket);
    location.hash = "connection";
  }

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

  return {
    init: init
  };

})(connection);

window.addEventListener('DOMContentLoaded', app.main.init);