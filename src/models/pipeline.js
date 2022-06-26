const getUserChatRooms = (userID, currentPage, recordPerPage) => {
  const skip = (currentPage - 1) * recordPerPage;


  return [
    {
      $match: {
        participants: {
          $in: [userID]
        }
      }
    }, {
      $sort: {
        _id: -1
      }
    }, {
      $skip: skip
    }, {
      $limit: recordPerPage

    },
    {

      $unwind: {
        path: '$participants',
        preserveNullAndEmptyArrays: true
      }
    }, {

      $lookup: {
        let: {userID: {$toObjectId: '$participants'}},
        from: 'users',
        pipeline: [
          {$match: {$expr: {$eq: ['$_id', '$$userID']}}},
          {
            $project: {
              firstName: 1,
              lastName: 1,
              avatar: 1,
              cover: 1,
              fullName: {$concat: ['$firstName', ' ', '$lastName']}
            },
          }
        ],
        as: 'userDetails'
      }
    }, {
      $unwind: {
        path: '$userDetails',
        preserveNullAndEmptyArrays: true
      }
    },
     
    {
      $lookup: {
        from: 'chatmessages',
        let: {
          roomID: {$toString: "$_id"},
        },
        pipeline: [
          {
  
           $match: {
             $expr: {
  //             $and: [
  //               {
                   $eq: [
                     "$roomID",
                     "$$roomID",
                   ],
  //               },
  //             ],
             },
           },
  
           },
           {
             $sort: {
               _id: -1,
             },
           },
           {
             $limit: 1,
           },
              ],
  
  
         as: "lastMessage",
        }
      },{
        $unwind: {
          path: '$lastMessage',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          participants: {
            $push: "$userDetails",
          },
          lastMessage: {
            $first: "$lastMessage",
          },
        },
      }, {
        $sort: {
          _id: -1
        }
      }
    ]

}

module.exports = {
  getUserChatRooms
}