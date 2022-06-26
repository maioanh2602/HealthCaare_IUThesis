const mongoose = require('mongoose');
const { getUserChatRooms } = require('./pipeline');
const Schema = mongoose.Schema

const chatRoomSchema = new Schema({
  participants: {
    type: Array,
  },
  name: {
    type: String,
    require: true,
  },
  updatedBy: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

chatRoomSchema.statics.initiateChatRoom = async function (participants) {
  const availableChatRooms = await this.findOne({
    participants: {
      $size: participants.length,
      $all: participants
    }
  });
  if (availableChatRooms) {
    return {
      isNew: false,
      roomID: availableChatRooms._id,
      message: 'success'

    }
  }

  const newChatRoom = await this.create({ participants: participants });
  return {
    isNew: true,
    message: "create new chat room",
    roomID: newChatRoom._id
  }
}
chatRoomSchema.statics.getParticipants = async function (chatRoomID) {
  const roomDetails = await this.findById(chatRoomID);
  if (roomDetails && roomDetails._doc) {
    return roomDetails._doc.participants;
  }
  return null;
}

chatRoomSchema.statics.getAllChatRooms = async function (currentUserID, currentPage, recordPerPage) {
  const pipeline = getUserChatRooms(currentUserID, currentPage, recordPerPage);
  const chatRooms = await this.aggregate(pipeline);
  return chatRooms
}

chatRoomSchema.statics.markRead = async function (roomID, currentUserID) {
  const chatRoom = await this.findById(roomID);
  if (chatRoom && chatRoom._doc) {
    const receivers = chatRoom.participants.find(participant => participant !== currentUserID);
    await this.updateMany({ roomID, sender: receivers }, {
      $set: {
        read: true
      }
    })
  }


}

module.exports = {
  chatRoomSchema
}
