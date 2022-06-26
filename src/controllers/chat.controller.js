const {handleSuccess, handleError} = require('../services/utils.service');
const {to} = require('await-to-js');
const {ChatRoomModel, ChatMessageModel} = require('../models');


export const createChatRoom = async (req, res) => {
  const currentUserID = req.userID;
  const chatUserID = req.body.chatUserID;
  const participants = [currentUserID, chatUserID];
  let [err, result] = await to(ChatRoomModel.initiateChatRoom(participants));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}



export const loadChatMessage = async (req, res) => {
  const chatRoomID = req.body.roomID;
  const currentPage = req.body.currentPage || 1;
  const recordPerPage = req.body.recordPerPage || 10;
  const skip = (currentPage - 1) * recordPerPage;
  const [err, result] = await to(ChatMessageModel.loadChatMessage(chatRoomID, skip, recordPerPage));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}

export const getAllChatRooms = async (req, res) => {
  const currentUserID = req.userID;
  const currentPage = req.body.currentPage || 1;
  const recordPerPage = req.body.recordPerPage || 10;
  const [err, result] = await to(ChatRoomModel.getAllChatRooms(currentUserID, currentPage, recordPerPage));
  console.log("getAllChatRooms", result);
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}

export const markRead = async (req, res) => { 
  const {roomID} = req.body;
  const currentUserID = req.userID;
  const [err, result] = await to(ChatMessageModel.markRead(roomID, currentUserID));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}

export const loadRoomDetail = async(req, res) => {
  const { roomID } = req.body;

  const [err, result] = await to(ChatRoomModel.getParticipants(roomID));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}