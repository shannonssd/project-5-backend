import mongoose from 'mongoose';

const { Schema } = mongoose;

// schema describes structure of documents
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// first model parameter must be the singular form of its corresponding collection
// collection name in db needs to be plural
const User = mongoose.model('User', userSchema);

export default User;
