import { Schema, model } from "mongoose";

const settingSchema=new Schema({
    website_title: {
        type: String,
        required: true
    },
    website_logo: {
        type: String
    },
    footer_description: {
        type: String,
        required: true
    }
}, { timestamps: true })

const SettingModel=model('Setting', settingSchema)
export default SettingModel