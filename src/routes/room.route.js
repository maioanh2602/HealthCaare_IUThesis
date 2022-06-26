const express = require("express");
const chatController = require("../controllers/chat.controller");

const validationMiddleware = require("../middlewares/validation");
const {authorize} = require("../middlewares/authorize");
const router = express.Router();

const {roomSchema, loadChatSchema, loadRoomSchema, markReadSchema, loadRoomDetail} = require("../validationSchema/room.schema");

router.post("/create", validationMiddleware(roomSchema), authorize(), chatController.createChatRoom);
router.post("/load-message", validationMiddleware(loadChatSchema), authorize(), chatController.loadChatMessage);
router.post("/get-all", validationMiddleware(loadRoomSchema), authorize(), chatController.getAllChatRooms);
router.post("/mark-read", validationMiddleware(markReadSchema), authorize(), chatController.markRead);
router.post("/load-participants", validationMiddleware(loadRoomDetail), authorize(), chatController.loadRoomDetail);

module.exports = router;