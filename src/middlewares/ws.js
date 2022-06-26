const {decodeToken} = require('../utils/jwt');
const {SocketModel} = require('../models');

function validateWSConnection(socket, next) {
  const {handshake} = socket;
  if (!handshake.auth || !handshake.auth.token) {
    next(new Error("Authentication error"));
  }

  try {
    const decodedToken = decodeToken(handshake.auth.token);
    socket.user = decodedToken;
    next();

  } catch (err) {
    next(new Error("Authentication error"));
  }
}

function saveSocketSession(socket, next) {
  const {user} = socket;
  const socketSession = new SocketModel({
    userID: user.stringID,
    socketID: socket.id
  });
  socketSession.save();
  next();
}

module.exports = {
  validateWSConnection,
  saveSocketSession
}