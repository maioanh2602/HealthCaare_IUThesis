const { ChatMessageModel, ChatRoomModel, SocketModel } = require('../models');
const { to } = require('await-to-js');
module.exports = (io, socket) => {
  const currentUserID = socket.user.stringID;

  const sendMessage = async (payload) => {
    const { roomID, message, type } = payload;
    const newMessage = new ChatMessageModel({ roomID, message, sender: currentUserID, type });
    newMessage.save();
    const participants = await ChatRoomModel.getParticipants(payload.roomID);
    const receivers = participants.filter(participant => participant !== currentUserID);
    let [, messages] = await to(ChatMessageModel.loadChatMessage(roomID, 0, 10));
    const senders = await SocketModel.getSocketID(currentUserID);
    for (let sender of senders) {
      io.to(sender.socketID).emit('newMessage', messages);
    }


    for (let receiver of receivers) {
      const socketSessions = await SocketModel.getSocketID(receiver);

      for (let session of socketSessions) {
        io.to(session.socketID).emit('newMessage', messages);

      }
    }

  }
  socket.on('sendMessage', sendMessage);

}