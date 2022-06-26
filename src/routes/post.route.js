const express = require("express");
const postController = require('../controllers/post.controller');

const {
  interactionSchema, loadInteractionSchema
} = require("../validationSchema/user.schema");
const {postSchema, postDetailsSchema, postDeleteSchema, loadLikeSchema} = require("../validationSchema/post.schema");
const validationMiddleware = require("../middlewares/validation");
const {commentSchema, loadCommentSchema} = require("../validationSchema/comment.schema");
const {authorize} = require("../middlewares/authorize");
const router = express.Router();


router.post("/create", validationMiddleware(postSchema), authorize(), postController.createPost);
router.post("/get-details", validationMiddleware(postDetailsSchema), postController.getPostDetails);
router.post("/delete", validationMiddleware(postDeleteSchema), authorize(), postController.deletePost);
router.post("/get-all", postController.getAllPosts);
router.post("/get-pagination", postController.getPagination);
router.post("/interaction", validationMiddleware(interactionSchema), authorize(), postController.interaction);
// router.post("/interaction", validationMiddleware(loadInteractionSchema), authorize(), postController.loadInteraction);
router.post("/load-interaction", validationMiddleware(loadInteractionSchema), postController.loadInteraction);
router.post("/comment", authorize(), validationMiddleware(commentSchema), postController.commentPost);
router.post("/load-comments", validationMiddleware(loadCommentSchema), authorize(), postController.loadComments);
router.post("/check-interaction", validationMiddleware(interactionSchema), authorize(), postController.checkInteraction);
module.exports = router;