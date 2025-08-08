import CategoryModel from "../model/category.model.js"
import NewsModel from "../model/news.model.js"
import createError from "../utils/error-message.js"
import { validationResult } from "express-validator"

export const allCategory=async (req, res) => {
    const categories=await CategoryModel.find()
    res.render('admin/categories', { categories, role: req.role })
}

export const addCategoryPage=async (req, res) => {

    res.render('admin/categories/create', { role: req.role, errors: 0 })

}

export const addCategory=async (req, res, next) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/categories/create', { role: req.role, errors: errors.array() });
    }

    try {
        await CategoryModel.create(req.body)
        res.redirect("/admin/category")
    }
    catch (err) {
        next(err)
    }
}

export const updateCategoryPage=async (req, res, next) => {
    try {
        const category=await CategoryModel.findById(req.params.id);
        if (!category) {
            return next(createError('Category Not Found', 404))

        }
        res.render('admin/categories/update', { category, role: req.role, errors: 0 })
    }
    catch (err) {
        next(err)
    }

}

export const updateCategory=async (req, res, next) => {
    const id=req.params.id;

    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        const category=await CategoryModel.findById(id);
        return res.render('admin/categories/update', {
            category, role: req.role, errors: errors.array()
        });
    }

    try {
        const category=await CategoryModel.findByIdAndUpdate(id)
        if (!category) {
            return next(createError('Category Not Found', 404))
        }
        category.name=req.body.name;
        category.description=req.body.description
        await category.save();
        res.redirect('/admin/category');
    }
    catch (err) {
        next(err)
    }
}

export const deleteCategory=async (req, res, next) => {
    const id=req.params.id;
    try {
        const category=await CategoryModel.findById(id)
        if (!category) {
            return next(createError('Category Not Found', 404))
        }
        const article=await NewsModel.findOne({ category: id })
        if (article) {
            return res.status(400).json({ success: false, message: 'Category is associated with an article' });
        }
        await category.deleteOne();
        res.json({ success: true })
    }
    catch (err) {
        next(err)
    }


}
