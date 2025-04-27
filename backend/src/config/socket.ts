import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import Message from '../models/messageModel';

export const initializeSocket = (server: HttpServer) => {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('sendMessage', async (message) => {
      try {
        // Store message in database
        const newMessage = new Message(message);
        await newMessage.save();
        
        // Broadcast message to all connected clients
        io.emit('message', newMessage);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    socket.on('typing', (data) => {
      socket.broadcast.emit('userTyping', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};