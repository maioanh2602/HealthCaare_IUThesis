const {swaggerDoc} = require("./swagger-to-json");
const joi = require("joi");
const {
  userSchema,
  updateUserSchema,
  userLoginSchema,
  userGetDetails,
  likePostSchema,
  updatePasswordSchema,
  userDeleteSchema,
  interactionSchema,
  loadInteractionSchema
} = require("./validationSchema/user.schema");
const {
  postSchema,
  postDetailsSchema,
  postDeleteSchema,
  getPostsSchema,
  getPostsPagination
} = require("./validationSchema/post.schema");
const {roomSchema, loadChatSchema, loadRoomSchema, loadRoomDetail} = require('./validationSchema/room.schema')
const {UserModel} = require("./models");
const {
  appointmentSchema,
  appointmentUpdateSchema,
  appointmentDeleteSchema,
  checkAppointmentSchema
} = require("./validationSchema/appointment.schema");
const {commentSchema, loadCommentSchema} = require("./validationSchema/comment.schema");
const { rateSchema } = require("./models/rate");
const { doctorRateSchema, doctorGetRateSchema } = require("./validationSchema/doctor.schema");
const { swagger } = require("./default_config");


const host = "localhost:8001";
const basePath = "/api/v1";
const info = {
  "version": "1.0.0",
  "title": "UI Health",
  "description": "UI Health API",
  "termsOfService": "http://swagger.io/terms/",
  "contact": {
    "name": "Example team"
  },
  "license": {
    "name": "MIT"
  }

}
swaggerDoc.createJsonDoc(info, host, basePath);

function generateSchema(schema, modelName, groupName) {
  if (schema) {
 return {
      body: schema.meta({modelName: modelName}),
      model: modelName,
      group: groupName

    }
  }
   
  return {
    model: modelName,
    groupName
  }
  
}

// User
swaggerDoc.addNewRoute(generateSchema(userSchema, "Register", "User"), '/register', 'post');
swaggerDoc.addNewRoute(generateSchema(userLoginSchema, "Login", "User"), '/login', 'post');
swaggerDoc.addNewRoute(generateSchema(updateUserSchema, "Update user", "User"), '/update', 'post');
swaggerDoc.addNewRoute(generateSchema(null, "Get details", "User"), 'user/get-details', 'post');
swaggerDoc.addNewRoute(generateSchema(updatePasswordSchema, "Update password", "User"), '/update', 'post');
swaggerDoc.addNewRoute(generateSchema(userDeleteSchema, "Delete user", "User"), 'user/delete', 'post');


// Post
swaggerDoc.addNewRoute(generateSchema(postSchema, "Create Post", "Post"), '/post/create', 'post');
swaggerDoc.addNewRoute(generateSchema(postDetailsSchema, "Get Post details", "Post"), '/post/get-details', 'post');
swaggerDoc.addNewRoute(generateSchema(postDeleteSchema, "Delete post", "Post"), '/post/delete', 'post');
swaggerDoc.addNewRoute(generateSchema(likePostSchema, "Like post", "Post"), '/post/like', 'post');
swaggerDoc.addNewRoute(generateSchema(getPostsSchema, "Get posts", "Post"), '/post/get-all', 'post');
swaggerDoc.addNewRoute(generateSchema(getPostsPagination, "Get pagination", "Post"), '/post/get-pagination', "post");
swaggerDoc.addNewRoute(generateSchema(commentSchema, "Comment Post", "Post"), '/post/comment', "post");
swaggerDoc.addNewRoute(generateSchema(loadCommentSchema, "Load comments", "Post"), '/post/load-comments', "post");
// Appointment
swaggerDoc.addNewRoute(generateSchema(appointmentSchema, "Create appointment", "Appointment"), '/appointment/create', 'post');
swaggerDoc.addNewRoute(generateSchema(appointmentUpdateSchema, "Update appointment", "Appointment"), '/appointment/update', 'post');
swaggerDoc.addNewRoute(generateSchema(appointmentDeleteSchema, "Delete appointment", "Appointment"), '/appointment/delete', 'post');
swaggerDoc.addNewRoute(generateSchema(roomSchema, "Create room", "Chat"), '/room/create', 'post');
swaggerDoc.addNewRoute(generateSchema(loadChatSchema, "Load chat message", "Chat"), '/room/load-message', 'post');
swaggerDoc.addNewRoute(generateSchema(loadRoomSchema, "Load online message", "Chat"), '/room/get-all', 'post');

// Comment
swaggerDoc.addNewRoute(generateSchema(commentSchema, "Create comment", "Comment"), '/post/comment', 'post');
swaggerDoc.addNewRoute(generateSchema(loadCommentSchema, "Load comments", "Comment"), '/post/load-comments', 'post');

// Rating
swaggerDoc.addNewRoute(generateSchema(doctorRateSchema, "Rate doctor", "Rating"), '/rate', 'post');
swaggerDoc.addNewRoute(generateSchema(doctorGetRateSchema, "Get doctor rate", "Rating"), '/get-rate', 'post');

// Load interaction 
swaggerDoc.addNewRoute(generateSchema(loadInteractionSchema, "Load interaction", "Interaction"), '/post/load-interaction', 'post');
swaggerDoc.addNewRoute(generateSchema(interactionSchema, "interaction", "Interaction"), '/post/interaction', 'post');
swaggerDoc.addNewRoute(generateSchema(interactionSchema, "check user interaction", "Interaction"), '/post/check-interaction', 'post');
swaggerDoc.addNewRoute(generateSchema(loadRoomDetail, "load room's participants", "Chat"), '/room/load-participants', 'post');
swaggerDoc.addNewRoute(generateSchema(checkAppointmentSchema, "check user appointment", "appointment"), '/appointment/check', 'post');
module.exports = swaggerDoc;
