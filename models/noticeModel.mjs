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
 *            documents for notices collection
 *
 * ========================================================
 * ========================================================
 */
const { Schema } = mongoose;

// Initialize new instance of Schema for notices collection
const noticeSchema = new Schema(
  {
    district: {
      type: String,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Create model from schema to access and alter database
export default mongoose.model('Notice', noticeSchema);
