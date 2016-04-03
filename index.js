const fs = require('fs');
var sfx = require("sfx");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('general-js');
var _ = require('underscore');

sfx.config.play.command = 'omxplayer';
var sounds;

sfx.config.play.command = 'omxplayer';
function loadSounds() {
    sounds = fs.readdirSync("/home/pi/SoundBoard/sounds");
    sounds = _.map(sounds, function (sound, index) {
        return {
            id: index,
            path: sound,
            playing: false,
            playCount: 0
        };

    });
    sounds = _.omit(sounds, _.isUndefined)
}

loadSounds();

app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');
});

io.on('connection', function (socket) {
    socket.emit('data', socket.id);
    socket.emit('sounds', sounds);

    socket.on('reload', function () {
        sfx.stop();
        loadSounds();
        socket.emit('sounds', sounds);
    });

    socket.on('play sound', function (soundId) {
        var sound = _.findWhere(sounds, {
            id: soundId
        });
        var path = "/home/pi/SoundBoard/{0}/{1}".format("sounds", sound.path);
        if (sound.playing) {
            sfx.stop(path);
        } else {
            sound.playCount++;
            sfx.play(path, function () {
                soundFinished(socket, sound);
            });
        }
        sound.playing = !sound.playing;
        socket.emit('sounds', sounds);
    });

});

function soundFinished(socket, sound) {
    sound.playing = false;
    socket.emit('sounds', sounds);
}

http.listen(3000, function () {
    console.log('listening on *:3000');
});
