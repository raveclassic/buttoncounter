var ws = require('ws');

var socket = new ws('ws://127.0.0.1:5000');

socket.on('open', function() {
	socket.send('something');
});

socket.on('message', function(message) {
	console.log('client recieved', message);
});
