const Joi = require('joi')

const postSchema = Joi.object().keys({
  title: Joi.string().required(),
  body: Joi.string().required(),
  cover: Joi.string().optional().allow(''),
  tags: Joi.array(),
  description: Joi.string().optional().allow(''),

});

const postDetailsSchema = Joi.object().keys({
  postID: Joi.string().required()
})

const postDeleteSchema = Joi.object().keys({
  postID: Joi.string().required()
})

const getPostsSchema = Joi.object().keys({
  currentPage: Joi.number().default(1),
  pageSize: Joi.number().default(10)

})

const getPostsPagination = Joi.object().keys({
  pageSize: Joi.number().default(10)
});


const loadLikeSchema = Joi.object().keys({
  postID: Joi.string().required()
});

module.exports = {
  postSchema,
  postDetailsSchema,
  postDeleteSchema,
  getPostsSchema,
  getPostsPagination,
  loadLikeSchema
};