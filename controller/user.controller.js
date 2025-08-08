import UserModel from "../model/user.model.js"
import NewsModel from "../model/news.model.js"
import CategoryModel from "../model/category.model.js"
import createError from "../utils/error-message.js"
import { validationResult } from "express-validator"
import fs from 'fs'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import SettingModel from "../model/setting.model.js"
dotenv.config();

export const loginPage=async (req, res) => {
    res.render('admin/login', { layout: false, errors: 0 });
}


export const adminLogin=async (req, res, next) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/login', { layout: false, errors: errors.array() });
    }

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
    const website_logo=req.file?.filename;
    try {
        let setting=await SettingModel.findOne();
        if (!setting) {
            setting=new SettingModel();
        }
        setting.website_title=website_title;
        setting.footer_description=footer_description;
        if (website_logo) {
            if (setting.website_logo) {
                const logoPath=`./public/uploads/${setting.website_logo}`;
                if (fs.existsSync(logoPath)) {
                    fs.unlinkSync(logoPath)
                }
            }
            setting.website_logo=website_logo;
        }

        await setting.save();
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
    res.render('admin/users/create', { role: req.role, errors: 0 })
}


export const addUser=async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/users/create', { role: req.role, errors: errors.array() });
    }

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
        res.render('admin/users/update', { user, role: req.role, errors: 0 })

    }
    catch (err) {
        next(err)
    }

}

export const updateUser=async (req, res, next) => {
    const id=req.params.id;
    const errors=validationResult(req);
    const user=await UserModel.findById(id)
    if (!errors.isEmpty()) {
        return res.render('admin/users/update', { user, role: req.role, errors: errors.array() });
    }

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
        const user=await UserModel.findById(id)
        if (!user) {
            return next(createError('User not found', 404))
        }

        const article=await NewsModel.findOne({ author: id })
        if (article) {
            return res.status(400).json({ success: false, message: 'User is associated with an article' });
        }


        await user.deleteOne();

        res.json({ success: true })
    }
    catch (err) {
        next(err)
    }
}

