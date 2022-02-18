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
    description: {
      type: String,
    },
    bannerPhoto: {
      type: String,
    },
    members: {
      // Store userDetails ObjectId of users who have joined this group
      type: [String],
      // Prevent empty array from automatically being defined
      default: undefined,
    },
    posts: [
      {
        postedBy: {
          type: String,
        },
        post: {
          type: String,
        },
        links: {
          type: String,
        },
        likedBy: {
          // Store userDetails ObjectId of users who have joined this group
          type: [String],
          // Prevent empty array from automatically being defined
          default: undefined,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Create model from schema to access and alter database
export default mongoose.model('interest_group', interestGroupSchema, 'interestGroups');
