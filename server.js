const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Serve the HTML file
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.method === 'GET' && req.url === '/chat.js') {
    // Serve the client-side JavaScript file
    fs.readFile(path.join(__dirname, 'public', 'chat.js'), (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Attach socket.io to the server
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  // Handle incoming chat messages
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
