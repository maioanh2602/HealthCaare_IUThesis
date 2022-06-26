import { CONSTANT } from '../constants';

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required:false,
    default: null
  },
  cover: {
    type: String,
    required: false,
    default: null
  },
 
  role: {
    type: String,
    enum: [CONSTANT.ROLE.DOCTOR, CONSTANT.ROLE.PATIENT, CONSTANT.ROLE.STAFF],
    default: CONSTANT.ROLE.PATIENT
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  active: {
    type: Boolean,
    default: true
  },
  specialist: {
    type: String,
  },
  experiences: {
    type: String
  },
  certificates: {
    type: String
  },
  phone: {
    type: String
  },
  status: {
    type: String
  }

  // assignedTo: {
  //   type: String
  // }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  getters: true
});

userSchema.pre('save', async function (next) {
  const { email} = this;
  const query = {
    $or: [
      // {username: username},
      {email: email}
    ],
    active: true
  }
  const User = mongoose.model('User', userSchema);

  const userExist = await User.findOne(query);
  if (userExist) {
    next(new Error("User already exist"))
  } else {
    next();
  }
});


userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
})

userSchema.set('toObject', { getters: true });

userSchema.statics.getUserInfo = async function (userID) {
  return await this.findById(userID).lean();
}
userSchema.statics.getUserOnline = async function () {
  return await this.find({active: true, status: "online"}).lean();
}
userSchema.set("toJSON", { getters: true })
export {
  userSchema
};

