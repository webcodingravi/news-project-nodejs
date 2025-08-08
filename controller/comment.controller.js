import CommentModel from "../model/comment.model.js"
import NewsModel from "../model/news.model.js";
import createError from "../utils/error-message.js";

export const allComments=async (req, res, next) => {
    try {
        let comments;
        if (req.role==='admin') {
            comments=await CommentModel.find().populate('article', 'title').sort({ createdAt: -1 });
        } else {
            const news=await NewsModel.find({ author: req.id });
            const newsIds=news.map(news => news._id)
            comments=await CommentModel.find({ article: { $in: newsIds } }).populate('article', 'title').sort({ createdAt: -1 });
        }

        res.render('admin/comments', { role: req.role, comments })
    }
    catch (err) {
        next(err)
    }
}

export const updateCommentStatus=async (req, res, next) => {
    console.log(req.body.status)
    try {
        const comment=await CommentModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!comment) {
            return next(createError('Comment Not Found', 404));
        }
        res.json({ success: true })
    }
    catch (err) {
        next(err)
    }
}

export const deleteComments=async (req, res, next) => {
    try {
        const comment=await CommentModel.findByIdAndDelete(req.params.id)
        if (!comment) {
            return next(createError('Comment Not Found', 404))
        }
        res.json({ success: true })
    }
    catch (err) {
        next(err)
    }

}
