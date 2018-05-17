/*
 * Filename : auditor.js
 * Date     : 17.05.18
 * Author   : Patrick Neto
 */

//Import packages
var package_dgram = require('dgram');
var package_net = require('net');
var package_moment = require('moment');

//Import protocol file
var file_protocol = require('./../../udp_protocol.js');


var udp_socket = package_dgram.createSocket('udp4');


var instruments = [];

//Print instrument
function printInstruments(){
    for (var i = 0; i < instruments.length; ++i) {
        console.log(instruments[i].instrument);
    }
}

//Add an instrument if it isn't in the list
function addInstrument(content){
    for (var i = 0; i < instruments.length; ++i) {
        if(content.uuid == instruments[i].uuid){
            return;
        }
    }
    console.log("Instrument '" + content.instrument + "' added!");
    instruments.push(content);
    printInstruments();
}

//Bind an UDP connection
udp_socket.bind(file_protocol.PORT, function () {
    console.log("Listening on multicast : " + file_protocol.ADDRESS_MULTI + ":" + file_protocol.PORT);
    udp_socket.addMembership(file_protocol.ADDRESS_MULTI);
});

//Message reception
udp_socket.on('message', function(message, source){
    console.log("Message recieved: " + message);

    var content = JSON.parse(message);
    addInstrument(content);
});

//-----------TCP Part
function verifyInstruments(){
    //For every instruments, verify if it sounds
    for(i = 0; i < instruments.length; ++i){
        if(moment().diff(instruments[i].activeSince) > file_protocol.DELAY_MAX){
            console.log("Instrument removed :" + instruments[i]);
            instruments.splice(i, 1);
        }
    }
}

var tcp_socket = package_net.createServer();

//Connecting TCP
tcp_socket.listen(file_protocol.PORT);
console.log("TCP: listening on port: " + file_protocol.PORT);

tcp_socket.on('connection', function (socket) {
    verifyInstruments();
    socket.write(JSON.stringify(instruments));    //sérialiser en JSON le tableau de musicien
    socket.destroy();
})




