var connection = function(){
  
  var obj = {};
  var body = document.querySelector("body");

  obj.init = function(socket){
    var loginBt = document.querySelector("login-bt");
    loginBt.addListener("click", function(){
      matchKey(socket);
    });
  };

  function matchKey(socket){
    socket.emit("match-key", "1234");
  }

  return obj;
};