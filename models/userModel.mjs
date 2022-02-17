/* eslint-disable max-len */
/*
 * ========================================================
 * ========================================================
 *
 *                      Imports
 *
 * ========================================================
 * ========================================================
 */
import mongoose from 'mongoose';

/*
 * ========================================================
 * ========================================================
 *
 *             Schema describing structure of
 *             documents for users collection
 *
 * ========================================================
 * ========================================================
 */
const { Schema } = mongoose;

// Initialize new instance of Schema for users collection
const userSchema = new Schema(
  {
    userDetails: {
      name: {
        type: String,
        // required: true,
      },
      email: {
        type: String,
        // required: true,
      },
      password: {
        type: String,
        // required: true,
      },
      photo: {
        data: Buffer,
        contentType: String,
      },
    },
    addressDetails: {
      address: {
        type: String,
        // required: true,
      },
      displayAddress: {
        type: String,
      },
      district: {
        type: String,
      },
    },
    handMeDowns: [{
      itemName: {
        type: String,
      },
      description: {
        type: String,
      },
      condition: {
        type: String,
      },
      photo: {
        data: Buffer,
        contentType: String,
      },
      peopleInterested: {
        // Store userDetails ObjectId of users who have liked this item
        type: [String],
        // Prevent empty array from automatically being defined
        default: undefined,
      },
    }],
    likedHandMeDowns: {
      // Store handMeDown items ObjectId of users who have liked this item
      type: [String],
      // Prevent empty array from automatically being defined
      default: undefined,
    },
    interestGroups: {
      // Store ?InterestGroup.name ObjectId of joined groups
      type: [String],
      // Prevent empty array from automatically being defined
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

// Create model from schema to access and alter database
export default mongoose.model('User', userSchema);
