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
 *          documents for interest groups collection
 *
 * ========================================================
 * ========================================================
 */
const { Schema } = mongoose;

// Initialize new instance of Schema for interest groups collection
const interestGroupSchema = new Schema(
  {
    district: {
      type: String,
    },
    name: {
      type: String,
    },
    creatorName: {
      type: String,
    },
    description: {
      type: String,
    },
    bannerPhoto: {
      type: String,
    },
    members: {
      // Embed userDetails ObjectId of users who have joined this group
      type: [{
        id: {
          type: String,
        },
        name: {
          type: String,
        },
        photo: {
          type: String,
        },
        displayAddress: {
          type: String,
        },
      }],
      // Prevent empty array from automatically being defined
      default: undefined,
    },
    posts: {
      type: [
        {
          postedBy: {
            type: String,
          },
          posteePhoto: {
            type: String,
          },
          displayAddress: {
            type: String,
          },
          post: {
            type: String,
          },
          likedBy: {
          // Embed userDetails ObjectId of users who have joined this group
            type: [String],
            // Prevent empty array from automatically being defined
            default: undefined,
          },
          createdAt: {
            type: Date,
            required: true,
            default: Date.now,
          },
        },
      ],
      // Prevent empty array from automatically being defined
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

// Create model from schema to access and alter database
export default mongoose.model('interest_group', interestGroupSchema, 'interestGroups');
