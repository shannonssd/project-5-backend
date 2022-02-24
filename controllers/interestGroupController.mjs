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
 *              Interest Group Controller
 *
 * ========================================================
 * ========================================================
 */
class InterestGroupController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /*
  * ========================================================
  *                Add new interest group to DB
  * ========================================================
  */
  async addGroup(req, res) {
    const {
      district, name, creatorName, description, userId,
    } = req.body;
    const photo = req.file;

    console.log(`POST Request: ${BACKEND_URL}/interest-group/add-group`);
    console.log('<=== req.body ===>', req.body);
    console.log('<=== req.file ===>', req.file);

    try {
      // Store profile pic in AWS S3 and return image link for storage in DB
      const imageLink = await handleImage(photo);

      // Add interest group to creator's user document under interestGroups field
      const user = await this.userModel.findById(userId);

      // Add interest group to DB
      const newGroup = await this.model.create({
        district,
        name,
        creatorName,
        description,
        bannerPhoto: imageLink,
        members: {
          id: user._id,
          name: user.userDetails.name,
          photo: user.userDetails.photo,
          displayAddress: user.addressDetails.displayAddress,
        },
      });

      if (user.interestGroups !== undefined) {
        user.interestGroups.push(newGroup._id);
      } else {
        user.interestGroups = [newGroup._id];
      }

      // Update DB with new item
      await user.save();

      // Update frontend
      res.status(200).json({ newGroup, user });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *        Display all interest groups in district
  * ========================================================
  */
  async showAllGroups(req, res) {
    const {
      userId, district,
    } = req.query;
    console.log(`GET Request: ${BACKEND_URL}/interest-group/show-groups`);
    console.log('<=== req.query ===>', req.query);

    try {
      // Find all interest groups in the users district
      const districtInterestGroups = await this.model.find({ district });

      // Query DB for user's document
      const user = await this.userModel.findOne({ _id: userId });
      // Find all interest groups followed by this user
      let usersInterestGroups = [];
      if (user.interestGroups !== undefined) {
        usersInterestGroups = user.interestGroups;
      } else {
        usersInterestGroups = [];
      }

      // Update frontend
      res.status(200).json({ districtInterestGroups, usersInterestGroups });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *            When user wants to follow group,
  *       add data to user and interest group collections
  * ========================================================
  */
  async followGroup(req, res) {
    const {
      userId, interestGrpId, district,
    } = req.body;
    console.log(`POST Request: ${BACKEND_URL}/interest-group/follow-group`);
    console.log('<=== req.body ===>', req.body);

    try {
      // Query user's document to add interest group under followed
      const user = await this.userModel.findOne({ _id: userId });

      // Query DB for interest group document
      const interestGroup = await this.model.findOne({ _id: interestGrpId });

      console.log('interGrp', interestGroup);
      // Add user as member of interest group
      if (interestGroup.members !== undefined) {
        interestGroup.members.push({
          id: user._id,
          name: user.userDetails.name,
          photo: user.userDetails.photo,
          displayAddress: user.addressDetails.displayAddress,
        });
      } else {
        interestGroup.members = [{
          id: user._id,
          name: user.userDetails.name,
          photo: user.userDetails.photo,
          displayAddress: user.addressDetails.displayAddress,
        }];
      }
      await interestGroup.save();

      // // Query user's document to add interest group under followed
      // const user = await this.userModel.findOne({ _id: userId });
      console.log('user', user);

      if (user.interestGroups !== undefined) {
        user.interestGroups.push(interestGrpId);
      } else {
        user.interestGroups = [interestGrpId];
      }
      await user.save();

      // Find all interest groups in the users district
      const districtInterestGroups = await this.model.find({ district });

      // Update frontend
      res.status(200).json({ districtInterestGroups });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *            When user wants to unfollow group,
  *   remove data from user and interest group collections
  * ========================================================
  */
  async unfollowGroup(req, res) {
    const {
      userId, interestGrpId, district,
    } = req.body;
    console.log(`POST Request: ${BACKEND_URL}/interest-group/unfollow-group`);
    console.log('<=== req.body ===>', req.body);

    try {
      // Query DB for interest group document
      const interestGroup = await this.model.findOne({ _id: interestGrpId });
      const { members } = interestGroup;
      // const updatedMembers = members.filter((memberId) => memberId !== userId);
      const updatedMembers = [];
      for (let i = 0; i < members.length; i += 1) {
        if (members[i].id !== userId) {
          updatedMembers.push(members[i]);
        }
      }
      interestGroup.members = updatedMembers;
      console.log('intGro', interestGroup.members);
      await interestGroup.save();

      // Query user's document to unfollow interest group
      const user = await this.userModel.findOne({ _id: userId });
      const updatedInterstGrps = user.interestGroups.filter((groupId) => groupId !== interestGrpId);
      user.interestGroups = updatedInterstGrps;
      user.save();

      // Find all interest groups in the users district
      const districtInterestGroups = await this.model.find({ district });

      // Update frontend
      res.status(200).json({ districtInterestGroups });
    } catch (err) {
      console.log(err);
    }
  }

  // /*
  // * ========================================================
  // *        Remove item for DB and update frontend
  // * ========================================================
  // */
  // async removeItem(req, res) {
  //   const {
  //     userId, itemId,
  //   } = req.body;
  //   console.log(`DELETE Request: ${BACKEND_URL}/hand-me-downs/remove-item`);
  //   console.log('<=== req.body ===>', req.body);

  //   try {
  //     // Remove item id from all other users likedHandMeDowns field
  //     // ***check through peopleInterested userId to remove likedHnadMeDown ObjectId
  //     // await this.model.updateMany({ }, { $pull: { likedHandMeDowns: itemId } });

  //     // Remove item from user's document
  //     await this.model.updateOne({ _id: userId }, {
  //       $pull: {
  //         handMeDowns: { _id: itemId },
  //       },
  //     });

  //     // Update frontend
  //     res.status(200).json({ message: 'Item succesfully deleted' });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // /*
  // * ========================================================
  // *     Like/unlike item in seller and users documents
  // * ========================================================
  // */
  // async likeItem(req, res) {
  //   const {
  //     userId, itemId,
  //   } = req.body;
  //   console.log(`POST Request: ${BACKEND_URL}/hand-me-downs/like-item`);
  //   console.log('<=== req.body ===>', req.body);

  //   try {
  //     // Retrieve sellers sub document
  //     const sellerObj = await this.model.findOne({ 'handMeDowns._id': itemId }, {
  //       handMeDowns: {
  //         $elemMatch: { _id: itemId },
  //       },
  //     });
  //     const sellerItem = sellerObj.handMeDowns[0];
  //     let { peopleInterested } = sellerItem;

  //     // Check if item has been liked in sellers document
  //     // Remove if present, else add
  //     let isLiked = false;
  //     if (peopleInterested === undefined) {
  //       peopleInterested = [userId];
  //       sellerObj.handMeDowns[0].peopleInterested = peopleInterested;
  //       isLiked = true;
  //     } else if (!peopleInterested.includes(userId)) {
  //       peopleInterested.push(userId);
  //       sellerObj.handMeDowns[0].peopleInterested = peopleInterested;
  //       isLiked = true;
  //     } else {
  //       const updatePeopleInterested = peopleInterested.filter((id) => id !== userId);
  //       sellerObj.handMeDowns[0].peopleInterested = updatePeopleInterested;
  //     }
  //     // Update sellers subdocument
  //     await sellerObj.save();

  //     // Retrieve users sub document
  //     const user = await this.model.findOne({ _id: userId });

  //     // Check if item has been liked in users document
  //     // Remove if present, else add
  //     if (user.likedHandMeDowns === undefined) {
  //       user.likedHandMeDowns = [itemId];
  //     } else if (isLiked) {
  //       user.likedHandMeDowns.push(itemId);
  //     } else {
  //       const likedArr = user.likedHandMeDowns;
  //       user.likedHandMeDowns = likedArr.filter((id) => id !== itemId);
  //     }
  //     // Update users subdocument
  //     await user.save();

  //     // Update frontend
  //     res.status(200).json({ message: 'Changes made to DB', isLiked });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}

export default InterestGroupController;
