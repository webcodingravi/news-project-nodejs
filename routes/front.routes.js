import { Router } from "express";
import { index, articleByCategories, singleArticle, search, author, addComment } from "../controller/site.controller.js";
import loadCommonDta from "../middleware/loadCommonData.js";

const frontRouter=Router();

frontRouter.use(loadCommonDta)

frontRouter.get("/", index);
frontRouter.get('/category/:name', articleByCategories);
frontRouter.get('/single/:id', singleArticle);
frontRouter.get('/search', search);
frontRouter.get('/author/:id', author);
frontRouter.post('/single/:id', addComment)
frontRouter.post('/single/:id/comment', addComment)

// 404 Error Handler Middleware
frontRouter.use((req, res, next) => {
    res.status(404).render('404', {
        message: 'Page Not Found',

    })
    next()
})


//  Error Handler
frontRouter.use((err, req, res, next) => {
    const status=err.status||500;

    res.status(500).render('errors', {
        message: err.message||'Something went wrong',
        status
    })
    next()
})



export default frontRouter;