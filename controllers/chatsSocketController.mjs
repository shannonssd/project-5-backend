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
// Import models
import UserModel from '../models/userModel.mjs';
import OnlineChatModel from '../models/onlineChatModel.mjs';
import ChatModel from '../models/chatModel.mjs';

/*
 * ========================================================
 * ========================================================
 *
 *        Controller function for chat socket routes
 *
 * ========================================================
 * ========================================================
 */
const initChatsSocketController = () => {
  /*
  * ========================================================
  *                If user is in chat room,
  *           add details to online chat collection
  *           and retrieve all messages with textee
  * ========================================================
  */
  const onlineChat = async (socket, data) => {
    console.log('onlineChat working');
    console.log('socket id', socket.id);
    console.log('<=== socket data ===>', data);

    try {
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

      // Combine all messages
      const allMessages = [...messages, ...messagesTwo];

      // // Sort messages according to time sent
      // const sortedMessages = allMessages.sort((a, b) => b.createdAt - a.createdAt);

      // Send messages to frontend
      socket.emit('All messages', { allMessages });
      console.log(messages, messagesTwo);
      console.log('done');
    } catch (err) {
      console.log(err);
    }
  };

  /*
  * ========================================================
  *               On disconnect from socket,
  *          remove document from Online Chat Colleciton
  * ========================================================
  */
  const offlineChat = async (id) => {
    console.log('bye!');
    console.log('disconnect ID', id);
    await OnlineChatModel.deleteOne({
      userSocketId: id,
    });
  };
  return {
    onlineChat,
    offlineChat,
  };
};

export default initChatsSocketController;
