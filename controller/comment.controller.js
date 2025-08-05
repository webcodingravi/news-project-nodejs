import CommentModel from "../model/comment.model.js"

export const allComments=async (req, res) => {
    res.render('admin/comments', { role: req.role })
}
