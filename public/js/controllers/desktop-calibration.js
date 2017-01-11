var calibration = (function(){

  console.log("Loaded module: calibration");
  
  var obj = {};             // This module
  var main;                 // Main app, shared across modules
  var pointer = document.querySelector("#pointer");

  obj.init = function(){
    console.log("init calibration");
    resetCalibration();
    pointer.classList.remove("hidden");
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
      pointer.classList.remove("hidden");
      renderInstructions("do-done");
    });

    main.socket.on('to-desktop-orientation', function(data) {
      console.log(data);
      displayOrientation(data);
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
    pointer.classList.add("hidden");
    main.socket.emit("from-desktop-reset-calibration");
    renderInstructions("do-center");
  }

  function movePointer(data){
    pointer.style["top"] = data["pos"].y + "px";
    pointer.style["left"] = data["pos"].x + "px";
  }

  function hitContinue(){
    var continueBt = document.querySelector("#continue-bt");
    // sdsdsdsdsds
    // if(){
      
    // }
  }  

  // DEBUG: use this to check if the gyroscope and magnetometer are working correctly
  function displayOrientation(data){
    
    document.querySelector("#do-results").classList.remove("hidden");

    var tiltLeftToRight = data["orientation"].tiltLeftToRight;   // left-to-right tilt in degrees, where right is positive
    var tiltFrontToBack = data["orientation"].tiltFrontToBack;   // front-to-back tilt in degrees, where front is positive
    var direction = data["orientation"].direction;               // compass direction the device is facing in degrees

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