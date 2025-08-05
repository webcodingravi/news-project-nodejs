import NewsModel from "../model/news.model.js"
import CategoryModel from "../model/category.model.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'
import createError from "../utils/error-message.js"


export const allArticle=async (req, res, next) => {
    let articles;

    try {
        if (req.rol==='admin') {
            articles=await NewsModel.find().populate('category', 'name').populate('author', 'fullname')
            res.render('admin/articles', { articles, role: req.role })
        } else {
            articles=await NewsModel.find({ author: req.id }).populate('category', 'name').populate('author', 'fullname')
            res.render('admin/articles', { articles, role: req.role })
        }
    }
    catch (err) {
        next(err)
    }



}

export const addArticlePage=async (req, res, next) => {
    const categories=await CategoryModel.find();
    res.render('admin/articles/create', { categories, role: req.role })
}

export const addArticle=async (req, res) => {
    const { title, content, category }=req.body;
    try {
        const article=new NewsModel({ title, content, category, author: req.id, image: req.file.filename })
        await article.save();
        res.redirect('/admin/article');

    }
    catch (err) {
        next(err)
    }

}

export const updateArticlePage=async (req, res, next) => {
    try {
        const article=await NewsModel.findById(req.params.id).populate('category', 'name').populate('author', 'fullname')
        if (!article) {
            return next(createError('Article Not Found', 404))
        }

        if (req.role=='author') {
            if (req.id!=article.author._id) {
                return next(createError('Unauthorized', 401))
            }
        }
        const categories=await CategoryModel.find();
        res.render('admin/articles/update', { article, categories, role: req.role })
    }
    catch (err) {
        next(err)
    }

}

export const updateArticle=async (req, res, next) => {
    try {
        const { title, content, category }=req.body;
        const article=await NewsModel.findById(req.params.id);
        if (!article) {
            return next(createError('Article Not Found', 404))

        }
        if (req.role=='author') {
            if (req.id!=article.author._id) {
                return next(createError('Unauthorized', 401))
            }
        }

        article.title=title;
        article.content=content;
        article.category=category;

        if (req.file) {
            const __filename=fileURLToPath(import.meta.url);
            const __dirname=path.dirname(__filename);
            const imagePath=path.join(__dirname, '../public/uploads', article.image);
            fs.unlinkSync(imagePath);
            article.image=req.file.filename;
        }
        await article.save();
        res.redirect('/admin/article')

    }
    catch (err) {
        next(err)
    }
}

export const deleteArticle=async (req, res, next) => {
    try {
        const article=await NewsModel.findById(req.params.id);
        if (!article) {
            return next(createError('Article Not Found', 404))

        }

        if (req.role=='author') {
            if (req.id!=article.author._id) {
                return next(createError('Unauthorized', 401))
            }
        }
        const __filename=fileURLToPath(import.meta.url);
        const __dirname=path.dirname(__filename);
        const imagePath=path.join(__dirname, '../public/uploads', article.image);
        fs.unlinkSync(imagePath);

        await article.deleteOne();

        res.json({ success: true })
    }
    catch (err) {
        next(err)
    }
}
