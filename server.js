// Env Variables
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var router = express.Router();
var io = require('socket.io')(server);
var port = process.env.PORT ||8080;

// Routes
router.get("/", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});

router.get("/join", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});

router.get("/room1", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});

router.get("/room2", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});

router.get("/about", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/", router);

// Data Variables
var usersRoom1 = [];
var usersRoom2 = [];
var usersAll = [];
var room1Messages = [];
var room2Messages = [];
var anonymousUserCnt = 0;


app.use(express.static(path.join(__dirname, "public")));


io.on('connection', function(socket) {
  console.log('new connection made');

  // Show all users
  socket.on('get-all-users', function(){
    console.log("All Users: ", usersAll);
    socket.emit('all-users', usersAll);
  });

  socket.on('get-users-room1', function(){
    console.log("Users in room 1: ", usersRoom1);
    socket.emit('users-room1', usersRoom1);
  });

  socket.on('get-users-room2', function(){
    console.log("Users in room 2: ", usersRoom2);
    socket.emit('users-room2', usersRoom2);
  });

  socket.on('get-room1-messages', function(){
    console.log("Messages in room 1: ", room1Messages);
    socket.emit('room1-messages', room1Messages);
  });

  socket.on('get-room2-messages', function(){
    console.log("Messages in room 1: ", room2Messages);
    socket.emit('room2-messages', room2Messages);
  });

  // When new socket joins in room 1
  socket.on('join-room1', function(data){
  	socket.nickname = data.nickname;
  	usersRoom1[socket.nickname] = socket;
  	var userObj = {
  		nickname: data.nickname,
  		socketid: socket.id
  	}
  	usersRoom1.push(userObj);
    flag = false;

    for(var user of usersAll){
      if(user.nickname == userObj.nickname){
        flag = true;
        break;
      }
    }
    if(!flag){
      usersAll.push(userObj);
    }
  	io.emit('users-room1', usersRoom1);
  });

  // Whem new socket joins in room 2
  socket.on('join-room2', function(data){
    socket.nickname = data.nickname;
    usersRoom2[socket.nickname] = socket;
    var userObj = {
      nickname: data.nickname,
      socketid: socket.id
    }
    usersRoom2.push(userObj);
    flag = false;
    for(var user of usersAll){
      if(user.nickname == userObj.nickname){
        flag = true;
        break;
      }
    }
    if(!flag){
      usersAll.push(userObj);
    }
    io.emit('users-room2', usersRoom2);
  });

  // Broadcast the message in room1 users
  socket.on('send-message-room1', function(data){
    room1Messages.unshift(data);
    socket.broadcast.emit('message-received-room1', data);
  });

  // Broadcast the message in room 2 users
  socket.on('send-message-room2', function(data){
    room2Messages.unshift(data);
    socket.broadcast.emit('message-received-room2', data);
  });

  socket.on('get-username', function(){
    anonymousUserCnt += 1;
    name = "Anonymous User" + anonymousUserCnt.toString();
    socket.emit('username', name);
  });

  // Disconnect from socket
  socket.on('disconnect', function(){
    usersAll = usersAll.filter(function(item){
      console.log(item.nickname + " disconnected")
      return item.nickname !== socket.nickname;
    });

    usersRoom1 = usersRoom1.filter(function(item){
      return item.nickname !== socket.nickname;
    });

    usersRoom2 = usersRoom2.filter(function(item){
      return item.nickname !== socket.nickname;
    });

    io.emit('users-room1', usersRoom1);
    io.emit('users-room2', usersRoom2);
  });

});

server.listen(port, function() {
  console.log("Listening on port " + port);
});