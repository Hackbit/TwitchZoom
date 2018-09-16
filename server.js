'use strict';

const http = require('http');
const fs = require('fs');
const tmi = require('tmi.js');
const socketio = require('socket.io');

const server = http.createServer();
const io = socketio.listen(server);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('build'));
}

function bot(channel, socket) {
	const tmiOptions = {
		options: {
			debug: true,
		},
		connection: {
			reconnect: false,
		},
		identity: {
			username: 'fxgump',
			password: 'oauth:2urdogguvmls0v9t0lcquzrcjn5orj',
		},
		channels: [channel],
	};

	const client = new tmi.client(tmiOptions);
	client.connect();
	client.on('connected', (addr, port) => {
		client.on('message', (channel, userstate, message, self) => {
			/*	---- DATA RESPONSE FORMAT ----
				channel:  #starladder5
				userstate:  {
				  badges: null,
				  color: '#8A2BE2',
				  'display-name': 'necrus7',
				  emotes: null,
				  id: '35e7ee43-3928-48b5-8db1-b8274bb36dd1',
				  mod: false,
				  'room-id': '28633374',
				  subscriber: false,
				  'tmi-sent-ts': '1537018245483',
				  turbo: false,
				  'user-id': '135853874',
				  'user-type': null,
				  'emotes-raw': null,
				  'badges-raw': null,
				  username: 'necrus7',
				  'message-type': 'chat'
				}
			  	message:  ало камбэечная, тайлу скоро придут
			  	self:  false
			*/
			socket.emit('message', { channel, userstate, message });
		});
		socket.on('disconnect', () => {
			client.close();
			client.disconnect();
			console.log('Client disconnected');
		});
	});
	client.on('disconnected', reason => {
		client.close();
		client.disconnect();
		console.log('Disconnected: ', reason);
	});
}

io.sockets.on('connection', (socket, username) => {
	socket.on('message', channel => {
		bot(channel, socket);
	});
});

server.listen(8080);
