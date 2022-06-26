const mongoose = require('mongoose');
const Schema = mongoose.Schema

export const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String
  },
  cover: {
    type: String,
  },
  view: {
    type: Number,
  },
  tags: {
    type:Array,
  },
  description: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  },
  // favorite: {
  //   type: Number,
  //   default: 0
  // },
  // dislikes: {
  //   type: Number,
  //   default: 0
  // },
  assignedTo: {
    type: String
  }
}, {
  timestamps: true
});

