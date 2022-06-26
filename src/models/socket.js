const mongoose = require('mongoose');
const Schema = mongoose.Schema

const socketSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  socketID: {
    type: String,
    require: true
  }
}, {
  timestamps: true
});
socketSchema.statics.saveSocketSession = async function (userID, socketID) {

  await this.create({
    userID: userID,
    socketID: socketID
  });
}
socketSchema.statics.removeSocketSession = async function (socketID) {
  await this.deleteOne({socketID: socketID});
}

socketSchema.statics.getSocketID = async function (userID) {
  const socketSessions = await this.find({userID: userID}).lean();
  return socketSessions
}
export {
  socketSchema
}