const fs = require('fs');
var sfx = require("sfx");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('general-js');
var _ = require('underscore');

var sounds = fs.readdirSync("sounds");
sounds = _.map(sounds, function (sound, index) {
    if (!sound.startsWith(".")) {
        return {
            id: index,
            path: sound,
            playing: false
        };
    }
});
sounds = _.omit(sounds, _.isUndefined)

app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');   
});

io.on('connection', function (socket) {
    socket.emit('data', socket.id);
    socket.emit('sounds', sounds);

    socket.on('play sound', function (soundId) {
        var sound = _.findWhere(sounds, {
            id: soundId
        });
        var path = "./{0}/{1}".format("sounds", sound.path);
        if (sound.playing) {
            sfx.stop(path);
        } else {
            sfx.play(path, function(a, b, c){
                soundFinished(socket, sound);
            });
        }
        sound.playing = !sound.playing;
        socket.emit('sounds', sounds);
    });

});

function soundFinished(socket, sound){
    sound.playing = false;
    socket.emit('sounds', sounds);
}

http.listen(3000, function () {
    console.log('listening on *:3000');
});