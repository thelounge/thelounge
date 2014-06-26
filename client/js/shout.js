$(function() {
	var socket = io();
	socket.emit("h", "hello");
});
