const fastcgi = require('node-fastcgi');
const { createServer } = require('./main.ts'); // Replace './main' with the path to your Nest.js main application file

const server = createServer();

fastcgi.createServer((req, res) => {
  server(req, res);
}).listen(9000); // Replace '9000' with the desired port for FastCGI communication
