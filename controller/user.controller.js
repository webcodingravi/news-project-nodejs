import UserModel from "../model/user.model.js"
import NewsModel from "../model/news.model.js"
import CategoryModel from "../model/category.model.js"
import createError from "../utils/error-message.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import SettingModel from "../model/setting.model.js"
dotenv.config();

export const loginPage=async (req, res) => {
    res.render('admin/login', { layout: false });
}


export const adminLogin=async (req, res, next) => {
    const { username, password }=req.body;
    try {
        const user=await UserModel.findOne({ username });
        if (!user) {
            return next(createError('Invalid username or password', 401))
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(createError('Invalid username or password', 401))

        }
        const payload={
            id: user._id,
            fullname: user.fullname,
            role: user.role
        }
        const token=jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 60*60*1000 })
        res.redirect('/admin/dashboard');
    }
    catch (err) {
        next(err)
    }
}

export const logout=(req, res) => {
    res.clearCookie('token')
    res.redirect('/admin/')
}



export const dashboard=async (req, res) => {
    try {
        let articleCount;
        if (req.role=='author') {
            articleCount=await NewsModel.countDocuments({ author: req.id });
        } else {
            articleCount=await NewsModel.countDocuments();
        }

        const categoryCount=await CategoryModel.countDocuments();
        const userCount=await UserModel.countDocuments();

        res.render('admin/dashboard', {
            role: req.role,
            fullname: req.fullname, articleCount, categoryCount, userCount
        });
    }
    catch (err) {
        next(err)
    }

}


export const settings=async (req, res, next) => {
    try {
        const settings=await SettingModel.findOne()
        res.render('admin/settings', { role: req.role, settings });
    }
    catch (err) {
        next(err)
    }

}

export const saveSettings=async (req, res, next) => {
    const { website_title, footer_description }=req.body;
    const website_logo=req.file? req.file.filename:null;
    try {
        await SettingModel.findOneAndUpdate({},
            { website_title, website_logo, footer_description }, { new: true, upsert: true });


        res.redirect('/admin/settings')
    }
    catch (err) {
        next(err)
    }

}


export const allUser=async (req, res) => {
    const users=await UserModel.find()
    res.render('admin/users', { users, role: req.role });
}


export const addUserPage=async (req, res) => {
    res.render('admin/users/create', { role: req.role })
}


export const addUser=async (req, res) => {
    try {
        await UserModel.create(req.body);
        res.redirect('/admin/users')
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

}



export const updateUserPage=async (req, res, next) => {
    const id=req.params.id;
    try {
        const user=await UserModel.findById(id)
        if (!user) {
            return next(createError('User not found', 404))
        }
        res.render('admin/users/update', { user, role: req.role })

    }
    catch (err) {
        next(err)
    }

}

export const updateUser=async (req, res, next) => {
    const id=req.params.id;
    const { fullname, password, role }=req.body
    try {
        const user=await UserModel.findById(id)
        if (!user) {
            return next(createError('User not found', 404))

        }

        user.fullname=fullname||user.fullname
        if (password) {
            user.password=password
        }
        user.role=role||user.role
        await user.save()
        res.redirect('/admin/users')

    }
    catch (err) {
        next(err)
    }

}

export const deleteUser=async (req, res, next) => {
    const id=req.params.id;
    try {
        const user=await UserModel.findByIdAndDelete(id)
        if (!user) {
            return next(createError('User not found', 404))
        }
        res.json({ success: true })
    }
    catch (err) {
        next(err)
    }
}

