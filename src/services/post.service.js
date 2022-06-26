const mongoose = require('mongoose');
const { to } = require("await-to-js");
const { PostModel, InteractionSchema, CommentModel } = require("../models");

export const createPost = async (req) => {
  const { userID } = req;
  let postData = req.body;
  postData.author = userID;
  const [err, result] = await to(new PostModel(postData).save());
  if (err) {
    throw err;
  }
  return result
}


export const getPostDetails = async (req) => {
  const { postID } = req.body
  if (!postID) {
    throw new Error("Post id is required");
  }
  const pipeline = [{
    $match: {
      _id: mongoose.Types.ObjectId(postID), active: true,
    }
  }, {
    "$lookup": {
      from: "users", let: { userID: "$author" }, pipeline: [{
        $match: {
          $expr: { "$eq": ["$_id", "$$userID"] }
        },
      }, {
        $project: {
          firstName: 1,
          lastName: 1,
          avatarUrl: "$cover",

        }
      }], as: "author"
    }
  }, {
    $unwind: {
      path: "$author",
    }
  }]
  let [err, post] = await to(PostModel.aggregate(pipeline));
  if (err) {
    throw err;
  }
  if (post.length) {
    post = post[0];
    const { firstName, lastName } = post.author;
    const fullName = `${firstName} ${lastName}`;
    post.author.name = fullName

    return post
  }
  return post;
}

export const deletePost = (data) => {
  const { postID } = data;
  if (!postID) {
    throw new Error("Post id is required");
  }
  return PostModel.findByIdAndUpdate(postID, { active: false });
}

export const getAllPosts = async ({ currentPage = 1, pageSize = 5 }) => {
  const skip = (currentPage - 1) * pageSize;
  const pipeline = [
    {
      $match: {
        active: true
      }
    },
    {
      $sort: {
        _id: -1
      }
    }, {
      $skip: skip
    }, {
      $limit: pageSize

    }, {
      $lookup: {
        from: 'users',
        let: { userID: '$author' },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ['$_id', '$$userID']
            }
          }
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
          }
        },],
        as: 'author'
      }
    }, {
      $unwind: {
        path: '$author',
      }
    }, {
      $lookup: {
        from: "comments",
        let: { postID: "$_id" },
        pipeline: [{
          $match: {
            $expr: { $eq: ["$postID", "$$postID"] },
          }
        }],
        as: "comments"
      }
    }, {
      $addFields: {
        comments: { $size: "$comments" }
      }
    }, {
      $lookup: {
        from: "interactions",
        let: { postID: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$postID", "$$postID"] },
              type: "like"
            }
          }
        ],
        as: "likes"
      }
    },
    {
      $addFields: {
        likes: { $size: "$likes" }

      }
    }
  ]

  const [err, data] = await to(PostModel.aggregate(pipeline))
  if (err) {
    throw err;
  }
  return data;
}

export const getPagination = async ({ currentPage = 1, pageSize = 5 }) => {
  const [err, totalRecord] = await to(PostModel.count({ active: true }));

  if (err) {
    throw err;
  }
  return {
    totalRecord, totalPage: Math.ceil(totalRecord / pageSize),
  };
}


export const interaction = async (data) => {

  const [err,] = await to(InteractionSchema.findOneAndUpdate({
    postID: mongoose.Types.ObjectId(data.postID),
    userID: mongoose.Types.ObjectId(data.userID)
  }, data, { upsert: true }))
  if (err) {
    throw err;
  }
  // const [, checkLiked] = await to(InteractionSchema.findOne({postID, userID}));
  // if (checkLiked) {
  //   await to(PostModel.findByIdAndUpdate(postID, {$inc: {favorite: -1}}));
  //   await to(InteractionSchema.findByIdAndDelete(checkLiked._id));
  //   return
  // }
  // await to(PostModel.findByIdAndUpdate({_id: postID}, {$inc: {favorite: 1}}));
  // await to(InteractionSchema({userID, postID, type: "like"}).save());

}


export const commentPost = async (data, userID) => {
  const { postID, content } = data;
  const [err, result] = await to(CommentModel({ postID, content, author: userID }).save());
  if (err) {
    throw err;
  }
  return result;
}

export const loadComments = async (data) => {
  if (!data || !data.postID) {
    throw new Error("postID is required field")
  }
  let { postID, currentPage, pageSize } = data;
  currentPage = currentPage ? currentPage : 1;
  pageSize = pageSize ? pageSize : 10;
  const skip = (currentPage - 1) * pageSize;

  const pipeline = [{
    $match: {
      postID: mongoose.Types.ObjectId(postID), active: true,
    }
  }, {
    $lookup: {
      from: "users", let: { userID: { $toObjectId: "$author" } }, pipeline: [{
        $match: {
          $expr: { "$eq": ["$_id", "$$userID"] }
        },
      }, {
        $project: {
          firstName: 1, lastName: 1,
          avatarUrl: "$cover",
        }
      }], as: "userDetails"
    }
  }, {
    $unwind: {
      path: "$userDetails",
    }
  }, {
    $skip: skip
  }, {
    $limit: pageSize
  },
  {
    $sort: {
      createdAt: -1
    }
  }]

  const [, totalRecord] = await to(CommentModel.count({ postID: mongoose.Types.ObjectId(postID), active: true }));
  const [err, comments] = await to(CommentModel.aggregate(pipeline));
  if (err) {
    throw err;
  }
  return {
    totalRecord,
    comments
  };
}

export const loadInteraction = async (postID) => {
  const [err, result] = await to(InteractionSchema.countDocuments({ postID: mongoose.Types.ObjectId(postID), active: true, type: "like" }));
  if (err) {
    throw err;
  }
  return result;

}
export const checkInteraction = async (data) => {
  const [err, result] = await to(InteractionSchema.findOne(data));

  if (err) throw err;
  return !!(result);
}