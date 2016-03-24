const fs = require('fs');
var sfx = require("sfx");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('general-js');

var sounds = fs.readdirSync("sounds");

app.get('/', function(req, res){
//    res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/client.html');
    //player.play('test.aiff', function(err){})    
});

io.on('connection', function(socket){
  socket.emit('data', socket.id);
    
  socket.on('play sound', function(msg){  
    sfx.play("ping");
    io.emit('play sound', {id: msg, userId: socket.id});
  });
    
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

