import { Router } from "express"
import { loginPage, adminLogin, logout, dashboard, saveSettings, settings, allUser, addUserPage, addUser, updateUserPage, updateUser, deleteUser } from "../controller/user.controller.js"
import { allCategory, addCategoryPage, addCategory, updateCategoryPage, updateCategory, deleteCategory } from "../controller/category.controller.js"
import { allArticle, addArticlePage, addArticle, updateArticlePage, updateArticle, deleteArticle } from "../controller/article.controller.js"
import { allComments } from "../controller/comment.controller.js"
import isLoggedIn from "../middleware/isLogin.middleware.js"
import isAdmin from "../middleware/isAdmin.middleware.js"
import upload from "../middleware/multer.js"


const adminRouter=Router();

// Login Routes
adminRouter.get('/', loginPage);
adminRouter.post('/index', adminLogin);


adminRouter.get('/logout', logout);
adminRouter.get('/dashboard', isLoggedIn, dashboard);
adminRouter.get('/settings', isLoggedIn, isAdmin, settings);
adminRouter.post('/save-settings', isLoggedIn, isAdmin, upload.single('website_logo'), saveSettings);

// User CRUD Routes
adminRouter.get('/users', isLoggedIn, isAdmin, allUser);
adminRouter.get('/add-user', isLoggedIn, isAdmin, addUserPage);
adminRouter.post('/add-user', isLoggedIn, isAdmin, addUser);
adminRouter.get('/update-user/:id', isLoggedIn, isAdmin, updateUserPage);
adminRouter.post('/update-user/:id', isLoggedIn, isAdmin, updateUser);
adminRouter.delete('/delete-user/:id', isLoggedIn, isAdmin, deleteUser);

// Category CRUD Routes
adminRouter.get('/category', isLoggedIn, isAdmin, allCategory);
adminRouter.get('/add-category', isLoggedIn, isAdmin, addCategoryPage);
adminRouter.post('/add-category', isLoggedIn, isAdmin, addCategory);
adminRouter.get('/update-category/:id', isLoggedIn, isAdmin, updateCategoryPage);
adminRouter.post('/update-category/:id', isLoggedIn, isAdmin, updateCategory);
adminRouter.delete('/delete-category/:id', isLoggedIn, isAdmin, deleteCategory);

// Article CRUD Routes
adminRouter.get('/article', isLoggedIn, allArticle);
adminRouter.get('/add-article', isLoggedIn, addArticlePage);
adminRouter.post('/add-article', isLoggedIn, upload.single('image'), addArticle);
adminRouter.get('/update-article/:id', isLoggedIn, updateArticlePage);
adminRouter.post('/update-article/:id', isLoggedIn, upload.single('image'), updateArticle);
adminRouter.delete('/delete-article/:id', isLoggedIn, deleteArticle);

// Comment Routes
adminRouter.get('/comments', isLoggedIn, allComments);

// 404 Error Handler Middleware
adminRouter.use(isLoggedIn, (req, res, next) => {
    res.status(404).render('admin/404', {
        message: 'Page Not Found',
        role: req.role
    })
    next()
})

//  Error Handler
adminRouter.use(isLoggedIn, (err, req, res, next) => {
    const status=err.status||500;
    let view;
    switch (status) {
        case 401:
            view='admin/401';
            break;
        case 404:
            view='admin/404';
            break;
        case 500:
            view='admin/500';
            break;
        default:
            view='admin/500';
    }
    res.status(500).render(view, {
        message: err.message||'Something went wrong',
        role: req.role
    })
    next()
})



export default adminRouter;
