/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-constructor */
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
import handleImage from '../utils/s3.mjs';

dotenv.config();

const { BACKEND_URL } = process.env;
/*
 * ========================================================
 * ========================================================
 *
 *                    User Controller
 *
 * ========================================================
 * ========================================================
 */
class HandMeDownController extends BaseController {
  constructor(model) {
    super(model);
  }

  /*
  * ========================================================
  * Retrieve and send all items in this district to frontend
  * ========================================================
  */
  async showAllItems(req, res) {
    const {
      userId, district,
    } = req.query;
    console.log(`GET Request: ${BACKEND_URL}/hand-me-downs/show-all-items`);
    console.log('<=== req.query ===>', req.query);

    try {
      // Find all items listed in current users district
      const itemsArr = await this.model.find({ 'addressDetails.district': district, handMeDowns: { $exists: true } }).select({ handMeDowns: 1, 'userDetails.name': 1, _id: 1 });

      // Find all items liked by current user
      const user = await this.model.findOne({ _id: userId });
      let likedHandMeDowns = [];
      if (user.likedHandMeDowns !== undefined) {
        likedHandMeDowns = user.likedHandMeDowns;
      }

      // Update frontend
      res.status(200).json({ itemsArr, likedHandMeDowns });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *       Retrieve and send users items to frontend
  * ========================================================
  */
  async showUsersItems(req, res) {
    const {
      userId,
    } = req.query;
    console.log(`GET Request: ${BACKEND_URL}/hand-me-downs/show-users-items`);
    console.log('<=== req.query ===>', req.query);

    try {
      // Query DB for user's document
      const user = await this.model.findOne({ _id: userId });

      // Find all items listed by user
      let itemsArr = [];
      if (user.handMeDowns !== undefined) {
        itemsArr = user.handMeDowns;
      }

      // Find all items liked by user
      let likedHandMeDowns = [];
      if (user.likedHandMeDowns !== undefined) {
        likedHandMeDowns = user.likedHandMeDowns;
      }

      // Update frontend
      res.status(200).json({ itemsArr, likedHandMeDowns });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *             Retrieve and send full details of
  *                   an item to frontend
  *    together with whether the user has liked item before
  * ========================================================
  */
  async showSingleItem(req, res) {
    const {
      userId, itemId,
    } = req.query;
    console.log(`GET Request: ${BACKEND_URL}/hand-me-downs/show-item`);
    console.log('<=== req.query ===>', req.query);

    try {
      // Query DB for items subdocument
      const item = await this.model.findOne({ 'handMeDowns._id': itemId }, {
        handMeDowns: {
          $elemMatch: { _id: itemId },
        },
      }).select({ 'userDetails.name': 1 });
      console.log('ITEMMMMMMM', item);
      // Query user's document to see if they've liked this item
      const user = await this.model.findOne({ _id: userId });
      let usersLikedItems = [];
      if (user.likedHandMeDowns !== undefined) {
        usersLikedItems = user.likedHandMeDowns;
      }
      let isLiked = false;
      if (usersLikedItems.includes(itemId)) {
        isLiked = true;
      }

      // Update frontend
      res.status(200).json({ item, isLiked });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *              Store added item to DB then
  *            send updated catalog to frontend
  * ========================================================
  */
  async addItem(req, res) {
    const {
      itemName, description, condition, userId,
    } = req.body;
    const photo = req.file;
    console.log(`POST Request: ${BACKEND_URL}/hand-me-downs/add-item`);
    console.log('<=== req.body ===>', req.body);
    console.log('<=== req.file ===>', req.file);

    // Find users documents and store new item
    try {
      const user = await this.model.findById(userId);
      console.log(user);
      // Store profile pic in AWS S3 and return image link for storage in DB
      const imageLink = await handleImage(photo);

      if (user.handMeDowns !== undefined) {
        user.handMeDowns.push({
          itemName,
          description,
          condition,
          photo: imageLink,
        });
      } else {
        user.handMeDowns = [{
          itemName,
          description,
          condition,
          photo: imageLink,
        }];
      }

      // Update DB with new item
      await user.save();
      // Update frontend
      res.status(200).json({ message: 'Item added to db' });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *        Remove item for DB and update frontend
  * ========================================================
  */
  async removeItem(req, res) {
    const {
      userId, itemId,
    } = req.body;
    console.log(`DELETE Request: ${BACKEND_URL}/hand-me-downs/remove-item`);
    console.log('<=== req.body ===>', req.body);

    try {
      // Remove item id from all other users likedHandMeDowns field
      // ***check through peopleInterested userId to remove likedHnadMeDown ObjectId
      // await this.model.updateMany({ }, { $pull: { likedHandMeDowns: itemId } });

      // Remove item from user's document
      await this.model.updateOne({ _id: userId }, {
        $pull: {
          handMeDowns: { _id: itemId },
        },
      });

      // Update frontend
      res.status(200).json({ message: 'Item succesfully deleted' });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *     Like/unlike item in seller and users documents
  * ========================================================
  */
  async likeItem(req, res) {
    const {
      userId, itemId,
    } = req.body;
    console.log(`POST Request: ${BACKEND_URL}/hand-me-downs/like-item`);
    console.log('<=== req.body ===>', req.body);

    try {
      // Retrieve sellers sub document
      const sellerObj = await this.model.findOne({ 'handMeDowns._id': itemId }, {
        handMeDowns: {
          $elemMatch: { _id: itemId },
        },
      });
      const sellerItem = sellerObj.handMeDowns[0];
      let { peopleInterested } = sellerItem;

      // Check if item has been liked in sellers document
      // Remove if present, else add
      let isLiked = false;
      if (peopleInterested === undefined) {
        peopleInterested = [userId];
        sellerObj.handMeDowns[0].peopleInterested = peopleInterested;
        isLiked = true;
      } else if (!peopleInterested.includes(userId)) {
        peopleInterested.push(userId);
        sellerObj.handMeDowns[0].peopleInterested = peopleInterested;
        isLiked = true;
      } else {
        const updatePeopleInterested = peopleInterested.filter((id) => id !== userId);
        sellerObj.handMeDowns[0].peopleInterested = updatePeopleInterested;
      }
      // Update sellers subdocument
      await sellerObj.save();

      // Retrieve users sub document
      const user = await this.model.findOne({ _id: userId });

      // Check if item has been liked in users document
      // Remove if present, else add
      if (user.likedHandMeDowns === undefined) {
        user.likedHandMeDowns = [itemId];
      } else if (isLiked) {
        user.likedHandMeDowns.push(itemId);
      } else {
        const likedArr = user.likedHandMeDowns;
        user.likedHandMeDowns = likedArr.filter((id) => id !== itemId);
      }
      // Update users subdocument
      await user.save();

      // Update frontend
      res.status(200).json({ message: 'Changes made to DB', isLiked });
    } catch (err) {
      console.log(err);
    }
  }
}

export default HandMeDownController;
