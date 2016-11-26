/*---------- BASIC SETUP ----------*/
var express   = require('express'),
  bodyParser  = require('body-parser');     // helper for parsing HTTP requests
var app = express();                        // our Express app
var PORT = 3334;
var server = require('http').Server(app);   // Socket.io setup
var io = require('socket.io')(server);

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());                         // parse application/json

// Detecting if the connecting user is using mobile or desktop
app.use('/', express.static(__dirname + '/public'));
app.use('*', function(req, res) {
  // console.log(req.headers['user-agent']);
  // Say if req.headers['user-agent'] contains "Mobile", re-route the user to mobile interface
  var ua = req.headers['user-agent'];
  res.redirect('mobile.html');
  // if (ua.indexOf('Mobile') > -1) {
  //   console.log('User is using mobile device');
  //   res.redirect('mobile.html');
  // } else {
  //   // Else display a desktop version
  //   console.log('User is using desktop device');
  //   res.redirect('desktop.html');
  // }
});

server.listen(PORT, function(){
    console.log('Express server is running at ' + PORT);
});

var users = {};
var loop;


//Assign function to 'connection' event for the connected socket
io.on('connection', function(socket) {

  /*––––––––––– SOCKET.IO starts here –––––––––––––––*/
  console.log('SOCKET: connection');
  console.log('A new client has connected: ' + socket.id);
  socket.emit('welcome', {
      msg: 'Welcome! your id is ' + socket.id,
      users: users
  });

  // DESKTOP
  // Getting dimensions
  socket.on('add-desktop', function(data, callback){
    console.log("SOCKET: add-desktop");
    console.log(data);

    // Dimensions are specific to each "user" (a desktop/mobile pair)
    // We'll send them when adding a new user
    addDesktopUser(socket.id, data["width"], data["height"], function(key){
      // After the (desktop) user is added, send the key to render on the screen
      callback(key);
    });
  });


  // MOBILE
  socket.on('add-mobile', function(data, callback) {
    console.log('SOCKET: add-mobile');
    addMobileUser(socket.id);
  });

  socket.on("match-key", function(data, callback){
    console.log('SOCKET: match-key');
    console.log(data);
    matchMobileUser(socket.id, data, function(msg, room){
      callback(msg);
      if(room !== undefined){
        socket.join(room);
        console.log(socket.rooms);
        io.to(room).emit("joined-room", "Welcome to room " +  room);
      }
    });
  });



  // socket.on('calibrate', function(data) {
  //   console.log('SOCKET: calibrate');
  //   console.log(data);
  //   calibrateMobileUser(socket.id, data);
  // });

  socket.on("new-calibration", function(data){
    console.log("New calibration.");
    console.log(data);
    calibrateMobileUser(socket.id, data);
  });

  // Listening for coordinates
  socket.on('orientation', function(data) {
    console.log('SOCKET: orientation');
    // console.log('has sent: ' + socket.id, data);
    updateUserPosition(socket.id, data);
    users[socket.id]['isDrawing'] = data.isDrawing;
    console.log(users[socket.id]['isDrawing']);
    // io.sockets.emit('debug', data.orientation.events);
  });
  
  socket.on('disconnect', function() {
    console.log('SOCKET: disconnect');
    console.log(socket.id + ' just disconnected');
    io.sockets.emit('global message', socket.id + ' just disconnected');
    removeUser(socket.id);
  });
});

function renderOnClient(){
  // console.log('FUNCTION: renderOnClient');
  // Emit coordinates to every clients (all players)
  io.sockets.emit('render', users);
}

// function calibrateMobileUser(id, data){
//   console.log('FUNCTION: calibrateMobileUser');
//   if(data.x > 180){
//     data.x -= 360;
//   }  
//   if(users.hasOwnProperty(id)){
//     users[id]['offset'] = {
//       x: data.x,
//       y: data.y
//     }
//     if(Object.keys(users).length === 1){
//       loop = setInterval(function(){
//         renderOnClient(io);
//       }, 20);
//     }    
//   }  
// }


// MOBILE
function addMobileUser(id) {
  console.log('FUNCTION: addMobileUser');
  if(!users.hasOwnProperty(id)) {
      users[id] = {
        type: "mobile",
        offset: {
          x: {
            min: "",
            max: ""
          },
          y: {
            min: "",
            max: ""
          }
        }
      };
      console.log("New user:" + users[id]);
  }
  console.log('current users: ' + Object.keys(users).length);
}

