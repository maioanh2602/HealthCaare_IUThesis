const Joi = require('joi')

const commentSchema = Joi.object().keys({
  content: Joi.string().required(),
  postID: Joi.string().required()

});

const loadCommentSchema = Joi.object().keys({
  postID: Joi.string().required(),
  currentPage: Joi.number().default(1),
  pageSize: Joi.number().default(10)
});

module.exports = {
  commentSchema,
  loadCommentSchema
};