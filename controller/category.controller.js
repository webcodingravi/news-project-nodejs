import CategoryModel from "../model/category.model.js"
import createError from "../utils/error-message.js"

export const allCategory=async (req, res) => {
    const categories=await CategoryModel.find()
    res.render('admin/categories', { categories, role: req.role })
}

export const addCategoryPage=async (req, res) => {

    res.render('admin/categories/create', { role: req.role })

}

export const addCategory=async (req, res, next) => {
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
        res.render('admin/categories/update', { category, role: req.role })
    }
    catch (err) {
        next(err)
    }

}

export const updateCategory=async (req, res, next) => {
    try {
        const category=await CategoryModel.findByIdAndUpdate(req.params.id, req.body)
        if (!category) {
            return next(createError('Category Not Found', 404))
        }
        res.redirect('/admin/category');
    }
    catch (err) {
        next(err)
    }
}

export const deleteCategory=async (req, res, next) => {
    const id=req.params.id;
    try {
        const category=await CategoryModel.findByIdAndDelete(id)
        if (!category) {
            return next(createError('Category Not Found', 404))
        }
        res.json({ success: true })
    }
    catch (err) {
        next(err)
    }


}
