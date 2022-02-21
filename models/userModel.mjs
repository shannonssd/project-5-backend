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
        type: String,
        // required: true,
      },
    },
    addressDetails: {
      address: {
        street: {
          type: String,
          // required: true,
        },
        block: {
          type: String,
        },
        postalCode: {
          type: String,
          // required: true,
        },
      },
      displayAddress: {
        type: String,
      },
      district: {
        type: String,
      },
    },
    handMeDowns: {
      type: [{
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
          type: String,
        },
        peopleInterested: {
        // Embed userDetails ObjectId of users who are interested in this item
          type: [mongoose.Schema.Types.ObjectId],
          // Prevent empty array from automatically being defined
          default: undefined,
        },
      }],
      // Prevent empty array from automatically being defined
      default: undefined,
    },
    likedHandMeDowns: {
      // Embed handMeDown items ObjectId of items which this user is interested in
      type: [mongoose.Schema.Types.ObjectId],
      // Prevent empty array from automatically being defined
      default: undefined,
    },
    interestGroups: {
      // Embed ?InterestGroup.name ObjectId of joined groups
      type: [mongoose.Schema.Types.ObjectId],
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
