const Joi = require('joi')

const roomSchema = Joi.object().keys({
  chatUserID: Joi.string().required(),

});

const loadChatSchema = Joi.object().keys({
  roomID: Joi.string().required(),
  currentPage: Joi.number().default(1),
  recordPerPage: Joi.number().default(10),

})

const loadRoomSchema = Joi.object().keys({
  currentPage: Joi.number().default(1),
  recordPerPage: Joi.number().default(10)
})

const loadRoomDetail = Joi.object().keys({
  roomID: Joi.string().required()
})

const markReadSchema = Joi.object().keys({
  roomID: Joi.string().required(),
})

module.exports = {
  roomSchema,
  loadChatSchema,
  loadRoomSchema,
  markReadSchema,
  loadRoomDetail
};