function matchMobileUser(id, key, callback){
  var msg = "wrong-key";
  var room;
  for(prop in users){
    // Loop through users and find the desktop one with a matching key and no partner
    if(users[prop]["type"] === "desktop" && users[prop]["key"] === key && users[prop]["partner"] === ""){
      msg = "right-key";
      users[prop]["partner"] = id;
      room = prop;
    }
  }
  callback(msg, room);
}

function calibrateMobileUser(id, data){
  console.log('FUNCTION: calibrateMobileUser');
  // if(data.x > 180){
  //   data.x -= 360;
  // }
  // console.log()
  data["alpha"]["min"] = fixAngle(data["alpha"]["min"]);
  data["alpha"]["max"] = fixAngle(data["alpha"]["max"]);
  data["beta"]["min"] = fixAngle(data["beta"]["min"]);
  data["beta"]["max"] = fixAngle(data["beta"]["max"]);
  
  if(users.hasOwnProperty(id)){
      users[id]['offset'] = {
        x: {
          min: data["alpha"]["min"],
          max: data["alpha"]["max"]
        },
        y: {
          min: data["beta"]["min"],
          max: data["beta"]["max"]
        }
      };
    console.log(users[id]['offset']);
    // users[id]['offset'] = {
    //   x: data.x,
    //   y: data.y
    // }

    // if(Object.keys(users).length === 1){
    //   loop = setInterval(function(){
    //     renderOnClient(io);
    //   }, 20);
    // }    
  }
}

function fixAngle(angle){
  var fixedAngle = angle;
  if(fixedAngle > 180) fixedAngle -= 360;
  return fixedAngle;
}

function updateUserPosition(id, data){
  // console.log('FUNCTION: updateUser');
  // console.log(data);
  if(users.hasOwnProperty(id)) {
    // console.log('in:\t' + data.orientation.x);
    // console.log('in:\t' + data.orientation.y);

    angleToPosition(id, data.orientation.x, "x");
    angleToPosition(id, data.orientation.y, "y");

    renderOnClient();
  }
}

function angleToPosition(id, angle, axis){
  angle = fixAngle(angle);
  // Clamping
  if(angle > users[id]['offset'][axis]["min"]) angle = users[id]['offset'][axis]["min"];
  if(angle < users[id]['offset'][axis]["max"]) angle = users[id]['offset'][axis]["max"];

  if(axis === "x"){
    users[id]['pos'][axis] = map(angle,
                            users[id]['offset'][axis]["min"], users[id]['offset'][axis]["max"],
                            0, dimensions[axis]);
  }else{
    users[id]['pos'][axis] = map(angle,
                            users[id]['offset'][axis]["min"], users[id]['offset'][axis]["max"],
                            dimensions[axis], 0); // y is inverted :/
  }
  users[id]['pos'][axis] = Math.round(users[id]['pos'][axis]);
  
  // console.log(axis, users[id]['pos'][axis]);
}



// DESKTOP

function addDesktopUser(id, width, height, callback) {
  console.log('FUNCTION: addDesktopUser');
  if(!users.hasOwnProperty(id)) {
      users[id] = {
        type: "desktop",
        key: generateKey(),
        dimensions: {
            x: width,
            y: height
          },
        partner: ""
      };

      console.log("New user:" + JSON.stringify(users[id]));
      callback(users[id]["key"]);
  }
  console.log('current users: ' + Object.keys(users).length);
}

function generateKey(){
  // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
  var possible = "0123456789";
  var uniqueKey = newKey();

  var existingKeys = [];
  for(prop in users){
    existingKeys.push(users[prop]["key"]);
  }

  // Let's check whether the key already exist
  while(existingKeys.indexOf(uniqueKey) > -1){
    uniqueKey = newKey();
  }

  function newKey(){
    var key = "";
    for(var i=0; i < 4; i++){
      key += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return key;
  }
  return uniqueKey;
}

function removeUser(id) {
  console.log('FUNCTION: removeUser');
  if(users.hasOwnProperty(id)) {

      // remove user from "partner" property on desktop ones
      if(users["type"] === "mobile"){
        for(prop in users){
          if(users[prop]["partner"] === id){
            users[prop]["partner"] = "";
          }
        }
      }

      // remove id from user list
      delete users[id];
  }
  console.log('current users: ' + Object.keys(users).length);
  if(Object.keys(users).length === 0){
    clearInterval(loop);
  }
}

// HELPERS
var map = function (n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

var constrain = function(num, min, max) {
  return Math.min(Math.max(num, min), max);
};