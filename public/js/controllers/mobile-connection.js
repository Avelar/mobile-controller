var connection = (function(){

  console.log("Loaded module: connection");
  
  var obj = {};

  obj.init = function(socket){
    attachEvents(socket);
  };

  function attachEvents(socket){
    var matchBt = document.querySelector("#match-bt");
    matchBt.addEventListener("click", function(){
      matchKey(socket);
    });
  }

  function matchKey(socket){

    var key = document.querySelector("#key-input").value;

    socket.emit("match-key", key, function(data){
      console.log(data);
      if(data === "right-key"){
        location.hash = "calibration";
      }else{
        document.querySelector("#do-wrong-key").classList.remove("hidden");
      }
    });
  }

  return obj;
})();