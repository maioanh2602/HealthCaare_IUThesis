const mongoose = require('mongoose');
const Schema = mongoose.Schema

export const chatMessageSchema = new Schema({
  roomID: {
    type: String,
    require: true
  },
  message: {
    type: Schema.Types.Mixed,
    require: true
  },
  read: {
    type: Schema.Types.Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'text'
  },
  sender: {
    type: String,
    require: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

chatMessageSchema.statics.loadChatMessage = async function (chatRoomID, skip, limit) {
  const pipeline = [
    {
      $match: {
        roomID: chatRoomID
      }
    }, {
      $lookup: {
        from: "users",
        let: {
          userID: "$sender"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$_id", { $toObjectId: "$$userID" }]
            }
          },
        }, {
          $project: {
            password: 0
          }
        }],
        as: "senderDetails"
      }


    }, {
      $unwind: {
        path: "$senderDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }, {
      $skip: skip
    }, {
      $limit: limit
    }
  ]
  const chatMessage = await this.aggregate(pipeline)
  const total = await this.countDocuments({ roomID: chatRoomID })

  return {
    chatMessage,
    total
  };
}

chatMessageSchema.statics.markRead = async function (roomID, currentUserID) {
  await this.updateMany({ roomID, sender: { $ne: currentUserID }, read: false }, {
    $set: {
      read: true
    }
  })


}