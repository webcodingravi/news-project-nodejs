import mongoose, { Schema, model } from "mongoose"
const commentSchema = new Schema({
    article: {
        type: mongoose.Types.ObjectId,
        ref: "News",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    }

}, { timestamps: true })

const CommentModel = model("Comment", commentSchema)
export default CommentModel;