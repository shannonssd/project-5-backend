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

    try {
      // Query user's document to add interest group under followed
      const user = await this.userModel.findOne({ _id: userId });

      // Query DB for interest group document
      const interestGroup = await this.model.findOne({ _id: interestGrpId });

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

    try {
      // Query DB for interest group document
      const interestGroup = await this.model.findOne({ _id: interestGrpId });
      const { members } = interestGroup;
      const updatedMembers = [];
      for (let i = 0; i < members.length; i += 1) {
        if (members[i].id !== userId) {
          updatedMembers.push(members[i]);
        }
      }
      interestGroup.members = updatedMembers;
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

  /*
  * ========================================================
  *                     Add new post to DB
  * ========================================================
  */
  async addPost(req, res) {
    const {
      userName, userPhoto, displayAddress, post, interestGrpId,
    } = req.body;

    try {
      // Add post to interest group collection
      const interestGrp = await this.model.findOne({ _id: interestGrpId });
      if (interestGrp.posts !== undefined) {
        interestGrp.posts.push({
          postedBy: userName,
          posteePhoto: userPhoto,
          displayAddress,
          post,
        });
      } else {
        interestGrp.posts = [{
          postedBy: userName,
          posteePhoto: userPhoto,
          displayAddress,
          post,
        }];
      }
      const newPostsArr = interestGrp.posts;
      newPostsArr.sort((a, b) => b.createdAt - a.createdAt);
      await interestGrp.save();

      // Update frontend
      res.status(200).json({ newPostsArr });
    } catch (err) {
      console.log(err);
    }
  }

  /*
  * ========================================================
  *                   Like/unlike post
  * ========================================================
  */
  async likePost(req, res) {
    const {
      userId, postId,
    } = req.body;

    try {
      // Retrieve post sub document
      const postArr = await this.model.findOne({ 'posts._id': postId }, {
        posts: {
          $elemMatch: { _id: postId },
        },
      });

      const postObj = postArr.posts[0];

      // Check if post has been liked by user
      // Remove if present, else add
      let isRemoved = false;
      if (postObj.likedBy === undefined) {
        postArr.posts[0].likedBy = userId;
      } else if (!postObj.likedBy.includes(userId)) {
        postArr.posts[0].likedBy.push(userId);
      } else {
        const updatedLikedBy = postObj.likedBy.filter((id) => id !== userId);
        postArr.posts[0].likedBy = updatedLikedBy;
        isRemoved = true;
      }
      const newPostsArr = postArr.posts[0].likedBy;
      // Update interest group's posts subdocument
      await postArr.save();

      // // Update frontend
      res.status(200).json({ newPostsArr, isRemoved });
    } catch (err) {
      console.log(err);
    }
  }
}

export default InterestGroupController;
