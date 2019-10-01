const express = require("express");
const fs = require("fs");
const http = require("http");
var SSHClient = require("ssh2").Client;
var utf8 = require("utf8");
const app = express();
const pty = require("pty.js");
const expressWs = require('express-ws')(app);

var serverPort = 9000;

var server = http.createServer(app);

//set the template engine ejs
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

// Instantiate shell and set up data handlers
expressWs.app.ws('/shell', (ws, req) => {
  // Spawn the shell
  const shell = pty.spawn('/bin/bash', [], {
    name: 'xterm-color',
    cwd: process.env.PWD,
    env: process.env
  });
  // For all shell data send it to the websocket
  shell.on('data', (data) => {
    ws.send(data);
  });
  // For all websocket data send it to the shell
  ws.on('message', (msg) => {
    shell.write(msg);
  });
});


server.listen(serverPort, () => console.log('Server run at port :9000'));
