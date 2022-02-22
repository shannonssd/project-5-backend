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
 *        Chats Socket Routes with various paths
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

    // On disconnect from socket, remove document from Online Chat colleciton
    socket.on('disconnect', () => {
      chatsSocketController.offlineChat(socket.id);
    });
  });
}
