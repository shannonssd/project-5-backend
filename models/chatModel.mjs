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
 *              Schema describing structure of
 *              documents for chats collection
 *
 * ========================================================
 * ========================================================
 */
const { Schema } = mongoose;

// Initialize new instance of Schema for chats collection
const chatSchema = new Schema(
  {
    senderId: {
      type: String,
    },
    receiverId: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Create model from schema to access and alter database
export default mongoose.model('Chat', chatSchema);
