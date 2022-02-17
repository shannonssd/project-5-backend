import mongoose from 'mongoose';

const { Schema } = mongoose;

// schema describes structure of documents
const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    giver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

// first model parameter must be the singular form of its corresponding collection
// collection name in db needs to be plural
const Item = mongoose.model('Item', itemSchema);

export default Item;
