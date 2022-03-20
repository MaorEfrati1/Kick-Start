import mongoose from "mongoose";

const postSchema = mongoose.Schema({

    title: String,
    name: String,
    creator: String,
    image1: String,
    image2: String,
    // image3: String,
    info: String,
    price: {
        type: Number,
        default: 0,
    },
    donates: {
        type: Number,
        default: 0,
    },
    url:String,
    videoLink:String,
      expirationDate: {
        type: Number,
        default: 0,
    },
      expirationDays: {
        type: Number,
        default: 0,
    },
       expirationHours: {
        type: Number,
        default: 0,
    },
      likes: {
        type: [String],
        default: [],
    },
    donor: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});


var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
