const {SocketModel, ChatRoomModel} = require('./../models/index');
const {CONSTANT} = require('./../constants');
module.exports = (io, socket) => {
  const {MAKE_CALL, ANSWER_CALL, CALL_ACCEPTED, RINGING, CALL_ENDED} = CONSTANT.WS_EVENT;

  socket.emit("me", socket.id);
  const { user } = socket;
  const userID = user.stringID;
  socket.on("disconnect", () => {

    socket.broadcast.emit(CALL_ENDED);
  });

  socket.on(MAKE_CALL, async (data) => {
    // data = 
    const { roomID, linkCall} = data;
    const participants = await ChatRoomModel.getParticipants(roomID);

    const receiver = participants.find(participant => participant !== userID);
    const receiverSockets = await SocketModel.getSocketID(receiver);
    for (let receiverSocket of receiverSockets) {
      io.to(receiverSocket.socketID).emit(RINGING, { from: userID, linkCall });
    }
    const senderSockets = await SocketModel.getSocketID(userID);
    for (let senderSocket of senderSockets) {
      io.to(senderSocket.socketID).emit(RINGING, { from: receiver, linkCall });
    }

  })

  socket.on(ANSWER_CALL, (data) => {
    io.to(data.to).emit(CALL_ACCEPTED, data.signal)
  })
}