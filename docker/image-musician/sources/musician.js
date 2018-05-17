/*
 * Filename : musician.js
 * Date     : 17.05.18
 * Author   : Patrick Neto
 */

//Import packages
var package_dgram = require('dgram');
var package_moment = require('moment');
var package_uuid = require('uuid');

//Import protocol file
var file_protocole = require('./udp_protocol.js');

const MUSIC = {
    piano: "ti-ta-ti",
    trumpet: "pouet",
    flute: "trulu",
    violin: "gzi-gzi",
    drum: "boum-boum"
}


var arg_instrument = process.argv[2];
var sound_sent = {
    uuid: package_uuid(),
    instrument: process.argv[2]
};

//Verify if instrument passed in argument is correct
function verifyInstrument(){
    //If there isn't an instrument passed in argument
    if(arg_instrument === undefined){
        console.log("Error: you didn't enter an instrument in argument");
        process.exit(1);
    }

    //If the instrument passed in argument doesn't exist
    for(var instrument in MUSIC){
        if(arg_instrument === instrument){
            return;
        }
    }
    //Print error message and exit
    console.log("Error: this instrument doesn't exist!")
    process.exit(1);
}

//Send message with UDP Protocol
function sendSound(){
    sound_sent.activeSince = package_moment();

    var msg = JSON.stringify(sound_sent);

    console.log("Multicast sending '" + MUSIC[arg_instrument] + "' to: " + file_protocole.ADDRESS_MULTI + ":" + file_protocole.PORT);
    socket.send(msg, 0, msg.length, file_protocole.PORT, file_protocole.ADDRESS_MULTI, function (err, bytes) {
        if (err) throw err;
    });
    console.log("Info: message sent!");
}

var socket = package_dgram.createSocket('udp4');
var interval = 1000;


verifyInstrument();
setInterval(sendSound, interval);
sendSound();


