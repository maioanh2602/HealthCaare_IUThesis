
const mongoose = require('mongoose')
const {userSchema} = require('./user');
const {appointmentSchema} = require('./appointment');
const {postSchema} = require('./post');
const {commentSchema} = require('./comment');
const {interactionSchema} = require('./interaction');
const {chatRoomSchema} = require('./chatRoom');
const {chatMessageSchema} = require('./chatMessage');
const {socketSchema} = require('./socket');
const {doctorCalender} = require('./doctorCalender');
const {rateSchema} = require('./rate');


const UserModel = mongoose.model('User', userSchema);
const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
const PostModel = mongoose.model('Post', postSchema);
const CommentModel = mongoose.model("Comment", commentSchema);
const InteractionSchema = mongoose.model("Interaction", interactionSchema);
const ChatRoomModel = mongoose.model("ChatRoom", chatRoomSchema);
const ChatMessageModel = mongoose.model("ChatMessage", chatMessageSchema);
const SocketModel = mongoose.model("Socket", socketSchema);
const DoctorCalenderModel = mongoose.model("DoctorCalendar", doctorCalender);
const RateModel = mongoose.model("Rate", rateSchema);


export {
  UserModel,
  AppointmentModel,
  PostModel,
  CommentModel,
  InteractionSchema,
  ChatRoomModel,
  ChatMessageModel,
  SocketModel,
  DoctorCalenderModel,
  RateModel
}