const mongoose = require('mongoose');
const Schema = mongoose.Schema

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  postID: {
    type: Schema.Types.ObjectId,
    require: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export {
  commentSchema
}