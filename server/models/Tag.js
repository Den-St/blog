import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
    tag: {
        type: String,
    },
    count: {
        type:Number,
        default:1
    }
});

export default mongoose.model('Tag',TagSchema);