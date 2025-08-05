import { Schema, model } from "mongoose"
import slugify from "slugify"

const categorySchema=new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,

    }

}, { timestamps: true })

categorySchema.pre('validate', function (next) {
    this.slug=slugify(this.name, { lower: true });
    next()
})

const CategoryModel=model("Category", categorySchema)
export default CategoryModel;