const { SocketModel, UserModel } = require('../models/index');
const { CONSTANT } = require('../constants');
const { default: mongoose } = require('mongoose');
const { to } = require('await-to-js');
const { logger } = require('../config/winston');
module.exports = async (io, socket) => {
  const { user } = socket;
  const userID = user.stringID;
  const userInfo = await UserModel.getUserInfo(userID);
  const { PATIENT, STAFF } = CONSTANT.ROLE;
  await UserModel.updateOne({ _id: mongoose.Types.ObjectId(userID), role: "doctor"  }, { $set: { status: "online" } });
  const [, userOnline] = await to(UserModel.find({ role: "doctor", status: "online" }));
  socket.broadcast.emit('userOnline', userOnline)
  logger.info("userOnline", userOnline);
  if (user.role === CONSTANT.ROLE.PATIENT) {
    socket.join(PATIENT);
  } else {
    socket.join(STAFF);
  }
  socket.on("disconnect", async () => {
    await SocketModel.removeSocketSession(socket.id);
    logger.info("user disconnect")
    await UserModel.updateOne({ _id: mongoose.Types.ObjectId(userID), role: "doctor"  }, { $set: { status: "offline" } });
    socket.broadcast.emit("userDisconnect", userInfo);
  });

}