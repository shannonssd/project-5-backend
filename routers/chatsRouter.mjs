/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/*
 * ========================================================
 * ========================================================
 *
 *                      Imports
 *
 * ========================================================
 * ========================================================
 */
import express from 'express';
import OnlineChatModel from '../models/onlineChatModel.mjs';
import ChatModel from '../models/chatModel.mjs';
// Set name of photo upload directory
const router = express.Router();

/*
 * ========================================================
 * ========================================================
 *
 *            User Router with various paths
 *
 * ========================================================
 * ========================================================
 */
export default function chatsRouter(controller, io) {
  // Route for getting list of all chats
  router.get('/show-chats', controller.chatsList.bind(controller));

  // Socket routes
  io.on('connection', (socket) => {
    console.log('socket id', socket.id);
    socket.emit('Send data');
    socket.on('Sent data to backend', (data) => {
      data.userSocketId = socket.id;
      // ################################# PROMBLEM STARTS HERE #################################
      // controller.onlineChat.bind(controller);
      const run = async () => {
        // Add user to Online Chat collection
        await OnlineChatModel.create({
          onlineUserId: data.onlineUserId,
          texteeId: data.texteeId,
          userSocketId: data.userSocketId,
        });

        // Retrieve all messages between users
        const messages = await ChatModel.find({
          senderId: data.onlineUserId,
          receiverId: data.texteeId,
        });

        const messagesTwo = await ChatModel.find({
          senderId: data.texteeId,
          receiverId: data.onlineUserId,
        });

        const allMessages = [...messages, ...messagesTwo];
        // const sortedMessages = allMessages.sort((a, b) => b.createdAt - a.createdAt);
        socket.emit('All messages', { allMessages });
        console.log(messages, messagesTwo);
        console.log('done');
      };
      run();
    });

    socket.on('disconnect', () => {
      console.log('bye!');
      console.log('discon ID', socket.id);
      // Remove document from Online Chat collection
      const run = async () => {
        await OnlineChatModel.deleteOne({
          userSocketId: socket.id,
        });
        console.log('done deleteing');
      };
      run();
    });
  });
  return router;
}
