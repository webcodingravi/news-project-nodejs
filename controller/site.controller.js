import UserModel from "../model/user.model.js"
import NewsModel from "../model/news.model.js"
import CategoryModel from "../model/category.model.js"
import paginate from "../utils/paginate.js"
import CommentModel from "../model/comment.model.js"
import createError from "../utils/error-message.js"

export const index=async (req, res) => {
    const paginatedNews=await paginate(NewsModel, {},
        req.query,
        {
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'author', select: 'fullname' }
            ],
            sort: '-createdAt'
        })


    res.render("index", { paginatedNews, query: req.query })
}


export const articleByCategories=async (req, res, next) => {
    const category=await CategoryModel.findOne({ slug: req.params.name })
    if (!category) {
        return next(createError('Category Not Found', 404))
    }

    const paginatedNews=await paginate(NewsModel, { category: category._id },
        req.query,
        {
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'author', select: 'fullname' }
            ],
            sort: '-createdAt'
        })



    res.render("category", { paginatedNews, category, query: req.query })

}


export const singleArticle=async (req, res, next) => {
    const singleNews=await NewsModel.findById(req.params.id)
        .populate('category', { 'name': 1, 'slug': 1 })
        .populate('author', 'fullname')
        .sort({ createdAt: -1 })

    if (!singleNews) {
        return next(createError('Article not found', 404))
    }
    //Get all comments fro this article
    const comments=await CommentModel.find({ article: req.params.id, status: 'approved' }).sort('-createdAt')

    res.render('single', { singleNews, comments })
}

export const search=async (req, res) => {
    const searchQuery=req.query.search;
    const paginatedNews=await paginate(NewsModel, {
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { content: { $regex: searchQuery, $options: 'i' } }
        ]
    },
        req.query,
        {
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'author', select: 'fullname' }
            ],
            sort: '-createdAt'
        })



    res.render('search', { paginatedNews, searchQuery, query: req.query })

}

export const author=async (req, res, next) => {
    const author=await UserModel.findOne({ _id: req.params.id });
    if (!author) {
        return next(createError('Author not found', 404))
    }

    const paginatedNews=await paginate(NewsModel, { author: req.params.id },
        req.query,
        {
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'author', select: 'fullname' }
            ],
            sort: '-createdAt'
        })


    res.render('author', { paginatedNews, author, query: req.query })

}

export const addComment=async (req, res, next) => {
    const { name, email, content }=req.body;
    try {
        const comment=new CommentModel({ name, email, content, article: req.params.id });
        await comment.save();
        res.redirect(`/single/${req.params.id}`);
    }
    catch (err) {
        next(err)
    }



}

