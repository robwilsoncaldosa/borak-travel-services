// backend/src/socket.ts

import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initializeSocket = (server: HttpServer) => {
  const io = new SocketServer(server, {
    cors: {
      origin: [process.env.FRONTEND_URL || '', process.env.FRONTEND_URL_2 || '', 'http://localhost:3000'].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('sendMessage', async (message) => {
      try {
        // Handle message logic here
        io.emit('message', message); // Emit message to all clients
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'An error occurred while sending the message' });
      }
    });

    socket.on('typing', (data) => {
      socket.broadcast.emit('userTyping', data); // Broadcast typing status
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Add more event listeners as needed
  });

  return io;
};
