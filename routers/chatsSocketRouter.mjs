/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/*
 * ========================================================
 * ========================================================
 *
 *                      Imports
 *
 * ========================================================
 * ========================================================
 */
import initChatsSocketController from '../controllers/chatsSocketController.mjs';

/*
 * ========================================================
 * ========================================================
 *
 *        Chats socket routes with various paths
 *
 * ========================================================
 * ========================================================
 */
export default function chatsSocketRoutes(io) {
  const chatsSocketController = initChatsSocketController();

  // Socket routes
  io.on('connection', (socket) => {
    // Request frontend to send user data after connection
    socket.emit('Send data');

    // Upon receiving data, store in collection and send messages to frontend
    socket.on('Sent data to backend', (data) => {
      data.userSocketId = socket.id;
      chatsSocketController.onlineChat(socket, data);
    });

    // Upon receiving message, store in DB and inform user and textee (if they are also in the chatroom)
    socket.on('Send message', (data) => {
      chatsSocketController.saveMessage(socket, data, io);
    });

    // On disconnect from socket, remove document from Online Chat colleciton
    socket.on('disconnect', () => {
      chatsSocketController.offlineChat(socket.id);
    });
  });
}
