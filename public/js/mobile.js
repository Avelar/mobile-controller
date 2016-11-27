var app = app || {};

app.main = (function(connection, calibration, application) {

  var socket;
  var controller = {
    isConnected: false,
    isCalibrated: false,
    orientation: {
      x: "",
      y: ""
    }
  };

  function init(){
    console.log('Initializing app.');
    if(!controller["isConnected"]) location.hash = "";
    socketSetup();
  }

  // Initializing socket and adding listener functions
  function socketSetup(){
  
    console.log("socketSetup");
  
    socket = io.connect();

    socket.on('welcome', function(data) {
      console.log(data.msg);
      console.log(data.users);
      attachEvents();
    });

    socket.on('to-all-user-disconnected', function(data){
      console.log(data);
    });
  }

  function attachEvents(){
    window.addEventListener('hashchange', hashRouter);
    // if(window.DeviceOrientationEvent){
      initModules();
    // }else{
    //   location.hash = "unsupported";
    // }
  }

  function initModules(){

    console.log("initModules");

    // We have to send the local socket object to the external modules,
    // so that they can communicate with the server
    connection.init(socket, controller);
    calibration.init(socket, controller);

    // Now let's call our first "page", connection
    location.hash = "connection";
  }

  // A function where we detect the change of '#' on the browser address field
  function hashRouter(){
    var currentPage = location.hash.substring(1, location.hash.length);
    console.log('Current hash is ' + currentPage);
    render("tpl-" + currentPage);
  }

  // Render the section templates based hash change
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

})(connection, calibration, application); // Pass our external modules to the local scope

window.addEventListener('DOMContentLoaded', app.main.init);