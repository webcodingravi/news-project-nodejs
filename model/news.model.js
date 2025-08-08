import mongoose, { Schema, model } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const newsSchema=new Schema({
    title: {
        type: String,
        required: true
    },
    short_desc: {
        type: String
    },
    content: {
        type: String,

    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    }

}, { timestamps: true })

newsSchema.plugin(mongoosePaginate)

const NewsModel=model("News", newsSchema);

export default NewsModel;

