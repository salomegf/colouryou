import createDebugger from 'debug';
import WebSocket, { WebSocketServer } from 'ws';

const debug = createDebugger('express-api:messaging');

const clients = [];

export function createWebSocketServer(httpServer) {
  debug('Creating WebSocket server');
  const wss = new WebSocketServer({
    server: httpServer,
    //port: 3000,
  });

  // Handle new client connections.
  // J'ai rajouté le connection devant fonction !
  wss.on('connection', function connection (ws) {
    debug('New WebSocket client connected');

    // Keep track of clients.
    clients.push(ws);

    // Listen for messages sent by clients.
    ws.on('message', (message) => {
      // Make sure the message is valid JSON.
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (err) {
        // Send an error message to the client with "ws" if you want...
        return debug('Invalid JSON message received from client');
      }

      // Handle the message.
      onMessageReceived(ws, parsedMessage);
    });

    // Clean up disconnected clients.
    ws.on('close', () => {
      clients.splice(clients.indexOf(ws), 1);
      debug('WebSocket client disconnected');
    });
  });
}

export function broadcastMessage(message) {
  debug(
    `Broadcasting message to all connected clients: ${JSON.stringify(message)}`
  );
  // You can easily iterate over the "clients" array to send a message to all
  // connected clients.
}

function onMessageReceived(ws, message) {
  debug(`Received WebSocket message: ${JSON.stringify(message)}`);
  // Do something with message...
}


/* Ce code est à mettre dans l'application mobile, du côté client */

/*
// Open a WebSocket connection to the server running on localhost port 3000.
const ws = new WebSocket('ws://localhost:3000')

// Wait for the connection to open.
ws.addEventListener('open', function(event) {
  // Send something to the server.
  ws.send('Hello Server!');
});

// Listen for message from the server.
ws.addEventListener('message', function(event) {
  console.log('Message from server ', event.data);
});
*/