var generaljs = require("general-js");
var _ = require('underscore');
const fs = require('fs');
var jsonfile = require('jsonfile')
var util = require('util')

var sbServer = {

    sounds: [],
    jsonFilePath: 'data.json',

    init: function () {
        //        this.jsonFilePath.log("File Path");
        this.loadJson();
        //this.saveJson();
        return sbServer;
    },
    scan: function () {
        "Scanning for new sounds...".log();
        var sounds = fs.readdirSync("sounds");
        sounds = _.map(sounds, function (sound, index) {
            return {
                id: index,
                path: sound,
                playing: false,
                playCount: 0,
                volume: 100
            };

        });
        sounds = _.omit(sounds, _.isUndefined)
        sounds.log("Scan found following sounds: ");
        return sounds;
    },
    saveJson: function (obj) {
        "Saving sounds to: {0}".format(this.jsonFilePath).log();
        jsonfile.writeFile(this.jsonFilePath, obj, function (err) {
            console.error(err)
        })
    },
    loadJson: function () {
        return jsonfile.readFileSync(this.jsonFilePath);
    },
    test: function () {
        "Operational".log("Status");
    }
};

module.exports = sbServer.init();