var ws = require('ws'),
	BigNumber = require('big-number').n,
	fs = require('fs'),
	http = require('http'),
	express = require('express'),
	app = express(),
	port = process.env.PORT || 5000;

app.get('/', function(req, res) {
	res.send(port);
});

var server = http.createServer(app);
server.listen(port);

console.log('server started on port', port);

var wss = new ws.Server({server: server});
console.log('websocket server started');

var counter;
try {
	counter = BigNumber(require("./counter"))
} catch (e) {
	counter = BigNumber(0);
}
console.log("counter loaded", counter.toString());


var connections = {};
wss.on('connection', function(connection) {

//	console.log('client connected');

	var time = new Date().getTime();
	connections[time] = connection;
	connection.send(counter.toString());

	connection.on('close', function() {
//		console.log('client disconnected');
		delete connections[time];
	});

	connection.on('message', function(message) {
		counter.plus(1);
//		console.log('recieved', message, 'sending', counter);
		for (var key in connections) {
			var conn = connections[key];
			conn.send(counter.toString());
		}
	});
});

function store(data) {
	fs.writeFile("counter.json", "\"" + data.toString() + "\"", "utf8");
}

setInterval(function() {
	store(counter);
}, 5000);