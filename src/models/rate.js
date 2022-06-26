const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {to} = require('await-to-js');

export const rateSchema = new Schema({
    doctorID: {
        type: String,
        require: true
    },
    stars: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// rateSchema.statics.checkExist = async function (ratedBy) {
//     const [err, rate] = await to(this.findOne({
//         ratedBy: ratedBy
//     }));
//     if (rate) {
//         throw new Error("You have already rated this doctor");
//     }
// }
