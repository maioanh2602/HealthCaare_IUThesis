import * as postServices from '../services/post.service';
const {handleSuccess, handleError} = require('../services/utils.service');
const { to } = require('await-to-js');

export const createPost = async (req, res) => {
  const [err, data] = await to(postServices.createPost(req));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, data);
}

export const getPostDetails = async (req, res) => {
  const [err, data] = await to(postServices.getPostDetails(req));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, data);
}


export const deletePost = async (req, res) => {
  const [err, data] = await to(postServices.deletePost(req.body));
  if (err) {
    throw err;
  }
  return handleSuccess(res, data);
}

export const getAllPosts = async (req, res) => {
  const [err, data] = await to(postServices.getAllPosts(req.body));
  if (err) {
    throw err;
  }
  return handleSuccess(res, data);
}

export const getPagination = async (req, res) => {
  const [err, data] = await to(postServices.getPagination(req.body));
  if (err) {
    throw err;
  }
  return handleSuccess(res, data);
}

export const interaction = async (req, res) => {
  const newData = {
    userID: req.userID,
    ...req.body
  }
 
  const [err, data] = await to(postServices.interaction(newData));
  if (err) {
    throw err;
  }
  return handleSuccess(res, data);
}


export const commentPost = async (req, res) => {
  const {userID} = req;
  const [err, data] = await to(postServices.commentPost(req.body, userID));
  if (err) {
    throw err;
  }
  return handleSuccess(res, data);

}
export const loadLikes = async (req, res) => {
  const {postID} = req.body;
  const [err, data] = await to(postServices.loadLikes(postID));
  if (err) {
    throw err;
  }
  return handleSuccess(res, data);

}

export const loadComments = async (req, res) => {
  const [err, data] = await to(postServices.loadComments(req.body));
  if (err) {
    throw err;
  }
  return handleSuccess(res, data);

}

export const loadInteraction = async (req, res) => {
  const { postID } = req.body;
  const [err, data] = await to(postServices.loadInteraction(postID));
  if (err) {
    throw err;
  }
  return handleSuccess(res, {total: data});

}

export const checkInteraction = async(req, res) => {
  const [err, data ] = await to(postServices.checkInteraction({...req.body, userID: req.userID}));
  if (err) {
    throw err;
  }
  return handleSuccess(res, data);
}