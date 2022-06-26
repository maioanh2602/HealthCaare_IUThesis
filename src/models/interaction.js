import {CONSTANT} from '../constants';

const mongoose = require('mongoose');
const Schema = mongoose.Schema

export const interactionSchema = new Schema({
  postID: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  type: {
    type: String,
    enum: [CONSTANT.INTERACTION_TYPE.LIKE, CONSTANT.INTERACTION_TYPE.DISLIKE],
  },

})
