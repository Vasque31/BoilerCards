//import React from "react";
//import ReactDOM from "react-dom";
//import App from "./App";
//import { BrowserRouter } from "react-router-dom"


//Following online tutorials
//will need to go into index.js

const express = require('express');
const app = express();
//const cors = require('cors');
const port = 3500; //Port open on  3500
const http = require('http');


var writeHead = function(res) {
	console.log("called header");
	res.write("HTTP/1.1 200 Document follows\r\n")
	res.write("Server: test Boiler Cards\r\n");
	res.write("Content-type: text/html\r\n");
	res.write("\r\n");
}

var server = http.createServer(function(req, res) {

	//res.writeHead(200, { 'Content-Type': 'text/html'});
	writeHead(res);
	res.write('<html><body><p>Connection made</p></body></html>');




});


server.listen(3501)

//, (req, res) => {

//		writeHead(res);
//		res.write('<!DOCTYPE html><html><body><p>Connection made</p></body></html>');
//		//res.write(index.js);
//		console.log("server running");
//});

//Source on http server: https://www.youtube.com/watch?v=7GRKUaQ8Spk
//app.use(cors());
//app.use(express.json());

//app.listen(port, (req, res) => {

//		res.writeHead(200, {'Content-Type': 'text/html'});
//		//res.write(index.js);
//		console.log("server running");
//	});
