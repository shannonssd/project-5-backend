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
import dotenv from 'dotenv';
import BaseController from './baseController.mjs';

dotenv.config();

/*
 * ========================================================
 * ========================================================
 *
 *                    Chats Controller
 *
 * ========================================================
 * ========================================================
 */
class ChatsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /*
  * ========================================================
  *  Retrieve list of users chats and send info to frontend
  * ========================================================
  */
  async chatsList(req, res) {
    const { userId } = req.query;

    try {
    // Find all conversations between user and others
      const messageList = await this.model.find({ senderId: userId });
      const messageListTwo = await this.model.find({ receiverId: userId });
      // Join arrays
      const combinedList = [...messageList, ...messageListTwo];
      // Extract all user ids
      const idArr = [];
      combinedList.forEach((element) => {
        idArr.push(element.senderId);
        idArr.push(element.receiverId);
      });
      // Remove user's id
      const texteeIdArr = idArr.filter((element) => element !== userId);
      // Ensure each textee's id only appears once
      const uniqueTexteeIdArr = [...new Set(texteeIdArr)];

      const texteeData = await this.userModel.find({ _id: { $in: uniqueTexteeIdArr } }).select({ 'userDetails.name': 1, 'userDetails.photo': 1 });
      res.status(200).json({ texteeData });
    } catch (err) {
      console.log(err);
    }
  }
}

export default ChatsController;
