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

      // Sort messages according to time sent
      allMessages.sort((a, b) => a.createdAt - b.createdAt);

      // Get textees info
      const user = await UserModel.findOne({ _id: data.texteeId }).select({ 'userDetails.name': 1, 'userDetails.photo': 1, 'addressDetails.displayAddress': 1 });

      const sendData = {
        allMessages,
        user,
      };
      // Send messages to frontend
      socket.emit('All messages', { sendData });
    } catch (err) {
      console.log(err);
    }
  };

  /*
  * ========================================================
  *                  Upon receiving message,
  *               store in DB and inform user
  *     and textee (if they are also in the chatroom)
  * ========================================================
  */
  const saveMessage = async (socket, data) => {
    try {
    // Add message to Chat collection
      await ChatModel.create({
        message: data.message,
        senderId: data.senderId,
        receiverId: data.receiverId,
      });

      // Retrieve updated conversation
      const messages = await ChatModel.find({
        senderId: data.senderId,
        receiverId: data.receiverId,
      });

      const messagesTwo = await ChatModel.find({
        senderId: data.receiverId,
        receiverId: data.senderId,
      });

      // Combine all messages
      const allMessages = [...messages, ...messagesTwo];

      // Sort messages according to time sent
      allMessages.sort((a, b) => a.createdAt - b.createdAt);

      // Send messages to frontend
      socket.emit('Latest conversation ', { allMessages });
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
    saveMessage,
    offlineChat,
  };
};

export default initChatsSocketController;
